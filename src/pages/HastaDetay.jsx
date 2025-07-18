import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../styles/HastaDetay.css";

const HastaDetay = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  return (
    <div className="hasta-detay-sayfa">
      {/* Sol panel */}
      <div className="hasta-sol-panel">
        <img src="/user.png" alt="Hasta" className="hasta-avatar" />
        <ul className="hasta-bilgileri">
          <li>İsim Soyisim</li>
          <li>Cinsiyet</li>
          <li>Yaş</li>
          <li>Kilo</li>
          <li>Boy</li>
          <li>VKİ</li>
          <li>Hastalık</li>
        </ul>
      </div>

      {/* Orta içerik paneli */}
      <div className="hasta-orta-panel">
        <div className="orta-baslik">Hastanın Öğünleri ve Aktiviteleri</div>
        <div className="ogun-satir">
          <div className="ogun">Sabah</div>
          <div className="ogun">Öğle</div>
        </div>
        <div className="ogun-satir">
          <div className="ogun">Akşam</div>
          <div className="ogun">Diğer</div>
        </div>
      </div>

      {/* Sağ alt rapor butonu */}
      <button className="rapor-btn" onClick={() => navigate(`/hasta/${id}/rapor`)}>
  📄 Raporlar
</button>
    </div>
  );
};

export default HastaDetay;
