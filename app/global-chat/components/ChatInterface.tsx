"use client"

import { useState, useRef, useEffect } from 'react'
import { Send, User, Bot, Menu, Plus, MessageSquare } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface Message {
  id: string
  content: string
  role: 'user' | 'assistant'
  timestamp: Date
}

interface ChatSession {
  id: string
  title: string
  messages: Message[]
  lastActive: Date
}

interface ChatRequest {
  message: string
  session_id?: string
}

interface ChatResponse {
  message: string
  success: boolean
  chat_context: string
  session_id: string
}

// API Configuration
const API_BASE_URL = 'http://127.0.0.1:8000'

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([
    {
      id: '1',
      title: 'New Chat',
      messages: [],
      lastActive: new Date()
    }
  ])
  const [currentSessionId, setCurrentSessionId] = useState('1')
  const [isStreaming, setIsStreaming] = useState(false)
  const [streamingMessageId, setStreamingMessageId] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const abortControllerRef = useRef<AbortController | null>(null)

  // Function to format text with bold highlighting for **text**
  const formatMessageContent = (content: string) => {
    // Split by ** and process alternating segments
    const parts = content.split('**')
    
    return parts.map((part, index) => {
      // Every odd index (1, 3, 5...) should be bold
      if (index % 2 === 1) {
        return (
          <strong 
            key={index} 
            className="font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-1 rounded"
          >
            {part}
          </strong>
        )
      }
      return part
    })
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const createNewChat = async () => {
    const newSession: ChatSession = {
      id: Date.now().toString(),
      title: 'New Chat',
      messages: [],
      lastActive: new Date()
    }
    setChatSessions([newSession, ...chatSessions])
    setCurrentSessionId(newSession.id)
    setMessages([])
  }

  const switchToSession = async (sessionId: string) => {
    const session = chatSessions.find(s => s.id === sessionId)
    if (session) {
      setCurrentSessionId(sessionId)
      setMessages(session.messages)
    }
  }

  const updateSessionTitle = async (sessionId: string, firstMessage: string) => {
    const title = firstMessage.slice(0, 30) + (firstMessage.length > 30 ? '...' : '')
    
    setChatSessions(prev => 
      prev.map(session => 
        session.id === sessionId 
          ? { ...session, title }
          : session
      )
    )
  }

  // Stream response character by character for ultra-smooth experience
  const streamResponseCharByChar = async (fullResponse: string, messageId: string) => {
    let currentContent = ''
    
    for (let i = 0; i < fullResponse.length; i++) {
      currentContent += fullResponse[i]
      
      setMessages(prev =>
        prev.map(msg =>
          msg.id === messageId
            ? { ...msg, content: currentContent }
            : msg
        )
      )

      // Variable delay based on character type for natural feel
      let delay = 25 // Base delay in milliseconds
      
      const char = fullResponse[i]
      
      // Adjust timing based on character type
      if (char === ' ') {
        delay = 45 // Pause between words
      } else if (char === '.' || char === '!' || char === '?') {
        delay = 300 // Long pause at sentence endings
      } else if (char === ',' || char === ';' || char === ':') {
        delay = 150 // Medium pause for punctuation
      } else if (char === '\n') {
        delay = 200 // Pause for line breaks
      } else if (char.match(/[A-Z]/)) {
        delay = 35 // Slightly slower for capital letters
      } else if (char.match(/[0-9]/)) {
        delay = 40 // Slower for numbers
      }
      
      // Add natural variation
      delay += Math.random() * 15 - 7
      
      // Ensure minimum delay
      delay = Math.max(delay, 15)

      await new Promise(resolve => setTimeout(resolve, delay))
      
      // Check if streaming was cancelled
      if (abortControllerRef.current?.signal.aborted) {
        break
      }
    }
  }

  // Ultra-fast word streaming for rapid responses
  const streamResponseUltraFast = async (fullResponse: string, messageId: string) => {
    const words = fullResponse.split(' ')
    let currentContent = ''
    
    // Set this message as currently streaming
    setStreamingMessageId(messageId)
    
    for (let i = 0; i < words.length; i++) {
      currentContent += words[i] + (i < words.length - 1 ? ' ' : '')
      
      setMessages(prev =>
        prev.map(msg =>
          msg.id === messageId
            ? { ...msg, content: currentContent }
            : msg
        )
      )

      // Ultra-fast streaming - minimal delays
      let delay = 20 // Very fast base delay
      
      const word = words[i]
      
      // Minimal delay variations
      if (word.length > 12) {
        delay = 35
      } else if (word.length < 2) {
        delay = 15
      }
      
      // Very short pauses for punctuation
      if (word.endsWith('.') || word.endsWith('!') || word.endsWith('?')) {
        delay += 40 // Short pause at sentence endings
      } else if (word.endsWith(',')) {
        delay += 20 // Brief pause for commas
      }

      await new Promise(resolve => setTimeout(resolve, delay))
      
      if (abortControllerRef.current?.signal.aborted) {
        break
      }
    }
    
    // Clear streaming state when done
    setStreamingMessageId(null)
  }

  // Fast word-by-word streaming with faster speeds
  const streamResponseWordByWord = async (fullResponse: string, messageId: string) => {
    const words = fullResponse.split(' ')
    let currentContent = ''
    
    // Set this message as currently streaming
    setStreamingMessageId(messageId)
    
    for (let i = 0; i < words.length; i++) {
      currentContent += words[i] + (i < words.length - 1 ? ' ' : '')
      
      setMessages(prev =>
        prev.map(msg =>
          msg.id === messageId
            ? { ...msg, content: currentContent }
            : msg
        )
      )

      // Faster streaming - reduced delays
      let delay = 40 // Base delay reduced from 80ms to 40ms
      
      const word = words[i]
      
      // Adjust delay based on word characteristics
      if (word.length > 10) {
        delay = 60 // Reduced from 120ms
      } else if (word.length > 6) {
        delay = 50 // Reduced from default
      } else if (word.length < 3) {
        delay = 30 // Reduced from 60ms
      }
      
      // Reduced pauses for punctuation
      if (word.endsWith('.') || word.endsWith('!') || word.endsWith('?')) {
        delay += 80 // Reduced from 200ms
      } else if (word.endsWith(',') || word.endsWith(';') || word.endsWith(':')) {
        delay += 40 // Reduced from 100ms
      }
      
      // Reduced randomness
      delay += Math.random() * 20 - 10

      await new Promise(resolve => setTimeout(resolve, delay))
      
      // Check if streaming was cancelled
      if (abortControllerRef.current?.signal.aborted) {
        break
      }
    }
    
    // Clear streaming state when done
    setStreamingMessageId(null)
  }

  // Enhanced streaming with typing indicator
  const streamResponseWithTypingIndicator = async (fullResponse: string, messageId: string) => {
    // Show typing indicator first
    setMessages(prev =>
      prev.map(msg =>
        msg.id === messageId
          ? { ...msg, content: '●●●' }
          : msg
      )
    )
    
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // Clear typing indicator and start streaming
    setMessages(prev =>
      prev.map(msg =>
        msg.id === messageId
          ? { ...msg, content: '' }
          : msg
      )
    )
    
    // Stream word by word with improved timing
    const sentences = fullResponse.split(/([.!?]+\s*)/g).filter(Boolean)
    let currentContent = ''
    
    for (const sentence of sentences) {
      if (sentence.match(/[.!?]+\s*/)) {
        // This is punctuation, add it immediately
        currentContent += sentence
        setMessages(prev =>
          prev.map(msg =>
            msg.id === messageId
              ? { ...msg, content: currentContent }
              : msg
          )
        )
        await new Promise(resolve => setTimeout(resolve, 400))
      } else {
        // This is a sentence, stream it word by word
        const words = sentence.split(' ')
        for (let i = 0; i < words.length; i++) {
          currentContent += words[i] + (i < words.length - 1 ? ' ' : '')
          
          setMessages(prev =>
            prev.map(msg =>
              msg.id === messageId
                ? { ...msg, content: currentContent }
                : msg
            )
          )
          
          // Dynamic delay based on word complexity
          const word = words[i]
          let delay = 60
          
          if (word.length > 10) delay = 120
          else if (word.length > 6) delay = 90
          else if (word.length < 3) delay = 40
          
          // Add randomness for natural feel
          delay += Math.random() * 30 - 15
          
          await new Promise(resolve => setTimeout(resolve, Math.max(delay, 25)))
          
          if (abortControllerRef.current?.signal.aborted) break
        }
      }
      
      if (abortControllerRef.current?.signal.aborted) break
    }
  }

  const handleSubmit = async () => {
    if (!inputValue.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue.trim(),
      role: 'user',
      timestamp: new Date()
    }

    const newMessages = [...messages, userMessage]
    setMessages(newMessages)
    setInputValue('')
    setIsLoading(true)
    setIsStreaming(false) // Will be set to true when streaming starts

    // Update session title if it's the first message
    if (messages.length === 0) {
      updateSessionTitle(currentSessionId, userMessage.content)
    }

    try {
      // Create abort controller for this request
      abortControllerRef.current = new AbortController()

      const chatRequest: ChatRequest = {
        message: userMessage.content,
        session_id: currentSessionId
      }

      const response = await fetch(`${API_BASE_URL}/api/v1/global`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(chatRequest),
        signal: abortControllerRef.current.signal
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const chatResponse: ChatResponse = await response.json()

      if (chatResponse.success) {
        // Create assistant message placeholder for streaming
        const assistantMessageId = (Date.now() + 1).toString()
        const assistantMessage: Message = {
          id: assistantMessageId,
          content: '',
          role: 'assistant',
          timestamp: new Date()
        }

        const messagesWithPlaceholder = [...newMessages, assistantMessage]
        setMessages(messagesWithPlaceholder)
        
        // Start streaming
        setIsStreaming(true)
        setIsLoading(false) // Hide initial loading, show streaming instead
        // Choose streaming speed:
        // Option 1: Ultra-fast streaming (20ms base delay)
        await streamResponseUltraFast(chatResponse.message, assistantMessageId)
        
        // Option 2: Fast streaming (40ms base delay) 
        // await streamResponseWordByWord(chatResponse.message, assistantMessageId)
        
        // Option 3: Character-by-character (smoothest but slowest)
        // await streamResponseCharByChar(chatResponse.message, assistantMessageId)

        // Update the session with final message
  // Function to format text with bold highlighting for **text**
  const formatMessageContent = (content: string) => {
    // Split by ** and process alternating segments
    const parts = content.split('**')
    
    return parts.map((part, index) => {
      // Every odd index (1, 3, 5...) should be bold
      if (index % 2 === 1) {
        return (
          <strong 
            key={index} 
            className="font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-1 rounded"
          >
            {part}
          </strong>
        )
      }
      return part
    })
  }

        // Update the session with final message
        const finalMessages = messagesWithPlaceholder.map(msg =>
          msg.id === assistantMessageId
            ? { ...msg, content: chatResponse.message }
            : msg
        )

        setChatSessions(prev =>
          prev.map(session =>
            session.id === currentSessionId
              ? { ...session, messages: finalMessages, lastActive: new Date() }
              : session
          )
        )
      } else {
        throw new Error('Chat request was not successful')
      }

    } catch (error: any) {
      if (error.name === 'AbortError') {
        console.log('Request was aborted')
      } else {
        console.error('Chat request failed:', error)
        
        // Show error message to user
        const errorMessage = 'Sorry, I encountered an error. Please try again.'
        setMessages(prev =>
          prev.map(msg =>
            msg.id === assistantMessageId
              ? { ...msg, content: errorMessage }
              : msg
          )
        )
      }
    } finally {
      setIsLoading(false)
      setIsStreaming(false)
      setStreamingMessageId(null)
      abortControllerRef.current = null
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    }).format(date)
  }

  // Stop streaming function
  const stopStreaming = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }
  }

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
    }
  }, [])

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <div className={`bg-gray-900 text-white transition-all duration-300 ${
        isSidebarOpen ? 'w-80' : 'w-0'
      } overflow-hidden`}>
        <div className="p-4">
          <Button
            onClick={createNewChat}
            className="w-full bg-gray-800 hover:bg-gray-700 text-white border border-gray-600 mb-4"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Chat
          </Button>
          
          <div className="space-y-2 max-h-[calc(100vh-120px)] overflow-y-auto">
            {chatSessions.map((session) => (
              <div
                key={session.id}
                onClick={() => switchToSession(session.id)}
                className={`p-3 rounded-lg cursor-pointer transition-colors ${
                  currentSessionId === session.id
                    ? 'bg-gray-700'
                    : 'bg-gray-800 hover:bg-gray-700'
                }`}
              >
                <div className="flex items-center">
                  <MessageSquare className="w-4 h-4 mr-2 flex-shrink-0" />
                  <span className="text-sm truncate">{session.title}</span>
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  {formatTime(session.lastActive)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex flex-col flex-1">
        {/* Header */}
        <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="mr-2"
              >
                <Menu className="w-5 h-5" />
              </Button>
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                Global Chat
              </h1>
            </div>
            {isStreaming && (
              <Button
                onClick={stopStreaming}
                variant="outline"
                size="sm"
                className="text-red-600 border-red-300 hover:bg-red-50"
              >
                Stop
              </Button>
            )}
          </div>
        </header>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-500 dark:text-gray-400">
              <Bot className="w-12 h-12 mb-4" />
              <h2 className="text-xl font-semibold mb-2">How can I help you today?</h2>
              <p className="text-center">Start a conversation by typing a message below.</p>
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex max-w-[70%] ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    message.role === 'user' 
                      ? 'bg-blue-500 ml-2' 
                      : 'bg-gray-600 mr-2'
                  }`}>
                    {message.role === 'user' ? (
                      <User className="w-4 h-4 text-white" />
                    ) : (
                      <Bot className="w-4 h-4 text-white" />
                    )}
                  </div>
                  <div className={`rounded-2xl px-4 py-2 ${
                    message.role === 'user'
                      ? 'bg-blue-500 text-white'
                      : 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-600'
                  }`}>
                    <div className="flex items-start">
                      <div className="flex-1">
                        <p className="whitespace-pre-wrap">
                          {formatMessageContent(message.content)}
                        </p>
                      </div>
                      {/* Show enhanced loading animation while streaming this specific message */}
                      {streamingMessageId === message.id && (
                        <div className="ml-3 flex items-center">
                          <div className="flex items-center space-x-1 bg-blue-100 dark:bg-blue-900/30 px-2 py-1 rounded-full">
                            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"></div>
                            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
                            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
                            <span className="text-xs text-blue-600 dark:text-blue-400 ml-1">typing...</span>
                          </div>
                        </div>
                      )}
                    </div>
                    {message.content && (
                      <div className={`text-xs mt-1 ${
                        message.role === 'user' ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'
                      }`}>
                        {formatTime(message.timestamp)}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
          {/* Loading indicator when AI is thinking/generating response */}
          {isLoading && (
            <div className="flex justify-start">
              <div className="flex">
                <div className="w-8 h-8 rounded-full bg-gray-600 mr-2 flex items-center justify-center">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div className="bg-white dark:bg-gray-700 rounded-2xl px-4 py-3 border border-gray-200 dark:border-gray-600">
                  <div className="flex items-center space-x-2">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    </div>
                    <span className="text-gray-500 dark:text-gray-400 text-sm">AI is thinking...</span>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="border-t border-gray-200 dark:border-gray-700 p-4 bg-white dark:bg-gray-800">
          <div className="flex space-x-2">
            <div className="flex-1 relative">
              <textarea
                ref={textareaRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your message..."
                disabled={isLoading}
                className="w-full resize-none rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-3 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:opacity-50"
                rows={1}
                style={{
                  minHeight: '52px',
                  maxHeight: '200px',
                }}
                onInput={(e) => {
                  const target = e.target as HTMLTextAreaElement
                  target.style.height = '52px'
                  target.style.height = Math.min(target.scrollHeight, 200) + 'px'
                }}
              />
            </div>
            <Button
              onClick={handleSubmit}
              disabled={!inputValue.trim() || isLoading}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-3 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400 text-center mt-2">
            Press Enter to send, Shift+Enter for new line
          </div>
        </div>
      </div>
    </div>
  )
}