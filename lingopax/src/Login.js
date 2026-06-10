import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Login.css';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const { email, password } = formData;

  // Handle Input Changes
  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  // Submit Logic to Backend
  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // 🚀 Hitting our Backend Login API Route
      const res = await axios.post('https://lingopax-backend-1.onrender.com/api', { email, password });
      
      setLoading(false);
      alert(res.data.message); // Successful Alert Box

    // Is exact line ko apne Login.js ke try block me 'navigate('/dashboard')' ke theek upar update kar do:
// 🚀 Res.data se token nikal kar localStorage me set karna
localStorage.setItem('token', res.data.token); 
localStorage.setItem('user', JSON.stringify(res.data.user));

navigate('/dashboard');
    } catch (err) {
      setLoading(false);
      // Agar password wrong hai ya email match nahi hua toh error return hoga
      setError(err.response?.data?.message || 'Something went wrong! Server connection failed.');
    }
  };

  return (
    <div className="login-root-container">
      <div className="login-glass-card">
        <div className="login-header">
          <h2>Welcome Back</h2>
          <p>Login to continue your 1% better daily routine 📈</p>
        </div>

        {error && <div className="error-alert-badge">⚠️ {error}</div>}

        <form className="login-form-element" onSubmit={onSubmit}>
          <div className="input-group-wrapper">
            <label>Email Address</label>
            <input 
              type="email" 
              name="email" 
              value={email} 
              onChange={onChange} 
              placeholder="Enter your registered email" 
              required 
            />
          </div>

          <div className="input-group-wrapper">
            <label>Password</label>
            <input 
              type="password" 
              name="password" 
              value={password} 
              onChange={onChange} 
              placeholder="••••••••" 
              required 
            />
          </div>

          <button type="submit" className="login-submit-btn" disabled={loading}>
            {loading ? 'Authenticating Profile...' : 'LOGIN ⚡'}
          </button>
        </form>

        <div className="login-footer-redirect">
          Don't have an account? <span onClick={() => navigate('/signup')}>Sign Up Free</span>
        </div>
      </div>
    </div>
  );
};

export default Login;