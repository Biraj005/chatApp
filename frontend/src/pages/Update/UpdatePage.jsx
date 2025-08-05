import { useContext, useState } from 'react';
import './Update.css';
import { StoreContext } from '../../store/StoreContext';
import { AuthContext } from '../../store/AuthContext';

function UpdatePage() {
  const { currentUser } = useContext(StoreContext);
  const {  updateUser} = useContext(AuthContext);
  const [name, setName] = useState(currentUser?.name || '');
  const [bio, setBio] = useState(currentUser?.bio || '');
  const [profilePic, setProfilePic] = useState(null);
  
const handleSubmit = async (e) => {
  e.preventDefault();

  const formData = new FormData();
  formData.append('name', name);
  formData.append('bio', bio);
  if (profilePic) {
    formData.append('profilePic', profilePic); 
  }
  console.log(formData);

  updateUser(formData);
};

  return (
    <div className="update-page">
      <form className="update-container" onSubmit={handleSubmit}>
        <h2>Update Profile</h2>

        <input
          type="text"
          required
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="text"
          required
          placeholder="Bio"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
        />

        <div className="file-input-wrapper">
          <label htmlFor="profilePicUpload" className="custom-file-label">
            Update Profile Pic
          </label>
          <input
            type="file"
            id="profilePicUpload"
            accept="image/*"
            hidden
            onChange={(e) => setProfilePic(e.target.files[0])}
          />
        </div>

        <button className="submit-btn" type="submit">
          Save Changes
        </button>
      </form>
    </div>
  );
}

export default UpdatePage;
