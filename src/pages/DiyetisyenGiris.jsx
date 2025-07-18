import React, { useState } from 'react';
import '../styles/DiyetisyenGiris.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const DiyetisyenGiris = () => {
  const navigate = useNavigate();
  const [tcNo, setTcNo] = useState("");
  const [sifre, setSifre] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("🟡 handleSubmit tetiklendi!");

    if (!tcNo || !sifre) {
      alert("Lütfen tüm alanları doldurun.");
      return;
    }

    if (tcNo.length !== 11) {
      alert("TC Kimlik numarası 11 haneli olmalıdır.");
      return;
    }

    try {
      console.log("🟡 API isteği gönderiliyor...");

      const response = await axios.post('http://localhost:8080/api/auth/login', {
        tcNo: `DIYETISYEN-${tcNo}`,
        sifre: sifre
      });

      const token = response.data.token;
      console.log("✅ Giriş başarılı. Token:", token);

      localStorage.setItem('token', token);
      localStorage.setItem('tcNo', tcNo);

      navigate('/diyetisyen/diyetisyenSayfa');
    } catch (error) {
      console.error("❌ Giriş hatası:", error);
      console.log("❌ axios.post başarısız oldu");
      alert("Giriş başarısız! Lütfen TC veya şifrenizi kontrol edin.");
    }
  };

  return (
    <>
      <video autoPlay muted loop className="background-video">
        <source src="/background.mp4" type="video/mp4" />
      </video>
      <div className="diyetisyen-container">
        <div className="diyetisyen-left">
          <img src="/logo.png" alt="Logo" className="diyetisyen-logo" />
          <h1 className="diyetisyen-baslik">Diyetisyen<br />Girişi</h1>
        </div>

        <div className="diyetisyen-right">
          <form className="giris-form" onSubmit={handleSubmit}>
            <label htmlFor="tc">TC Kimlik Numarası</label>
            <input
              type="text"
              id="tc"
              name="tc"
              maxLength="11"
              inputMode="numeric"
              value={tcNo}
              onChange={(e) => {
                const value = e.target.value;
                if (/^\d*$/.test(value) && value.length <= 11) {
                  setTcNo(value);
                }
              }}
              required
            />

            <label htmlFor="sifre">Şifre</label>
            <input
              type="password"
              id="sifre"
              name="sifre"
              value={sifre}
              onChange={(e) => setSifre(e.target.value)}
              required
            />

            <button type="submit">GİRİŞ YAP</button>
          </form>
        </div>
      </div>
    </>
  );
};

export default DiyetisyenGiris;
