import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/Home.css"; 
import { Eye, EyeOff } from "lucide-react"; 
import { useNavigate } from "react-router-dom";
const Home = () => {
  // State Data API
  const [profile, setProfile] = useState({});
  const [balance, setBalance] = useState(0);
  const [services, setServices] = useState([]);
  const [banners, setBanners] = useState([]);
const navigate = useNavigate();
  // State UI
  const [showBalance, setShowBalance] = useState(false);
 const [, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const token = localStorage.getItem("token");
    const config = { headers: { Authorization: `Bearer ${token}` } };

    try {
      const [resProfile, resBalance, resServices, resBanner] = await Promise.all([
        axios.get("https://take-home-test-api.nutech-integrasi.com//profile", config),
        axios.get("https://take-home-test-api.nutech-integrasi.com//balance", config),
        axios.get("https://take-home-test-api.nutech-integrasi.com/services", config),
        axios.get("https://take-home-test-api.nutech-integrasi.com/banner", config),
      ]);

      setProfile(resProfile.data.data);
      setBalance(resBalance.data.data.balance);
      setServices(resServices.data.data);
      setBanners(resBanner.data.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data", error);
    
    }
  };

  const formatRupiah = (number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(number);
  };

  return (
    <div className="home-container">
      {/* --- NAVBAR --- */}
      <nav className="navbar">
        <div className="nav-logo">
    
          <img src="{process.env.PUBLIC_URL + '/logo.png'}" alt="Logo" width={24} />
          <span>SIMS PPOB</span>
        </div>
        <div className="nav-links">
          <a href="/topup">Top Up</a>
          <a href="/transaction">Transaction</a>
          <a href="/akun">Akun</a>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <div className="hero-section">
        {/* Profile */}
        <div className="profile-box">
          <img 
           
            src={
              profile.profile_image && profile.profile_image.includes("https") 
                ? profile.profile_image 
                : "{process.env.PUBLIC_URL + '/Profile Photo.png'}" 
            } 
            alt="Profile" 
            className="profile-img" 
            onError={(e) => {
            
              e.target.onerror = null; 
              e.target.src = "{process.env.PUBLIC_URL + '/Profile Photo.png'}"; 
            }}
          />
          <div className="profile-text">
            <p className="greeting">Selamat datang,</p>
            <h2 className="user-name">
              {profile.first_name ? `${profile.first_name} ${profile.last_name}` : "User"}
            </h2>
          </div>
        </div>

        {/* Balance Card */}
        <div className="balance-card">
          <p className="balance-label">Saldo anda</p>
          <h1 className="balance-amount">
            {showBalance ? formatRupiah(balance) : "Rp •••••••"}
          </h1>
          <div className="toggle-balance" onClick={() => setShowBalance(!showBalance)}>
            <span className="toggle-text">Lihat Saldo</span>
            {showBalance ? <Eye size={14} /> : <EyeOff size={14} />}
          </div>
        </div>
      </div>

      {/* --- SERVICES --- */}
      <div className="services-container">
        {services.map((service, index) => (
          <div 
                    key={index} 
                    className="service-item"
                    onClick={() => navigate("/payment", { state: { service: service } })}
                    >
                    <div className="service-icon-box">
                        <img src={service.service_icon} alt={service.service_name} />
                    </div>
                    <p className="service-label">{service.service_name}</p>
                    </div>
        ))}
      </div>

      {/* --- BANNER --- */}
      <div className="banner-section">
        <h3 className="section-title">Temukan promo menarik</h3>
        <div className="banner-slider">
          {banners.map((banner, index) => (
            <img 
              key={index} 
              src={banner.banner_image} 
              alt={banner.banner_name} 
              className="banner-img" 
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;