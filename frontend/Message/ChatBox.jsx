import './ChatBox.css'
import { useState, useEffect, useRef } from 'react';

function ChatBox({ user }) {
  const [message, setMessage] = useState('');

  const conversation = [
    { id: 2, text: "Hey! Are you free this weekend?", timestamp: "8:15 PM" },
    { id: 1, text: "Yeah, mostly! What's up?", timestamp: "8:16 PM" },
    { id: 2, text: "There's a new sci-fi movie out, 'Galaxy Runners'. Want to catch it?", timestamp: "8:16 PM" },
    { id: 1, text: "Oh, I've heard about that one! Sounds awesome. When were you thinking?", timestamp: "8:17 PM" },
    { id: 2, text: "How about Saturday evening? Maybe the 7 PM show at the downtown theater?", timestamp: "8:18 PM" },
    { id: 1, text: "Perfect! Should I book the tickets online now?", timestamp: "8:19 PM" },
    { id: 2, text: "That would be great! Let me know which seats you get. I'll send you the money for my ticket.", timestamp: "8:19 PM" },
    { id: 1, text: "No worries, you can get the popcorn. 😉 Just booked them. We're in row G, seats 12 and 13.", timestamp: "8:21 PM" },
    { id: 2, text: "Awesome! It's a plan. See you at the theater then.", timestamp: "8:22 PM" },
    { id: 1, text: "See you!", timestamp: "8:22 PM" }
  ];

  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation]);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Sending message:', message);
    setMessage('');
  };

  return (
    <div className='chat-box'>
      <div className="top">
        <img src="/Chatrix.png" alt="User" />
       <div className="name">
         <h2>{user.name}</h2>
          <p className='top-online'>online</p>
       </div>
      </div>

     <ul className='message-list'>
  {conversation.map((item, index) => (
    <li
      key={index}
      className={`message ${item.id === 1 ? 'user' : 'sender'}`}
    >
      <div className="messages">
        <p>{item.text}</p>
        <span className="timestamp">{item.timestamp}</span>
      </div>
    </li>
  ))}
  <div ref={bottomRef} />
</ul>


      <form className='send-message' onSubmit={handleSubmit}>
        <div className="type">
          <input
            className='text'
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder='send message'
          />
          <label htmlFor="file-input" className="file-input-label">
            <span className="material-symbols-outlined">perm_media</span>
          </label>

          <input
            id="file-input"
            className='media'
            type="file"
            style={{ display: 'none' }}
          />
        </div>
        <div className="send">
          <button type="submit">Send</button>
        </div>
      </form>
    </div>
  );
}

export default ChatBox;
