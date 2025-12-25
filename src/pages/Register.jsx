import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AtSign, User, Lock, Eye, EyeOff } from "lucide-react"; 
import "../styles/registrasi.css"; 
const Registration = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    password: "",
    confirmPassword: "",
  });


  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);


  const [passwordError, setPasswordError] = useState(false); 
  const [generalError, setGeneralError] = useState(""); 
  const [isLoading, setIsLoading] = useState(false);


  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    if (passwordError) setPasswordError(false);
    if (generalError) setGeneralError("");
  };

 const handleRegister = async (e) => {
  e.preventDefault();

  if (formData.password !== formData.confirmPassword) {
    setPasswordError(true);
    return;
  }

  setIsLoading(true);

  try {
    const response = await axios.post(
    "https://take-home-test-api.nutech-integrasi.com/registration",
      {
        email: formData.email,
        first_name: formData.firstName,
        last_name: formData.lastName,
        password: formData.password,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

   
    if (response.data.status === 0) {
      alert("Registrasi berhasil! Silakan login.");
      navigate("/");
    } else {
      setGeneralError(response.data.message || "Registrasi gagal");
    }
  } catch (error) {
    setGeneralError(
      error.response?.data?.message ||
      "Registrasi gagal, silakan coba lagi"
    );
  } finally {
    setIsLoading(false);
  }
};

  return (
    <div className="login-container">
   
      <div className="login-left">
        <div className="login-box">
        
          <div className="logo-header">
            <img src="{process.env.PUBLIC_URL + '/logo.png'}" alt="Logo" style={{ width: 24 }} />
            <span className="logo-text">SIMS PPOB</span>
          </div>

        
          <h2 className="title">Lengkapi data untuk membuat akun</h2>

          <form onSubmit={handleRegister}>
            
          
            <div className="input-wrapper">
              <div className="input-field-container">
                <AtSign size={18} className="icon-gray" />
                <input
                  type="email"
                  name="email"
                  placeholder="masukan email anda"
                  className="custom-input"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

         
            <div className="input-wrapper">
              <div className="input-field-container">
                <User size={18} className="icon-gray" />
                <input
                  type="text"
                  name="firstName"
                  placeholder="nama depan"
                  className="custom-input"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="input-wrapper">
              <div className="input-field-container">
                <User size={18} className="icon-gray" />
                <input
                  type="text"
                  name="lastName"
                  placeholder="nama belakang"
                  className="custom-input"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

  
            <div className="input-wrapper">
              <div className="input-field-container">
                <Lock size={18} className="icon-gray" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="buat password"
                  className="custom-input"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  minLength={8}
                />
                <button
                  type="button"
                  className="eye-btn"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

           
            <div className="input-wrapper">
              <div
                className={`input-field-container ${
                  passwordError ? "border-error" : ""
                }`}
              >
                <Lock size={18} className="icon-gray" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="konfirmasi password"
                  className="custom-input"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
                <button
                  type="button"
                  className="eye-btn"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              
         
              {passwordError && (
                <span className="error-text">password tidak sama</span>
              )}
            </div>

          
            {generalError && (
              <div style={{ color: "red", fontSize: 12, marginBottom: 10, textAlign: "center" }}>
                {generalError}
              </div>
            )}

            <button type="submit" className="btn-submit" disabled={isLoading}>
              {isLoading ? "Loading..." : "Registrasi"}
            </button>
          </form>

       
          <p className="footer-text">
            sudah punya akun? login{" "}
            <span className="link-red" onClick={() => navigate("/")}>
              di sini
            </span>
          </p>
        </div>
      </div>


      <div className="login-right">
        <img src="{process.env.PUBLIC_URL + '/Illustrasi Login.png}" alt="Ilustrasi" className="hero-image" />
      </div>
    </div>
  );
};

export default Registration;