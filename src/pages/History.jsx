import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/Home.css";
import "../styles/Transaction.css";
import logo from '../assets/Logo.png'; 
import ProfilePhoto from '../assets/Profile Photo.png';
import { Link } from 'react-router-dom';
const Transaction = () => {
 const [profile, setProfile] = useState({}); 
  const [balance, setBalance] = useState(0);
  const [showBalance, setShowBalance] = useState(false);
  
  // State Transaksi
  const [transactions, setTransactions] = useState([]);
  const [offset, setOffset] = useState(0);
  const limit = 5; 
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    fetchUserData();
    fetchTransactions(0); 
  }, []);

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

  const fetchTransactions = async (currentOffset) => {
    const token = localStorage.getItem("token");
    try {

      const res = await axios.get(
        `https://take-home-test-api.nutech-integrasi.com/transaction/history?offset=${currentOffset}&limit=${limit}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      const newItems = res.data.data.records;
      
      if (currentOffset === 0) {
        setTransactions(newItems);
      } else {
        setTransactions((prev) => [...prev, ...newItems]);
      }


      if (newItems.length < limit) {
        setHasMore(false);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleShowMore = () => {
    const nextOffset = offset + limit; 
    setOffset(nextOffset);
    fetchTransactions(nextOffset);
  };

  return (
    <div className="home-container">
      {/* --- NAVBAR --- */}
      <nav className="navbar">
        <div className="nav-logo">
          <img src={logo} alt="Logo" width={24} />
        <Link to="/homepage" style={{ textDecoration: 'none', color: 'inherit', fontWeight: 'bold' }}>
  SIMS PPOB
</Link>
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
          <img src={ProfilePhoto}  alt="Profile" className="profile-img" />
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

      {/* --- TRANSACTION HISTORY --- */}
      <div className="transaction-content" style={{ marginTop: "40px" }}>
        <h3 style={{ marginBottom: "20px" }}>Semua Transaksi</h3>

        {transactions.length === 0 ? (
          <div className="empty-state">
            <p className="text-gray">Maaf tidak ada histori transaksi saat ini</p>
          </div>
        ) : (
          <div className="transaction-list">
            {transactions.map((item, index) => (
              <div key={index} className="transaction-card">
                <div className="card-left">
                  <h2 className={item.transaction_type === "TOPUP" ? "text-green" : "text-red"}>
                    {item.transaction_type === "TOPUP" ? `+ Rp ${item.total_amount.toLocaleString("id-ID")}` : `- Rp ${item.total_amount.toLocaleString("id-ID")}`}
                  </h2>
                  <p className="text-date">
                    {new Date(item.created_on).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })} {new Date(item.created_on).toLocaleTimeString("id-ID", { hour: '2-digit', minute: '2-digit' })} WIB
                  </p>
                </div>
                <div className="card-right">
                  <p className="text-desc">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {hasMore && transactions.length > 0 && (
          <button className="btn-show-more" onClick={handleShowMore}>
            Show more
          </button>
        )}
      </div>
    </div>
  );
};

export default Transaction;