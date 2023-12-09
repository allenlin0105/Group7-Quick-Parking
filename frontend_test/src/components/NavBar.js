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
        navigate('/guard');
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
        <FaArrowLeft size={30} color="black" />
      </button>
    )}

    {home && (
      <Link to="/" style={{
        marginRight: '1em',
        position: 'absolute',
        top: '55%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
      }}>
      <FaHome size={30} color="black" />
      </Link>
    )}
  </div>

  {search && (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      position: 'relative',
      flexGrow: 1,
      marginRight: '18px',
      height: '50px',
    }}>
      <form onSubmit={handleSearch} style={{
        position: 'relative',
        width: '100%',
        display: 'flex', /* 使用 flex 佈局 */
      }}>
        <input 
          type="search" 
          placeholder="請輸入車牌號碼"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          style={{
            width: '200px', 
            borderRadius: '15em', 
            padding: '0.25em 1.9em 0.25em 0.8em', /* 調整上下 padding */
            border: '1px solid #ccc',
            fontSize: '1.3em', /* 設定文字大小 */
            textIndent: '0em', 
            marginLeft: 'auto',
          }} 
        />
        <style>
          {`
            /* placeholder 的樣式 */
            ::placeholder {
              font-size: 0.7em; /* 調整 placeholder 的字體大小 */
              text-align: middle; 
            }
          `}
        </style>
        <button 
          type="submit"
          style={{
            position: 'absolute', 
            right: '0.7em', 
            top: '55%', 
            transform: 'translateY(-50%)',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            clipPath: 'circle(1em at center)', /* 裁剪邊界 */
          }}
        >
        <FaSearch size={20} color="grey" />
        </button>
      </form>
    </div>
  )}
    </nav>
  );
};

export default Navbar;