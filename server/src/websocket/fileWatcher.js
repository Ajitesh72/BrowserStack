// server/src/websocket/fileWatcher.js
const fs = require('fs');
const path = require('path');
const { readFileContent, getUpdatedLines, broadcast } = require('./utils');
const { getClients } = require('./connection');

const filename = path.join(__dirname, '../logs/logCreation.json');
let previousContent = '';

function startFileWatcher() {
  if (!fs.existsSync(filename)) {
    console.error(`File does not exist: ${filename}`);
    return;
  }

  fs.watch(filename, async (eventType) => {
    if (eventType === 'change') {
      console.log('File changed, checking for updates');
      try {
        const newContent = await readFileContent(filename);

        if (previousContent !== newContent) {
          const updatedLines = getUpdatedLines(previousContent, newContent);
          previousContent = newContent;
          if (updatedLines.length > 0) {
            broadcast(updatedLines.join('\n'));
          }
        }
      } catch (err) {
        console.error('Error reading file:', err);
        broadcast('Error reading file.');
      }
    }
  });

  readFileContent(filename)
    .then(content => {
      previousContent = content;
    })
    .catch(err => {
      console.error('Error initializing file content:', err);
    });
}

module.exports = { startFileWatcher };
