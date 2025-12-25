import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Pencil, User, AtSign } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "../styles/Profile.css";

const Profile = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  
  // State data profil
  const [profile, setProfile] = useState({
    email: "",
    first_name: "",
    last_name: "",
    profile_pic: "/image/Profile Photo.png" 
  });

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ first_name: "", last_name: "" });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await axios.get("https://take-home-test-api.nutech-integrasi.com/profile", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = res.data.data;
      setProfile({
        email: data.email,
        first_name: data.first_name,
        last_name: data.last_name,
        profile_pic: data.profile_image.includes("null") ? "/image/Profile Photo.png" : data.profile_image
      });
      setFormData({ first_name: data.first_name, last_name: data.last_name });
    } catch (err) {
      console.error(err);
    }
  };

  // Fungsi Update Foto Profil
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 100000) return alert("Size image maksimum 100 kb"); // Validasi 100kb

    const token = localStorage.getItem("token");
    const formDataImage = new FormData();
    formDataImage.append("file", file);

    try {
      await axios.put("https://take-home-test-api.nutech-integrasi.com/profile/image", formDataImage, {
        headers: { 
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data"
        }
      });
      fetchProfile();
    } catch (err) {
      alert("Gagal mengupdate foto");
    }
  };


  const handleUpdateProfile = async () => {
    const token = localStorage.getItem("token");
    try {
      await axios.put("https://take-home-test-api.nutech-integrasi.com/profile/update", formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setIsEditing(false); 
      fetchProfile();
      alert("Profil berhasil diperbarui!");
    } catch (err) {
      alert("Gagal memperbarui profil");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token"); 
    navigate("/login"); 
  };

  return (
    <div className="home-container">
      <nav className="navbar">
        <div className="nav-logo">
          <img src="/image/Logo.png" alt="Logo" width={24} />
          <span>SIMS PPOB</span>
        </div>
        <div className="nav-links">
          <a href="/topup">Top Up</a>
          <a href="/transaction">Transaction</a>
          <a href="/akun" className="active">Akun</a>
        </div>
      </nav>

      <div className="profile-content">
        <div className="profile-header">
          <div className="avatar-wrapper">
            <img src={profile.profile_pic} alt="Profile" className="large-avatar" />
            <div className="edit-avatar-icon" onClick={() => fileInputRef.current.click()}>
              <Pencil size={14} />
            </div>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleImageUpload} 
              style={{ display: "none" }} 
              accept="image/*"
            />
          </div>
          <h2 className="profile-name">{profile.first_name} {profile.last_name}</h2>
        </div>

        <div className="profile-form">
          <div className="form-group">
            <label>Email</label>
            <div className="input-with-icon disabled">
              <AtSign size={16} />
              <input type="email" value={profile.email} disabled />
            </div>
          </div>

          <div className="form-group">
            <label>Nama Depan</label>
            <div className={`input-with-icon ${!isEditing ? "disabled" : ""}`}>
              <User size={16} />
              <input 
                type="text" 
                value={isEditing ? formData.first_name : profile.first_name}
                disabled={!isEditing}
                onChange={(e) => setFormData({...formData, first_name: e.target.value})}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Nama Belakang</label>
            <div className={`input-with-icon ${!isEditing ? "disabled" : ""}`}>
              <User size={16} />
              <input 
                type="text" 
                value={isEditing ? formData.last_name : profile.last_name}
                disabled={!isEditing}
                onChange={(e) => setFormData({...formData, last_name: e.target.value})}
              />
            </div>
          </div>

          <div className="profile-actions">
            {!isEditing ? (
              <>
                <button className="btn-outline-red" onClick={() => setIsEditing(true)}>Edit Profile</button>
                <button className="btn-solid-red" onClick={handleLogout}>Logout</button>
              </>
            ) : (
              <>
                <button className="btn-solid-red" onClick={handleUpdateProfile}>Simpan</button>
                <button className="btn-outline-gray" onClick={() => setIsEditing(false)}>Batalkan</button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;