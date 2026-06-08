import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const navigate = useNavigate();
  const rotateSectionRef = useRef(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const heroWords = ["Speak", "every", "language", "with", "absolute", "confidence"];
  const scrollLetters = ["S", "o", ",", " ", "r", "e", "a", "d", "y", " ", "t", "o", " ", "e", "x", "p", "l", "o", "r", "e", "?"];

  useEffect(() => {
    // 🛡️ Direct Browser Window check kyuki scripts index.html se load ho chuki hain
    const gsap = window.gsap;
    const ScrollTrigger = window.ScrollTrigger;

    if (!gsap || !ScrollTrigger) return;
    gsap.registerPlugin(ScrollTrigger);

    // ─── 1. 3D CHARACTER SCROLL ROTATE ANIMATION ───
    const rotateTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: "#rotate-section",
        start: "top top",
        end: "+=100%",
        scrub: 1,
        pin: true,
        invalidateOnRefresh: true
      }
    });

    rotateTimeline.fromTo(".scroll-letter-span", 
      { opacity: 0.1, scale: 0.7, rotateZ: -45, rotateX: 40, y: 30 },
      { opacity: 1, scale: 1, rotateZ: 0, rotateX: 0, y: 0, stagger: 0.1, ease: "power1.out" }
    );

    // ─── 2. 3D PARALLAX TILT CARDS ───
    const cards = document.querySelectorAll('.tilt-card');
    cards.forEach(card => {
      const handleMouseMove = (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const rotateX = ((rect.height / 2) - y) / (rect.height / 2) * 15;
        const rotateY = (x - (rect.width / 2)) / (rect.width / 2) * 15;
        
        gsap.to(card, { rotateX: rotateX, rotateY: rotateY, x: rotateY * 0.4, y: -rotateX * 0.4, duration: 0.3, ease: "power2.out" });
      };

      const handleMouseLeave = () => {
        gsap.to(card, { rotateX: 0, rotateY: 0, x: 0, y: 0, duration: 0.5, ease: "power3.out" });
      };

      card.addEventListener('mousemove', handleMouseMove);
      card.addEventListener('mouseleave', handleMouseLeave);
    });

    return () => {
      const allTriggers = ScrollTrigger.getAll();
      allTriggers.forEach(t => t.kill());
    };
  }, []); // Empty array ka matlab page load hote hi direct trigger hoga!

  return (
    // ... Baki aapka poora safe responsive HTML return structure jo pehle diya tha ...
    <div style={{ backgroundColor: '#0A0A08', color: '#F4EFE6', fontFamily: "'Plus Jakarta Sans', sans-serif", overflowX: 'hidden' }}>
      <style dangerouslySetInnerHTML={{__html: `
        .nav-links a:hover { color: #F4EFE6 !important; }
        .tilt-card { transition: border-color 0.4s ease; transform-style: preserve-3d; }
        .tilt-card:hover { border-color: rgba(244,239,230,0.25) !important; }
        .btn-text-move { display: inline-block; transition: transform 0.5s cubic-bezier(0.25, 1, 0.5, 1); will-change: transform; transform-style: preserve-3d; }
        .landing-nav-btn:hover .btn-text-move { transform: rotateX(360deg); }
        .hover-word-span { display: inline-block; transition: color 0.25s ease, transform 0.25s ease; padding: 0 4px; cursor: default; color: #3E3B34; }
        .hover-word-span:hover { color: #FFFFFF !important; transform: translateY(-2px); text-shadow: 0 4px 15px rgba(255, 255, 255, 0.4); }
        @media (max-width: 968px) {
          .nav-menu-links, .nav-auth-buttons { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
          .responsive-grid-layout { grid-template-columns: 1fr !important; gap: 3rem !important; }
          .mobile-sidebar { display: flex !important; }
        }
      `}} />

      {/* FIXED NAVIGATION DOCK */}
      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.2rem 5%', background: 'rgba(10,10,8,0.85)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(244,239,230,0.08)' }}>
        <div style={{ fontSize: '1.5rem', fontWeight: 700, cursor: 'pointer' }} onClick={() => window.scrollTo({top:0, behavior:'smooth'})}>
          Lingo<span style={{ color: '#C7622A' }}>Pax</span>
        </div>
        <ul className="nav-menu-links" style={{ display: 'flex', gap: '2.5rem', listStyle: 'none', alignItems: 'center', margin: 0, padding: 0 }}>
          <li><a href="#potential" style={{ fontSize: '0.85rem', color: '#A89F91', textDecoration: 'none', fontWeight: 500 }}>Features</a></li>
          <li><a href="#session-feel" style={{ fontSize: '0.85rem', color: '#A89F91', textDecoration: 'none', fontWeight: 500 }}>Try Session</a></li>
          <li><a href="#rotate-section" style={{ fontSize: '0.85rem', color: '#A89F91', textDecoration: 'none', fontWeight: 500 }}>Explore</a></li>
        </ul>
        <div className="nav-auth-buttons" style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          <button onClick={() => navigate('/login')} style={{ background: 'transparent', color: '#F4EFE6', border: 'none', cursor: 'pointer', fontSize: '0.85rem', fontWeight: '500' }}>Login</button>
          <button className="landing-nav-btn" onClick={() => navigate('/signup')} style={{ background: '#F4EFE6', color: '#0A0A08', border: 'none', padding: '0.6rem 1.4rem', borderRadius: '40px', fontWeight: '600', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem', perspective: '1000px', transition: 'all 0.3s' }} onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#C7622A'; e.currentTarget.style.color = '#FFFFFF'; }} onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#F4EFE6'; e.currentTarget.style.color = '#0A0A08'; }}>
            <span className="btn-text-move">Start free →</span>
          </button>
        </div>
        <button className="mobile-menu-btn" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} style={{ display: 'none', flexDirection: 'column', gap: '5px', background: 'transparent', border: 'none', cursor: 'pointer', padding: '5px', zIndex: 110 }}>
          <span style={{ width: '25px', height: '2px', backgroundColor: '#F4EFE6', transition: '0.3s', transform: mobileMenuOpen ? 'rotate(45deg) translate(5px, 5px)' : 'none' }}></span>
          <span style={{ width: '25px', height: '2px', backgroundColor: '#F4EFE6', transition: '0.3s', opacity: mobileMenuOpen ? 0 : 1 }}></span>
          <span style={{ width: '25px', height: '2px', backgroundColor: '#F4EFE6', transition: '0.3s', transform: mobileMenuOpen ? 'rotate(-45deg) translate(5px, -5px)' : 'none' }}></span>
        </button>
      </nav>

      {mobileMenuOpen && (
        <div className="mobile-sidebar" style={{ display: 'none', position: 'fixed', top: 0, right: 0, bottom: 0, width: '280px', backgroundColor: '#131310', zIndex: 99, flexDirection: 'column', padding: '7rem 2rem 2rem', gap: '2rem', borderLeft: '1px solid rgba(244,239,230,0.1)', boxShadow: '-10px 0 30px rgba(0,0,0,0.5)' }}>
          <a href="#potential" onClick={() => setMobileMenuOpen(false)} style={{ color: '#F4EFE6', textDecoration: 'none', fontSize: '1.1rem' }}>Features</a>
          <a href="#session-feel" onClick={() => setMobileMenuOpen(false)} style={{ color: '#F4EFE6', textDecoration: 'none', fontSize: '1.1rem' }}>Try Session</a>
          <a href="#rotate-section" onClick={() => setMobileMenuOpen(false)} style={{ color: '#F4EFE6', textDecoration: 'none', fontSize: '1.1rem' }}>Explore</a>
          <hr style={{ borderColor: 'rgba(244,239,230,0.08)', width: '100%' }} />
          <button onClick={() => { setMobileMenuOpen(false); navigate('/login'); }} style={{ background: 'transparent', color: '#F4EFE6', border: '1px solid rgba(244,239,230,0.3)', padding: '0.8rem', borderRadius: '40px', cursor: 'pointer' }}>Login</button>
          <button onClick={() => { setMobileMenuOpen(false); navigate('/signup'); }} style={{ background: '#F4EFE6', color: '#0A0A08', border: 'none', padding: '0.8rem', borderRadius: '40px', fontWeight: '600', cursor: 'pointer' }}>Start Free</button>
        </div>
      )}

      {/* HERO SECTION */}
      <section style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '8rem 1.5rem 4rem', position: 'relative' }}>
        <h1 id="hero-title" style={{ fontSize: 'clamp(2rem, 6.5vw, 4.5rem)', fontWeight: 700, maxWidth: '950px', marginBottom: '1.5rem', lineHeight: 1.2, letterSpacing: '-0.02em', userSelect: 'none' }}>
          {heroWords.map((word, i) => ( <span key={i} className="hover-word-span">{word}</span> ))}
        </h1>
        <p style={{ color: '#A89F91', maxWidth: '550px', marginBottom: '2.5rem', fontWeight: 300, fontSize: 'clamp(0.95rem, 2.5vw, 1.05rem)', lineHeight: 1.6 }}>
          Practice live immersive staging sessions with smart adaptive AI agents customized around cultural native frameworks.
        </p>
        <div>
          <button className="landing-nav-btn" onClick={() => navigate('/signup')} style={{ background: '#F4EFE6', color: '#0A0A08', border: 'none', padding: '0.9rem 2.2rem', borderRadius: '40px', fontWeight: '700', cursor: 'pointer', fontSize: '0.95rem', perspective: '1000px', transition: 'all 0.3s' }} onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#C7622A'; e.currentTarget.style.color = '#FFFFFF'; }} onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#F4EFE6'; e.currentTarget.style.color = '#0A0A08'; }}>
            <span className="btn-text-move">Begin Journey</span>
          </button>
        </div>
      </section>

      {/* FEATURES MATRIX */}
      <section style={{ padding: '4rem 1.5rem', maxWidth: '1200px', margin: '0 auto' }} id="potential">
        <div className="responsive-grid-layout" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ perspective: '1000px' }}>
              <div className="tilt-card" style={{ background: '#131310', border: '1px solid rgba(244,239,230,0.08)', borderRadius: '24px', padding: '2rem 1.5rem' }}>
                <h3 style={{ fontSize: '1.3rem', marginBottom: '0.8rem', transform: 'translateZ(30px)', color: '#FFFFFF', fontWeight: '600' }}>01 / Feedback Loop</h3>
                <p style={{ fontSize: '0.9rem', color: '#A89F91', lineHeight: 1.6, transform: 'translateZ(15px)', fontWeight: '300' }}>Instant vocabulary tracking adjustments delivered right inside conversational timelines seamlessly.</p>
              </div>
            </div>
            <div style={{ perspective: '1000px' }}>
              <div className="tilt-card" style={{ background: '#131310', border: '1px solid rgba(244,239,230,0.08)', borderRadius: '24px', padding: '2rem 1.5rem' }}>
                <h3 style={{ fontSize: '1.3rem', marginBottom: '0.8rem', transform: 'translateZ(30px)', color: '#FFFFFF', fontWeight: '600' }}>02 / Mirror Analysis</h3>
                <p style={{ fontSize: '0.9rem', color: '#A89F91', lineHeight: 1.6, transform: 'translateZ(15px)', fontWeight: '300' }}>Webcam structural tracking matrix calculates user posture and behavioral metrics instantly.</p>
              </div>
            </div>
            <div style={{ perspective: '1000px' }}>
              <div className="tilt-card" style={{ background: '#131310', border: '1px solid rgba(244,239,230,0.08)', borderRadius: '24px', padding: '2rem 1.5rem' }}>
                <h3 style={{ fontSize: '1.3rem', marginBottom: '0.8rem', transform: 'translateZ(30px)', color: '#FFFFFF', fontWeight: '600' }}>03 / Sandbox Labs</h3>
                <p style={{ fontSize: '0.9rem', color: '#A89F91', lineHeight: 1.6, transform: 'translateZ(15px)', fontWeight: '300' }}>Isolate grammatical expressions or logic segments utilizing dynamic deep AI parser sweeps.</p>
              </div>
            </div>
          </div>

          <div id="session-feel" style={{ width: '100%' }}>
            <h3 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '1.4rem', marginBottom: '1.5rem', textAlign: 'center', fontWeight: '500', color: '#F4EFE6' }}>See How A Session Feels</h3>
            <div style={{ background: '#131310', border: '1px solid rgba(244,239,230,0.08)', borderRadius: '24px', padding: '1.5rem', boxShadow: '0 30px 60px rgba(0,0,0,0.5)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', paddingBottom: '1.2rem', borderBottom: '1px solid rgba(244,239,230,0.08)', marginBottom: '1.5rem' }}>
                <div style={{ width: '38px', height: '38px', background: 'rgba(244,239,230,0.05)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem' }}>🌸</div>
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontWeight: '600', fontSize: '0.9rem' }}>Yuki · Japanese Tutor</div>
                  <div style={{ fontSize: '0.7rem', color: '#10b981', display: 'flex', alignItems: 'center', gap: '5px', marginTop: '2px' }}>
                    <span style={{ width: '6px', height: '6px', background: '#10b981', borderRadius: '50%', display: 'inline-block' }}></span> Active Evaluation
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', marginBottom: '1.2rem' }}>
                <div style={{ maxWidth: '85%', padding: '0.8rem 1.1rem', borderRadius: '16px', fontSize: '0.85rem', background: 'rgba(244,239,230,0.06)', color: '#F4EFE6', borderBottomLeftRadius: '4px', textAlign: 'left', lineHeight: '1.5', fontWeight: '300' }}>
                  こんにちは！ Let's practice greetings today. How would you say "nice to meet you" in Japanese?
                </div>
              </div>
              <div style={{ display: 'flex', marginBottom: '1.2rem', flexDirection: 'row-reverse' }}>
                <div style={{ maxWidth: '85%', padding: '0.8rem 1.1rem', borderRadius: '16px', fontSize: '0.85rem', background: '#F4EFE6', color: '#0A0A08', borderBottomRightRadius: '4px', fontWeight: '500', textAlign: 'left' }}>
                  Hmm... はじめまして?
                </div>
              </div>
              <div style={{ display: 'flex', marginBottom: '1.2rem' }}>
                <div style={{ maxWidth: '85%', padding: '0.8rem 1.1rem', borderRadius: '16px', fontSize: '0.85rem', background: 'rgba(244,239,230,0.06)', color: '#F4EFE6', borderBottomLeftRadius: '4px', textAlign: 'left', fontWeight: '300' }}>
                  完璧！ Perfect! はじめまして is exactly right. 😊
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MARKETING BANNER */}
      <div style={{ maxWidth: '1100px', margin: '3rem auto', padding: '0 1.5rem' }}>
        <div style={{ background: 'linear-gradient(135deg, #131310 0%, #080806 100%)', border: '1px solid rgba(244,239,230,0.08)', borderRadius: '32px', padding: '4rem 1.5rem', textAlign: 'center' }}>
          <h2 style={{ fontSize: 'clamp(1.6rem, 4.5vw, 2.8rem)', fontWeight: 700, color: '#FFFFFF', marginBottom: '1.2rem', letterSpacing: '-0.02em' }}>Your first conversation is free</h2>
          <p style={{ color: '#A89F91', fontSize: '0.95rem', maxWidth: '500px', margin: '0 auto 2rem', lineHeight: 1.6, fontWeight: '300' }}>No credit card. No commitment. Just pick a tutor and start speaking.</p>
          <button onClick={() => navigate('/signup')} style={{ background: '#FFFFFF', color: '#0A0A08', border: 'none', padding: '0.8rem 2rem', borderRadius: '40px', fontSize: '0.95rem', fontWeight: '600', cursor: 'pointer', transition: 'all 0.3s' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#C7622A'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#FFFFFF'}>
            Meet your tutor →
          </button>
        </div>
      </div>

      {/* 3D SCROLL ROTATE VIEWPORT */}
      <section id="rotate-section" ref={rotateSectionRef} style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0E0E0C', padding: '4rem 1rem', position: 'relative', borderTop: '1px solid rgba(244,239,230,0.08)' }}>
        <h2 id="text-rotate-target" style={{ fontSize: 'clamp(1.8rem, 6vw, 4.5rem)', fontWeight: 600, lineHeight: 1.2, letterSpacing: '-0.03em', color: '#F4EFE6', maxWidth: '1100px', display: 'inline-block', perspective: '600px', textAlign: 'center' }}>
          {scrollLetters.map((char, index) => {
            if (char === " ") return <span key={index}>&nbsp;</span>;
            return ( <span key={index} className="scroll-letter-span" style={{ display: 'inline-block', transformOrigin: 'center center', willChange: 'transform, opacity' }}> {char} </span> );
          })}
        </h2>
      </section>

      {/* FOOTER */}
      <footer style={{ textAlign: 'center', padding: '2.5rem 1.5rem', fontSize: '0.8rem', color: '#3E3B34', borderTop: '1px solid rgba(244,239,230,0.08)', background: '#060605' }}>
        © 2026 LingoPax · Language is culture, culture is connection.
      </footer>
    </div>
  );
};

export default LandingPage;