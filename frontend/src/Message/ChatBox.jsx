import './ChatBox.css';
import { useState, useEffect, useRef, useContext } from 'react';
import { useSocket } from '../store/Socket';
import { AuthContext } from '../store/AuthContext';

function ChatBox({ user }) {

  const { getMessages, sendMessages } = useContext(AuthContext);
  const socket = useSocket();
  const [message, setMessage] = useState('');
  const [conversation, setConversation] = useState([]);
  const [image, setImage] = useState(null);
  const { userId } = useContext(AuthContext);
  const bottomRef = useRef(null);

  useEffect(() => {
    const init = async () => {
      if (!userId || !user?._id) return;

      const data = await getMessages(userId, user._id);
      if (data?.success && data.messages) {
        setConversation(
          data.messages.map(msg => ({
            text: msg.text,
            image: msg.image || null, // assuming backend sends image url if any
            id: msg.from,
            timestamp: new Date(msg.createdAt).toLocaleTimeString()
          }))
        );
      } else {
        setConversation([]);
      }
    };

    init();
  }, [user, userId, getMessages]);

  useEffect(() => {
    if (!socket.current) return;

    const handleIncomingMessage = (data) => {
      setConversation(prev => [...prev, {
        text: data.text,
        image: data.image || null,
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Don't send if both message and image are empty
    if (!message.trim() && !image) return;

    const formData = new FormData();
    formData.append("from", userId);
    formData.append("to", user._id);
    formData.append("text", message || "");
    if (image) formData.append("image", image);

    const timestamp = new Date().toLocaleTimeString();
    const payload = {
      to: user._id,
      from: userId,
      text: message,
      image: image ? URL.createObjectURL(image) : null,
      timestamp
    };

    setConversation(prev => [...prev, {
      text: message,
      image: image ? URL.createObjectURL(image) : null,
      id: userId,
      timestamp
    }]);

    if (socket.current) {
      socket.current.emit('send-message', payload);
    }

    await sendMessages(formData);

    setMessage('');
    setImage(null);
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
              {item.text && <p>{item.text}</p>}
              {item.image && <img src={item.image} alt="attachment" className="chat-image" />}
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
            onChange={(e) => setImage(e.target.files[0])}
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
