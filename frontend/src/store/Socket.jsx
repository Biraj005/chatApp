import { createContext, useContext, useRef } from "react";

export const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const socket = useRef(null);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
