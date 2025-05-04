"use client";

import { useState, useRef, useEffect } from 'react';
import { Sidebar } from "@/components/Sidebar";
import {  PaperAirplaneIcon, MicrophoneIcon } from "@heroicons/react/24/outline";
import { InformationCircleIcon, DocumentTextIcon, BriefcaseIcon, AcademicCapIcon } from "@heroicons/react/24/solid";

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}


interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  feedback?: {
    score: number;
    strengths: string[];
    improvements: string[];
  };
}

interface Resume {
  id: string;
  name: string;
  content: string;
}

const mockResumes: Resume[] = [
  {
    id: '1',
    name: 'Software Engineer Resume',
    content: 'Experience with React, TypeScript, Node.js...'
  },
  {
    id: '2',
    name: 'Data Science Resume',
    content: 'Experience with Python, Machine Learning, Data Analysis...'
  },
  {
    id: '3',
    name: 'UX/UI Designer Resume',
    content: 'Experience with Figma, UI/UX principles, user research...'
  }
];

const interviewRounds = [
  { id: 'technical', name: 'Technical Interview' },
  { id: 'behavioral', name: 'Behavioral Interview' },
  { id: 'system-design', name: 'System Design Interview' },
  { id: 'hr', name: 'HR/Final Round' }
];

