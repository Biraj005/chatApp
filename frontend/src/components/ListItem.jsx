import { useContext, useState } from "react"
import { StoreContext } from "../store/StoreContext";

function ListItem({ user }) {

    const [useractive, setUseractive] = useState(true);
    const { selectedUser,setSelectedUser } = useContext(StoreContext);
    return (
        <div className={`user-item ${selectedUser===user?'selected':''}`}>
            <img className='user-image' src={`${user.profilePic}`} alt="user image" />
            <div onClick={() => setSelectedUser(user)} className="name">
                <p className='name'> {user.name}</p>
                <p className={`online ${user.isOnline? 'active' : ''}`}>{user.isOnline? 'online' : 'offline'}</p>
            </div>
        </div>
    )
}


export default ListItem