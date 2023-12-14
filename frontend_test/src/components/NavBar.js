import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaHome, FaSearch } from 'react-icons/fa'; // Import the necessary icons

const Navbar = ({home, search}) => {
  const navigate = useNavigate();

  const handleBack = () => {
    // Every search uses a navigate, so the navigate(-1) goes back to the last search.
    // Since search is only in carowner, navigate back to it instead of -1.
    if (search)
        navigate('/carowner');
    else
        navigate('/guard');
  }

  const handleHome = () => {
    if (!search)
      localStorage.clear();
    navigate("/");
  }

  return (
    <nav style={{
      border: 'none',
      backgroundColor: '#576575',
      display: 'flex',
      alignItems: 'center',
      padding: '0.3em',
      margin: '0em',
      backgroundClip: 'border-box',
      overflow: 'hidden',  // 新增這行，裁切超出範圍的內容
      }}>
      <div style={{
        width: '50px',
        height: '50px',
        position: 'relative',
        overflow: 'hidden',
        left: '0.2em'}}>
        {!home && (
          <button
            type='button'
            onClick={handleBack}
            style={{ 
              border: 'none', 
              background: 'none', 
              cursor: 'pointer',
              position: 'absolute',
              top: '53%',
              left: '50%',
              transform: 'translate(-50%, -50%)', 
            }}
          >
            <FaArrowLeft size={30} color="white" />
          </button>
        )}

        {home && (
          <div onClick={handleHome} style={{
            marginRight: '1em',
            cursor: 'pointer',
            position: 'absolute',
            top: '55%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
          }}>
          <FaHome size={30} color="white" />
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;