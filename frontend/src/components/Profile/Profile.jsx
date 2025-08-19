import { useContext, useState, useEffect } from 'react';
import './Profile.css';
import { StoreContext } from '../../store/StoreContext';

function Profile() {
  const { selectedUser, usermedia } = useContext(StoreContext);
  const [load, setLoad] = useState({});

  // whenever selectedUser changes → reset load state
  useEffect(() => {
    setLoad({});
  }, [selectedUser]);

  return (
    <div className="sender-profile">
      <div className="top-profile">
        <img src={selectedUser.profilePic} alt={selectedUser.name} />
        <p className="name">{selectedUser.name}</p>
        {selectedUser.bio?.length > 0 && (
          <span className="bio">{selectedUser.bio}</span>
        )}
      </div>

      <div className="shared-media">
        <h4>Shared Media</h4>
        <div className="media-grid">
          {usermedia.map((src, index) => (
            <div className="media-item" key={index}>
              {load[index + 1] ? (
                <img src={src.attachments} alt={`Shared media ${index + 1}`} />
              ) : (
                <button
                className='load-btn'
                  onClick={() =>
                    setLoad(prev => ({ ...prev, [index + 1]: true }))
                  }
                >
                  Load
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Profile;
