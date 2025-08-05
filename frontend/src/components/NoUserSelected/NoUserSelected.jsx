
import './NoUserSelected.css';
function NoUserSelected() {
  return (
    <div className='no-user-selected'>
      <h2>Welcome to Chatrix 👋</h2>
      <p>Select a user from the left to start chatting.</p>
     <img src="/Chatrix.png" alt="Chat Logo" className="no-user-img" />
    </div>
  );
}

export default NoUserSelected;
