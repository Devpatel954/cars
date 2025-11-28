import React, { useState, useRef, useEffect } from 'react'
import { assets } from '../assets/assets'

const AIChatbot = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hi! I'm your AI car rental assistant. I can help you find the perfect car. What are you looking for?",
      sender: 'ai',
      timestamp: new Date()
    }
  ])
  const [inputValue, setInputValue] = useState('')
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef(null)
  const userId = localStorage.getItem('token') || 'anonymous'

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async (e) => {
    e.preventDefault()
    
    if (!inputValue.trim()) return

    // Add user message
    const userMessage = {
      id: messages.length + 1,
      text: inputValue,
      sender: 'user',
      timestamp: new Date()
    }
    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setLoading(true)

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3020'
      const response = await fetch(`${apiUrl}/api/ai/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: inputValue,
          userId
        })
      })

      const data = await response.json()
      
      if (data.success) {
        const aiMessage = {
          id: messages.length + 2,
          text: data.message,
          sender: 'ai',
          timestamp: new Date()
        }
        setMessages(prev => [...prev, aiMessage])
      } else {
        const errorMessage = {
          id: messages.length + 2,
          text: 'Sorry, I encountered an error. Please try again.',
          sender: 'ai',
          timestamp: new Date()
        }
        setMessages(prev => [...prev, errorMessage])
      }
    } catch (error) {
      console.error('Chat error:', error)
      const errorMessage = {
        id: messages.length + 2,
        text: 'Connection error. Please check your internet and try again.',
        sender: 'ai',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {/* Chat Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className='fixed bottom-6 right-6 bg-primary hover:bg-primary-dull text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg transition-all duration-300 z-40'
        title='AI Assistant'
      >
        <span className='text-2xl'>💬</span>
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className='fixed bottom-24 right-6 w-96 h-96 bg-white rounded-lg shadow-2xl border border-gray-200 flex flex-col z-40'>
          {/* Header */}
          <div className='bg-primary text-white p-4 rounded-t-lg flex justify-between items-center'>
            <h3 className='font-semibold'>Car Rental AI Assistant</h3>
            <button
              onClick={() => setIsOpen(false)}
              className='text-white hover:bg-primary-dull rounded-full w-6 h-6 flex items-center justify-center'
            >
              ✕
            </button>
          </div>

          {/* Messages */}
          <div className='flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50'>
            {messages.map(msg => (
              <div
                key={msg.id}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs px-4 py-2 rounded-lg ${
                    msg.sender === 'user'
                      ? 'bg-primary text-white rounded-br-none'
                      : 'bg-gray-200 text-gray-800 rounded-bl-none'
                  }`}
                >
                  <p className='text-sm'>{msg.text}</p>
                  <span className='text-xs opacity-70 mt-1 block'>
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            ))}
            {loading && (
              <div className='flex justify-start'>
                <div className='bg-gray-200 text-gray-800 px-4 py-2 rounded-lg rounded-bl-none'>
                  <p className='text-sm'>AI is thinking...</p>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSendMessage} className='border-t p-3 flex gap-2'>
            <input
              type='text'
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder='Ask me anything...'
              className='flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-primary'
              disabled={loading}
            />
            <button
              type='submit'
              disabled={loading || !inputValue.trim()}
              className='bg-primary hover:bg-primary-dull text-white rounded-lg px-4 py-2 text-sm disabled:opacity-50'
            >
              Send
            </button>
          </form>
        </div>
      )}
    </>
  )
}

export default AIChatbot
