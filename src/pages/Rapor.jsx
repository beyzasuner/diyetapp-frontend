import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/Rapor.css";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const Rapor = () => {
  const { id } = useParams(); // bu varsa diyetisyen girişi, yoksa hasta girişi
  const navigate = useNavigate();

  const [hasta, setHasta] = useState(null);
  const [raporVerisi, setRaporVerisi] = useState([]);
  const [gecersizId, setGecersizId] = useState(false);
  const [makroMap, setMakroMap] = useState({});
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!id || id === "undefined") {
      // hasta girişi
      axios.get("http://localhost:8080/api/hastalar/me", {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => setHasta(res.data))
      .catch(err => {
        console.error("Hasta bilgisi alınamadı:", err);
        setGecersizId(true);
      });

      axios.get("http://localhost:8080/api/rapor/me/haftalik", {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => setRaporVerisi(res.data))
      .catch(err => console.error("Rapor verisi alınamadı:", err));
    } else {
      // diyetisyen girişi
      axios.get(`http://localhost:8080/api/hastalar/id/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => setHasta(res.data))
      .catch(err => {
        console.error("Hasta bilgisi alınamadı:", err);
        setGecersizId(true);
      });

      axios.get(`http://localhost:8080/api/rapor/hasta/${id}/haftalik`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => setRaporVerisi(res.data))
      .catch(err => console.error("Rapor verisi alınamadı:", err));
    }
  }, [id]);

  useEffect(() => {
    const fetchMakrolarForDate = async (tarih, hastaId) => {
      try {
        const url = hastaId
          ? `http://localhost:8080/api/ogunler/makrolar/${hastaId}/${tarih}`
          : `http://localhost:8080/api/ogunler/makrolar/me/${tarih}`;
        const res = await axios.get(url, {
          headers: { Authorization: `Bearer ${token}` }
        });
        return res.data;
      } catch (err) {
        console.error("Makro verisi alınamadı:", err);
        return null;
      }
    };

    const fetchAllMakrolar = async () => {
      const yeniMap = {};
      for (const gun of raporVerisi) {
        const makro = await fetchMakrolarForDate(gun.tarih, id);
        if (makro) {
          yeniMap[gun.tarih] = makro;
        }
      }
      setMakroMap(yeniMap);
    };

    if (raporVerisi.length > 0) {
      fetchAllMakrolar();
    }
  }, [raporVerisi, id]);

  if (gecersizId) {
    return (
      <p style={{ color: "red", textAlign: "center", marginTop: "50px" }}>
        ❌ Hasta ID geçersiz. Lütfen tekrar deneyin.
      </p>
    );
  }

  return (
    <div className="rapor-sayfa">
      <div className="hasta-bilgi-panel">
        <img src="/user.png" alt="Hasta" className="hasta-avatar" />
        {hasta ? (
          <>
            <ul className="hasta-bilgileri">
              <li className="hasta-isim"><strong>{hasta.ad} {hasta.soyad}</strong></li>
              <li><strong>Cinsiyet:</strong> {hasta.cinsiyet}</li>
              <li><strong>Yaş:</strong> {hasta.yas}</li>
              <li><strong>Kilo:</strong> {hasta.kilo} kg</li>
              <li><strong>Boy:</strong> {hasta.boy} cm</li>
              <li><strong>Vücut Kitle İndeksi:</strong> {hasta.vki?.toFixed(2)}</li>
              <li><strong>Hastalıkları:</strong> {hasta.saglikDurumu}</li>
              <li><strong>Fiziksel Aktivite:</strong> {hasta?.fizikselAktivite || "Belirtilmemiş"}</li>
            </ul>

            {raporVerisi.length > 0 && (
              <div style={{ width: '100%', height: 200, marginTop: "30px" }}>
                <h4 style={{ textAlign: 'center', color: 'white', fontSize: "14px", marginBottom: "10px" }}>
                  Haftalık Kalori Grafiği
                </h4>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={raporVerisi}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey={(entry) => new Date(entry.tarih).toLocaleDateString("tr-TR")} tick={{ fontSize: 10 }} />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="toplamKalori" fill="#ff6b6b" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </>
        ) : (
          <p style={{ color: "white" }}>Yükleniyor...</p>
        )}
      </div>

      <div className="rapor-icerik-panel">
        <div className="geri-btn-wrapper">
          <button className="geri-btn" onClick={() => navigate(-1)}>⬅️ Geri Dön</button>
       
        </div>
        <h2>📊 {hasta?.ad} {hasta?.soyad} - Haftalık Rapor</h2>

        <div className="rapor-liste">
          {raporVerisi.length === 0 ? (
            <p style={{ textAlign: "center", color: "#666" }}>
              Bu haftaya ait kayıtlı öğün verisi bulunamadı.
            </p>
          ) : (
            raporVerisi.map((gun, index) => (
              <div className="rapor-kutu" key={`${gun.tarih}-${index}`}>
                <p><strong>📅 Tarih:</strong> {new Date(gun.tarih).toLocaleDateString("tr-TR")}</p>
                <p><strong>🍳 Sabah:</strong> {gun.sabah || "-"}</p>
                <p><strong>🍲 Öğle:</strong> {gun.ogle || "-"}</p>
                <p><strong>🌙 Akşam:</strong> {gun.aksam || "-"}</p>
                <p><strong>📎 Diğer:</strong> {gun.diger || "-"}</p>
                <p><strong>💧 Su:</strong> {gun.su || "-"}</p>
                <p><strong>🔥 Kalori:</strong> {gun.toplamKalori?.toFixed(2) || "0"} kcal</p>
                {makroMap[gun.tarih] && (
                  <div className="gunluk-makro-box">
                    <p>🥦 Karbonhidrat: {makroMap[gun.tarih].karbonhidrat?.toFixed(1)} g</p>
                    <p>🍗 Protein: {makroMap[gun.tarih].protein?.toFixed(1)} g</p>
                    <p>🧈 Yağ: {makroMap[gun.tarih].yag?.toFixed(1)} g</p>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Rapor;
