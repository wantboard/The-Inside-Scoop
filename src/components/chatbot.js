import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const suggestedQuestions = [
  { display: "Best dishes", query: "What are the best dishes at {restaurant}?" },
  { display: "Dishes to avoid", query: "What dishes should I avoid at {restaurant}?" },
  { display: "Dress code", query: "What's the dress code at {restaurant}?" },
  { display: "The inside scoop", query: "What are some tips and secrets about {restaurant}?" },  
];

const restaurants = [
  { value: "Alder", display: "Alder", city: "Toronto" },
  { value: "BarRaval", display: "Bar Raval", city: "Toronto" },
  { value: "Black+Blue", display: "Black + Blue", city: "Toronto"  },
  { value: "CurryishTavern", display: "Curryish Tavern", city: "Toronto"  },
  { value: "Edulis", display: "Edulis", city: "Toronto"  },
  { value: "FamigliaBaldassarre", display: "Famiglia Baldassarre", city: "Toronto"  },
  { value: "FishmanLobsterClubhouseRestaurant", display: "Fishman Lobster Clubhouse Restaurant", city: "Toronto"  },
  { value: "Gusto101", display: "Gusto 101", city: "Toronto"  },
  { value: "MimiChinese", display: "MIMI Chinese", city: "Toronto"  },
  { value: "PrimeSeafoodPalace", display: "Prime Seafood Palace", city: "Toronto"  },
  { value: "Quetzal", display: "Quetzal", city: "Toronto"  },
  { value: "RamenButaNibo", display: "Ramen Buta-Nibo", city: "Toronto"  },
  { value: "Aska", display: "Aska", city: "Brooklyn" },
  { value: "CloverHill", display: "Clover Hill", city: "Brooklyn" },
  { value: "Eyval", display: "Eyval", city: "Brooklyn" },
  { value: "TheFourHoursemen", display: "The Four Horsemen", city: "Brooklyn" },
  { value: "Fluid", display: "Fluid", city: "Brooklyn" },
  { value: "Francie", display: "Francie", city: "Brooklyn" },
  { value: "LaserWolfBrooklyn", display: "Laser Wolf Brooklyn", city: "Brooklyn" },
  { value: "Lilia", display: "Lilia", city: "Brooklyn" },
  { value: "Lingo", display: "Lingo", city: "Brooklyn" },
  { value: "Lucali", display: "Lucali", city: "Brooklyn" },
  { value: "Misi", display: "Misi", city: "Brooklyn" },
  { value: "TheRiverCafe", display: "The River Café", city: "Brooklyn" },
  { value: "Beba", display: "Beba", city: "Montreal" },
  { value: "JoeBeef", display: "Joe Beef", city: "Montreal" },
  { value: "MaPouleMouillee", display: "Ma Poule Mouillée", city: "Montreal" },
  { value: "LeMousso", display: "Le Mousso", city: "Montreal" },  
  { value: "LePasseCompose", display: "Le Passé Composé", city: "Montreal" },
  { value: "Pichai", display: "Pichai", city: "Montreal" },
  { value: "SchwartzsDeli", display: "Schwartz's Deli", city: "Montreal" },
  { value: "VinMonLapin", display: "Vin Mon Lapin", city: "Montreal" },
  // Add more options as necessary
];

// cities list
const cities = [
  { value: "Toronto", display: "Toronto" },
  { value: "Brooklyn", display: "Brooklyn" },
  { value: "Montreal", display: "Montréal" },
];

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [selectedRestaurant, setSelectedRestaurant] = useState(restaurants[0]);
  const [selectedCity, setSelectedCity] = useState(cities[0]);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(scrollToBottom, [messages]);

  // select the first restaurant in the selected city as the default restaurant
  useEffect(() => {
    setSelectedRestaurant(restaurants.find(restaurant => restaurant.city === selectedCity.value));
  }, [selectedCity]);

  const sendMessage = async (query) => {
    if (query.trim() === '') return;

    const newMessages = [...messages, { sender: 'user', text: query }];
    setMessages(newMessages);
    setInput('');

    try {
      const response = await axios.post('/ask', { restaurant: selectedRestaurant.value, transcript: newMessages }, { withCredentials: true });
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
      <label className="label">City</label>
      <select className="select-city" onChange={(e) => setSelectedCity(cities.find(city => city.value === e.target.value))}>
        {cities.map((city, index) => (
          <option key={index} value={city.value}>{city.display}</option>
        ))}
      </select>

      <label className="label">Restaurant</label>
      <select className="select-restaurant" onChange={(e) => setSelectedRestaurant(restaurants.find(restaurant => restaurant.value === e.target.value && restaurant.city === selectedCity.value))}>
        {restaurants.filter(restaurant => restaurant.city === selectedCity.value).map((restaurant, index) => (
          <option key={index} value={restaurant.value}>{restaurant.display}</option>
        ))}
      </select>
      
      <div className="suggested-questions">
        {suggestedQuestions.map((question, index) => (
          <button key={index} className="suggested-question" onClick={() => {
            const modifiedQuery = question.query.replace('{restaurant}', selectedRestaurant.display);
            setInput(modifiedQuery);
            sendMessage(modifiedQuery);
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
          onKeyPress={(e) => e.key === 'Enter' && sendMessage(input)}
          placeholder={`Ask a question about ${selectedRestaurant.display} . . .`}
        />
        <button onClick={() => sendMessage(input)}>
          <i className="material-icons">send</i>
        </button>
      </div>
    </div>
  );
};

export default Chatbot;