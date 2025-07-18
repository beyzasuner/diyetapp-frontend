import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import HastaGiris from './pages/HastaGiris';
import DiyetisyenGiris from './pages/DiyetisyenGiris';
import UyeOl from './pages/UyeOl';
import HastaSayfa from './pages/HastaSayfa';
import DiyetisyenSayfa from './pages/DiyetisyenSayfa';
import Rapor from "./pages/Rapor";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/hasta" element={<HastaGiris />} />
        <Route path="/diyetisyen" element={<DiyetisyenGiris />}/>
        <Route path="/hasta/uyeOl" element={<UyeOl />} />
        <Route path="/hasta/hastaSayfa" element={<HastaSayfa />}/>
        <Route path="/diyetisyen/diyetisyenSayfa" element={<DiyetisyenSayfa/>}/>
        <Route path="/rapor" element={<Rapor />} />
        <Route path="/rapor/:id" element={<Rapor />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
