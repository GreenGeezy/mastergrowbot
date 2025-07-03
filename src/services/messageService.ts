
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
  
  console.log('Uploading file with name:', fileName)
  
  const { data, error } = await supabase.storage
    .from('plant-images')
    .upload(fileName, file)

  if (error) {
    console.error('Upload error:', error)
    throw error
  }

  console.log('Upload successful, data:', data)

  // Get the full public URL
  const { data: { publicUrl } } = supabase.storage
    .from('plant-images')
    .getPublicUrl(fileName)

  console.log('Generated public URL:', publicUrl)
  
  // Validate the URL is accessible
  if (!publicUrl || (!publicUrl.startsWith('http://') && !publicUrl.startsWith('https://'))) {
    console.error('Invalid public URL generated:', publicUrl)
    throw new Error('Failed to generate valid public URL for uploaded image')
  }

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
    console.log('Invoking AI chat with message:', message);
    console.log('Attachments being sent:', attachments);

    // Process and validate image attachments
    const processedAttachments = attachments.map(attachment => {
      console.log('Processing attachment:', attachment);
      
      if (attachment.type && attachment.type.startsWith('image/')) {
        const url = attachment.url;
        
        // Validate the URL is absolute and accessible
        if (!url || (!url.startsWith('http://') && !url.startsWith('https://'))) {
          console.error('Invalid image URL found:', url);
          return null;
        }
        
        console.log('Valid image attachment processed:', url);
        return {
          ...attachment,
          url: url
        };
      }
      return attachment;
    }).filter(Boolean); // Remove any null values

    console.log('Final processed attachments for AI:', processedAttachments);

    const promise = supabase.functions.invoke('chat', {
      body: { 
        message, 
        userId, 
        conversationId, 
        attachments: processedAttachments 
      }
    }).then(response => {
      console.log('AI response received:', response);

      if (response.error) {
        console.error('AI response error:', response.error);
        throw new Error(response.error.message || 'Failed to get AI response');
      }

      if (!response.data) {
        console.error('No response data received from AI');
        throw new Error('No response data received from AI');
      }

      console.log('AI response data:', response.data);

      // Check if response.data.response exists
      if (!response.data.response) {
        console.error('Invalid response structure from AI:', response.data);
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
