import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaHome, FaSearch } from 'react-icons/fa'; // Import the necessary icons

const SearchBar = ({searchCallBack}) => {
  const [searchText, setSearchText] = useState('');

  const handleSearch = (event) => {
    event.preventDefault(); // Prevent the default form submit action
    // console.log('Search text:', searchText);
    searchCallBack(searchText);
    // You can perform the search operation here using searchText
  };

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      width: '100%',
      border: '1px solid #6d8594',
      borderRadius: 15,
      paddingTop: 10,
      paddingBottom: 10,
      paddingLeft: 15,
      paddingRight: 15,
      marginTop: 20
    }}>
      <form onSubmit={handleSearch} style={{
        position: 'relative',
        width: '100%',
        display: 'flex', /* 使用 flex 佈局 */
        gap: 10,
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <input 
          type="search" 
          placeholder="輸入車牌找愛車"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          style={{
            fontSize: '1.3em', /* 設定文字大小 */
            flexGrow: 1,
            border: 0,
            textIndent: 0,
            color: "#4e5d66"
          }} 
        />
        <button 
          type="submit"
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            clipPath: 'circle(1em at center)', /* 裁剪邊界 */
          }}
        >
        <FaSearch size={22} color="#6d8594" />
        </button>
      </form>
    </div>
  );
};

export default SearchBar;