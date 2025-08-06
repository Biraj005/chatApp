import './ChatBox.css';
import { io } from "socket.io-client";
import { useState, useEffect, useRef, useContext } from 'react';
import { AuthContext } from '../src/store/AuthContext';
import { SocketContext } from '../src/store/Socket';


function ChatBox({ user }) {

  const socket = useContext(SocketContext); 
  
  const [message, setMessage] = useState('');
  const [conversation, setConversation] = useState([]);

  const {userId} = useContext(AuthContext);
  const bottomRef = useRef(null);

 

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation]);

  const handleSubmit = (e) => {
        e.preventDefault();
        if (!message.trim()) return;

        const msg = {
        from: userId,
        to: user._id,  
        text: message,
        timestamp: new Date().toLocaleTimeString(),
      };

  console.log(socket)
  // socket.current.emit("private-message", msg);

  setConversation((prev) => [...prev, msg]);
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
            className={`message ${item.from === userId ? 'sender' : 'user'}`}
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
            placeholder='Send message'
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
