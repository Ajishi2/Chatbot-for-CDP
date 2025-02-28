import { useState, useRef, useEffect } from 'react';
import { getChatResponse } from './services/cohereService';
import { saveChatMessage, getChatHistory } from './services/supabaseClient';
import { Message, MessageType, DbChatMessage, ChatMessage } from './types';
import { MessageSquare, Send, User, Bot, ChevronDown, HelpCircle, ExternalLink, Moon, Sun } from 'lucide-react';

function App() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: MessageType.BOT,
      text: "Hello! I'm your CDP Support Agent. I can help with questions about Segment, mParticle, Lytics, and Zeotap. How can I assist you today?",
      timestamp: new Date()
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [userId, setUserId] = useState<string>('');
  const [inputValue, setInputValue] = useState('');
  const [showDocs, setShowDocs] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const docLinks = [
    { name: 'Segment Documentation', url: 'https://segment.com/docs/?ref=nav' },
    { name: 'mParticle Documentation', url: 'https://docs.mparticle.com/' },
    { name: 'Lytics Documentation', url: 'https://docs.lytics.com/' },
    { name: 'Zeotap Documentation', url: 'https://docs.zeotap.com/home/en-us/' }
  ];

  
  const platformLinks = [
    { name: 'Segment', url: 'https://segment.com/' },
    { name: 'mParticle', url: 'https://www.mparticle.com/' },
    { name: 'Lytics', url: 'https://www.lytics.com/' },
    { name: 'Zeotap', url: 'https://zeotap.com/' }
  ];

  const quickQuestions = [
    "How does Segment compare to mParticle?",
    "What are Zeotap's main features?",
    "How can I implement user tracking in Lytics?",
    "What's the best CDP for e-commerce?"
  ];

  
  useEffect(() => {
    const savedTheme = localStorage.getItem('cdp-chat-theme') || 'light';
    setTheme(savedTheme as 'light' | 'dark');
    document.documentElement.classList.toggle('dark', savedTheme === 'dark');
  }, []);

  useEffect(() => {
    if (!userId) {
      const newUserId = `user_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
      setUserId(newUserId);
      saveChatMessage(newUserId, 'CHATBOT', messages[0].text)
        .catch(error => console.error('Error saving welcome message:', error));
    }
  }, [userId, messages]);

  useEffect(() => {
    if (userId) loadChatHistory();
  }, [userId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadChatHistory = async () => {
    try {
      const history = await getChatHistory(userId);
      if (history && history.length > 0) {
        const startIndex = history[0].message === messages[0].text ? 1 : 0;
        const loadedMessages = history.slice(startIndex).map((msg: DbChatMessage) => ({
          id: msg.id,
          type: msg.role === 'USER' ? MessageType.USER : MessageType.BOT,
          text: msg.message,
          timestamp: new Date(msg.created_at)
        }));
        if (loadedMessages.length > 0) setMessages(prev => [...prev, ...loadedMessages]);
      }
    } catch (error) {
      console.error('Error loading chat history:', error);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: MessageType.USER,
      text: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      await saveChatMessage(userId, 'USER', inputValue);
      const chatHistory: ChatMessage[] = messages.map(m => ({
        role: m.type === MessageType.USER ? 'USER' : 'CHATBOT',
        message: m.text
      }));
      const response = await getChatResponse(chatHistory, inputValue);
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: MessageType.BOT,
        text: response || "I'm sorry, I couldn't process your request. Please try again.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);
      await saveChatMessage(userId, 'CHATBOT', botMessage.text);
    } catch (error) {
      console.error('Error getting chat response:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: MessageType.BOT,
        text: "I'm sorry, I encountered an error. Please try again later.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
      await saveChatMessage(userId, 'CHATBOT', errorMessage.text);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('cdp-chat-theme', newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className={`flex h-screen ${theme === 'light' ? 'bg-gradient-to-br from-blue-50 to-indigo-50' : 'bg-gradient-to-br from-gray-900 to-gray-950'}`}>
      {/* Sidebar */}
      <aside className={`hidden md:flex flex-col w-64 ${theme === 'light' ? 'bg-white' : 'bg-gray-800'} border-r ${theme === 'light' ? 'border-gray-200' : 'border-gray-700'} shadow-sm`}>
        <div className={`p-4 border-b ${theme === 'light' ? 'border-gray-200' : 'border-gray-700'}`}>
          <div className="flex items-center space-x-2">
            <div className="bg-blue-600 p-2 rounded-lg">
              <MessageSquare className="text-white" size={20} />
            </div>
            <h1 className={`font-bold text-lg ${theme === 'light' ? 'text-gray-800' : 'text-gray-200'}`}>CDP Assistant</h1>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <div className="mb-6">
            <h2 className={`text-xs font-semibold ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'} uppercase tracking-wider mb-2`}>CDP Platforms</h2>
            <ul className="space-y-1">
              {platformLinks.map((platform) => (
                <li
                  key={platform.name}
                  className={`px-3 py-2 rounded-md text-sm flex items-center ${theme === 'light' ? 'text-gray-700 hover:bg-blue-50 hover:text-blue-700' : 'text-gray-300 hover:bg-gray-700 hover:text-blue-400'} transition-colors cursor-pointer`}
                  onClick={() => window.open(platform.url, '_blank')}
                >
                  <span className="w-2 h-2 rounded-full bg-blue-500 mr-2"></span>
                  {platform.name}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className={`text-xs font-semibold ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'} uppercase tracking-wider mb-2`}>Useful Links</h2>
            <ul className="space-y-1">
              <li
                className={`px-3 py-2 rounded-md text-sm flex items-center justify-between ${theme === 'light' ? 'text-gray-700 hover:bg-blue-50 hover:text-blue-700' : 'text-gray-300 hover:bg-gray-700 hover:text-blue-400'} transition-colors cursor-pointer`}
                onClick={() => setShowDocs(!showDocs)}
              >
                <div className="flex items-center">
                  <span className={`mr-2 ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}><HelpCircle size={16} /></span>
                  Documentation
                </div>
                <ChevronDown
                  size={16}
                  className={`transform transition-transform ${showDocs ? 'rotate-180' : ''}`}
                />
              </li>

              {showDocs && (
                <div className={`ml-6 mt-1 mb-2 space-y-1 text-xs border-l-2 ${theme === 'light' ? 'border-gray-200' : 'border-gray-700'} pl-3`}>
                  {docLinks.map((link, index) => (
                    <a
                      key={index}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex items-center py-1.5 ${theme === 'light' ? 'text-gray-600 hover:text-blue-600' : 'text-gray-400 hover:text-blue-400'} transition-colors`}
                    >
                      <ExternalLink size={12} className="mr-1.5" />
                      {link.name}
                    </a>
                  ))}
                </div>
              )}

              <li
                className={`px-3 py-2 rounded-md text-sm flex items-center ${theme === 'light' ? 'text-gray-700 hover:bg-blue-50 hover:text-blue-700' : 'text-gray-300 hover:bg-gray-700 hover:text-blue-400'} transition-colors cursor-pointer`}
                onClick={toggleTheme}
              >
                <span className={`mr-2 ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
                  {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
                </span>
                {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
              </li>
            </ul>
          </div>
        </div>

        <div className={`p-4 border-t ${theme === 'light' ? 'border-gray-200 bg-white' : 'border-gray-700 bg-gray-800'}`}>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white font-medium">
              {userId.substring(0, 2).toUpperCase()}
            </div>
            <div className="text-sm">
              <p className={`font-medium ${theme === 'light' ? 'text-gray-800' : 'text-gray-200'}`}>Guest User</p>
              <p className={`${theme === 'light' ? 'text-gray-500' : 'text-gray-400'} text-xs`}>{userId.substring(0, 8)}...</p>
            </div>
          </div>
        </div>
      </aside>

      <main className="flex-1 flex flex-col max-h-screen overflow-hidden">
     
        <header className={`${theme === 'light' ? 'bg-white border-gray-200' : 'bg-gray-800 border-gray-700'} border-b shadow-sm z-10`}>
          <div className="px-4 py-3 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="md:hidden bg-blue-600 p-1.5 rounded">
                <MessageSquare className="text-white" size={18} />
              </div>
              <div>
                <h1 className={`font-semibold ${theme === 'light' ? 'text-gray-800' : 'text-gray-200'}`}>CDP Support Agent</h1>
                <p className={`text-xs ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>Ask questions about your favorite CDPs</p>
              </div>
            </div>
            <div className={`hidden sm:flex items-center space-x-2 text-xs ${theme === 'light' ? 'bg-gray-100' : 'bg-gray-700'} px-3 py-1.5 rounded-full`}>
              <span className="w-2 h-2 rounded-full bg-green-500"></span>
              <span className={`${theme === 'light' ? 'text-gray-600' : 'text-gray-300'}`}>Online</span>
            </div>
          </div>
        </header>

        <div className={`flex-1 overflow-y-auto p-4 space-y-4 ${theme === 'light' ? 'bg-gray-50' : 'bg-gray-900'}`}>
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.type === MessageType.USER ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`
                max-w-3xl rounded-2xl p-4
                ${message.type === MessageType.USER
                  ? 'bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-tr-none'
                  : `${theme === 'light' 
                      ? 'bg-white border border-gray-200 text-gray-800' 
                      : 'bg-gray-700 border border-gray-600 text-gray-100'} rounded-tl-none shadow-sm`}
              `}>
                <div className="flex items-center space-x-2 mb-1">
                  <div className={`
                    w-6 h-6 rounded-full flex items-center justify-center
                    ${message.type === MessageType.USER
                      ? 'bg-blue-500'
                      : 'bg-gradient-to-r from-purple-500 to-indigo-600'}
                    text-white text-xs font-bold
                  `}>
                    {message.type === MessageType.USER ? <User size={14} /> : <Bot size={14} />}
                  </div>
                  <span className={`text-xs font-medium ${message.type === MessageType.USER ? 'text-blue-200' : theme === 'light' ? 'text-gray-500' : 'text-gray-300'}`}>
                    {message.type === MessageType.USER ? 'You' : 'CDP Assistant'}
                  </span>
                  <span className={`text-xs ${message.type === MessageType.USER ? 'text-blue-200' : theme === 'light' ? 'text-gray-400' : 'text-gray-300'}`}>
                    {formatTime(message.timestamp)}
                  </span>
                </div>
                <p className={`whitespace-pre-wrap text-sm ${message.type === MessageType.USER ? 'text-gray-50' : theme === 'light' ? 'text-gray-700' : 'text-gray-100'}`}>
                  {message.text}
                </p>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className={`${theme === 'light' ? 'bg-white border-gray-200' : 'bg-gray-700 border-gray-600'} border rounded-2xl rounded-tl-none p-4 shadow-sm max-w-xs animate-pulse`}>
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-r from-purple-500 to-indigo-600 flex items-center justify-center text-white text-xs">
                    <Bot size={14} />
                  </div>
                  <span className={`text-xs font-medium ${theme === 'light' ? 'text-gray-500' : 'text-gray-300'}`}>CDP Assistant</span>
                </div>
                <div className="mt-2 flex space-x-1">
                  <div className="h-2 w-2 rounded-full bg-gray-300 animate-bounce"></div>
                  <div className="h-2 w-2 rounded-full bg-gray-300 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <div className="h-2 w-2 rounded-full bg-gray-300 animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {messages.length < 3 && !isLoading && (
          <div className={`px-4 py-3 ${theme === 'light' ? 'bg-gray-50' : 'bg-gray-900'}`}>
            <p className={`text-xs ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'} mb-2`}>Try asking:</p>
            <div className="flex flex-wrap gap-2">
              {quickQuestions.map((question, index) => (
                <button
                  key={index}
                  className={`${theme === 'light' 
                    ? 'bg-white border-gray-200 text-gray-700 hover:bg-blue-50 hover:border-blue-300' 
                    : 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600 hover:border-blue-400'} 
                    border rounded-full px-3 py-1.5 text-xs transition-colors`}
                  onClick={() => {
                    setInputValue(question);
                    inputRef.current?.focus();
                  }}
                >
                  {question}
                </button>
              ))}
            </div>
          </div>
        )}

      
        <div className={`p-4 border-t ${theme === 'light' ? 'border-gray-200 bg-white' : 'border-gray-700 bg-gray-800'}`}>
          <form onSubmit={handleSendMessage} className="flex items-end space-x-2">
            <div className={`flex-1 ${theme === 'light' 
              ? 'bg-gray-100 hover:bg-gray-50 focus-within:bg-white' 
              : 'bg-gray-700 hover:bg-gray-600 focus-within:bg-gray-600'} 
              rounded-2xl p-3 focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-opacity-50 transition-all`}>
              <textarea
                ref={inputRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your message..."
                className={`w-full bg-transparent border-0 focus:ring-0 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'} resize-none max-h-32 min-h-[40px]`}
                rows={1}
                style={{ overflow: 'auto' }}
              />
              <div className="flex justify-between items-center mt-2">
                <div className={`text-xs ${theme === 'light' ? 'text-gray-400' : 'text-gray-500'}`}>
                  Press Enter to send
                </div>
              </div>
            </div>
            <button
              type="submit"
              disabled={isLoading || !inputValue.trim()}
              className={`
                p-3 rounded-full
                ${isLoading || !inputValue.trim()
                  ? `${theme === 'light' ? 'bg-gray-100 text-gray-400' : 'bg-gray-700 text-gray-500'}`
                  : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md hover:shadow-lg'}
                transition-all
              `}
            >
              <Send size={18} />
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}

export default App;