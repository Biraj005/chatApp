import { useSocket } from '../../store/Socket';
import ChatContainer from '../../components/ChatContainer/ChatContainer';
import Right from '../../components/Right/Right';
import './Homepage.css';
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../store/AuthContext';
import { io } from 'socket.io-client';
import { StoreContext } from '../../store/StoreContext';

function Homepage() {
  const socket = useSocket(); 
  const { userId } = useContext(AuthContext);
  const {selectedUser} = useContext(StoreContext)
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 890);
  
  useEffect(() => {
    if (userId && !socket.current) {
     socket.current = io(import.meta.env.VITE_BACKEND_URL, {
      withCredentials: true, 
      transports: ["websocket", "polling"], 
    });

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

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 890);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="home-page">
      <div className="home-container">
        {isMobile ? (
          
          selectedUser==='none'? <ChatContainer /> : <Right />
        ) : (
      
          <>
            <div className="home-container-left">
              <ChatContainer />
            </div>
            <div className="home-container-right">
              <Right />
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Homepage;
