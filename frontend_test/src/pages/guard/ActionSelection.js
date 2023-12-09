import React from 'react';
import './guard.css'; // 添加你的樣式文件

export default function ActionSelection({ onParkingStatus, onClose }) {
    
    return (
        <div>
            <div className="selection-container">
                <h1 className='selection-h1'>系統操作選單</h1>
                <button onClick={onParkingStatus}>停車場狀態</button>
                <br/ >
                <button onClick={onClose}>出入場管理</button>
            </div>
            <div className="selection-overlay"></div>
        </div>   
  );
}