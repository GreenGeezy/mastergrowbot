
import { supabase } from '@/integrations/supabase/client'
import { isIOSPreview } from '@/utils/flags'

// Track in-flight requests to prevent duplicates
const activeRequests = new Map<string, Promise<any>>()

export const uploadAttachment = async (file: File, userId: string): Promise<string> => {
  if (isIOSPreview) {
    console.log('iOS preview mode: skipping file upload')
    return `mock-url-${file.name}`
  }

  const fileExt = file.name.split('.').pop()
  const fileName = `${userId}/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
  
  const { data, error } = await supabase.storage
    .from('plant-images')
    .upload(fileName, file)

  if (error) throw error

  // Get the full public URL instead of just the path
  const { data: { publicUrl } } = supabase.storage
    .from('plant-images')
    .getPublicUrl(fileName)

  console.log('Generated public URL:', publicUrl)
  return publicUrl
}

export const sendMessageToSupabase = async (
  userId: string,
  message: string,
  conversationId: string,
  isAi: boolean = false,
  attachments: any[] = []
) => {
  // Skip database operations in iOS preview mode
  if (isIOSPreview) {
    console.log('iOS preview mode: skipping database save')
    return { data: null, error: null }
  }

  const requestKey = `send:${userId}:${conversationId}:${Date.now()}`
  
  try {
    // Create the query but don't execute it yet
    const query = supabase
      .from('chat_history')
      .insert([
        {
          user_id: userId,
          message: message,
          is_ai: isAi,
          conversation_id: conversationId,
          attachments: attachments
        }
      ])
    
    // Execute the query and convert to a standard Promise
    const promise = Promise.resolve(query.then(result => result))
    activeRequests.set(requestKey, promise)
    return await promise
  } finally {
    // Clean up request tracking
    setTimeout(() => {
      activeRequests.delete(requestKey)
    }, 5000)
  }
}

export const fetchChatHistory = async (userId: string, conversationId: string) => {
  // Skip database operations in iOS preview mode
  if (isIOSPreview) {
    console.log('iOS preview mode: skipping chat history fetch')
    return { data: [], error: null }
  }

  const requestKey = `fetch:${userId}:${conversationId}`
  
  // Check if this exact request is already in flight
  if (activeRequests.has(requestKey)) {
    console.log('Reusing in-flight request for chat history')
    return activeRequests.get(requestKey)!
  }
  
  try {
    // Create the query but don't execute it yet
    const query = supabase
      .from('chat_history')
      .select('*')
      .eq('user_id', userId)
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true })
    
    // Execute the query and convert to a standard Promise
    const promise = Promise.resolve(query.then(result => result))
    activeRequests.set(requestKey, promise)
    return await promise
  } finally {
    // Clean up request tracking
    setTimeout(() => {
      activeRequests.delete(requestKey)
    }, 5000)
  }
}

export const invokeAIChat = async (
  message: string,
  userId: string,
  conversationId: string,
  attachments: any[] = []
) => {
  const requestKey = `ai:${userId}:${conversationId}:${Date.now()}`
  
  try {
    console.log('Invoking AI chat with:', { message, userId, conversationId, attachments });

    const promise = supabase.functions.invoke('chat', {
      body: { message, userId, conversationId, attachments }
    }).then(response => {
      console.log('AI response:', response);

      if (response.error) {
        throw new Error(response.error.message || 'Failed to get AI response');
      }

      if (!response.data) {
        throw new Error('No response data received from AI');
      }

      // For debugging
      console.log('Response data structure:', JSON.stringify(response.data, null, 2));

      // Check if response.data.response exists
      if (!response.data.response) {
        console.error('Invalid response structure:', response.data);
        throw new Error('Invalid response structure from AI');
      }

      return {
        data: {
          response: response.data.response
        },
        error: null
      };
    }).catch(error => {
      console.error('Error in invokeAIChat:', error);
      return {
        data: null,
        error: error instanceof Error ? error : new Error('Unknown error occurred')
      };
    });
    
    activeRequests.set(requestKey, promise)
    return await promise
  } finally {
    // Clean up request tracking
    setTimeout(() => {
      activeRequests.delete(requestKey)
    }, 10000)
  }
}
