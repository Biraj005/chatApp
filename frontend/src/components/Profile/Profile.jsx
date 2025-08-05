import { useContext } from 'react'
import './Profile.css'
import { StoreContext } from '../../store/StoreContext'


function Profile() {
  const { selectedUser } = useContext(StoreContext);
  return (
    <div className='sender-profile'>
      <div className="top-profile">
        <img src={selectedUser.img} alt="" />
        <p>{selectedUser.name}</p>
        <span className="about">{selectedUser.about}</span>

      </div>

    </div>
  )
}

export default Profile