import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Home.css'; 

const Home = () => {
  const navigate = useNavigate();
  

  return (
    <>
    <video autoPlay muted loop className="background-video">
      <source src="/background.mp4" type="video/mp4" />
    </video>


    <div className="home-container fade-in">
       <div className="home-header">
        <img src="/logo.png" alt="Logo" className="home-logo" />
        <div className="home-title-text">
          <h1 className="home-title">Diyetisyen-Hasta<br />Takip Sistemi</h1>
        </div>
      </div>
      <div className="button-container">
  <button className="home-button" onClick={() => navigate('/hasta')}><img src="/user.png" alt="Hasta" className="button-icon" />HASTA GİRİŞİ</button>
  <button className="home-button" onClick={() => navigate('/diyetisyen')}> <img src="/doctor.png" alt="Diyetisyen" className="button-icon" />DİYETİSYEN GİRİŞİ</button>
</div>

    </div>

    </>
  );
};

export default Home;
