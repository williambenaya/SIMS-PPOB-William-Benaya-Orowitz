import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { Banknote } from "lucide-react";
import "../styles/Home.css";
import "../styles/Payment.css";

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // State Data
  const [profile, setProfile] = useState({});
  const [balance, setBalance] = useState(0);
  const [showBalance, setShowBalance] = useState(false);
  
  // State Modal & Status
  const [modalType, setModalType] = useState(null); 
  const selectedService = location.state?.service;

  useEffect(() => {
    if (!selectedService) {
      navigate("/homepage");
      return;
    }
    fetchUserData();
  }, [selectedService]);

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

  const handleProcessPayment = async () => {
    const token = localStorage.getItem("token");
    try {
    
      await axios.post(
        "https://take-home-test-api.nutech-integrasi.com/transaction",
        { service_code: selectedService.service_code },
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
          <img src="/image/Logo.png" alt="Logo" width={24} />
          <span>SIMS PPOB</span>
        </div>
        <div className="nav-links">
          <a href="/topup">Top Up</a>
          <a href="/transaction" className="active">Transaction</a>
          <a href="/akun">Akun</a>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <div className="hero-section">
        <div className="profile-box">
          <img src="/image/Profile Photo.png" alt="Profile" className="profile-img" />
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

      {/* --- PAYMENT FORM --- */}
      <div className="payment-content" style={{ marginTop: "40px" }}>
        <p>Pembayaran</p>
        <div className="service-info-header">
          <img src={selectedService?.service_icon} alt="icon" width={30} />
          <h3>{selectedService?.service_name}</h3>
        </div>

        <div className="input-field-container">
          <Banknote size={18} className="icon-gray" />
          <input
            type="text"
            className="custom-input"
            value={selectedService?.service_tariff.toLocaleString("id-ID")}
            readOnly
          />
        </div>

        <button className="btn-submit" onClick={() => setModalType("confirm")}>
          Bayar
        </button>
      </div>

      {/* --- LOGIKA MODAL --- */}
      {modalType && (
        <div className="modal-overlay">
          <div className="modal-box">
            {modalType === "confirm" && (
              <>
                <div className="modal-icon logo-bg">
                  <img src="/image/Logo.png" alt="logo" width={40} />
                </div>
                <p>Beli {selectedService?.service_name} senilai</p>
                <h2 className="modal-amount">Rp{selectedService?.service_tariff.toLocaleString("id-ID")} ?</h2>
                <button className="btn-link text-red" onClick={handleProcessPayment}>Ya, lanjutkan Bayar</button>
                <button className="btn-link text-gray" onClick={() => setModalType(null)}>Batalkan</button>
              </>
            )}

            {(modalType === "success" || modalType === "failed") && (
              <>
                <div className={`modal-icon ${modalType === "success" ? "bg-green" : "bg-red"}`}>
                  {modalType === "success" ? "✓" : "X"}
                </div>
                <p>Pembayaran {selectedService?.service_name} sebesar</p>
                <h2 className="modal-amount">Rp{selectedService?.service_tariff.toLocaleString("id-ID")}</h2>
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

export default Payment;