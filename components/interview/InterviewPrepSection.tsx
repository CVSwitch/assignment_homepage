"use client";

import { useState, useRef, useEffect } from 'react';
import { Sidebar } from "@/components/Sidebar";
import { PaperAirplaneIcon } from "@heroicons/react/24/outline";
import { InformationCircleIcon } from "@heroicons/react/24/solid";

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

interface InterviewPrepSectionProps {
  isCollapsed: boolean;
  setIsCollapsed: (value: boolean) => void;
}

export function InterviewPrepSection({ isCollapsed, setIsCollapsed }: InterviewPrepSectionProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hi there! I'm your interview preparation assistant. I can help you practice for interviews by asking common questions, providing feedback on your answers, or offering tips for specific interview scenarios. What type of interview are you preparing for?",
      sender: 'ai',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom of messages when new messages are added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Function to generate a unique ID
  const generateId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  };

  // Handle sending a message
  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    // Add user message to chat
    const userMessage: Message = {
      id: generateId(),
      content: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      // In a real implementation, this would call your LLM API endpoint
      // For now, we'll simulate a response with a timeout
      const response = await simulateLLMResponse(inputMessage);
      
      // Add AI response to chat
      const aiMessage: Message = {
        id: generateId(),
        content: response,
        sender: 'ai',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error getting response from LLM:', error);
      
      // Add error message
      const errorMessage: Message = {
        id: generateId(),
        content: "I'm sorry, I encountered an error processing your request. Please try again.",
        sender: 'ai',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Simulate LLM response (replace with actual API call in production)
  const simulateLLMResponse = async (userMessage: string): Promise<string> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Simple response logic based on user input
    const userMessageLower = userMessage.toLowerCase();
    
    if (userMessageLower.includes('tell me about yourself') || userMessageLower.includes('introduce yourself')) {
      return "That's a common interview opener! When answering 'Tell me about yourself,' focus on your professional background, relevant skills, and what makes you a good fit for the role. Keep it concise (1-2 minutes) and highlight your most impressive achievements. Would you like to practice this response?";
    }
    
    if (userMessageLower.includes('weakness') || userMessageLower.includes('weaknesses')) {
      return "When discussing weaknesses, choose something genuine but not critical to the job. Explain how you're actively working to improve it. For example: 'I sometimes get caught up in details. I've been working on this by setting time limits for tasks and focusing on the bigger picture.' Would you like more examples?";
    }
    
    if (userMessageLower.includes('strength') || userMessageLower.includes('strengths')) {
      return "When discussing strengths, choose qualities relevant to the position. Back them up with specific examples. For instance: 'One of my strengths is problem-solving. In my previous role, I identified a workflow issue that was causing delays and implemented a solution that reduced processing time by 30%.' What strengths would you like to highlight in your interview?";
    }
    
    if (userMessageLower.includes('salary') || userMessageLower.includes('compensation')) {
      return "Salary negotiations can be tricky. Research industry standards for your role and location before the interview. When asked, you might say: 'Based on my research and experience, I'm looking for a salary in the range of X to Y. However, I'm also considering the entire compensation package including benefits.' Would you like more tips on salary negotiation?";
    }
    
    if (userMessageLower.includes('why should we hire you') || userMessageLower.includes('why are you the best candidate')) {
      return "This question is your opportunity to sell yourself. Focus on: 1) Your specific skills that match the job requirements, 2) Relevant achievements that demonstrate your capabilities, and 3) How your unique background adds value. For example: 'My combination of experience in X and skills in Y has prepared me to excel in this role. In my previous position, I achieved Z, which demonstrates my ability to deliver results.' Would you like to practice your response?";
    }
    
    // Default response for other questions
    return "That's a good question to prepare for. When answering, remember to be specific, use the STAR method (Situation, Task, Action, Result) for behavioral questions, and keep your responses concise but detailed. Would you like me to ask you some common interview questions for practice?";
  };

  // Handle pressing Enter to send message
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  

  return (
    <div className="min-h-screen h-full w-full bg-white dark:bg-gray-900 bg-[radial-gradient(125%_125%_at_50%_10%,#fff_40%,#63e_100%)] dark:bg-[radial-gradient(125%_125%_at_50%_10%,#1f2937_40%,#1e40af_100%)] flex flex-col md:flex-row">
      {/* Added dark mode and responsiveness */}
      <Sidebar onCollapseChange={setIsCollapsed} />
      <main className={`flex-1 transition-all duration-300 ${isCollapsed ? 'md:ml-16' : 'md:ml-64'} p-4 lg:p-6 max-w-4xl mx-auto w-full`}>
        <div className="flex flex-col h-full">
          {/* Header Section */}
          <div className="p-4 md:p-6 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Interview Preparation</h1>
            
            {/* User Guide */}
            <div className="mt-4 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <div className="flex items-start">
                <InformationCircleIcon className="w-6 h-6 text-blue-500 dark:text-blue-400 mr-3 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-blue-800 dark:text-blue-300 mb-1">How to Use This Chat</h3>
                  <p className="text-blue-700 dark:text-blue-200">
                    Practice answering common interview questions or ask for advice on specific interview scenarios. 
                    You can try questions like:
                  </p>
                  <ul className="list-disc list-inside text-blue-700 dark:text-blue-200 mt-2 space-y-1">
                    <li>How should I answer &quot;Tell me about yourself&quot;?</li>
                    <li>What are good questions to ask the interviewer?</li>
                    <li>How do I explain employment gaps?</li>
                    <li>Can you give me feedback on my answer to...</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          
          {/* Chat Area */}
          <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
            {messages.map((message) => (
              <div 
                key={message.id} 
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`max-w-[85%] md:max-w-3xl rounded-lg p-3 md:p-4 ${
                    message.sender === 'user' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200'
                  }`}
                >
                  <p className="whitespace-pre-line text-sm md:text-base">{message.content}</p>
                  <p 
                    className={`text-xs mt-1 ${
                      message.sender === 'user' ? 'text-blue-200' : 'text-gray-500 dark:text-gray-400'
                    }`}
                  >
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-3 md:p-4">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-500 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-500 animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-500 animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
          
          {/* Input Area */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
            <div className="flex items-center gap-2">
              <textarea
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your message here..."
                className="flex-1 border border-gray-300 dark:border-gray-600 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 min-h-[40px] max-h-[120px]"
                rows={1}
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isLoading}
                className={`p-2 rounded-full ${
                  !inputMessage.trim() || isLoading
                    ? 'bg-gray-200 dark:bg-gray-600 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                <PaperAirplaneIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 