import React, { useEffect } from 'react';
import { Users, LogOut } from 'lucide-react';
import './Sidebar.css';

const Sidebar = ({ currentUser, onlineUsers, setOnlineUsers, onLogout }) => {
  
  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <div className="app-title">
          <Users size={24} />
          <h2>ChatApp</h2>
        </div>
        <div className="current-user">
          <div className="user-avatar">
            {currentUser.charAt(0).toUpperCase()}
          </div>
          <span className="username">{currentUser}</span>
        </div>
      </div>

      <div className="online-users">
        <h3>Online Users ({onlineUsers.length})</h3>
        <div className="users-list">
          {onlineUsers.map((user, index) => (
            <div key={index} className="user-item">
              <div className="user-avatar small">
                {user.charAt(0).toUpperCase()}
              </div>
              <span className="user-name">{user}</span>
              <div className="online-indicator"></div>
            </div>
          ))}
        </div>
      </div>

      <div className="sidebar-footer">
        <button className="logout-button" onClick={onLogout}>
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;