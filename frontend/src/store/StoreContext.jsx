import { createContext, useEffect, useState } from "react";



export const StoreContext = createContext(null);
export const StoreContextProvider = (props) => {
  const [users,setUsers] = useState([]);

  const [selectedUser, setSelectedUser] = useState('none');
  const contextValue = {
    users,
    setSelectedUser,
    selectedUser,
    setUsers,
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
};
