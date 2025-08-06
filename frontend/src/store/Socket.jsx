import { createContext, useContext, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

export const SocketContext = createContext(null);

export const SocketProvider = ({ children, user }) => {
  const socket = useRef(null);

  useEffect(() => {
    if (user) {
      socket.current = io("http://localhost:5000", {
        withCredentials: true,
      });

      socket.current.emit("join", user._id);

      socket.current.on("connect", () => {
        console.log("Connected:", socket.current.id);
      });

      return () => {
        socket.current.disconnect();
        console.log("Socket disconnected");
      };
    }
  }, [user]);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};


