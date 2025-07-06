
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
  imageUrls: string[],
  userProfile?: any
): Promise<void> {
  // Prepare base prompt text
  let promptText = "Analyze this cannabis plant image. Provide a detailed assessment in the following format:\n\n" +
                  "Growth Stage: (seedling, vegetative, flowering, etc.)\n" +
                  "Health Score: (excellent, good, fair, poor)\n" +
                  "Specific Issues: (any visible problems, deficiencies, pests, etc.)\n" +
                  "Environmental Factors: (lighting, temperature, humidity observations)\n" +
                  "Recommended Actions: (bullet points of specific actions to take)";
  
  // Add user profile context if available
  if (userProfile) {
    promptText += "\n\nUser Growing Context:";
    
    if (userProfile.growing_method) {
      promptText += `\n- Growing Method: ${userProfile.growing_method} growing`;
    }
    
    if (userProfile.grow_experience_level) {
      promptText += `\n- Experience Level: ${userProfile.grow_experience_level}`;
    }
    
    if (userProfile.monitoring_method) {
      promptText += `\n- Monitoring Method: ${userProfile.monitoring_method}`;
    }
    
    if (userProfile.nutrient_type) {
      promptText += `\n- Nutrient Type: ${userProfile.nutrient_type}`;
    }
    
    // Add note to tailor response based on profile
    promptText += "\n\nPlease tailor your analysis and recommendations specifically for this user's growing context.";
  }

  // Prepare message with text prompt
  const content = [
    {
      type: "text",
      text: promptText
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
  assistantId: string,
  userProfile?: any
): Promise<string> {
  // Create base instructions
  let instructions = "You are Master Growbot, a cannabis cultivation expert. Analyze the plant image thoroughly and provide specific, detailed feedback about the plant's health, growth stage, and potential issues. Be thorough and specific in your analysis rather than general.";
  
  // Modify instructions based on user profile if available
  if (userProfile) {
    if (userProfile.growing_method === 'indoor') {
      instructions += " Since the user grows indoors, focus on lighting issues, ventilation problems, and temperature/humidity control specific to indoor environments.";
    } else if (userProfile.growing_method === 'outdoor') {
      instructions += " Since the user grows outdoors, consider weather impacts, seasonal challenges, pests common in outdoor grows, and sunlight exposure issues.";
    } else if (userProfile.growing_method === 'greenhouse') {
      instructions += " Since the user grows in a greenhouse, focus on greenhouse-specific issues like humidity management, temperature regulation, and the balance of natural/supplemental light.";
    }
    
    if (userProfile.grow_experience_level === 'new') {
      instructions += " Provide beginner-friendly recommendations with detailed steps since the user is new to growing.";
    } else if (userProfile.grow_experience_level === 'advanced') {
      instructions += " You can include more technical recommendations since the user has advanced growing experience.";
    }
    
    if (userProfile.nutrient_type) {
      instructions += ` Tailor nutrient recommendations to the user's preference for ${userProfile.nutrient_type} nutrients.`;
    }
  }

  const response = await fetch(`https://api.openai.com/v1/threads/${threadId}/runs`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'OpenAI-Beta': 'assistants=v2'
    },
    body: JSON.stringify({
      assistant_id: assistantId,
      instructions
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

// Check run status with exponential backoff and improved timeout handling
export async function waitForRunCompletion(
  apiKey: string, 
  threadId: string, 
  runId: string
): Promise<void> {
  let runStatus = 'queued';
  let attempts = 0;
  let delay = 1000; // Start with 1s delay
  const maxAttempts = 20; // Increased attempts
  const maxDelay = 4000; // Maximum delay of 4s
  const startTime = Date.now();
  const maxWaitTime = 50000; // 50 second maximum wait time
  
  while ((runStatus === 'queued' || runStatus === 'in_progress') && attempts < maxAttempts) {
    // Check if we've exceeded maximum wait time
    if (Date.now() - startTime > maxWaitTime) {
      throw new Error(`Analysis timed out after ${maxWaitTime / 1000} seconds`);
    }

    await new Promise(resolve => setTimeout(resolve, delay));
    
    try {
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
      const elapsed = Date.now() - startTime;
      console.log(`Run status (attempt ${attempts + 1}/${maxAttempts}, ${elapsed}ms elapsed):`, runStatus);
      
      if (runStatus === 'completed') {
        console.log(`Analysis completed in ${elapsed}ms`);
        return;
      } else if (runStatus === 'failed' || runStatus === 'cancelled' || runStatus === 'expired') {
        throw new Error(`Run failed with status: ${runStatus}`);
      }
      
      attempts++;
      // Implement exponential backoff (with a maximum)
      delay = Math.min(delay * 1.2, maxDelay);
    } catch (error) {
      console.error(`Error checking run status (attempt ${attempts + 1}):`, error);
      if (attempts >= maxAttempts - 1) {
        throw error;
      }
      attempts++;
      delay = Math.min(delay * 1.2, maxDelay);
    }
  }

  throw new Error(`Run did not complete in time. Last status: ${runStatus}. Total attempts: ${attempts}`);
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

  console.log('Analysis text length:', analysisText.length);
  return analysisText;
}
