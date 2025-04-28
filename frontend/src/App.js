// src/App.js
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import Login from './components/Login';
import Usersignup from './components/Usersignup';
import Sellersignup from './components/Sellersignup';
import Home from './components/Home';
import Index from './components/Index';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/index" element={<Index />} />
        <Route path="/login" element={<Login />} />
        <Route path="/usersignup" element={<Usersignup />} />
        <Route path="/sellersignup" element={<Sellersignup />} />
      </Routes>
    </Router>
  );
}

export default App;