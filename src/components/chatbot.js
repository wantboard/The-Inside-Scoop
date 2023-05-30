import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const suggestedQuestions = [
  { display: "Best dishes", query: "What are the best dishes at {restaurant}?" },
  { display: "Dishes to avoid", query: "What dishes should I avoid at {restaurant}?" },
  { display: "Where to sit", query: "Where's the best table at {restaurant}?" },
  { display: "Dress code", query: "What's the dress code at {restaurant}?" },
  { display: "Tips", query: "What are some tips and secrets about {restaurant}?" },  
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
      <div className="header">
        <h1>The Inside Scoop</h1>
      </div>
      <label className="label">Select a Restaurant</label>
      <select className="select-restaurant" onChange={(e) => setSelectedRestaurant(e.target.value)}>
        <option value="Alder">Alder</option>
        <option value="BarRaval">Bar Raval</option>
        <option value="Black+Blue">Black + Blue</option>
        <option value="CurryishTavern">Curryish Tavern</option>
        <option value="Edulis">Edulis</option>
        <option value="FamigliaBaldassarre">Famiglia Baldassarre</option>
        <option value="FishmanLobsterClubhouseRestaurant">Fishman Lobster Clubhouse Restaurant</option>
        <option value="MimiChinese">MIMI Chinese</option>
        <option value="PrimeSeafoodPalace">Prime Seafood Palace</option>
        <option value="Quetzal">Quetzal</option>
        <option value="RamenButaNibo">Ramen Buta-Nibo</option>
        {/* Add more options as necessary */}
      </select>
      
      <div className="suggested-questions">
        {suggestedQuestions.map((question, index) => (
          <button key={index} className="suggested-question" onClick={() => {
            const modifiedQuery = question.query.replace('{restaurant}', selectedRestaurant);
            setInput(modifiedQuery);
            sendMessage();
          }}>
            {question.display}
          </button>
        ))}
      </div>
      
      <div className="messages">
        {messages.map((message, index) => (
          <div key={index} className={`message-container ${message.sender}`}>
            <div className={`message ${message.sender}`}>
              {message.text}
            </div>
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
          placeholder={`Ask a question about ${selectedRestaurant} . . .`}
        />
        <button onClick={sendMessage}>
  <i className="material-icons">send</i>
</button>
      </div>
    </div>
  );
};

export default Chatbot;
