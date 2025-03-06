
/**
 * OpenAI API client for plant analysis
 */

// Helper function to manage thread creation
export async function createThread(apiKey: string): Promise<string> {
  const response = await fetch('https://api.openai.com/v1/threads', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'OpenAI-Beta': 'assistants=v2'
    },
    body: JSON.stringify({})
  });

  if (!response.ok) {
    const errorBody = await response.text();
    console.error('Thread creation failed:', errorBody);
    throw new Error(`Failed to create thread: ${errorBody}`);
  }

  const data = await response.json();
  console.log('Thread created with ID:', data.id);
  return data.id;
}

// Add images and analysis request to thread
export async function addMessageWithImages(
  apiKey: string, 
  threadId: string, 
  imageUrls: string[]
): Promise<void> {
  // Prepare message with text prompt
  const content = [
    {
      type: "text",
      text: "Analyze this cannabis plant image. Provide a detailed assessment in the following format:\n\n" +
            "Growth Stage: (seedling, vegetative, flowering, etc.)\n" +
            "Health Score: (excellent, good, fair, poor)\n" +
            "Specific Issues: (any visible problems, deficiencies, pests, etc.)\n" +
            "Environmental Factors: (lighting, temperature, humidity observations)\n" +
            "Recommended Actions: (bullet points of specific actions to take)"
    }
  ];

  // Add image URLs to the message
  for (const url of imageUrls) {
    content.push({
      type: "image_url",
      image_url: { url }
    });
  }

  // Add message to thread
  const response = await fetch(`https://api.openai.com/v1/threads/${threadId}/messages`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'OpenAI-Beta': 'assistants=v2'
    },
    body: JSON.stringify({
      role: 'user',
      content
    })
  });

  if (!response.ok) {
    const errorBody = await response.text();
    console.error('Message creation failed:', errorBody);
    throw new Error(`Failed to add message: ${errorBody}`);
  }

  console.log('Message with images added to thread');
}

// Start assistant run
export async function runAssistant(
  apiKey: string, 
  threadId: string, 
  assistantId: string
): Promise<string> {
  const response = await fetch(`https://api.openai.com/v1/threads/${threadId}/runs`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'OpenAI-Beta': 'assistants=v2'
    },
    body: JSON.stringify({
      assistant_id: assistantId,
      instructions: "You are Master Growbot, a cannabis cultivation expert. Analyze the plant image thoroughly and provide specific, detailed feedback about the plant's health, growth stage, and potential issues. Be thorough and specific in your analysis rather than general."
    })
  });

  if (!response.ok) {
    const errorBody = await response.text();
    console.error('Run creation failed:', errorBody);
    throw new Error(`Failed to run assistant: ${errorBody}`);
  }

  const data = await response.json();
  console.log('Run created with ID:', data.id);
  return data.id;
}

// Check run status with exponential backoff
export async function waitForRunCompletion(
  apiKey: string, 
  threadId: string, 
  runId: string
): Promise<void> {
  let runStatus = 'queued';
  let attempts = 0;
  let delay = 1000; // Start with 1s delay
  const maxAttempts = 15; // Reduced from 30
  const maxDelay = 3000; // Maximum delay of 3s
  
  while ((runStatus === 'queued' || runStatus === 'in_progress') && attempts < maxAttempts) {
    await new Promise(resolve => setTimeout(resolve, delay));
    
    const response = await fetch(`https://api.openai.com/v1/threads/${threadId}/runs/${runId}`, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'OpenAI-Beta': 'assistants=v2'
      }
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error('Status check failed:', errorBody);
      throw new Error(`Failed to check status: ${errorBody}`);
    }

    const statusData = await response.json();
    runStatus = statusData.status;
    console.log(`Run status (attempt ${attempts + 1}/${maxAttempts}):`, runStatus);
    
    if (runStatus === 'completed') {
      return;
    } else if (runStatus === 'failed' || runStatus === 'cancelled' || runStatus === 'expired') {
      throw new Error(`Run failed with status: ${runStatus}`);
    }
    
    attempts++;
    // Implement exponential backoff (with a maximum)
    delay = Math.min(delay * 1.5, maxDelay);
  }

  throw new Error(`Run did not complete in time. Last status: ${runStatus}`);
}

// Get completion message
export async function getAssistantResponse(apiKey: string, threadId: string): Promise<string> {
  const response = await fetch(`https://api.openai.com/v1/threads/${threadId}/messages`, {
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'OpenAI-Beta': 'assistants=v2'
    }
  });

  if (!response.ok) {
    const errorBody = await response.text();
    console.error('Messages retrieval failed:', errorBody);
    throw new Error(`Failed to retrieve messages: ${errorBody}`);
  }

  const messagesData = await response.json();
  
  // Find assistant's response (most recent assistant message)
  const assistantMessages = messagesData.data.filter((msg: any) => msg.role === 'assistant');
  
  if (assistantMessages.length === 0) {
    throw new Error('No assistant response found');
  }

  const latestMessage = assistantMessages[0];
  
  // Find text content in message parts
  let analysisText = '';
  if (latestMessage.content && latestMessage.content.length > 0) {
    const textParts = latestMessage.content.filter((part: any) => part.type === 'text');
    if (textParts.length > 0) {
      analysisText = textParts.map((part: any) => part.text.value).join('\n');
    }
  }

  if (!analysisText) {
    throw new Error('No text content found in assistant response');
  }

  console.log('Analysis text:', analysisText.substring(0, 200) + '...');
  return analysisText;
}
