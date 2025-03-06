
import { supabase } from '@/integrations/supabase/client'

// Track in-flight requests to prevent duplicates
const activeRequests = new Map<string, Promise<any>>()

export const sendMessageToSupabase = async (
  userId: string,
  message: string,
  conversationId: string,
  isAi: boolean = false
) => {
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
          conversation_id: conversationId
        }
      ])
    
    // Execute the query and store the promise
    const promise = query.then(result => result)
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
    
    // Execute the query and store the promise
    const promise = query.then(result => result)
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
  conversationId: string
) => {
  const requestKey = `ai:${userId}:${conversationId}:${Date.now()}`
  
  try {
    console.log('Invoking AI chat with:', { message, userId, conversationId });

    const promise = supabase.functions.invoke('chat', {
      body: { message, userId, conversationId }
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
