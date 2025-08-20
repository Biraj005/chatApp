// src/pages/Homepage.jsx
import { useSocket } from '../../store/Socket';
import ChatContainer from '../../components/ChatContainer/ChatContainer';
import Right from '../../components/Right/Right';
import './Homepage.css';
import { useContext, useEffect } from 'react';
import { AuthContext } from '../../store/AuthContext';
import { io } from 'socket.io-client';

function Homepage() {
  const socket = useSocket(); 
  const { userId } = useContext(AuthContext);

  useEffect(() => {
    if (userId && !socket.current) {
      socket.current = io(import.meta.env.VITE_BACKEND_UR);

      socket.current.on("connect", () => {
  
        socket.current.emit("join", userId);
      });
    }

    return () => {
      if (socket.current) {
        socket.current.disconnect();
        socket.current = null;
      }
    };
  }, [userId]);

  return (
    <div className='home-page'>
      <div className="home-container">
        <div className="home-container-left">
          <ChatContainer />
        </div>
        <div className="home-container-right">
          <Right />
        </div>
      </div>
    </div>
  );
}

export default Homepage;
