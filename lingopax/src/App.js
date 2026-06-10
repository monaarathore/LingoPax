import React, { useState } from 'react';
import './App.css';
import Dashboard from './tabs/Dashboard'; 
import Workspace from './tabs/Workspace'; 
import Sandbox from './tabs/Sandbox';
import MirrorLab from './tabs/MirrorLab';
import { FiHome, FiMic, FiCompass, FiVideo, FiUser, FiLogOut } from 'react-icons/fi';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './LandingPage';
import Login from './Login';
import Signup from './Signup';

// 🔒 SECURITY GUARD LAYER
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/" replace />;
  }
  return children;
};

const MainDashboardLayout = () => {
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  const activeLocalUser = JSON.parse(localStorage.getItem('user')) || { name: 'Mona', email: 'mona@lingopax.com' };

  // ⚡ FIXED: State mapping functions sync dynamically to render clean dashboard hooks
  const renderCurrentTab = () => {
    switch(activeTab) {
      case 'Dashboard': return <Dashboard setActiveTab={setActiveTab} />;
      case 'Workspace': return <Workspace />;
      case 'Sandbox': return <Sandbox />;
      case 'MirrorLab': return <MirrorLab />;
      default: return <Dashboard setActiveTab={setActiveTab} />;
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/';
  };

  return (
    <div className="dashboard-root-container">
      
      <header className="global-top-navbar" style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0 32px',
        background: 'rgba(255, 255, 255, 0.02)', /* Translucent Velvet Glass Overlay */
        backdropFilter: 'blur(20px)',
        webkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(244, 239, 230, 0.06)',
        position: 'relative',
        zIndex: 99999 
      }}>
        {/* 🌟 FIXED: EXACT LOGO ROUTING INTERACTIVITY TRIGGER */}
        <div 
          className="top-logo-group" 
          onClick={() => window.location.href = '/'} 
          style={{ cursor: 'pointer' }}
          title="Go to Landing Page"
        >
          <span className="global-logo-text">
            Lingo<span style={{ color: 'var(--accent-orange)' }}>Pax</span>
          </span>
        </div>
        
        {/* PROFILE CONTROL CONTAINER */}
        <div className="top-actions-group" style={{ position: 'relative' }}>
          
          {/* Elegant Circular Minimal User Trigger */}
          <div 
            className="global-profile-avatar"
            onClick={() => setProfileMenuOpen(!profileMenuOpen)}
            style={{ 
              background: 'rgba(255, 255, 255, 0.03)',
              border: profileMenuOpen ? '1px solid var(--accent-orange)' : '1px solid var(--border)',
              padding: '8px', 
              borderRadius: '50%', 
              color: '#F4EFE6',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.25s ease',
              boxShadow: profileMenuOpen ? '0 0 15px rgba(199, 98, 42, 0.25)' : 'none'
            }}
          >
            <FiUser size={18} />
          </div>

          {/* 🖤 NEW LAYER: LUXURY CHROME LOGOUT DROPDOWN (NO MORE WHITE BOX) */}
          {profileMenuOpen && (
            <div 
              className="profile-dropdown-glass-panel"
              style={{
                position: 'absolute',
                top: '55px',
                right: '0',
                background: '#0D0D0B', /* Deep Velvet Charcoal Base */
                border: '1px solid var(--border)',
                borderRadius: '16px',
                width: '240px',
                padding: '20px',
                boxShadow: '0 20px 40px rgba(0, 0, 0, 0.7)',
                zIndex: 100000,
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
                animation: 'smoothTabFadeIn 0.25s ease'
              }}
            >
              <div className="user-meta-info-block" style={{ borderBottom: '1px solid var(--border)', paddingBottom: '12px', textAlign: 'left' }}>
                <h4 style={{ margin: '0 0 4px 0', fontSize: '0.95rem', fontWeight: '600', color: '#FFFFFF' }}>
                  {activeLocalUser.name}
                </h4>
                <p style={{ margin: '0', fontSize: '0.8rem', color: 'var(--text-dim)', wordBreak: 'break-all', fontWeight: '300' }}>
                  {activeLocalUser.email}
                </p>
              </div>

              <button 
                onClick={handleLogout}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                  width: '100%',
                  background: 'rgba(255, 255, 255, 0.03)',
                  color: '#FFFFFF',
                  border: '1px solid var(--border)',
                  padding: '12px 14px',
                  borderRadius: '30px',
                  fontWeight: '600',
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  transition: 'all 0.25s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--accent-orange)';
                  e.currentTarget.style.borderColor = 'var(--accent-orange)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.03)';
                  e.currentTarget.style.borderColor = 'var(--border)';
                }}
              >
                <FiLogOut size={15} /> Sign Out Session
              </button>
            </div>
          )}

        </div>
      </header>

      <div className="hero-workspace-layout">
        
        {/* ─── SIDEBAR NAVIGATION FRAME (INTEGRATED WITH TRANS-ALPHA) ─── */}
        <aside className={`premium-left-sidebar ${sidebarOpen ? 'open' : 'collapsed'}`}>
          <button 
            className={`modern-square-toggle ${sidebarOpen ? 'sidebar-is-open' : 'sidebar-is-collapsed'}`} 
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <div className="sliding-indicator-line"></div>
          </button>
          
          <nav className="nav-icons-stack">
            <div className={`nav-link-custom ${activeTab === 'Dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('Dashboard')}>
              <FiHome /> {sidebarOpen && <span className="sidebar-link-text">Dashboard</span>}
            </div>
            <div className={`nav-link-custom ${activeTab === 'Workspace' ? 'active' : ''}`} onClick={() => setActiveTab('Workspace')}>
              <FiMic /> {sidebarOpen && <span className="sidebar-link-text">AI Talk Space</span>}
            </div>
            <div className={`nav-link-custom ${activeTab === 'Sandbox' ? 'active' : ''}`} onClick={() => setActiveTab('Sandbox')}>
              <FiCompass /> {sidebarOpen && <span className="sidebar-link-text">Sandbox</span>}
            </div>
            <div className={`nav-link-custom ${activeTab === 'MirrorLab' ? 'active' : ''}`} onClick={() => setActiveTab('MirrorLab')}>
              <FiVideo /> {sidebarOpen && <span className="sidebar-link-text">Mirror Lab</span>}
            </div>
          </nav>
        </aside>

        {/* VIEWPORT CONTROLLER LAYOUT BOX */}
        <main className="main-viewport-content">
          <div className="tab-core-render-box" key={activeTab}>
            {renderCurrentTab()}
          </div>
        </main>

      </div>
    </div>
  );
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <MainDashboardLayout />
            </ProtectedRoute>
          } 
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;