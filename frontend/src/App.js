import React, { useState } from 'react';
const API = process.env.REACT_APP_API || 'http://localhost:4000';
export default function App() {
  const [support, setSupport] = useState(null);
  async function getSupport() {
    try {
      const r = await fetch(API + '/support');
      const j = await r.json();
      setSupport(j);
    } catch (e) {
      alert('Cannot reach backend: ' + e.message);
    }
  }
  return (
    <div className='app'>
      <header className='header'><h1>SkillArena</h1></header>
      <main>
        <p>Welcome to SkillArena. Default wallet currency is ₦ (Naira).</p>
        <button className='btn' onClick={getSupport}>Contact & Support</button>
        {support && <div className='card'><p>WhatsApp: {support.whatsapp}</p><p>Call: {support.call}</p><p>Email: {support.email}</p></div>}
      </main>
      <footer>Support: WhatsApp +2347011695248 | Call +2347053070533 | Email kennygalubeze@gmail.com</footer>
    </div>
  );
}
