import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import '../../App.css'; // Import the CSS file

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate(); // Hook for navigation

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3001/api/auth/signin', { email, password });
      const { token, userId } = response.data;
      // Save token and userId to sessionStorage
      sessionStorage.setItem('token', token);
      sessionStorage.setItem('userId', userId);
      // Redirect to home page
      navigate('/home');
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred');
    }
  };

  return (
    <div className="login-container" style={{ backgroundImage: "url('https://encrypted-tbn3.gstatic.com/licensed-image?q=tbn:ANd9GcT8dj1YVsGUU-PMEpMMhiJtXrn0NhoXOAsNVDORyV-Id2s7Zan4KLeV3pFVFyqtvy9e0upoP0qkYIGd0w1Lt1Np6l3HMGo8fvyh2D8tlg')",}}>
      <div className="login-card">
        <div className="card-body">
          <h5 className="card-title">Login</h5>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">Email:</label>
              <input
                type="email"
                className="form-control"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label">Password:</label>
              <input
                type="password"
                className="form-control"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {error && <div className="alert alert-danger" role="alert">{error}</div>}
            <button type="submit" className="btn btn-primary">Login</button>
          </form>
          <div className="mt-3">
            <p>Don't have an account? <Link to="/register">Register here</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
