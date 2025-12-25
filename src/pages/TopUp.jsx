import React, { useState, useEffect } from "react";
import axios from "axios";
import { Banknote } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "../styles/Home.css";
import "../styles/TopUp.css"; 

const TopUp = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState({});
  const [balance, setBalance] = useState(0);
  const [showBalance, setShowBalance] = useState(false);
  
  // State Input & Logic
  const [amount, setAmount] = useState("");
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [modalType, setModalType] = useState(null); 

  const presets = [10000, 20000, 50000, 100000, 250000, 500000];

  useEffect(() => {
    fetchUserData();
  }, []);


  useEffect(() => {
    const val = parseInt(amount);
    if (val >= 10000 && val <= 1000000) {
      setIsButtonDisabled(false);
    } else {
      setIsButtonDisabled(true);
    }
  }, [amount]);

  const fetchUserData = async () => {
    const token = localStorage.getItem("token");
    const config = { headers: { Authorization: `Bearer ${token}` } };
    try {
      const [resProfile, resBalance] = await Promise.all([
        axios.get("https://take-home-test-api.nutech-integrasi.com/profile", config),
        axios.get("https://take-home-test-api.nutech-integrasi.com/balance", config),
      ]);
      setProfile(resProfile.data.data);
      setBalance(resBalance.data.data.balance);
    } catch (err) {
      console.error(err);
    }
  };

  const handleTopUpAction = async () => {
    const token = localStorage.getItem("token");
    try {
     
      await axios.post(
        "https://take-home-test-api.nutech-integrasi.com/topup",
        { top_up_amount: parseInt(amount) },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setModalType("success"); 
    } catch (err) {
      setModalType("failed"); 
    }
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
          <a href="/topup" className="active">Top Up</a>
          <a href="/transaction">Transaction</a>
          <a href="/akun">Akun</a>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <div className="hero-section">
        <div className="profile-box">
          <img src="{process.env.PUBLIC_URL + '/Profile Photo.png'}" alt="Profile" className="profile-img" />
          <div className="profile-text">
            <p className="greeting">Selamat datang,</p>
            <h2 className="user-name">{profile.first_name} {profile.last_name}</h2>
          </div>
        </div>
        <div className="balance-card">
          <p className="balance-label">Saldo anda</p>
          <h1 className="balance-amount">
            {showBalance ? `Rp ${balance.toLocaleString("id-ID")}` : "Rp •••••••"}
          </h1>
          <div className="toggle-balance" onClick={() => setShowBalance(!showBalance)}>
            <span>{showBalance ? "Tutup Saldo" : "Lihat Saldo"}</span>
          </div>
        </div>
      </div>

      {/* --- TOP UP CONTENT --- */}
      <div className="topup-container" style={{ marginTop: "40px" }}>
        <p>Silahkan masukan</p>
        <h2 style={{ marginBottom: "20px" }}>Nominal Top Up</h2>

        <div className="topup-layout">
          <div className="topup-left">
            <div className="input-field-container">
              <Banknote size={18} className="icon-gray" />
              <input
                type="number"
                placeholder="masukan nominal Top Up"
                className="custom-input"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>
            <button 
              className={`btn-submit ${isButtonDisabled ? "disabled" : ""}`}
              disabled={isButtonDisabled}
              onClick={() => setModalType("confirm")}
            >
              Top Up
            </button>
          </div>

          <div className="topup-right">
            {presets.map((val) => (
              <button 
                key={val} 
                className="btn-preset" 
                onClick={() => setAmount(val.toString())}
              >
                Rp{val.toLocaleString("id-ID")}
              </button>
            ))}
          </div>
        </div>
      </div>

 
      {modalType && (
        <div className="modal-overlay">
          <div className="modal-box">
            {modalType === "confirm" && (
              <>
                <div className="modal-icon logo-bg">
                  <img src="{process.env.PUBLIC_URL + '/logo.png'}" alt="logo" width={40} />
                </div>
                <p>Anda yakin untuk Top Up sebesar</p>
                <h2 className="modal-amount">Rp{parseInt(amount).toLocaleString("id-ID")} ?</h2>
                <button className="btn-link text-red" onClick={handleTopUpAction}>Ya, lanjutkan Top Up</button>
                <button className="btn-link text-gray" onClick={() => setModalType(null)}>Batalkan</button>
              </>
            )}

            {(modalType === "success" || modalType === "failed") && (
              <>
                <div className={`modal-icon ${modalType === "success" ? "bg-green" : "bg-red"}`}>
                  {modalType === "success" ? "✓" : "X"}
                </div>
                <p>Top Up sebesar</p>
                <h2 className="modal-amount">Rp{parseInt(amount).toLocaleString("id-ID")}</h2>
                <p>{modalType === "success" ? "berhasil!" : "gagal"}</p>
                <button className="btn-link text-red" onClick={() => navigate("/homepage")}>Kembali ke Beranda</button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TopUp;