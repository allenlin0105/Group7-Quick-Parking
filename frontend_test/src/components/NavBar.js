import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaHome, FaSearch } from 'react-icons/fa'; // Import the necessary icons

const Navbar = ({home, search, searchCallBack}) => {
  const [searchText, setSearchText] = useState('');
  const navigate = useNavigate();

  const handleBack = () => {
    // Every search uses a navigate, so the navigate(-1) goes baco to the last search.
    // Since search is only in carowner, navigate back to it instead of -1.
    if (search)
        navigate('/carowner');
    else
        navigate(-1);
  }

  const handleSearch = (event) => {
    event.preventDefault(); // Prevent the default form submit action
    // console.log('Search text:', searchText);
    searchCallBack(searchText);
    // You can perform the search operation here using searchText
  };

  return (
    <nav style={{
      border: 'none',
      backgroundColor: 'grey',
      display: 'flex',
      alignItems: 'center',
      padding: '10px',
      margin: '-10px',
      backgroundClip: 'border-box',
    }}>
    {!home && (
    <button
      type='button'
      onClick={handleBack}
      style={{ 
        border: 'none', 
        background: 'none', 
        cursor: 'pointer' 
        }}
    >
        <FaArrowLeft size={30} color="black"/>
    </button>
    )}

    {home && (
    <Link to="/" style={{ marginRight: '10px' }}>
    <FaHome size={30} color="black" />
    </Link>
    )}

    {search && (
    <form onSubmit={handleSearch} style={{ position: 'relative', flexGrow: 1, marginRight: '10px' }}>
        <input 
          type="search" 
          placeholder="搜索..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          style={{
            width: '100%', 
            borderRadius: '15px', 
            padding: '10px 35px 10px 20px', 
            border: '1px solid #ccc',
          }} 
        />
        <button 
          type="submit"
          style={{
            position: 'absolute', 
            right: '10px', 
            top: '50%', 
            transform: 'translateY(-50%)',
            background: 'none',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          <FaSearch size={20} color="grey" />
        </button>
      </form>
      )}
    </nav>
  );
};

export default Navbar;
