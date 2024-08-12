import { useState, useEffect, useRef } from 'react';
import './App.css';

function App() {
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]); 
  const socketRef = useRef(null);

  async function startConversation() {
    console.log("Initiating WebSocket connection...");
    
    const ws = new WebSocket('ws://localhost:8080');
    
    setSocket(ws);
    socketRef.current = ws;
    
    // Event listeners for the WebSocket
    ws.onopen = () => {
      console.log('WebSocket connection opened');
    };

    ws.onmessage = (event) => {
      console.log('Message from server:', event.data);

      const receivedLines = event.data.split('\n').filter(line => line.trim() !== '');
      setMessages(prevMessages => {
        const updatedMessages = [...prevMessages, ...receivedLines];
        return updatedMessages.slice(-10); 
      });
    };

    ws.onclose = () => {
      console.log('WebSocket connection closed');
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
  }

  useEffect(() => {
    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, []);

  return (
  <>
    <div className='mainDiv'>
      <div className='startSocket' onClick={startConversation}>
        Initiate Socket?
      </div>
      <br/>
      <div className='messageContainer'>
        {messages.map((message, index) => (
          <div key={index} className='message'>
            {message}
          </div>
        ))}
      </div>
    </div>
  </>
    
  );
}

export default App;
