import React, { useState } from 'react';
import '../styles/HastaGiris.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const HastaGiris = () => {
  const navigate = useNavigate();
  const [tcNo, setTcNo] = useState("");
  const [sifre, setSifre] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!tcNo || !sifre) {
      alert("Lütfen tüm alanları doldurun.");
      return;
    }

    if (tcNo.length !== 11) {
      alert("TC Kimlik numarası 11 haneli olmalıdır.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:8080/api/auth/login", {
        tcNo: `HASTA-${tcNo}`,
        sifre: sifre
      });

      const token = response.data.token;
      localStorage.setItem("token", token);
      localStorage.setItem("rol", "HASTA");
      localStorage.setItem("tcNo", tcNo);

      navigate("/hasta/hastaSayfa");
    } catch (error) {
      if (error.response && error.response.status === 403) {
        alert("Giriş başarısız! TC veya şifre hatalı.");
      } else {
        alert("Sunucu hatası. Lütfen tekrar deneyin.");
      }
      console.error("Login error:", error);
    }
  };

  return (
    <>
      <video autoPlay muted loop className="background-video">
        <source src="/background.mp4" type="video/mp4" />
      </video>
      <div className="hasta-container">
        <div className="hasta-left">
          <img src="/logo.png" alt="Logo" className="hasta-logo" />
          <h1 className="hasta-baslik">Hasta Girişi</h1>
        </div>

        <div className="hasta-right">
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
            <button type="button" onClick={() => navigate('/hasta/UyeOl')}>KAYIT OL</button>
          </form>
        </div>
      </div>
    </>
  );
};

export default HastaGiris;
