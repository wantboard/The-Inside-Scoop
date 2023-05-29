import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const suggestedQuestions = [
  { display: "Most popular dishes", query: "What are the most popular dishes?" },
  { display: "Where to sit", query: "Where's the best table?" },
  { display: "Dishes to avoid", query: "What dishes should I avoid?" },
  { display: "Dress code", query: "What's the dress code?" },
];

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [selectedRestaurant, setSelectedRestaurant] = useState('Alder');

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(scrollToBottom, [messages]);

  const sendMessage = async () => {
    if (input.trim() === '') return;

    const newMessages = [...messages, { sender: 'user', text: input }];
    setMessages(newMessages);
    setInput('');

    try {
      const response = await axios.post('/ask', { restaurant: selectedRestaurant, transcript: newMessages }, { withCredentials: true });
      const botMessage = response.data;
      setMessages((prevMessages) => [...prevMessages, { sender: 'bot', text: botMessage }]);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <div className="chatbot">
      <label className="label">Select a restaurant</label>
      <select className="select-restaurant" onChange={(e) => setSelectedRestaurant(e.target.value)}>
        <option value="Alder">Alder</option>
        <option value="Gusto101">Gusto 101</option>
        {/* Add more options as necessary */}
      </select>
      
      <div className="suggested-questions">
        {suggestedQuestions.map((question, index) => (
          <button key={index} className="suggested-question" onClick={() => {
            setInput(question.query);
            sendMessage();
          }}>
            {question.display}
          </button>
        ))}
      </div>
      <div className="messages">
        {messages.map((message, index) => (
          <div key={index} className={`message ${message.sender}`}>
            {message.text}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="input-area">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="Type a message..."
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default Chatbot;
