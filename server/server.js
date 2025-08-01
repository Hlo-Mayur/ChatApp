const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

const DB_PATH = path.join(__dirname, 'db.json');

// Middleware
app.use(cors());
app.use(express.json());

// Database helper functions
function readDB() {
  try {
    const data = fs.readFileSync(DB_PATH, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading database:', error);
    return { users: [], messages: [] };
  }
}

function writeDB(data) {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error writing to database:', error);
  }
}

// Initialize database on startup
let db = readDB();

// API Routes
app.post('/api/login', (req, res) => {
  const { username } = req.body;
  
  if (!username || username.trim() === '') {
    return res.status(400).json({ error: 'Username is required' });
  }

  const trimmedUsername = username.trim();
  
  // Check if user already exists
  const existingUser = db.users.find(user => user.username === trimmedUsername);
  
  if (!existingUser) {
    // Add new user
    const newUser = {
      id: Date.now().toString(),
      username: trimmedUsername,
      joinedAt: new Date().toISOString()
    };
    
    db.users.push(newUser);
    writeDB(db);
  }
  
  res.json({ 
    success: true, 
    message: 'Login successful', 
    username: trimmedUsername 
  });
});

app.get('/api/messages', (req, res) => {
  db = readDB(); // Refresh data from file
  res.json(db.messages);
});

app.get('/api/users', (req, res) => {
  db = readDB(); // Refresh data from file
  res.json(db.users);
});

// Socket.io connection handling
const connectedUsers = new Map();

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('user_joined', (username) => {
    connectedUsers.set(socket.id, username);
    io.emit('user_list_update', Array.from(connectedUsers.values()));
  });

  socket.on('send_message', (messageData) => {
    const message = {
      id: Date.now().toString(),
      username: messageData.username,
      text: messageData.text,
      timestamp: new Date().toISOString()
    };

    // Add message to database
    db = readDB(); // Refresh data from file
    db.messages.push(message);
    writeDB(db);

    // Broadcast to all connected clients
    io.emit('new_message', message);
  });

  socket.on('disconnect', () => {
    const username = connectedUsers.get(socket.id);
    connectedUsers.delete(socket.id);
    io.emit('user_list_update', Array.from(connectedUsers.values()));
    console.log('User disconnected:', socket.id, username);
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});