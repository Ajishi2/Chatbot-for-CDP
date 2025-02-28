import { createClient } from '@supabase/supabase-js';

// Use environment variables for Supabase connection
const supabaseUrl = 'https://jzupnjxfroypgjjasgtm.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp6dXBuanhmcm95cGdqamFzZ3RtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA3NDI5NDIsImV4cCI6MjA1NjMxODk0Mn0.LU_9pEcJ8BPxkl8Wu1ob6-tKBWOp1Aq2BwBASiS_FtE';

export const supabase = createClient(supabaseUrl, supabaseKey);

// Function to save chat messages to Supabase
export async function saveChatMessage(userId: string, role: string, message: string) {
  try {
    const { data, error } = await supabase
      .from('chat_messages')
      .insert([
        { user_id: userId, role, message, created_at: new Date().toISOString() }
      ]);
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error saving message to Supabase:', error);
    throw error;
  }
}

// Function to fetch chat history from Supabase
export async function getChatHistory(userId: string) {
  try {
    const { data, error } = await supabase
      .from('chat_messages')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: true });
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching chat history from Supabase:', error);
    throw error;
  }
}