export function InterviewPrepSection() {
  // Chat messages
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Welcome to the Interview Preparation Assistant! To get started, please select an interview round, paste in a job description, and choose a resume to prepare with.",
      sender: 'ai',
      timestamp: new Date()
    }
  ]);
  
  // User inputs
  const [inputMessage, setInputMessage] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [selectedResumeId, setSelectedResumeId] = useState('');
  const [selectedRound, setSelectedRound] = useState('');
  
  // UI states
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [setupComplete, setSetupComplete] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [currentScore, setCurrentScore] = useState(0);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const speechRecognition = useRef<any>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window !== 'undefined' && (window.SpeechRecognition || window.webkitSpeechRecognition)) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      speechRecognition.current = new SpeechRecognition();
      speechRecognition.current.continuous = true;
      speechRecognition.current.interimResults = true;
  
      speechRecognition.current.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0])
          .map((result: any) => result.transcript)
          .join('');
  
        setInputMessage(transcript);
      };
  
      speechRecognition.current.onerror = (event: any) => {
        console.error('Speech recognition error', event.error);
        setIsRecording(false);
      };
    }
  }, []);
  // Function to generate a unique ID
  const generateId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  };

  // Start interview after setup is complete
  const startInterview = () => {
    if (!selectedRound || !jobDescription || !selectedResumeId) {
      alert('Please complete all setup fields before starting the interview.');
      return;
    }

    const selectedResume = mockResumes.find(resume => resume.id === selectedResumeId);
    const roundName = interviewRounds.find(round => round.id === selectedRound)?.name;
    
    setSetupComplete(true);
    
    // Add start message
    const startMessage: Message = {
      id: generateId(),
      content: `Great! Let's begin your ${roundName} preparation based on the job description and your ${selectedResume?.name}. I'll ask you relevant questions - answer them as you would in a real interview.`,
      sender: 'ai',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, startMessage]);
    
    // Ask first question after a slight delay
    setTimeout(() => {
      askNextQuestion();
    }, 1000);
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
      // Analyze response and generate feedback
      const { response, feedback } = await analyzeResponse(inputMessage, selectedRound);
      
      // Set the current score for the progress bar
      setCurrentScore(feedback.score);
      
      // Add AI response with feedback
      const aiMessage: Message = {
        id: generateId(),
        content: response,
        sender: 'ai',
        timestamp: new Date(),
        feedback: feedback
      };
      
      setMessages(prev => [...prev, aiMessage]);
      
      // Ask next question after a delay
      setTimeout(() => {
        askNextQuestion();
      }, 2000);
    } catch (error) {
      console.error('Error getting response from AI:', error);
      
      // Add error message
      const errorMessage: Message = {
        id: generateId(),
        content: "I'm sorry, I encountered an error processing your response. Let's continue with the next question.",
        sender: 'ai',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessage]);
      
      // Continue with next question despite error
      setTimeout(() => {
        askNextQuestion();
      }, 1000);
    } finally {
      setIsLoading(false);
    }
  };

  // Ask the next interview question based on context
  const askNextQuestion = async () => {
    setIsLoading(true);
    
    try {
      const question = await generateQuestion(selectedRound, jobDescription, selectedResumeId);
      
      const questionMessage: Message = {
        id: generateId(),
        content: question,
        sender: 'ai',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, questionMessage]);
    } catch (error) {
      console.error('Error generating question:', error);
      
      const errorMessage: Message = {
        id: generateId(),
        content: "I'm having trouble generating the next question. Let's try a general one: Tell me about a challenging project you worked on and how you handled it.",
        sender: 'ai',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Analyze user's response and generate feedback
  const analyzeResponse = async (response: string, interviewType: string): Promise<{ response: string, feedback: any }> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // In a real app, this would call an API or LLM
    // For now, we'll use mock logic based on response length and keywords
    
    const wordCount = response.split(' ').length;
    let score = 0;
    const strengths = [];
    const improvements = [];
    
    // Basic scoring logic
    if (wordCount < 20) {
      score = 4;
      improvements.push("Provide more detailed answers");
    } else if (wordCount > 100) {
      score = 7;
      strengths.push("Comprehensive answer");
      improvements.push("Try to be more concise");
    } else {
      score = 8;
      strengths.push("Good answer length");
    }
    
    // Check for STAR method usage in behavioral questions
    if (interviewType === 'behavioral') {
      const hasStarElements = /situation|task|action|result/i.test(response);
      if (hasStarElements) {
        score += 1;
        strengths.push("Good use of STAR method");
      } else {
        improvements.push("Consider using the STAR method (Situation, Task, Action, Result)");
      }
    }
    
    // Check for technical terms in technical interviews
    if (interviewType === 'technical') {
      const hasTechnicalTerms = /algorithm|code|implement|design|solution|complexity|efficient/i.test(response);
      if (hasTechnicalTerms) {
        score += 1;
        strengths.push("Good use of technical terminology");
      } else {
        improvements.push("Include more technical details in your answer");
      }
    }
    
    // Cap score at 10
    score = Math.min(10, score);
    
    return {
      response: "Thanks for your answer!",
      feedback: {
        score,
        strengths,
        improvements
      }
    };
  };

  // Generate question based on context
  const generateQuestion = async (round: string, jobDesc: string, resumeId: string): Promise<string> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // In a real app, this would call an API or LLM
    // For now, use static questions based on interview round
    
    const technicalQuestions = [
      "Based on the job requirements, how would you implement a feature that requires real-time data processing?",
      "The job mentions experience with React. Can you explain your approach to state management in a complex React application?",
      "How would you optimize the performance of a web application that's loading slowly?",
      "Explain how you would design a database schema for a feature mentioned in the job description."
    ];
    
    const behavioralQuestions = [
      "Tell me about a time when you had to meet a tight deadline. How did you manage your time?",
      "Describe a situation where you had to work with a difficult team member. How did you handle it?",
      "Give me an example of a time when you showed leadership skills.",
      "Tell me about a project you're particularly proud of from your resume."
    ];
    
    const systemDesignQuestions = [
      "How would you design a scalable system for the main product mentioned in the job description?",
      "Explain how you would architect a solution for handling high traffic loads for this company's services.",
      "Design a database schema and API endpoints for a key feature mentioned in the job description.",
      "How would you implement caching for the type of application this company builds?"
    ];
    
    const hrQuestions = [
      "Why are you interested in this specific role and company?",
      "Where do you see yourself in 5 years?",
      "What salary range are you expecting for this position?",
      "Do you have any questions about the company culture or team structure?"
    ];
    
    // Select question based on round
    let questions;
    switch (round) {
      case 'technical':
        questions = technicalQuestions;
        break;
      case 'behavioral':
        questions = behavioralQuestions;
        break;
      case 'system-design':
        questions = systemDesignQuestions;
        break;
      case 'hr':
        questions = hrQuestions;
        break;
      default:
        questions = [...technicalQuestions, ...behavioralQuestions];
    }
    
    // Get a random question
    const randomIndex = Math.floor(Math.random() * questions.length);
    return questions[randomIndex];
  };

  // Toggle voice recording
  const toggleRecording = () => {
    if (isRecording) {
      speechRecognition.current?.stop();
      setIsRecording(false);
    } else {
      setInputMessage('');
      speechRecognition.current?.start();
      setIsRecording(true);
    }
  };

  // Handle pressing Enter to send message
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Toggle feedback visibility
  const toggleFeedback = () => {
    setShowFeedback(!showFeedback);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      
      <div className="ml-64 flex flex-col h-screen">
        <div className="p-6 bg-white border-b border-gray-200">
          <h1 className="text-2xl font-bold">Interview Preparation</h1>
          
          {/* Setup Form - Shown until setup is complete */}
          {!setupComplete && (
            <div className="mt-6 bg-white rounded-lg border border-gray-200 p-6 space-y-6">
              <h2 className="text-xl font-semibold text-gray-800">Interview Setup</h2>
              
              {/* Interview Round Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <AcademicCapIcon className="w-5 h-5 inline-block mr-2 text-blue-500" />
                  Interview Round
                </label>
                <select 
                  value={selectedRound}
                  onChange={(e) => setSelectedRound(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Interview Round</option>
                  {interviewRounds.map(round => (
                    <option key={round.id} value={round.id}>{round.name}</option>
                  ))}
                </select>
              </div>
              
              {/* Job Description Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <BriefcaseIcon className="w-5 h-5 inline-block mr-2 text-blue-500" />
                  Job Description
                </label>
                <textarea
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Paste the job description here..."
                  className="w-full border border-gray-300 rounded-lg p-3 h-32 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              {/* Resume Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <DocumentTextIcon className="w-5 h-5 inline-block mr-2 text-blue-500" />
                  Select Resume
                </label>
                <select 
                  value={selectedResumeId}
                  onChange={(e) => setSelectedResumeId(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Resume</option>
                  {mockResumes.map(resume => (
                    <option key={resume.id} value={resume.id}>{resume.name}</option>
                  ))}
                </select>
              </div>
              
              {/* Start Button */}
              <button
                onClick={startInterview}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Start Interview Preparation
              </button>
            </div>
          )}
          
          {/* User Guide - Shown after setup is complete */}
          {setupComplete && (
            <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start">
                <InformationCircleIcon className="w-6 h-6 text-blue-500 mr-3 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-blue-800 mb-1">Interview in Progress</h3>
                  <p className="text-blue-700">
                    Answer each question as you would in a real interview. You'll receive feedback on your responses.
                  </p>
                  <div className="mt-2 flex items-center">
                    <span className="text-sm text-blue-700 mr-2">Current Performance:</span>
                    <div className="w-48 h-2 bg-gray-200 rounded-full">
                      <div 
                        className="h-2 bg-blue-600 rounded-full"
                        style={{ width: `${currentScore * 10}%` }}
                      ></div>
                    </div>
                    <span className="ml-2 text-sm font-medium text-blue-700">{currentScore}/10</span>
                    
                    <button
                      onClick={toggleFeedback}
                      className="ml-4 text-sm text-blue-700 hover:text-blue-800 hover:underline"
                    >
                      {showFeedback ? 'Hide Detailed Feedback' : 'Show Detailed Feedback'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((message) => (
            <div key={message.id}>
              <div 
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`max-w-3xl rounded-lg p-4 ${
                    message.sender === 'user' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  <p className="whitespace-pre-line">{message.content}</p>
                  <p 
                    className={`text-xs mt-1 ${
                      message.sender === 'user' ? 'text-blue-200' : 'text-gray-500'
                    }`}
                  >
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
              
              {/* Feedback section for AI responses */}
              {message.sender === 'ai' && message.feedback && showFeedback && (
                <div className="mt-2 ml-4 p-3 bg-gray-50 border border-gray-200 rounded-lg max-w-3xl">
                  <h4 className="font-medium text-gray-700 mb-2">Response Feedback:</h4>
                  
                  {/* Score display */}
                  <div className="mb-2 flex items-center">
                    <span className="text-sm text-gray-600 mr-2">Score:</span>
                    <div className="w-32 h-2 bg-gray-200 rounded-full">
                      <div 
                        className="h-2 bg-green-500 rounded-full" 
                        style={{ width: `${message.feedback.score * 10}%` }}
                      ></div>
                    </div>
                    <span className="ml-2 text-sm font-medium">{message.feedback.score}/10</span>
                  </div>
                  
                  {/* Strengths */}
                  {message.feedback.strengths.length > 0 && (
                    <div className="mb-2">
                      <h5 className="text-sm font-medium text-green-700">Strengths:</h5>
                      <ul className="list-disc list-inside text-sm text-gray-700 ml-2">
                        {message.feedback.strengths.map((strength, index) => (
                          <li key={index}>{strength}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {/* Areas for improvement */}
                  {message.feedback.improvements.length > 0 && (
                    <div>
                      <h5 className="text-sm font-medium text-amber-700">Areas for improvement:</h5>
                      <ul className="list-disc list-inside text-sm text-gray-700 ml-2">
                        {message.feedback.improvements.map((improvement, index) => (
                          <li key={index}>{improvement}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 rounded-lg p-4">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
        
        {/* Input Area - Only shown after setup is complete */}
        {setupComplete && (
          <div className="p-4 border-t border-gray-200 bg-white">
            <div className="flex items-center">
              <textarea
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your answer here..."
                className="flex-1 border border-gray-300 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                rows={2}
              />
              
              {/* Voice input button */}
              <button
                onClick={toggleRecording}
                className={`ml-2 p-2 rounded-full ${
                  isRecording
                    ? 'bg-red-500 text-white'
                    : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                }`}
                title={isRecording ? "Stop recording" : "Start voice input"}
              >
                <MicrophoneIcon className="w-5 h-5" />
              </button>
              
              {/* Send button */}
              <button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isLoading}
                className={`ml-2 p-2 rounded-full ${
                  !inputMessage.trim() || isLoading
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                <PaperAirplaneIcon className="w-5 h-5" />
              </button>
            </div>
            
            {/* Recording indicator */}
            {isRecording && (
              <div className="mt-2 text-sm text-red-500 animate-pulse flex items-center">
                <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                Recording... Speak your answer clearly
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}