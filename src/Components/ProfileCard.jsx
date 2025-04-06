import React, { useState } from "react";
import '../styles/style.css';
import axios from "axios";
import VideoRecorder from "./VideoRecorder";
import { FaSignOutAlt, FaEdit, FaSave, FaTimes } from "react-icons/fa";

const ProfileCard = ({ user = {}, token }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState(user ? {...user} : {});
  const [selectedFile, setSelectedFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setEditedUser({...editedUser, [e.target.name]: e.target.value});
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      let profileImageUrl = editedUser.profileImage;
      
      if (selectedFile) {
        const formData = new FormData();
        formData.append("profileImage", selectedFile);
  
        const imageUploadRes = await axios.post(
          "https://backend-build.onrender.com/api/upload", 
          formData, 
          {
            headers: { 
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${token}`
            },
          }
        );
        profileImageUrl = imageUploadRes.data.imageUrl;
      }
  
      const updatedUser = {
        username: editedUser.username,
        email: editedUser.email,
        profileImage: profileImageUrl
      };
  
      const response = await axios.put(
        `https://backend-build.onrender.com/api/users/${user.id}`,
        updatedUser,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
  
      setEditedUser(response.data.user);
      localStorage.setItem('user', JSON.stringify(response.data));
      setIsEditing(false);
      setSelectedFile(null);
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = () => {
    if (window.confirm("Are you sure you want to sign out?")) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
  };

  return (
    <div className="profile-card-container">
      <div className="profile-header">
        <button className="sign-out-button" onClick={handleSignOut}>
          <FaSignOutAlt /> Sign Out
        </button>
      </div>
      
      <div className="profile-card">
        <div className="profile-content">
          <button 
            className="edit-button" 
            onClick={() => setIsEditing(!isEditing)}
            disabled={isLoading}
          >
            {isEditing ? <FaTimes /> : <FaEdit />}
            {isLoading ? "Saving..." : isEditing ? "Cancel" : "Edit"}
          </button>
          
          {isEditing ? (
            <div className="edit-mode">
              <label className="file-upload-label">
                Change Profile Picture
                <input 
                  type="file" 
                  onChange={handleFileChange}
                  className="file-upload"
                  accept="image/*"
                  style={{ display: 'none' }}
                />
              </label>
              {selectedFile && (
                <p>Selected: {selectedFile.name}</p>
              )}
              
              <input 
                type="text" 
                name="username" 
                value={editedUser.username || ''} 
                onChange={handleChange} 
                placeholder="Username"
              />
              <input 
                type="email" 
                name="email" 
                value={editedUser.email || ''} 
                onChange={handleChange} 
                placeholder="Email"
              />
              <input 
                type="text" 
                name="description" 
                value={editedUser.description || ''} 
                onChange={handleChange} 
                placeholder="Description"
              />
              
              <button onClick={handleSave} disabled={isLoading}>
                <FaSave /> {isLoading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          ) : (
            <>
              {editedUser.profileImage && (
                <img 
                  src={editedUser.profileImage} 
                  alt={editedUser.username} 
                  className="profile-img" 
                />
              )}
              <h2 className="username">{editedUser.username || 'User'}</h2>
              <p className="email">{editedUser.email || 'No email provided'}</p>
              <p className="description">
                {editedUser.description || 'No description yet'}
              </p>
              <p className="score">Score: {editedUser.score || 0}</p>
            </>
          )}
        </div>
        
        {user?._id && <VideoRecorder userId={user.id} />}
      </div>
    </div>
  );
};

export default ProfileCard;