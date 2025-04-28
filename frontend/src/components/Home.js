// src/components/Home.js
import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate('/login'); // This will redirect to login page
  };
  const handleSignupClientClick = () => {
    navigate('/usersignup'); // This will redirect to signup page
  };
  const handleSignupSellerClick = () => {
    navigate('/sellersignup'); // This will redirect to signup page
  };

  return (
    <div className="home-page">
      <h1>Welcome to Our E-Commerce Store</h1>
      <button 
        onClick={handleLoginClick}
        className="login-button"
      >
        Login
      </button>
      <button 
        onClick={handleSignupClientClick}
        className="signupclient-button"
      >
        Signup as client
      </button>
      <button 
        onClick={handleSignupSellerClick}
        className="signupseller-button"
      >
        Signup as Seller
      </button>
    </div>
  );
}

export default Home;