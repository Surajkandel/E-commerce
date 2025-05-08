import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password,
      });



      const { token, user } = response.data.data;

      // Save token and user info (optional)
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      // Role-based navigation
      if (user.role === 'admin') {
        navigate('/admin/All-users');
      } else if (user.role === 'seller') {
        navigate('/seller-dashbord');
      } else {
        navigate('/index'); // default for regular users
      }
    } catch (err) {
      console.log(err);
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="login-form">
      <h2>Login</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
