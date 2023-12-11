import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './guard.css'; // 添加你的樣式文件
import Plan from '../../components/Plan';


export default function Parking() {
    const navigate = useNavigate();

    // 使用 useEffect 在組件渲染後立即導航到新的 URL
    useEffect(() => {
        navigate('/guard/parking');
    }, [navigate]);

    return (
        <div className="home-container">
            <h1>登記系統</h1>
            <Plan autoPark={true} />
        </div>
    )
}