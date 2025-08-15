import { useContext, useState } from 'react';
import './LoginPage.css';
import {  AuthContext } from '../../store/AuthContext';
import toast from 'react-hot-toast'; 

function LoginPage() {
  const [login, setLogin] = useState(true); 
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [bio, setBio] = useState('');
  const [profilePic, setProfilePic] = useState(null);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  
const { loginSignUp } = useContext( AuthContext); 

const onSubmitHandler = (event) => {
  event.preventDefault();
  const formType = login ? 'Login' : 'Signup';

  if (!login && password !== confirmPassword) {
    toast.error("Passwords do not match!");
    return;
  }
  if (login) {
    loginSignUp(formType, { email, password });
  } else {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("bio", bio);
    if (profilePic) {
      formData.append("profilePic", profilePic); 
    }

    loginSignUp(formType, formData);
  }
};

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePic(file);
      toast.success(`${file.name} selected!`); 
    }
  };

  return (
    <div className="login-page">
      <form className="login-container" onSubmit={onSubmitHandler}>
        <h2>{login ? "Login" : "Create Account"}</h2>
        {!login && (
          <>
            <input type="text" required placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
            <input type="text" required placeholder="Bio" value={bio} onChange={(e) => setBio(e.target.value)} />
          </>
        )}


        <input type="email" required placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input type="password" required placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        {!login && (
          <>
            <input type="password" required placeholder="Confirm password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
            <div className="file-input-wrapper">
              <label htmlFor="profilePicUpload" className="custom-file-label">
                {profilePic ? profilePic.name : "Select Profile Pic"}
              </label>
              <input type="file" id="profilePicUpload" accept="image/*" onChange={handleFileChange} hidden />
            </div>
          </>
        )}
        
        <button className="submit-btn" type="submit">{login ? 'Login' : 'Signup'}</button>
        
    <div className="switch-login">
        <p>{login ? "Don't have an account?" : "Already have an account?"}</p>
        <button 
          onClick={() => setLogin(prev => !prev)} 
          type="button" 
          className="text-btn"
        >
          {login ? 'Signup here' : 'Login here'}
        </button>
        {login && ( <button type="button" className="text-btn">
          Forgot password?
        </button>)}
      </div>


      </form>
    </div>
  );
}

export default LoginPage;