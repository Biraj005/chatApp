import { useContext, useEffect } from 'react';
import ChatContainer from '../../components/ChatContainer/ChatContainer';
import Right from '../../components/Right/Right';
import './Homepage.css';
import { StoreContext } from '../../store/StoreContext';
import { SocketContext } from '../../store/Socket'; // Make sure SocketContext is exported correctly

function Homepage() {
  const { userId } = useContext(StoreContext);
  const socket = useContext(SocketContext); // Directly use socket, not `{ socket }`

  useEffect(() => {
    if (socket && userId) {
      socket.current.emit("join", userId);
    }
  }, [socket, userId]); // ⬅️ Dependencies are IMPORTANT!

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
