import { useContext,useEffect,useState } from 'react'
import './Right.css'
import { StoreContext } from '../../store/StoreContext'
import Profile from '../Profile/Profile';
import ChatBox from '../../Message/ChatBox'

function Right() {
    const { selectedUser } = useContext(StoreContext);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 890);
    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 890);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
      }, []);
    


    return (
        <div className='right-side'>
            {selectedUser === 'none' ? (
                <div className='no-user-selected'>
                    <h2>Welcome to Chatrix </h2>
                    <p>Select a user from the left to start chatting.</p>
                </div>
            ) : (
                <div className='user-selcted'>
                    {isMobile ? <ChatBox user={selectedUser} />:
                     <> <ChatBox user={selectedUser} />
                    <Profile className='sender-profile' /></>}
                </div>
            )}
        </div>
    )
}

export default Right
