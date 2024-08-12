const http = require('http');
const WebSocket = require('ws');
const { handleConnection } = require('./websocket/connection');
const { startFileWatcher } = require('./websocket/fileWatcher');

const server = http.createServer();
const wss = new WebSocket.Server({ server });

wss.on('connection', handleConnection);

startFileWatcher();

server.listen(8080, () => {
  console.log('WebSocket server is listening on port 8080');
});
