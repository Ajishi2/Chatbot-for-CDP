import React, { useState, useRef, useEffect } from 'react';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, isLoading }) => {
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<HTMLTextAreaElement>(null);
  
  useEffect(() => {
    // Focus the input when the component mounts
    inputRef.current?.focus();
  }, []);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (inputValue.trim() && !isLoading) {
      onSendMessage(inputValue.trim());
      setInputValue('');
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };
  
  // Auto-resize textarea based on content
  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const target = e.target;
    setInputValue(target.value);
    
    // Reset height to auto to get the correct scrollHeight
    target.style.height = 'auto';
    
    // Set the height to scrollHeight + border (2px)
    target.style.height = `${Math.min(target.scrollHeight, 150)}px`;
  };
  
  return (
    <form onSubmit={handleSubmit} className="relative">
      <textarea
        ref={inputRef}
        value={inputValue}
        onChange={handleInput}
        onKeyDown={handleKeyDown}
        placeholder="Type your question here..."
        disabled={isLoading}
        className="w-full p-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
        style={{ minHeight: '50px', maxHeight: '150px' }}
      />
      <button
        type="submit"
        disabled={!inputValue.trim() || isLoading}
        className={`absolute right-3 bottom-3 p-1 rounded-full ${
          !inputValue.trim() || isLoading
            ? 'text-gray-400 cursor-not-allowed'
            : 'text-blue-600 hover:bg-blue-100'
        }`}
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="24" 
          height="24" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          <path d="m22 2-7 20-4-9-9-4Z" />
          <path d="M22 2 11 13" />
        </svg>
      </button>
    </form>
  );
};

export default ChatInput;