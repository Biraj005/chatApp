import './ChatBox.css';
import { useState, useEffect, useRef, useContext } from 'react';
import { useSocket } from '../store/Socket';
import { AuthContext } from '../store/AuthContext';
import { StoreContext } from '../store/StoreContext';

function ChatBox({ user }) {
  const { getMessages, sendMessages } = useContext(AuthContext);
  const { selectedUser } = useContext(StoreContext);
  const socket = useSocket();
  const [message, setMessage] = useState('');
  const [conversation, setConversation] = useState([]);
  const [image, setImage] = useState(null);
  const { userId } = useContext(AuthContext);
  const bottomRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    const init = async () => {
      if (!userId || !user?._id) return;
      setIsLoading(true);
      try {
        const data = await getMessages(userId, user._id);
        if (data?.success && data.messages) {
          setConversation(
            data.messages.map(msg => ({
              text: msg.text,
              image: msg.attachments
                ? { url: msg.attachments, loaded: false }
                : null,
              id: msg.id || msg.sender || msg.from,
              timestamp: new Date(msg.createdAt).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              }),
            }))
          );
        } else {
          setConversation([]);
        }
      } catch {
        setConversation([]);
      } finally {
        setIsLoading(false);
      }
    };
    init();
  }, [user, userId, getMessages]);


  useEffect(() => {
    if (!socket.current) return;
    const handleIncomingMessage = (data) => {
      setConversation(prev => [
        ...prev,
        {
          text: data.text,
          image: data.attachments
            ? { url: data.attachments, loaded: false }
            : null,
          id: data.id || data.sender || data.from,
          timestamp: new Date().toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          }),
        },
      ]);
    };
    socket.current.on('receive-message', handleIncomingMessage);
    return () => {
      if (socket.current) {
        socket.current.off('receive-message', handleIncomingMessage);
      }
    };
  }, [socket]);


  const handleLoadImage = (index) => {
    setConversation(prev => {
      const newConv = [...prev];
      if (newConv[index].image) {
        newConv[index].image.loaded = true;
      }
      return newConv;
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim() && !image) return;

    const timestamp = new Date().toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
    const tempImageURL = image ? URL.createObjectURL(image) : null;

    setConversation(prev => [
      ...prev,
      {
        text: message,
        image: image ? { url: tempImageURL, loaded: false, isLocal: true } : null,
        id: userId,
        timestamp,
      },
    ]);

    const formData = new FormData();
    formData.append("from", userId);
    formData.append("to", user._id);
    formData.append("text", message || "");
    if (image) formData.append("image", image);
    

    if (socket.current) {
      socket.current.emit('send-message', {
        to: user._id,
        from: userId,
        text: message,
        image: null,
      });
    }

    await sendMessages(formData);
    setMessage('');
    setImage(null);
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation]);

  return (
    <div className='chat-box'>
      <div className="top">
        <img src={user.profilePic || "/Chatrix.png"} alt="User" />
        <div className="name">
          <h2>{user.name}</h2>
          <p className={`top-online ${user.isOnline ? "online" : "offline"}`}>
            {user.isOnline ? "online" : "offline"}
          </p>
        </div>
      </div>

      <ul className='message-list'>
        {isLoading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
          </div>
        ) : (
          <>
            {conversation.map((item, index) => (
              <li
                key={index}
                className={`message ${item.id === userId ? 'user' : 'sender'}`}
              >
                <div className="messages">
                  {item.text && <p>{item.text}</p>}

                  {item.image && !item.image.loaded && (
                    <button
                      onClick={() => handleLoadImage(index)}
                      className="load-btn"
                    >
                      Load Image
                    </button>
                  )}

                  {item.image && item.image.loaded && (
                    <div className="image-container">
                      <img
                        src={item.image.url}
                        alt="attachment"
                        className="chat-image"
                      />
                      <a
                        href={item.image.url}
                        download
                        className="download-btn"
                      >
                        Download
                      </a>
                    </div>
                  )}

                  <span className="timestamp">{item.timestamp}</span>
                </div>
              </li>
            ))}
            <div ref={bottomRef} />
          </>
        )}
      </ul>
      {image && (
        <div className="image-preview">
          <img src={URL.createObjectURL(image)} alt="preview" />
          <button onClick={() => setImage(null)}>✕</button>
        </div>
      )}

      <form className='send-message' onSubmit={handleSubmit}>
        <div className="type">
          <input
            className='text'
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder='Send message...'
            onKeyPress={(e) =>
              e.key === 'Enter' && !e.shiftKey && handleSubmit(e)
            }
          />
          <label htmlFor="file-input" className="file-input-label">
            <span className="material-symbols-outlined">perm_media</span>
          </label>
          <input
            id="file-input"
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={handleImageChange}
          />
        </div>
        <div className="send">
          <button type="submit">➤</button>
        </div>
      </form>
    </div>
  );
}

export default ChatBox;
