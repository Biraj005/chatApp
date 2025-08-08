import './ChatBox.css';
import { useState, useEffect, useRef, useContext } from 'react';
import { useSocket } from '../store/Socket';
import { AuthContext } from '../store/AuthContext';

function ChatBox({ user }) {
  const socket = useSocket();
  const [message, setMessage] = useState('');
  const [conversation, setConversation] = useState([]);
  const { userId } = useContext(AuthContext);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation]);

  useEffect(() => {
    if (!socket.current) return;

    const handleIncomingMessage = (data) => {
      console.log('receive-message', data);
      setConversation(prev => [...prev, {
        text: data.text,
        id: data.from,
        timestamp: new Date().toLocaleTimeString()
      }]);
    };

    socket.current.on('receive-message', handleIncomingMessage);

    return () => {
      if (socket.current) {
        socket.current.off('receive-message', handleIncomingMessage);
      }
    };
  }, [socket, user._id]);


  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim() === '') return;

    const payload = {
      to: user._id,
      from: userId,
      text: message,
      timestamp: new Date().toLocaleTimeString()
    };

  
    setConversation(prev => [...prev, {
      text: message,
      id: userId,
      timestamp: payload.timestamp
    }]);

 
    if (socket.current) {
      socket.current.emit('send-message', payload);
    }

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
            className={`message ${item.id === userId ? 'user' : 'sender'}`}
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
            placeholder='Send message...'
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
