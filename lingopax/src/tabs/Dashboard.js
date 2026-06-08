import React, { useState, useEffect } from 'react';
import { FiCheckCircle, FiLock, FiSearch } from 'react-icons/fi';
import axios from 'axios'; 

const Workspace = () => {
  const [selectedLang, setSelectedLang] = useState('Japanese');
  const [searchQuery, setSearchQuery] = useState('');
  const [userName, setUserName] = useState('Explorer'); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboardLiveSpecs = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5000/api/auth/dashboard-data', {
          headers: { 'x-auth-token': token }
        });
        
        if (res.data && res.data.name) {
          setUserName(res.data.name);
        }
        setLoading(false);
      } catch (err) {
        console.error("Auth sync barrier hit:", err);
        setError('Backup mesh layout active.');
        setLoading(false);
      }
    };

    fetchDashboardLiveSpecs();
  }, []);

  const languages = [
    { name: 'Japanese', native: '日本語', flag: '🇯🇵', badge: 'High Demand' },
    { name: 'English', native: 'Global', flag: '🇺🇸', badge: 'Essential' },
    { name: 'German', native: 'Deutsch', flag: '🇩🇪', badge: 'Top Rates' },
    { name: 'French', native: 'Français', flag: '🇫🇷', badge: 'Creative Niche' },
    { name: 'Korean', native: '한국어', flag: '🇰🇷', badge: 'Media/K-Pop' },
    { name: 'Mandarin', native: '中文', flag: '🇨🇳', badge: 'E-Commerce' },
    { name: 'Spanish', native: 'Español', flag: '🇪🇸', badge: 'Localization' },
  ];

  const getSimulatedDate = (index) => {
    const baseDate = new Date(2026, 4, 1);
    baseDate.setDate(baseDate.getDate() + index);
    return `Date: ${baseDate.getDate()} ${baseDate.toLocaleString('default', { month: 'short' })} ${baseDate.getFullYear()}`;
  };

  const filteredLanguages = languages.filter(lang => 
    lang.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh', color: '#F4EFE6' }}>
        <div style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '1rem', letterSpacing: '0.05em', opacity: 0.6 }}>
          SYNCHRONIZING WORKSPACE CONTENT...
        </div>
      </div>
    );
  }

  return (
    <div style={{
      background: 'transparent', /* ⚡ FIXED: Parent base ke sath auto blend hoga */
      width: '100%',
      color: '#F4EFE6',
      fontFamily: 'Plus Jakarta Sans, sans-serif',
      padding: '20px 10px',
      display: 'grid',
      /* ⚡ RESPONSIVE FLUID GRID: Sidebar active hone par auto adjust hoga */
      gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
      gap: '25px',
      boxSizing: 'border-box'
    }}>
      
      {/* ─── LEFT COLUMN STACK: ROADMAP & METRICS ─── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '25px', width: '100%' }}>
        
        {/* PERSONAL GREETING HEADER */}
        <header style={{ marginBottom: '5px' }}>
          <h1 style={{ 
            fontFamily: 'Playfair Display, serif', 
            fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', 
            fontWeight: '700', 
            color: '#FFFFFF', 
            letterSpacing: '-0.01em' 
          }}>
            Good morning, <span style={{ color: '#F4EFE6' }}>{userName}</span>.
          </h1>
          {error && <p style={{ color: '#C7622A', fontSize: '0.8rem', marginTop: '4px' }}>{error}</p>}
        </header>

        {/* 1. MICRO-IMMERSION ROADMAP CARD */}
        <div style={{ background: '#0D0D0B', border: '1px solid rgba(244,239,230,0.06)', borderRadius: '20px', padding: '1.8rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '15px', marginBottom: '25px' }}>
            <div>
              <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.35rem', fontWeight: '600', marginBottom: '4px' }}>Micro-Immersion Roadmap</h3>
              <p style={{ color: '#A89F91', fontSize: '0.85rem', fontWeight: '300' }}>Custom patterns optimized for Web Dev in {selectedLang}</p>
            </div>
            <span style={{ fontSize: '0.75rem', background: 'rgba(244,239,230,0.05)', color: '#F4EFE6', padding: '0.3rem 0.8rem', borderRadius: '30px', border: '1px solid rgba(244,239,230,0.08)' }}>Steady Pace</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Node 1 */}
            <div style={{ display: 'flex', gap: '15px' }}>
              <div style={{ color: '#C7622A', fontSize: '1.1rem', marginTop: '2px' }}><FiCheckCircle /></div>
              <div>
                <h4 style={{ fontSize: '0.98rem', fontWeight: '600', marginBottom: '4px' }}>Phase 1: Phonetic Sound Mimicry & Greetings</h4>
                <p style={{ color: '#A89F91', fontSize: '0.85rem', lineHeight: '1.4' }}>Learn basic client onboarding sounds without complex alphabets.</p>
              </div>
            </div>

            {/* Node 2 */}
            <div style={{ display: 'flex', gap: '15px' }}>
              <div style={{ width: '8px', height: '8px', background: '#C7622A', borderRadius: '50%', margin: '6px 4px 0', boxShadow: '0 0 10px #C7622A' }}></div>
              <div>
                <h4 style={{ fontSize: '0.98rem', fontWeight: '600', marginBottom: '4px', color: '#FFFFFF' }}>Phase 2: Budget & Requirement Negotiation</h4>
                <p style={{ color: '#A89F91', fontSize: '0.85rem', lineHeight: '1.4' }}>Target Phase: Match 20 repeating core business conversation chunks.</p>
              </div>
            </div>

            {/* Node 3 */}
            <div style={{ display: 'flex', gap: '15px', opacity: 0.35 }}>
              <div style={{ color: '#A89F91', fontSize: '1rem', marginTop: '2px' }}><FiLock /></div>
              <div>
                <h4 style={{ fontSize: '0.98rem', fontWeight: '500', marginBottom: '4px' }}>Phase 3: Work Handover & Milestone Reviews</h4>
                <p style={{ color: '#A89F91', fontSize: '0.85rem' }}>Unlock via Client Sandbox simulations completion.</p>
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM MATRIX PANEL SPLIT */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px', width: '100%' }}>
          
          {/* 2. ACTIVITY COMPACT HUB */}
          <div style={{ background: '#0D0D0B', border: '1px solid rgba(244,239,230,0.06)', borderRadius: '20px', padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' }}>
              <div>
                <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.2rem', fontWeight: '600' }}>Activity Hub</h3>
                <p style={{ color: '#A89F91', fontSize: '0.8rem' }}>Metrics summary grids.</p>
              </div>
              <span style={{ color: '#C7622A', fontSize: '0.85rem', fontWeight: '500' }}>Crushed 30!</span>
            </div>

            {/* FLUID ACTIVITY GRID - NEVER CRASHES OR SQUISHES */}
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fill, minmax(16px, 1fr))', 
              gap: '5px', 
              background: 'rgba(255,255,255,0.01)', 
              padding: '12px', 
              borderRadius: '10px', 
              border: '1px solid rgba(244,239,230,0.03)',
              width: '100%'
            }}>
              {Array.from({ length: 42 }).map((_, i) => {
                let bg = '#252525';
                if (i % 5 === 0) bg = '#FFA07A';
                else if (i % 7 === 0) bg = '#E9967A';
                else if (i % 3 === 0) bg = '#CD5C5C';
                else if (i % 11 === 0) bg = '#C7622A';
                
                return (
                  <div 
                    key={i} 
                    style={{ aspectRatio: '1/1', background: bg, borderRadius: '3px', cursor: 'pointer' }}
                    title={getSimulatedDate(i)}
                  ></div>
                );
              })}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.7rem', color: '#A89F91', marginTop: '12px' }}>
              <span>Less</span>
              <div style={{ display: 'flex', gap: '3px' }}>
                <div style={{ width: '8px', height: '8px', background: '#252525', borderRadius: '1px' }}></div>
                <div style={{ width: '8px', height: '8px', background: '#C7622A', borderRadius: '1px' }}></div>
              </div>
              <span>More</span>
            </div>
          </div>

          {/* 3. GROWTH METRICS PANEL */}
          <div style={{ background: '#0D0D0B', border: '1px solid rgba(244,239,230,0.06)', borderRadius: '20px', padding: '1.5rem' }}>
            <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.2rem', fontWeight: '600', marginBottom: '15px' }}>Growth Metrics</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '6px', color: '#A89F91' }}>
                  <span>Vocabulary</span><span style={{ color: '#FFF', fontWeight: '600' }}>84%</span>
                </div>
                <div style={{ width: '100%', height: '2px', background: '#22221C' }}>
                  <div style={{ width: '84%', height: '100%', background: '#F4EFE6' }}></div>
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '6px', color: '#A89F91' }}>
                  <span>Pronunciation</span><span style={{ color: '#FFF', fontWeight: '600' }}>69%</span>
                </div>
                <div style={{ width: '100%', height: '2px', background: '#22221C' }}>
                  <div style={{ width: '69%', height: '100%', background: '#F4EFE6' }}></div>
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '6px', color: '#A89F91' }}>
                  <span>Fluency</span><span style={{ color: '#FFF', fontWeight: '600' }}>92%</span>
                </div>
                <div style={{ width: '100%', height: '2px', background: '#22221C' }}>
                  <div style={{ width: '92%', height: '100%', background: '#F4EFE6' }}></div>
                </div>
              </div>

            </div>
          </div>

        </div> 
      </div>

      {/* ─── RIGHT COLUMN: TARGET LANGUAGE (FLUID FLOATING SIDEBAR PANEL) ─── */}
      <div style={{ 
        background: '#0D0D0B', 
        border: '1px solid rgba(244,239,230,0.06)', 
        borderRadius: '20px', 
        padding: '1.5rem 1.2rem',
        display: 'flex',
        flexDirection: 'column',
        maxHeight: '85vh',
        boxSizing: 'border-box',
        width: '100%'
      }}>
        <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.25rem', fontWeight: '600', marginBottom: '14px' }}>Target Language</h3>
        
        {/* SEARCH BAR CARD LAYOUT */}
        <div style={{ position: 'relative', marginBottom: '15px' }}>
          <FiSearch style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#A89F91' }} />
          <input 
            type="text" 
            placeholder="Search language..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%', padding: '10px 10px 10px 36px', background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(244,239,230,0.06)', borderRadius: '12px', color: '#F4EFE6',
              fontSize: '0.85rem', outline: 'none', boxSizing: 'border-box'
            }}
          />
        </div>

        {/* SCROLLABLE PILLAR LIST */}
        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px', paddingRight: '2px' }}>
          {filteredLanguages.map((lang) => {
            const isSelected = selectedLang === lang.name;
            return (
              <div 
                key={lang.name}
                onClick={() => setSelectedLang(lang.name)}
                style={{
                  background: isSelected ? 'rgba(199, 98, 42, 0.08)' : 'rgba(255,255,255,0.01)',
                  border: isSelected ? '1px solid #C7622A' : '1px solid rgba(244,239,230,0.03)',
                  borderRadius: '12px', padding: '12px', display: 'flex', justifyContent: 'space-between',
                  alignItems: 'center', cursor: 'pointer', transition: 'all 0.2s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '1.3rem' }}>{lang.flag}</span>
                  <div>
                    <div style={{ fontSize: '0.88rem', fontWeight: '600', color: isSelected ? '#FFFFFF' : '#F4EFE6' }}>{lang.name}</div>
                    <div style={{ fontSize: '0.75rem', color: '#A89F91', marginTop: '1px' }}>{lang.native}</div>
                  </div>
                </div>
                <span style={{ fontSize: '0.65rem', color: isSelected ? '#FFFFFF' : '#A89F91', background: isSelected ? '#C7622A' : 'rgba(244,239,230,0.04)', padding: '2px 6px', borderRadius: '20px' }}>
                  {lang.badge}
                </span>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};

export default Workspace;