import React, { useState, useEffect }  from "react"
import "./carowner.css"
import Plan from "../../components/Plan";
import { getAvailalbeSpace } from "../../services/service";
import Button from '@mui/material/Button';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { findCar } from '../../services/service';
import SearchBar from "../../components/SearchBar";

export default function Home() {
    const [availableSlots, setAvailableSlots] = useState(46); // 初始可停車位數量
    const [totalSlots, setTotalSlots] = useState(0);

    // useEffect(() => {
    //     // 使用fetch向後端發送GET請求
    //     fetch('/api/getAvailableSlots') // 假設後端API端點為/api/getAvailableSlots
    //         .then((response) => {
    //             if (!response.ok) {
    //                 throw new Error('Network response was not ok');
    //             }
    //             return response.json(); // 解析JSON格式的回應
    //         })
    //     .then((data) => {
    //         // 從後端獲取到的位置數據，假設後端回傳的資料格式為 { availableSlots: 20 }
    //         setAvailableSlots(data.availableSlots);
    //     })
    //     .catch((error) => {
    //         console.error('There was a problem with the fetch operation:', error);
    //     });
    // }, []); // 空依賴數組表示只在組件首次渲染時發送請求

    const setSpaceNumber = async() => {
        const { data } = await getAvailalbeSpace();
        setAvailableSlots(data.n_available_space);
        setTotalSlots(data.total_space);
    }
    setSpaceNumber();

    // 模擬後端數據更新
    useEffect(() => {
        // 這裡模擬從後端獲取數據，實際情況需要根據你的後端設置
        const interval = setInterval(() => {
            // 假設後端傳回的資訊中有可用位子數
            const newAvailableSlots = Math.floor(Math.random() * 46); // 假設最大位子數為46
            setAvailableSlots(newAvailableSlots);
        }, 30000); // 每30秒更新一次資訊

        return () => clearInterval(interval); // 清除interval
    }, []);

    const navigate = useNavigate();
    const navSearch = async (text) => {
        console.log(text);
        const { data } = await findCar(text)
        console.log('data', data)
        if(data.space_id === -1) {
            navigate('/carowner/not_found/', { state: { carId: text }});
        }
        else {
            navigate('/carowner/search/',  { state: { 
                carId: text, 
                spaceId: data.space_id + 1, 
                startTime: data.start_time
            }});
        }
    } 

    return (
        <div className="carowner-container">
            <div style={{display: 'flex', alignItems: 'center'}}>
                <SearchBar searchCallBack={navSearch}/>
            </div>
            <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                <div>
                    <p>停車場空位： <span className="availnum">{availableSlots}</span> &nbsp;/ {totalSlots}</p>
                </div>         
                <Plan clickable={false}/>
            </div>
        </div>
    )
};