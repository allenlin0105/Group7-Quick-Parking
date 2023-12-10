import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import "./Home.css"
import Login from './Login';

export default function Home() {
  const [showLogin, setShowLogin] = useState(false);

  const handleLoginClose = () => {
    setShowLogin(false);
  };

  const handleLogin = () => {
    setShowLogin(true);
  };
  const navigate = useNavigate();
  const handleSuccessfulLogin = () => {
    // 登入成功後的處理
    // 可以導航到GuardHome
    navigate('/guard');
  };

  return (
    <div className='home-container home-gradient'>
      {showLogin && <Login onClose={handleLoginClose} onLogin={handleSuccessfulLogin} />}
      <div className='center'>
        <h1 className='custom-h1'>Quick Parking</h1>
        <div className="image-container">
          <img src="images/home_graphic.png" alt="Home" />
        </div>
        <div className="button-group">
          <h2 className='custom-h2'>你的身份是 ...</h2>
          <nav>
            <div>
              <Link to="/carowner">
                <button className="identity_button">車 主</button>
              </Link>
            </div>
            <div>
              <button className="identity_button" onClick={handleLogin}>警 衛</button>
            </div>
          </nav>
        </div>
      </div>
    </div>
  );
};
