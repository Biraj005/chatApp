import { useContext } from 'react';
import './Profile.css';
import { StoreContext } from '../../store/StoreContext';
function Profile() {
  const { selectedUser,usermedia } = useContext(StoreContext);
  console.log(usermedia)

  return (
    <div className='sender-profile'>
      <div className="top-profile">
        <img src={selectedUser.profilePic} alt={selectedUser.name} />
        <p className="name">{selectedUser.name}</p>
      {selectedUser.bio.lenght>0 &&  <span className="bio">{selectedUser.bio}</span>}
      </div>
      <div className="shared-media">
        <h4>Shared Media</h4>
        <div className="media-grid">
          {usermedia.map((src, index) => (
            <div className="media-item" key={index}>
              <img src={src.attachments} alt={`Shared media ${index + 1}`} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Profile;