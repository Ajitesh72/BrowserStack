// server/src/websocket/utils.js
const WebSocket = require('ws');

function readFileContent(filename) {
  console.log("Reading file:", filename);
  return new Promise((resolve, reject) => {
    fs.readFile(filename, 'utf8', (err, data) => {
      if (err) {
        return reject(err);
      }
      resolve(data);
    });
  });
}

function getUpdatedLines(oldContent, newContent) {
  const oldLines = oldContent.trim().split('\n');
  const newLines = newContent.trim().split('\n');
  return newLines.filter(line => !oldLines.includes(line));
}

function broadcast(message) {
  const { getClients } = require('./connection');
  const clients = getClients();

  console.log(`Broadcasting to ${clients.size} clients`);
  if (clients && clients.size > 0) {
    clients.forEach(ws => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(message);
      }
    });
  } else {
    console.error('No clients to broadcast to.');
  }
}


//new try
// server/src/websocket/utils.js
const fs = require('fs');
const path = require('path');

async function tailFile(filePath, lines = 10) {
    const file = fs.createReadStream(filePath, { flags: 'r', encoding: 'utf8' });
    let buffer = ''; // Use a string for easier manipulation
    const output = [];
  
    return new Promise((resolve, reject) => {
      file.on('data', (chunk) => {
        buffer += chunk; // Add new chunk to buffer
        let lastIndex = buffer.lastIndexOf('\n');
  
        // Process lines in the buffer
        while (lastIndex !== -1) {
          const line = buffer.slice(0, lastIndex); // Extract the line
          buffer = buffer.slice(lastIndex + 1); // Update buffer to remove processed line
          output.unshift(line); // Add line to the beginning of the output array
  
          if (output.length > lines) {
            output.pop(); // Remove the oldest line from the end
          }
  
          // Find the next newline
          lastIndex = buffer.lastIndexOf('\n');
        }
      });
  
      file.on('end', () => {
        if (buffer.length > 0) {
          output.unshift(buffer);
          if (output.length > lines) {
            output.splice(lines); 
          }
        }
        resolve(output.join('\n')); // Join lines and resolve
      });
  
      file.on('error', reject);
    });
  }


module.exports = { readFileContent, getUpdatedLines, broadcast,tailFile };
