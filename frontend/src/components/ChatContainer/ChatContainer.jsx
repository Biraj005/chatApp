import { useContext, useState, useEffect } from 'react';
import './ChatContainer.css';
import { StoreContext } from '../../store/StoreContext';
import ListItem from '../ListItem/ListItem';
import { AuthContext } from '../../store/AuthContext';
import search from '../../assets/search.png'
import three_dot from '../../assets/three_dot.png'
import { useNavigate } from 'react-router-dom';

function ChatContainer() {
  const { Logout, getUsers } = useContext(AuthContext);
  const { users,setSelectedUser,selectedUser } = useContext(StoreContext);
  const [query, setQuery] = useState('');
  const [isMenuVisible, setMenuVisible] = useState(false);
  const navigate = useNavigate()

  useEffect(() => {
    getUsers();
  }, []);

  const filteredUsers = users?.filter(user =>
    user.name.toLowerCase().includes(query.toLowerCase())
  ) || [];

  return (
    <div className='chat-container'>
      <div className="chat-top">
        <h2>Chatrix</h2>
        <svg
          className='three-dot'
          onClick={() => setMenuVisible(!isMenuVisible)}
          xmlns={three_dot}
          height="24px"
          viewBox="0 -960 960 960"
          width="24px"
          fill="#fff">
          <path d="M480-160q-33 0-56.5-23.5T400-240q0-33 23.5-56.5T480-320q33 0 56.5 23.5T560-240q0 33-23.5 56.5T480-160Zm0-240q-33 0-56.5-23.5T400-480q0-33 23.5-56.5T480-560q33 0 56.5 23.5T560-480q0 33-23.5 56.5T480-400Zm0-240q-33 0-56.5-23.5T400-720q0-33 23.5-56.5T480-800q33 0 56.5 23.5T560-720q0 33-23.5 56.5T480-640Z" />
        </svg>

        <ul className={`Logout ${isMenuVisible ? 'active' : ''}`}>
          <li className='li' onClick={Logout}>Logout</li>
          <hr />
          <li className="li" onClick={() => navigate("/profile")}>
            Profile
          </li>
        </ul>
      </div>
      <div className='search_box'>
        <img className='search_icon' src={search} alt="Search" />
        <input
          type="text"
          className='search-box'
          placeholder='Search user...'
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>
      <ul className='user-list'>
        {filteredUsers.map(user => (
          <ListItem key={user._id} user={user} />
        ))}
      </ul>
    </div>
  );
}

export default ChatContainer;
