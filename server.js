const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const app = express();

app.use(express.static('public')) // Serve static files, assuming your HTML is in 'public' folder

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const chatMessages = [];  // In-memory storage; replace with a database in production

wss.on('connection', ws => {
  ws.send(JSON.stringify(chatMessages)); // Send current chat history to the new user

  ws.on('message', message => {
    const chat = JSON.parse(message);
    chatMessages.push(chat);
    chatMessages.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify([chat]));
      }
    });
  });
});

server.listen(8080, () => {
  console.log('Server started on http://localhost:8080');
});