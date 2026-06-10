import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const { email, password } = formData;

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // ✅ Using native fetch to avoid any axios 's is not a function' mismatch
      const response = await fetch("https://lingopax-backend-1.onrender.com/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();
      setLoading(false);

      if (response.ok && data.token) {
        localStorage.setItem('token', data.token); 
        localStorage.setItem('user', JSON.stringify(data.user));
        
        alert(data.message || "Welcome back to LingoPax! 🎉");
        navigate('/dashboard');
      } else {
        setError(data.message || 'Login failed! Please check your credentials.');
      }

    } catch (err) {
      setLoading(false);
      setError('Something went wrong! Server connection failed.');
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
            <input type="email" name="email" value={email} onChange={onChange} placeholder="Enter your registered email" required />
          </div>

          <div className="input-group-wrapper">
            <label>Password</label>
            <input type="password" name="password" value={password} onChange={onChange} placeholder="••••••••" required />
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