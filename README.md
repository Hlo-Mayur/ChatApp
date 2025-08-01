# Real-Time Chat Application

A simple, real-time chat application built from scratch using the MERN stack (without the 'M'). This project features a React frontend, a Node.js/Express backend, and uses Socket.io for live, bi-directional communication.

All application data, including users and messages, is persistently stored in a single db.json file on the server, managed via Node's native fs module.

Core Technologies
Frontend: React

Backend: Node.js, Express

Real-time Communication: Socket.io, Socket.io-client

Data Storage: JSON file (db.json)

Styling: Plain CSS with Flexbox/Grid

Project Structure
/chat-app
|-- /client          (React Frontend)
|-- /server          (Node.js Backend)
`-- .gitignore
