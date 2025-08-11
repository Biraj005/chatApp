import { useContext } from 'react'
import './Right.css'
import { StoreContext } from '../../store/StoreContext'
import Profile from '../Profile/Profile';
import ChatBox from '../../Message/ChatBox'



function Right() {
    
    const { selectedUser, setSelectedUser } = useContext(StoreContext);

    return (
        <div className='right-side'>
            {selectedUser === 'none' ?
                <div className='no-user-selected'>
                    <h2>Welcome to Chatrix 👋</h2>
                    <p>Select a user from the left to start chatting.</p>
                </div>
                :
                <div className='user-selcted'>
                    <ChatBox user={selectedUser} />
                    <Profile className='sender-profile' />
             </div>
            }
        </div>
    )
}

export default Right