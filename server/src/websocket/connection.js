// server/src/websocket/connection.js
const WebSocket = require('ws');
const { readFileContent, getUpdatedLines,tailFile } = require('./utils');
let clients = new Set();

async function handleConnection(ws) {
  console.log('Client connected');
  clients.add(ws);

  try {
    // const lastLines = (await readFileContent('logs/logCreation.json')).trim().split('\n').slice(-10).join('\n');
    // const lastLines = (await tailFile('logs/logCreation.json')).trim().split('\n').slice(-10).join('\n');
    const lastLines = (await tailFile('logs/logCreation.json'));
    ws.send(lastLines);
  } catch (err) {
    console.error('Error reading file:', err);
    ws.send('Error reading file.');
  }

  ws.on('message', (message) => {
    console.log('Received:', message);
    ws.send(`You said: ${message}`);
  });

  ws.on('close', () => {
    console.log('Client disconnected');
    clients.delete(ws);
  });

  ws.on('error', (error) => {
    console.error('WebSocket error:', error);
  });
}

function getClients() {
  return clients;
}

module.exports = { handleConnection, getClients };
