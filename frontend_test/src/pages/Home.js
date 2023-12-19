import React, { useState } from 'react'
import { Link } from 'react-router-dom';
import "./Home.css"
import Login from './Login';
import { Button } from '@mui/material';

export default function Home() {
  const [showLogin, setShowLogin] = useState(false);

  const handleLoginClose = () => {
    setShowLogin(false);
  };

  const handleLogin = () => {
    setShowLogin(true);
  };
  // const navigate = useNavigate();
  // const handleSuccessfulLogin = () => {
  //   // 登入成功後的處理
  //   // 可以導航到GuardHome
  //   navigate('/guard');
  // };

  const buttonStyle = {
    bgcolor: '#1b2928', // Grey background
    color: 'white', // White text color
    '&:hover': {
      bgcolor: 'darkgrey',
      color: 'black'
    },
    borderRadius: '8px', // Rectangle shape with slight rounding
    width: '200px',
    height: '50px',
    fontWeight: 'bold',
    fontSize: '1.8em',
    paddingTop: '30px',
    paddingBottom: '25px'
}


  return (
    <div className='portal-container home-gradient'>
      <Login open={showLogin} onClose={handleLoginClose} />
      <div className='center'>
        <h1 className='custom-h1'>Quick Parking</h1>
        <div className="image-container">
          <img src="images/home_graphic.png" alt="Home" />
        </div>
        <div className="button-group">
          <h2 className='custom-h2'>你的身份是...</h2>
          <nav className="nav-group">
            <div>
              <Link to="/carowner">
                <Button variant="contained" sx={buttonStyle}>車 主</Button>
              </Link>
            </div>
            <div>
              <Button variant="contained" sx={buttonStyle} onClick={handleLogin}>警 衛</Button>
            </div>
          </nav>
        </div>
      </div>
    </div>
  );
};
