import { useContext, useState, useEffect } from 'react';
import './Profile.css';
import { StoreContext } from '../../store/StoreContext';

function Profile() {
  const { selectedUser, usermedia } = useContext(StoreContext);
  const [load, setLoad] = useState({});
  useEffect(() => {
    setLoad({});
  }, [selectedUser]);

  return (
    <div className="sender-profile">
      <div className="top-profile">
        <img
          src={selectedUser.profilePic || '/noprofile.png'}
          alt={`${selectedUser.name}'s profile picture`}
        />
        <p className="name">{selectedUser.name}</p>
        {selectedUser.bio?.length > 0 && (
          <span className="bio">{selectedUser.bio}</span>
        )}
      </div>

      <div className="shared-media">
        <h4>Shared Media</h4>
        {usermedia.length === 0 ? (
            <></>
        ) : (
          <div className="media-grid">
            {usermedia.map((src, index) => (
              <div className="media-item" key={index}>
                {load[index] ? (
                  <img
                    src={src.attachments}
                    alt={`Shared media ${index + 1}`}
                    loading="lazy"
                  />
                ) : (
                  <button
                    className="load-btn"
                    onClick={() => setLoad(prev => ({ ...prev, [index]: true }))}
                  >
                    Load
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Profile;
