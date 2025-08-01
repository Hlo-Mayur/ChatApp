import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import Sidebar from './components/Sidebar';
import ChatWindow from './components/ChatWindow';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);

  useEffect(() => {
    // Check if user is already logged in (localStorage)
    const savedUser = localStorage.getItem('chatUser');
    if (savedUser) {
      setUser(savedUser);
    }
  }, []);

  const handleLogin = (username) => {
    setUser(username);
    localStorage.setItem('chatUser', username);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('chatUser');
    setOnlineUsers([]);
  };

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="app">
      <Sidebar 
        currentUser={user} 
        onlineUsers={onlineUsers}
        setOnlineUsers={setOnlineUsers}
        onLogout={handleLogout}
      />
      <ChatWindow 
        currentUser={user} 
        onlineUsers={onlineUsers}
        setOnlineUsers={setOnlineUsers}
      />
    </div>
  );
}

export default App;