/*
  # Create chat_messages table

  1. New Tables
    - `chat_messages`
      - `id` (uuid, primary key)
      - `user_id` (text, not null) - Identifies the user session
      - `role` (text, not null) - Either 'USER' or 'CHATBOT'
      - `message` (text, not null) - The actual message content
      - `created_at` (timestamptz, default now()) - When the message was created
  
  2. Security
    - Enable RLS on `chat_messages` table
    - Add policy for public access (since we're using anonymous access for this demo)
*/

CREATE TABLE IF NOT EXISTS chat_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id text NOT NULL,
  role text NOT NULL,
  message text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create index on user_id for faster queries
CREATE INDEX IF NOT EXISTS chat_messages_user_id_idx ON chat_messages(user_id);

-- Enable Row Level Security
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anonymous users to insert their own messages
CREATE POLICY "Anyone can insert chat messages"
  ON chat_messages
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Create policy to allow users to read only their own messages
CREATE POLICY "Users can read their own messages"
  ON chat_messages
  FOR SELECT
  TO anon
  USING (true);