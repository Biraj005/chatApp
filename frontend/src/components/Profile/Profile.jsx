import { useContext } from 'react'
import './Profile.css'
import { StoreContext } from '../../store/StoreContext'


function Profile() {
  const { selectedUser } = useContext(StoreContext);
  return (
    <div className='sender-profile'>
      <div className="top-profile">
        <img src={selectedUser.profilePic} alt="" />
        <p>{selectedUser.name}</p>
        <span className="about">{selectedUser.bio}</span>

      </div>

    </div>
  )
}

export default Profile