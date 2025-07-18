import React, { useState, useEffect } from "react";
import '../styles/UyeOl.css';
import { useNavigate } from "react-router-dom";
import axios from "axios";

const UyeOl = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    ad: "",
    soyad: "",
    tcNo: "",
    sifre: "",
    yas: "",
    kilo: "",
    boy: "",
    suTuketimi: "",
    saglikDurumu: "",
    fizikselAktivite: "",
    cinsiyet: "",
    diyetisyenId: 4 
  });

  const [diyetisyenler, setDiyetisyenler] = useState([]);

  // Diyetisyen listesi (TCNo + ad soyad) çek
  useEffect(() => {
    axios.get("http://localhost:8080/api/diyetisyenler")
      .then((res) => setDiyetisyenler(res.data))
      .catch((err) => console.error("Diyetisyen listesi alınamadı:", err));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log("🧾 DEĞİŞİKLİK:", name, value,typeof value); // ← BU ÇOK KRİTİK
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log("📤 GÖNDERİLEN FORM:", form);

      await axios.post("http://localhost:8080/api/auth/register/hasta", form);
      alert("Kayıt başarılı!");
      navigate("/hasta");
    } catch (error) {
      console.error("Kayıt hatası:", error);
      alert("Kayıt başarısız. Bu TC zaten kayıtlı olabilir.");
    }
  };

  return (
    <>
      <video autoPlay muted loop className="background-video">
        <source src="/background.mp4" type="video/mp4" />
      </video>
      <div className="uyeol-container">
        <div className="uye-left">
          <img src="/logo.png" alt="Logo" className="uye-logo" />
          <h1 className="uye-baslik">Kayıt Ol</h1>
          

        </div>

        <div className="uye-right">
          <form className="uye-form" onSubmit={handleSubmit}>
            <input name="ad" placeholder="Ad" onChange={handleChange} required />
            <input name="soyad" placeholder="Soyad" onChange={handleChange} required />
            <input name="tcNo" placeholder="TC Kimlik No" onChange={handleChange} required />
            <input name="sifre" type="password" placeholder="Şifre" onChange={handleChange} required />
            <input name="yas" placeholder="Yaş" type="number" onChange={handleChange} required />
            <input name="kilo" placeholder="Kilo (kg)" type="number" step="0.1"onChange={handleChange} required />
            <input name="boy" placeholder="Boy (cm)" type="number" onChange={handleChange} required />
            <input name="suTuketimi" placeholder="Günlük Su (litre)" type="number" step="0.1" onChange={handleChange} required />
            <input name="saglikDurumu" placeholder="Hastalığınız yoksa '-' yazınız" onChange={handleChange} required />

            <select name="fizikselAktivite" onChange={handleChange} required>
              <option value="">Fiziksel Aktivite</option>
              <option value="Az Aktif">Az Aktif</option>
              <option value="Orta Aktif">Orta Aktif</option>
              <option value="Çok Aktif">Çok Aktif</option>
            </select>

            <select name="cinsiyet" onChange={handleChange} required>
              <option value="">Cinsiyet</option>
              <option value="KADIN">Kadın</option>
              <option value="ERKEK">Erkek</option>
              <option value="BELIRTMEK ISTEMIYORUM">Belirtmek İstemiyorum</option>
            </select>
            <select name="diyetisyenId" onChange={handleChange} required>
  <option value="">Diyetisyen Seçiniz</option>
  {diyetisyenler.map((d) => (
    <option key={d.id} value={String(d.id)}>
      {d.ad} {d.soyad}
    </option>
  ))}
</select>


            



            <button type="submit">Kayıt Ol</button>
            <p className="uye-giris-link">
  Zaten hesabın var mı?{" "}
  <span className="giris-link-metni" onClick={() => navigate("/hasta")}>
    Giriş Yap
  </span>
</p>
          </form>
        </div>
      </div>
    </>
  );
};

export default UyeOl;
