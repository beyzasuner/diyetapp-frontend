import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/HastaSayfa.css";
import { fetchMakrolar } from "../utils/nutritionix";


const HastaSayfa = () => {
  const navigate = useNavigate();
  const bugun = new Date().toLocaleDateString("tr-TR");
  const scrollRef = useRef(null);

  const [formData, setFormData] = useState({
    sabah: "",
    ogle: "",
    aksam: "",
    diger: "",
    suTuketimi: ""
  });

  const [toplamKalori, setToplamKalori] = useState(null);
  const [hasta, setHasta] = useState(null);
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState([]);
  const [isKaydedildi, setIsKaydedildi] = useState(false); // ✅ yeni state
  const [makroVerileri, setMakroVerileri] = useState(null);


  useEffect(() => {
  const token = localStorage.getItem("token");
  const tarih = new Date().toISOString().split("T")[0];

  // hasta bilgisi çek
  axios.get("http://localhost:8080/api/hastalar/me", {
    headers: { Authorization: `Bearer ${token}` }
  })
  .then((res) => setHasta(res.data))
  .catch((err) => console.error("Hasta bilgisi alınamadı", err));

  // bugünkü öğün kontrolü
  axios.get(`http://localhost:8080/api/ogunler/me/${tarih}`, {
    headers: { Authorization: `Bearer ${token}` }
  })
  .then((res) => {
    if (res.data && res.data.length > 0) {
      setIsKaydedildi(true); // ✅ bugün için zaten kayıt var
    }
  })
  .catch((err) => console.error("Bugünkü öğün kontrolü başarısız", err));
}, []);
useEffect(() => {
  const fullQuery = `${formData.sabah} ${formData.ogle} ${formData.aksam} ${formData.diger}`;
  console.log("🧾 Formdan alınan tüm öğünler:", fullQuery);

  if (fullQuery.trim().length > 10) {
    console.log("📡 Nutritionix API'ye istek gönderiliyor...");
    fetchMakrolar(fullQuery).then((makro) => {
      if (makro) {
        console.log("✅ API'den gelen makro verisi:", makro);
        setMakroVerileri(makro);
        localStorage.setItem("makroVerisi", JSON.stringify(makro));
        console.log("💾 localStorage'a kaydedildi:", makro);
      } else {
        console.warn("⚠️ Nutritionix makro verisi boş geldi.");
      }
    }).catch((err) => {
      console.error("❌ Nutritionix API hatası:", err);
    });
  } else {
    console.log("⛔ Öğün verisi çok kısa, Nutritionix çağrılmadı.");
  }

  console.log("🧾 Anlık formData:", formData);
}, [formData]);



  const handleChange = (e, alan) => {
    setFormData({ ...formData, [alan]: e.target.value });
  };

  const translateWithGoogle = async (text) => {
    const apiKey = "AIzaSyBnOGuyw52U-ZR6RbRN5woIfFd1IofmC2k";
    const response = await fetch(
      `https://translation.googleapis.com/language/translate/v2?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ q: text, source: "tr", target: "en", format: "text" })
      }
    );
    const data = await response.json();
    return data.data.translations[0].translatedText;
  };

  const queryNutritionix = async (foodText) => {
  const response = await fetch(
    "https://trackapi.nutritionix.com/v2/natural/nutrients",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-app-id": "375c5757",
        "x-app-key": "296e1dab255d60859869b13239c2414a"
      },
      body: JSON.stringify({ query: foodText })
    }
  );

  const data = await response.json();
  console.log("📦 Nutritionix cevabı:", data);

  const foods = data.foods || [];

  let makrolar = {
    karbonhidrat: 0,
    protein: 0,
    yag: 0,
    kalori: 0,
  };

  foods.forEach((f) => {
    makrolar.karbonhidrat += f.nf_total_carbohydrate || 0;
    makrolar.protein += f.nf_protein || 0;
    makrolar.yag += f.nf_total_fat || 0;
    makrolar.kalori += f.nf_calories || 0;
  });

  console.log("🥗 Toplam makrolar:", makrolar);
  localStorage.setItem("makroVerisi", JSON.stringify(makrolar)); // ✅ buradan rapora yaz
  return foods;
};


  const hesaplaToplamKalori = (foods) => {
    return foods.reduce((total, item) => total + item.nf_calories, 0);
  };

  const handleSubmit = async () => {
  const tarih = new Date().toISOString().split("T")[0];
  const token = localStorage.getItem("token");

  setIsKaydedildi(false); // reset

  const ogunListesi = [
    { alan: "sabah", ogunTuru: "SABAH", ogunAdi: "Kahvaltı", ogunAdiIngilizce: "Breakfast" },
    { alan: "ogle", ogunTuru: "ÖĞLE", ogunAdi: "Öğle Yemeği", ogunAdiIngilizce: "Lunch" },
    { alan: "aksam", ogunTuru: "AKŞAM", ogunAdi: "Akşam Yemeği", ogunAdiIngilizce: "Dinner" },
    { alan: "diger", ogunTuru: "DİĞER", ogunAdi: "Ara Öğün", ogunAdiIngilizce: "Snack" },
    { alan: "suTuketimi", ogunTuru: "SU", ogunAdi: "Su Tüketimi", ogunAdiIngilizce: "Water" }
  ];

  try {
    let toplam = 0;
    for (const ogun of ogunListesi) {
      const icerik = formData[ogun.alan];
      if (!icerik) continue;

      if (ogun.ogunTuru === "SU") {
        // Su için kalori ve makro gönderme, sadece 0 olarak kayıt et
        await axios.post("http://localhost:8080/api/ogunler", {
          ogunTuru: ogun.ogunTuru,
          ogunAdi: ogun.ogunAdi,
          ogunAdiIngilizce: ogun.ogunAdiIngilizce,
          yemekDetayi: `${icerik} litre`,
          kaloriMiktari: 0.0,
          porsiyonMiktari: 1.0,
          tarih: tarih,
          karbonhidratMiktari: 0.0,
          proteinMiktari: 0.0,
          yagMiktari: 0.0
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });
        continue;
      }

      // Diğer öğünler için
      const ingilizce = await translateWithGoogle(icerik);
      const besinler = await queryNutritionix(ingilizce);
      const kalori = hesaplaToplamKalori(besinler);
      toplam += kalori;

      const makrolar = await fetchMakrolar(ingilizce);

      if (!makrolar) {
        alert("Makro verisi alınamadı. Kayıt iptal edildi.");
        return;
      }

      await axios.post("http://localhost:8080/api/ogunler", {
        ogunTuru: ogun.ogunTuru,
        ogunAdi: ogun.ogunAdi,
        ogunAdiIngilizce: ogun.ogunAdiIngilizce,
        yemekDetayi: icerik,
        kaloriMiktari: kalori,
        porsiyonMiktari: 1.0,
        tarih: tarih,
        karbonhidratMiktari: makrolar.karbonhidrat,
        proteinMiktari: makrolar.protein,
        yagMiktari: makrolar.yag
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
    }

    setToplamKalori(toplam.toFixed(2));
    setIsKaydedildi(true);
    setTimeout(() => setIsKaydedildi(false), 3600000);
    alert("Tüm öğünler başarıyla kaydedildi!");
  } catch (err) {
    console.error(err);
    alert("Kayıt sırasında hata oluştu.");
  }
};

  const gptChat = async () => {
    const userMsg = { sender: "user", text: chatInput };
    setChatMessages((prev) => [...prev, userMsg]);
    setChatInput("");

    try {
      const response = await fetch("http://localhost:8080/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ soru: userMsg.text })
      });

      const data = await response.json();
      const botMsg = { sender: "bot", text: data.cevap };
      setChatMessages((prev) => [...prev, botMsg]);

      setTimeout(() => {
        scrollRef.current?.scrollTo(0, scrollRef.current.scrollHeight);
      }, 100);
    } catch {
      setChatMessages((prev) => [
        ...prev,
        { sender: "bot", text: "❌ Chatbot şu anda yanıt veremiyor." }
      ]);
    }
  };

  return (
    <div className="hasta-panel">
      <div className="sol-panel">
        <div className="tarih-header">{bugun}</div>
        <div className="profil-kart">
          <img src="/people.png" alt="Logo" className="profil-icon" />
          {hasta ? (
            <ul>
              <li>{hasta.ad} {hasta.soyad}</li>
              <li>{hasta.cinsiyet}</li>
              <li>{hasta.yas} yaş</li>
              <li>{hasta.boy} cm</li>
              <li>{hasta.kilo} kg</li>
              <li>VKİ: {hasta.vki}</li>
              <li>{hasta.hastalik}</li>
            </ul>
          ) : (
            <p>Yükleniyor...</p>
          )}
        </div>
        <button className="rapor-btn" onClick={() => navigate(`/rapor`)}>📝 RAPORLARIM</button>
      </div>

      <div className="orta-panel">
        <div className="ogun-blok">
          {[
            { key: "sabah", label: "SABAH" },
            { key: "ogle", label: "ÖĞLE" },
            { key: "aksam", label: "AKŞAM" },
            { key: "diger", label: "DİĞER" },
            { key: "suTuketimi", label: "SU TÜKETİMİ (Litre)" }
          ].map(({ key, label }) => (
            <div className="ogun-satir" key={key}>
              <div className="ogun-baslik">{label}</div>
              <textarea
                className="ogun-kutu"
                placeholder={label === "SU TÜKETİMİ (Litre)" ? "örn: 2.5" : "Yediklerinizi yazın..."}
                value={formData[key]}
                onChange={(e) => handleChange(e, key)}
              />
            </div>
          ))}
        </div>
        <br />

       <div className="buton-kapsayici">
  <button
    className="rapor-btn"
    onClick={handleSubmit}
    disabled={isKaydedildi}
  >
    {isKaydedildi ? "✔️ Kaydedildi" : "Kaydet"}
  </button>
</div>




        {toplamKalori && (
          <div className="kalori-sonuc">
            🔥 Bugünkü toplam kalori: <strong>{toplamKalori} kcal</strong>
          </div>
        )}

        <div className="chatbot-container">
          <h3>💬 Yapay Zeka Asistan</h3>
          <div className="chat-history" ref={scrollRef}>
            {chatMessages.map((msg, i) => (
              <div key={i} className={`chat-bubble ${msg.sender}`}>
                {msg.text}
              </div>
            ))}
          </div>
          <div className="chat-input-blok">
            <textarea
              className="chat-input"
              placeholder="Chatbot'a bir soru sor..."
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
            />
            <button className="chat-button" onClick={gptChat}>Sor</button>
          </div>
        </div>

        <div className="logout-btn" onClick={() => navigate("/")}>🔓</div>
      </div>
    </div>
  );
};

export default HastaSayfa;
