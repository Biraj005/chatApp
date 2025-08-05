import { createContext, useEffect, useState } from "react";
import toast from 'react-hot-toast';
import axios from 'axios';
import io from 'socket.io-client';

export const StoreContext = createContext(null);

const backend_url = import.meta.env.VITE_BACKEND_URL;
axios.defaults.baseURL = backend_url;

export const StoreContextProvider = (props) => {
 const users = [
  {
    name: 'Biraj',
    userId: 1,
    about: 'Full-stack developer from Coochbehar',
    img: '/Chatrix.png',
  },
  {
    name: 'Rohan',
    userId: 2,
    about: 'Passionate about machine learning and chess',
    img: '/Chatrix.png',
  },
  {
    name: 'Disha',
    userId: 3,
    about: 'Frontend designer who loves React and Figma',
    img: '/Chatrix.png',
  },
  {
    name: 'Purni',
    userId: 4,
    about: 'Backend enthusiast and API architect',
    img: '/Chatrix.png',
  },
  {
    name: 'Rana',
    userId: 5,
    about: 'Mobile app developer focused on Flutter',
    img: '/Chatrix.png',
  },
  {
    name: 'Raistar',
    userId: 6,
    about: 'Competitive coder and game strategist',
    img: '/Chatrix.png',
  },
  {
    name: 'Dishaa',
    userId: 7,
    about: 'Tech blogger and cloud computing learner',
    img: '/Chatrix.png',
  },
  {
    name: 'Disha',
    userId: 8,
    about: 'Cybersecurity student and ethical hacker',
    img: '/Chatrix.png',
  },
  {
    name: 'Disha',
    userId: 9,
    about: 'AI research assistant working on NLP',
    img: '/Chatrix.png',
  },
  {
    name: 'Disha',
    userId: 10,
    about: 'Loves building UI animations with Framer Motion',
    img: '/Chatrix.png',
  },
];


  const [selectedUser, setSelectedUser] = useState('none');



  // Provide values
  const contextValue = {
    users,
    setSelectedUser,
    selectedUser,
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
};
