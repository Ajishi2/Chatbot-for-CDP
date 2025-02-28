export enum MessageType {
    USER = 'user',
    BOT = 'bot'
  }
  
  export interface Message {
    id: string;
    type: MessageType;
    text: string;
    timestamp: Date;
  }
  
  export interface ChatMessage {
    role: 'USER' | 'CHATBOT';
    message: string;
    id?: string;
    timestamp?: Date;
  }
  
  
  export interface DbChatMessage {
    id: string;
    user_id: string;
    role: string;
    message: string;
    created_at: string;
  }