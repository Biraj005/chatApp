import React, { useContext } from "react";
import "./ProfilePage.css";
import { AuthContext } from "../../store/AuthContext";
import { useNavigate } from "react-router-dom";

function ProfilePage() {
  const { user ,Logout} = useContext(AuthContext);
  const navigate = useNavigate()

  return (
    <div className="profile-page">
      <div className="profile-box">
        <img src={user.profilePic} alt="Profile" className="profile-pic" />
        <h2 className="profile-name">{user.name}</h2>
        <p className="profile-email">{user.email}</p>
        <p className={`status ${user.isOnline ? "online" : "offline"}`}>
          {user.isOnline ? "Online" : "Offline"}
        </p>
        <div className="bio-box">{user.bio}</div>
        <button onClick={()=>navigate("/update")} className="update-button">Update Profile</button>
        <button onClick={()=>Logout()} className="update-button logout-button">Logout</button>
      </div>
    </div>
  );
}

export default ProfilePage;