import { createContext, useEffect, useState } from "react";



export const StoreContext = createContext(null);
export const StoreContextProvider = (props) => {
  const [users,setUsers] = useState([]);
  const [usermedia,setUserMedia] = useState([]);
  const [selectedUser, setSelectedUser] = useState('none');
  const contextValue = {
    users,
    setSelectedUser,
    selectedUser,
    setUsers,
    usermedia,
    setUserMedia
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
};
