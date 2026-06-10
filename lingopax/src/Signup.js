import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Signup.css';

const Signup = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const { name, email, password } = formData;

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    loading(true);

    try {
      
      const res = await axios.post("https://lingopax-backend-1.onrender.com/api/auth/register", { name, email, password });
      
      setLoading(false);

      if (res.data.token) {
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user', JSON.stringify(res.data.user));
        
        alert("Account created successfully! Welcome to LingoPax 🎉");
        
      
        navigate('/dashboard');
      } else {
       
        navigate('/login');
      }

    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.message || 'Signup failed! Please try again.');
    }
  };

  return (
    <div className="signup-root-container">
      <div className="signup-glass-card">
        <div className="signup-header">
          <h2>Create Account</h2>
          <p>Join LingoPax and build your disciplined daily routine 📈</p>
        </div>

        {error && <div className="error-alert-badge">⚠️ {error}</div>}

        <form className="signup-form-element" onSubmit={onSubmit}>
          <div className="input-group-wrapper">
            <label>Full Name</label>
            <input 
              type="text" 
              name="name" 
              value={name} 
              onChange={onChange} 
              placeholder="Enter your name" 
              required 
            />
          </div>

          <div className="input-group-wrapper">
            <label>Email Address</label>
            <input 
              type="email" 
              name="email" 
              value={email} 
              onChange={onChange} 
              placeholder="Enter your email" 
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
              placeholder="Create a strong password" 
              required 
            />
          </div>

          <button type="submit" className="signup-submit-btn" disabled={loading}>
            {loading ? 'Creating Account...' : 'SIGN UP FREE ⚡'}
          </button>
        </form>

        <div className="signup-footer-redirect">
          Already have an account? <span onClick={() => navigate('/login')}>Sign In</span>
        </div>
      </div>
    </div>
  );
};

export default Signup;