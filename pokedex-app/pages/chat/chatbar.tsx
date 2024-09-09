import React, { useState, useEffect, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { types } from 'util';

const Chatbar: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [sessionId, setSessionId] = useState(() => localStorage.getItem('sessionId') || uuidv4());
  const [searchQuery, setSearchQuery] = useState('');
  const inputElement = document.getElementById("input") as HTMLInputElement | null;

  useEffect(() => {
    localStorage.setItem('sessionId', sessionId);
  }, [sessionId]);

  const messageContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const messageContainer = messageContainerRef.current;
    if (messageContainer) {
      const windowHeight = window.innerHeight;
      const containerHeight = messageContainer.scrollHeight;
      if (containerHeight > windowHeight) {
        messageContainer.style.maxHeight = `${windowHeight - 20}px`;
      }
    }
  }, [messages]);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    if (inputElement) {
      inputElement.value = ""; 
    }

    const userMessage: Message = { role: 'user', content: searchQuery };
    setMessages(prevMessages => [...prevMessages, userMessage]);

    try {
      const response = await fetch('./api/chat/chain', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: searchQuery }),
      });

      if (!response.ok) {
        console.log('No search');
        throw new Error(`Server responded with ${response.status}: ${await response.text()}`);
      }

      const responseData = await response.json();
      const chainResponseText = responseData.message || responseData;

      const systemMessage: Message = chainResponseText
        ? { role: 'system', content: chainResponseText }
        : { role: 'system', content: 'No response from system' };

      setMessages(prevMessages => [...prevMessages, systemMessage]);
      setSearchQuery('');

    } catch (error) {
      console.error('Error during search:', error);
    }
  };

  return (
    <div className="chat-container">
      <div className="message-area" ref={messageContainerRef}>
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.role}`}>
            <div className="message-content">{msg.content}</div>
          </div>
        ))}
      </div>
      <div className="input-area pointer-events-auto">
        <input
          type="text"
          id="input"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          placeholder="Search for Pokemon informations..."
        />
        <button onClick={handleSearch}>send</button>
      </div>
    </div>
  );
};

export default Chatbar;