import { useContext, useState } from 'react';
import './ChatContainer.css';
import { StoreContext } from '../../store/StoreContext';
import ListItem from '../ListItem';

// import { ChatContext } from '../../store/Socket';
import { AuthContext } from '../../store/AuthContext';
import { Link, Navigate } from 'react-router-dom';
import { useEffect } from 'react';

function ChatContainer() {
  const {Logout,getUsers} = useContext(AuthContext);
  const { users } = useContext(StoreContext);
  const [query, setQuery] = useState('');
  
 
  const [isMenuVisible, setMenuVisible] = useState(false);

 let filteredUsers = [];

if (users && Array.isArray(users)) {
  filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(query.toLowerCase())
  );
}

  useEffect(()=>{

     getUsers();

  },[])

  return (
    <div className='chat-container'>
      <div className="chat-top">
        <h2>Chatrix</h2>
        <svg
          className='three-dot'
          onClick={() => setMenuVisible(!isMenuVisible)}
          xmlns="http://www.w3.org/2000/svg"
          height="24px"
          viewBox="0 -960 960 960"
          width="24px"
          fill="#ffff">
            <path d="M480-160q-33 0-56.5-23.5T400-240q0-33 23.5-56.5T480-320q33 0 56.5 23.5T560-240q0 33-23.5 56.5T480-160Zm0-240q-33 0-56.5-23.5T400-480q0-33 23.5-56.5T480-560q33 0 56.5 23.5T560-480q0 33-23.5 56.5T480-400Zm0-240q-33 0-56.5-23.5T400-720q0-33 23.5-56.5T480-800q33 0 56.5 23.5T560-720q0 33-23.5 56.5T480-640Z"/>
        </svg>

        <ul className={`Logout ${ isMenuVisible ? 'active' : ''}`}>
         <li className="li">
          <Link to="/Update">Edit Profile</Link>
        </li>

          <hr />
          <li className='li' onClick={()=>Logout()}>Logout</li>
        </ul>
      </div>

      <input
        type="text"
        className='search-box'
        placeholder='Search user...'
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      <ul className='user-list'>
       {filteredUsers.map((user) => (
        <li className='user-item ' key={user._id} >
          <ListItem key={user._id} user={user} />
        </li>
      ))}

      </ul>
    </div>
  );
}

export default ChatContainer;