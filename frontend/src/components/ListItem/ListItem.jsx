import { useContext, useState } from "react"
import { StoreContext } from "../../store/StoreContext";

function ListItem({user}) {
    const { selectedUser,setSelectedUser} = useContext(StoreContext);
    return (
        <div onClick={()=>setSelectedUser(user)} className={`user-item ${selectedUser === user ? 'selected' : ''}`}>
            <img className='user-image' src={`${user.profilePic}`} alt="user image" />
            <div  className="name">
                <p className='name'> {user.name}</p>
                <p className={` ${user.isOnline ? 'online' : 'ofline'}`}>{user.isOnline ? 'online' : 'offline'}</p>
            </div>
        </div>
    )
}


export default ListItem