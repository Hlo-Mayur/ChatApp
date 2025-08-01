import React, { useState } from 'react';
import axios from 'axios'; // Import axios to make API requests
import './App.css';

import Login from './components/Login';

// Placeholders for components you will build later
const Sidebar = () => <div className="sidebar"><h3>Users</h3></div>;
const ChatWindow = () => <div className="chat-window"><h3>Chat</h3></div>;

function App() {
  const [user, setUser] = useState(null);

  // The handleLogin function is now an "async" function
  const handleLogin = async (username) => {
    try {
      // Make a POST request to your backend's login endpoint
      // Ensure your server is running on port 3001
      const response = await axios.post('http://localhost:3001/api/login', {
        username: username,
      });

      // If the login is successful, update the user state
      if (response.data.success) {
        setUser(username);
        console.log(`User logged in: ${username}`);
      }
    } catch (error) {
      console.error('Login failed:', error);
      // You could add logic here to show an error message to the user
    }
  };

  return (
    <div className="App">
      {!user ? (
        <Login onLogin={handleLogin} />
      ) : (
        <div className="chat-container">
          <Sidebar />
          <ChatWindow />
        </div>
      )}
    </div>
  );
}

export default App;