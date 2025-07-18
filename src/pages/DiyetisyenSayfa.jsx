import React, { useEffect, useState } from "react";
import "../styles/DiyetisyenSayfa.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";


const DiyetisyenPanel = () => {
  const navigate = useNavigate();

  const [profil, setProfil] = useState({
    ad: "",
    soyad: "",
    email: "",
    telefon: ""
  });

  const [hastalar, setHastalar] = useState([]);
  const [tarih, setTarih] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");

    const bugun = new Date();
    const formatliTarih = bugun.toLocaleDateString("tr-TR", {
      weekday: "long", year: "numeric", month: "long", day: "numeric"
    });
    setTarih(formatliTarih);

    // Profil bilgisi
    axios.get("http://localhost:8080/api/diyetisyenler/me", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => setProfil(res.data))
      .catch(err => console.error("Profil bilgisi alınamadı:", err));

    // Hasta listesi
    axios.get("http://localhost:8080/api/diyetisyenler/me/hastalar", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => setHastalar(res.data))
      .catch(err => console.error("Hasta listesi alınamadı:", err));
  }, []);

  const handleHastaClick = (hasta) => {
    if (hasta?.id) {
      console.log("📦 Yönlendirilen hasta ID:", hasta.id);
      navigate(`/rapor/${hasta.id}`);
    } else {
      console.warn("⛔ Hasta ID bulunamadı, yönlendirme iptal edildi.");
    }
  };

  return (
    <div className="diyetisyen-panel">
      {/* Sol Panel */}
      <div className="sol-panel">
        <div className="tarih-header">{tarih}</div>
        <div className="profil-kart">
          <img src="/dr.png" alt="Logo" className="profil-icon" />
          <ul>
            <li>Diyetisyen Bilgileri</li>
            <li>{profil.ad} {profil.soyad}</li>
            <li>{profil.email}</li>
            <li>{profil.telefon}</li>
          </ul>
        </div>
      </div>

      {/* Sağ Panel */}
      <div className="sag-panel">
        <div className="hasta-grid">
          {hastalar.map((hasta) => (
            <div
              key={hasta.id}
              className="hasta-kart"
              onClick={() => handleHastaClick(hasta)}
              title={hasta?.id ? "Raporu Görüntüle" : "Hasta ID yüklenemedi"}
            >
              <img src="/medical-report.png" alt="Logo" className="profil-icon" />
              <div className="hasta-isim">{hasta.ad} {hasta.soyad}</div>
            </div>
          ))}

          {/* Çıkış */}
          <div className="logout-btn" onClick={() => {
            localStorage.removeItem("token");
            localStorage.removeItem("tcNo");
            navigate("/");
          }}>🔓</div>

        
        </div>
      </div>
    </div>
  );
};

export default DiyetisyenPanel;
