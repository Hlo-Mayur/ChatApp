import React, { useState, useEffect, useRef } from 'react';
import { Send } from 'lucide-react';
import axios from 'axios';
import io from 'socket.io-client';
import './ChatWindow.css';

const ChatWindow = ({ currentUser, setOnlineUsers }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [socket, setSocket] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    // Initialize socket connection
    const socketConnection = io('http://localhost:3001');
    setSocket(socketConnection);

    // Join the chat
    socketConnection.emit('user_joined', currentUser);

    // Listen for new messages
    socketConnection.on('new_message', (message) => {
      setMessages(prev => [...prev, message]);
    });

    // Listen for user list updates
    socketConnection.on('user_list_update', (users) => {
      setOnlineUsers(users);
    });

    // Load existing messages
    const loadMessages = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/messages');
        setMessages(response.data);
      } catch (error) {
        console.error('Error loading messages:', error);
      }
    };

    loadMessages();

    return () => {
      socketConnection.disconnect();
    };
  }, [currentUser, setOnlineUsers]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    
    if (!newMessage.trim() || !socket) return;

    const messageData = {
      username: currentUser,
      text: newMessage.trim(),
    };

    socket.emit('send_message', messageData);
    setNewMessage('');
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      });
    }
  };

  const groupMessagesByDate = (messages) => {
    const groups = {};
    messages.forEach(message => {
      const date = formatDate(message.timestamp);
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(message);
    });
    return groups;
  };

  const messageGroups = groupMessagesByDate(messages);

  return (
    <div className="chat-window">
      <div className="chat-header">
        <h2>General Chat</h2>
        <span className="message-count">{messages.length} messages</span>
      </div>

      <div className="messages-container">
        {Object.entries(messageGroups).map(([date, dateMessages]) => (
          <div key={date}>
            <div className="date-separator">
              <span>{date}</span>
            </div>
            {dateMessages.map((message) => (
              <div
                key={message.id}
                className={`message ${message.username === currentUser ? 'own-message' : 'other-message'}`}
              >
                <div className="message-content">
                  {message.username !== currentUser && (
                    <div className="message-header">
                      <div className="message-avatar">
                        {message.username.charAt(0).toUpperCase()}
                      </div>
                      <span className="message-username">{message.username}</span>
                      <span className="message-time">{formatTime(message.timestamp)}</span>
                    </div>
                  )}
                  <div className="message-text">{message.text}</div>
                  {message.username === currentUser && (
                    <div className="message-time own-time">{formatTime(message.timestamp)}</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSendMessage} className="message-input-form">
        <div className="input-container">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="message-input"
          />
          <button type="submit" className="send-button" disabled={!newMessage.trim()}>
            <Send size={20} />
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatWindow;