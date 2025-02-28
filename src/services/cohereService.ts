import { CohereClient } from 'cohere-ai';
import { ChatMessage } from '../types';

// Initialize Cohere client with API key
const cohere = new CohereClient({
  token: import.meta.env.VITE_COHERE_API_KEY || '',
});

// Function to get chat response from Cohere
export async function getChatResponse(chatHistory: ChatMessage[], userMessage: string): Promise<string> {
  try {
    // Convert chat history to Cohere's message format
    const messages = chatHistory.map(msg => ({
      role: msg.role as 'USER' | 'CHATBOT', // Cast the role explicitly
      message: msg.message,
    }));
    


    // Add the current user message
    messages.push({
      role: 'USER',
      message: userMessage,
    });

    // Define the system prompt for CDP support
    const systemPrompt = `
      You are a helpful Customer Data Platform (CDP) support agent specializing in Segment, mParticle, Lytics, and Zeotap.
      Your goal is to provide accurate, helpful information about how to use these platforms.
      
      When answering questions:
      1. Focus on providing step-by-step instructions for "how-to" questions
      2. If you don't know the answer, admit it and suggest checking the official documentation
      3. Keep responses concise but complete
      4. For questions unrelated to CDPs, politely redirect the conversation back to CDP topics
      
      Base your answers on the official documentation of these platforms:
      - Segment: https://segment.com/docs/
      - mParticle: https://docs.mparticle.com/
      - Lytics: https://docs.lytics.com/
      - Zeotap: https://docs.zeotap.com/
    `;

    // Call Cohere's chat endpoint
    const response = await cohere.chat({
      message: userMessage,
      chatHistory: messages.slice(0, -1), // Exclude the current message as it's passed separately
      model: 'command',
      preamble: systemPrompt,
    });

    return response.text;
  } catch (error) {
    console.error('Error calling Cohere API:', error);
    throw error;
  }
}