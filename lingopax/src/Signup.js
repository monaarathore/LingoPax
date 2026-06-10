import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Signup.css';

const Signup = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const { name, email, password } = formData;

  // Handle input values dynamically
  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // ✅ Pure native fetch request without any external axios issues
      const response = await fetch("https://lingopax-backend-1.onrender.com/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ name, email, password })
      });

      const data = await response.json();
      setLoading(false);

      if (response.ok && data.token) {
        // Save auth details to local storage
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        alert("Account created successfully! Welcome to LingoPax 🎉");
        
        // Direct redirect to Dashboard
        navigate('/dashboard');
      } else {
        // Show server validation errors if any (like email already exists)
        setError(data.message || 'Signup failed! Please check your details and try again.');
      }

    } catch (err) {
      setLoading(false);
      setError('Server connection failed! Please check if backend is awake.');
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

        {/* ✅ Strict form submission connected directly to onSubmit */}
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