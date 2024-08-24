import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import '../../App.css'; // Import the CSS file

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      const response = await axios.post('http://localhost:3001/api/auth/create', { name, email, password });
      setSuccess(response.data.message);
      // Redirect or show success message
      console.log('Registration successful!');
    } catch (err) {
      setError(err.response?.data?.errors[0]?.msg || 'An error occurred');
    }
  };

  return (
    <div className="register-container" style={{ backgroundImage: "url('https://encrypted-tbn3.gstatic.com/licensed-image?q=tbn:ANd9GcT8dj1YVsGUU-PMEpMMhiJtXrn0NhoXOAsNVDORyV-Id2s7Zan4KLeV3pFVFyqtvy9e0upoP0qkYIGd0w1Lt1Np6l3HMGo8fvyh2D8tlg' )",}}>
      <div className="register-card">
        <div className="card-body">
          <h5 className="card-title">Register</h5>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="name" className="form-label">Name:</label>
              <input
                type="text"
                className="form-control"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
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
            <div className="mb-3">
              <label htmlFor="confirmPassword" className="form-label">Confirm Password:</label>
              <input
                type="password"
                className="form-control"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            {error && <div className="alert alert-danger" role="alert">{error}</div>}
            {success && <div className="alert alert-success" role="alert">{success}</div>}
            <button type="submit" className="btn btn-primary">Register</button>
          </form>
          <div className="mt-3">
            <p>Already have an account? <Link to="/login">Login here</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
