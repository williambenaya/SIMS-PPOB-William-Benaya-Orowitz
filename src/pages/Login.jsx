import { useState } from "react";
import "../styles/login.css";
import Input from "../components/Input";
import { Mail, Lock, Eye, EyeOff } from "lucide-react"; 
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Link } from "react-router-dom";
import logo from '../assets/Logo.png'; 
import illustration from '../assets/Illustrasi Login.png';
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [showPassword, setShowPassword] = useState(false); 
const navigate = useNavigate();

 const handleLogin = async (e) => {
  e.preventDefault();

  if (!email || !password) {
    setErrorMsg("Email dan password wajib diisi");
    return;
  }

  try {
    const response = await axios.post(
      "https://take-home-test-api.nutech-integrasi.com/login",
      {
        email,
        password,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (response.data.status === 0) {
      const token = response.data.data.token;
      localStorage.setItem("token", token);
      navigate("/homepage");
    } else {
      setErrorMsg(response.data.message || "Login gagal");
    }
  } catch (error) {
    setErrorMsg(
      error.response?.data?.message ||
      "Login gagal, email atau password salah"
    );
  }
};
  return (
    <div className="login-container">
      {/* LEFT */}
      <div className="login-left">
        <div className="login-box">
          <div className="logo-header">
           <img src={logo} alt="logo" />
            <span className="logo-text">SIMS PPOB</span>
          </div>

         <h1>Masuk atau buat akun untuk memulai</h1>

          <form onSubmit={handleLogin}>
            <Input
              type="email"
              placeholder="masukkan email anda"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              icon={<Mail size={18} color="#999" />} 
            />

            <Input
              type={showPassword ? "text" : "password"}
              placeholder="masukkan password anda"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={errorMsg}
              icon={<Lock size={18} color="#999" />} 
            
              suffix={
                <button
                  type="button"
                  className="eye-btn"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} color="#999" /> : <Eye size={18} color="#999" />}
                </button>
              }
            />

            <button type="submit" className="btn-login">Masuk</button>
          </form>

       <p className="register-text">
   belum punya akun? registrasi <Link to="/register" className="red-link">di sini</Link>
</p>
          
       
          {errorMsg && (
      <div className="alert-message">
        <span>{errorMsg}</span>
        <span 
          className="close-icon" 
          onClick={() => setErrorMsg("")} 
        >
          ×
        </span>
      </div>
    )}
        </div>
      </div>

      {/* RIGHT */}
      <div className="login-right">
                    <img
                src={illustration}
                alt="illustration"
                className="login-img"
            />
      </div>
    </div>
  );
};

export default Login;