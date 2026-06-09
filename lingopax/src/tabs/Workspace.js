import React, { useState, useRef } from 'react';
import { FiSend, FiSliders, FiBriefcase, FiPhoneOff } from 'react-icons/fi';
import styled from 'styled-components';
import axios from 'axios'; 

const Workspace = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [conversationActive, setConversationActive] = useState(false);
  const [messages, setMessages] = useState([
    { sender: 'ai', text: "Hello! Persona configured. I'm ready to analyze your voice lines." }
  ]);
  const [input, setInput] = useState('');
  const [activeBehaviour, setActiveBehaviour] = useState('Strict Client');
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);
  const [aiLoading, setAiLoading] = useState(false); 

  const [orbScale, setOrbScale] = useState(1);
  const [orbSpeed, setOrbSpeed] = useState(1);

  const [targetRole, setTargetRole] = useState('MERN Stack Developer');
  const [techStack, setTechStack] = useState('React, Node.js, JWT, MongoDB');

  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const streamRef = useRef(null);
  const animationRef = useRef(null);
  const recognitionRef = useRef(null); 
  const isAiSpeakingRef = useRef(false); 

  const agentBehaviours = [
    { id: 'Strict Client', name: 'Strict Tech Client', desc: 'Fast-paced, highly critical of bugs.' },
    { id: 'Tech Buddy', name: 'Casual Tech Buddy', desc: 'Relaxed tone, developer-friendly slangs.' },
    { id: 'Job Interviewer', name: 'Technical Interview Panel', desc: 'Custom mock loops tracking tailored tech targets.' },
  ];

  const speakLocalText = (textToSpeak) => {
    if (!window.speechSynthesis) return;
    
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch(e){}
    }

    window.speechSynthesis.cancel(); 
    isAiSpeakingRef.current = true;

    const cleanText = textToSpeak.replace(/[#*]/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    
    const voices = window.speechSynthesis.getVoices();
    const englishVoice = voices.find(v => v.lang.startsWith('en-')) || voices[0];
    if (englishVoice) utterance.voice = englishVoice;
    
    utterance.rate = 0.95; 

    utterance.onstart = () => {
      setOrbScale(1.15);
      setOrbSpeed(2.2);
    };
    utterance.onend = () => {
      setOrbScale(1);
      setOrbSpeed(1);
      isAiSpeakingRef.current = false;
      
      // Wake mic back up safely if call is still active
      if (isRecording && recognitionRef.current) {
        setTimeout(() => {
          if (!isAiSpeakingRef.current) {
            try { recognitionRef.current.start(); } catch(e){}
          }
        }, 400); 
      }
    };

    window.speechSynthesis.speak(utterance);
  };

  const startLiveVoiceSession = async () => {
    setConversationActive(true);
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      audioContextRef.current = audioCtx;
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 32;
      analyserRef.current = analyser;
      const source = audioCtx.createMediaStreamSource(stream);
      source.connect(analyser);
      setIsRecording(true);
      trackAudioVolume();
    } catch (err) {
      console.error("Microphone tracking blocked:", err);
    }

    const introductionGreeting = "Hello! Welcome to LingoPax AI Workspace. I am your personal growth coach. Before we begin, please guide me on our target direction for today: Would you like to practice Language Learning, or proceed with customized Mock Interview Preparation?";
    
    const initialMsgs = [{ sender: 'ai', text: introductionGreeting }];
    setMessages(initialMsgs);
    speakLocalText(introductionGreeting);

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onresult = async (event) => {
        const userSpeechResult = event.results[0][0].transcript;
        if (!userSpeechResult.trim()) return;
        
        // Pass current messages context directly to helper thread
        dispatchVoiceDataToAI(userSpeechResult, initialMsgs);
      };

      recognition.onend = () => {
        if (!isAiSpeakingRef.current && isRecording) {
          setTimeout(() => {
            try { recognition.start(); } catch(e){}
          }, 300);
        }
      };

      recognitionRef.current = recognition;
    }
  };

  // 🟢 FIXED: Now accepts context explicitly to bypass state racing
  const dispatchVoiceDataToAI = async (textPayload, currentMessagesSnapshot) => {
    if (!textPayload.trim()) return;
    
    const activeHistory = currentMessagesSnapshot || messages;
    const updatedMsgs = [...activeHistory, { sender: 'user', text: textPayload }];
    
    setMessages(updatedMsgs);
    setAiLoading(true);

    try {
      const token = localStorage.getItem('token');
      
      // 🟢 CLEAN CORRECTION: Sending raw simplified objects to prevent backend structure mismatch
      const simpleHistory = updatedMsgs.map(msg => ({
        role: msg.sender === 'user' ? 'user' : 'model',
        text: msg.text
      }));

      const payload = { 
        message: textPayload, 
        behaviour: activeBehaviour,
        history: simpleHistory, // Send pure clean format
        targetRole: targetRole,
        techStack: techStack
      };

      const res = await axios.post('https://lingopax-backend.onrender.com', payload, {
        headers: { 'x-auth-token': token }
      });

      if (res.data && res.data.reply) {
        const newAiMsgs = [...updatedMsgs, { sender: 'ai', text: res.data.reply }];
        setMessages(newAiMsgs);
        
        if (res.data.detectedBehaviour && res.data.detectedBehaviour !== activeBehaviour) {
          setActiveBehaviour(res.data.detectedBehaviour);
        }

        speakLocalText(res.data.reply);
      }
    } catch (err) {
      console.error("Transmission breakdown:", err);
    } finally {
      setAiLoading(false);
    }
  };

  const terminateVoiceSession = () => {
    setIsRecording(false);
    setConversationActive(false);
    isAiSpeakingRef.current = false;

    if (animationRef.current) cancelAnimationFrame(animationRef.current);
    if (streamRef.current) streamRef.current.getTracks().forEach(track => track.stop());
    if (audioContextRef.current) audioContextRef.current.close();
    if (recognitionRef.current) {
      recognitionRef.current.onend = null;
      recognitionRef.current.stop();
    }
    if (window.speechSynthesis) window.speechSynthesis.cancel();

    setOrbScale(1);
    setOrbSpeed(1);
    alert("🔒 Call finalized. Session structural transcripts locked.");
  };

  const sendMessage = async () => {
    if (!input.trim() || aiLoading) return;
    const currentInputSnapshot = input.trim();
    setInput('');
    dispatchVoiceDataToAI(currentInputSnapshot, messages);
  };

  const trackAudioVolume = () => {
    const analyser = analyserRef.current;
    if (!analyser) return;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const checkVolume = () => {
      if (!analyserRef.current) return;
      animationRef.current = requestAnimationFrame(checkVolume);
      analyser.getByteFrequencyData(dataArray);
      let total = 0;
      for (let i = 0; i < bufferLength; i++) total += dataArray[i];
      const average = total / bufferLength;

      if (!isAiSpeakingRef.current) {
        const rawScale = 1 + (average / 110);
        setOrbScale(rawScale > 1.35 ? 1.35 : rawScale);
      }
    };
    checkVolume();
  };

  return (
    <StyledWorkspaceWrapper>
      <div className="ai-workspace-container">
        
        <div className="agent-configuration-header">
          <div className="config-meta-details">
            <h3 className="workspace-main-title">Active Session Configuration</h3>
            <p className="workspace-sub-title">Setup: <span style={{ color: 'var(--accent-orange)', fontWeight: '600' }}>{activeBehaviour}</span></p>
          </div>
          <button className="filter-configuration-trigger-btn" onClick={() => setIsFilterMenuOpen(!isFilterMenuOpen)}>
            <FiSliders /> <span>Configure Persona</span>
          </button>
        </div>

        {isFilterMenuOpen && (
          <div className="dynamic-filter-dropdown-panel" style={{ background: 'rgba(20, 20, 18, 0.95)', padding: '20px', borderRadius: '16px', marginBottom: '20px' }}>
            <div className="filter-panel-section-block">
               <h4 className="filter-section-inner-title" style={{ color: '#FFF', marginBottom: '12px' }}>Agent Behaviour Matrix</h4>
               <div className="behaviour-selection-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '15px' }}>
                 {agentBehaviours.map((b) => (
                   <div 
                     key={b.id} 
                     className={`behaviour-interactive-card ${activeBehaviour === b.id ? 'selected-card' : ''}`} 
                     onClick={() => setActiveBehaviour(b.id)} 
                     style={{ border: activeBehaviour === b.id ? '2px solid #C7622A' : '1px solid #333', padding: '12px', borderRadius: '12px', cursor: 'pointer' }}
                   >
                     <div className="behaviour-card-body">
                       <h5 style={{ margin: '0 0 4px 0', color: '#FFF' }}>{b.name}</h5>
                       <p style={{ margin: 0, fontSize: '0.8rem', color: '#AAA' }}>{b.desc}</p>
                     </div>
                   </div>
                 ))}
               </div>
            </div>

            {activeBehaviour === 'Job Interviewer' && (
              <div className="interview-configuration-sub-deck" style={{ marginTop: '20px', borderTop: '1px solid #333', paddingTop: '15px' }}>
                <h4 style={{ fontSize: '0.9rem', color: 'var(--accent-orange)', margin: '0 0 12px 0', display: 'flex', alignItems: 'center', gap: '6px' }}><FiBriefcase /> Mock Targeting Configurations</h4>
                <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
                  <div style={{ flex: 1, minWidth: '200px' }}>
                    <label style={{ display: 'block', fontSize: '0.75rem', color: '#888', marginBottom: '4px' }}>Target Job Profile</label>
                    <input type="text" value={targetRole} onChange={(e) => setTargetRole(e.target.value)} style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', background: '#222', border: '1px solid #444', color: '#FFF', fontSize: '0.85rem' }} />
                  </div>
                  <div style={{ flex: 1, minWidth: '200px' }}>
                    <label style={{ display: 'block', fontSize: '0.75rem', color: '#888', marginBottom: '4px' }}>Tech Stack Details</label>
                    <input type="text" value={techStack} onChange={(e) => setTechStack(e.target.value)} style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', background: '#222', border: '1px solid #444', color: '#FFF', fontSize: '0.85rem' }} />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        <div className="ai-agent-main-grid">
          <div className="ai-orb-card">
            <span className="badge-track">{activeBehaviour.toUpperCase()} MATRIX ACTIVE</span>
            
            <div className="uiverse-orb-portal-wrapper" style={{ width: '100%', height: '240px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <div className={`orb-container ${isRecording ? 'live-tracking-mode' : ''}`} style={{ transform: `scale(${orbScale})`, transition: isAiSpeakingRef.current ? 'transform 0.15s ease' : 'none' }}>
                <div className="orb">
                  <div className="orb-inner" style={{ animationDuration: `${6 / orbSpeed}s` }} />
                  <div className="orb-inner" style={{ animationDuration: `${8 / orbSpeed}s` }} />
                </div>
              </div>
            </div>

            <p style={{ color: 'var(--text-dim)', fontSize: '0.82rem', fontWeight: '300', textAlign: 'center', marginBottom: '15px', maxWidth: '85%' }}>
              {conversationActive ? "Vocal channels open. Communication logs transmitting seamlessly." : "Voice core matrix is offline. Fire up the gateway stream."}
            </p>

            {conversationActive ? (
              <button className="action-mic-toggle live-streaming" onClick={terminateVoiceSession} style={{ background: '#7a2222' }}>
                <FiPhoneOff style={{ marginRight: '6px' }} /> Stop Conversation
              </button>
            ) : (
              <button className="action-mic-toggle" onClick={startLiveVoiceSession}>
                Start Live Conversation
              </button>
            )}
          </div>

          <div className="ai-chat-card">
            <div className="chat-messages-stream">
              {messages.map((msg, index) => (
                <div key={index} className={`chat-bubble-row ${msg.sender === 'user' ? 'user-end' : 'ai-end'}`}>
                  <div className="bubble-text-content">
                    {msg.text}
                  </div>
                </div>
              ))}
              
              {aiLoading && (
                <div className="chat-bubble-row ai-end">
                  <div className="bubble-text-content" style={{ opacity: 0.5, borderStyle: 'dashed' }}>
                    AI Agent syncing response matrices... ⚡
                  </div>
                </div>
              )}
            </div>

            <div className="chat-input-sticky">
              <input 
                value={input} 
                onChange={(e) => setInput(e.target.value)} 
                onKeyDown={(e) => e.key === 'Enter' && sendMessage()} 
                placeholder={aiLoading ? "Processing dynamic speech logic..." : "Type a message..."}
                disabled={aiLoading}
              />
              <button onClick={sendMessage} className="chat-send-arrow-btn" disabled={aiLoading}>
                <FiSend size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </StyledWorkspaceWrapper>
  );
};

const StyledWorkspaceWrapper = styled.div`
  /* Restoring Webkit backdrop property validation style */
  WebkitBackdropFilter: blur(8px);
  
  .orb-container {
    position: relative;
    width: 170px;
    height: 170px;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    border-radius: 50%;
    transform: rotate(90deg);
    filter: drop-shadow(0 0 10px rgba(199, 98, 42, 0.6)) drop-shadow(0 0 20px rgba(233, 150, 122, 0.4));
  }
  .orb {
    position: absolute;
    width: 170px;
    aspect-ratio: 1;
    border-radius: 50%;
    background: #0d0d0c;
    filter: blur(20px);
  }
  .orb-container:hover .orb, .orb-container.live-tracking-mode .orb {
    width: 190px;
    animation: rotateOrb 6s infinite linear;
  }
  @keyframes rotateOrb {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  .orb-inner {
    position: absolute;
    left: -120%;
    top: -25%;
    width: 160%;
    aspect-ratio: 1;
    border-radius: 50%;
    background: #C7622A;
    clip-path: polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%);
    animation: rotateOrb linear infinite;
  }
  .orb-inner:nth-child(2) {
    left: auto;
    right: -120%;
    top: auto;
    bottom: -25%;
    background: #E9967A;
    animation-direction: reverse;
    clip-path: polygon(20% 0%, 0% 20%, 30% 50%, 0% 80%, 20% 100%, 50% 70%, 80% 100%, 100% 80%, 70% 50%, 100% 20%, 80% 0%, 50% 30%);
  }
  .orb-container:hover .orb-inner, .orb-container.live-tracking-mode .orb-inner {
    width: 170%;
  }
`;

export default Workspace;