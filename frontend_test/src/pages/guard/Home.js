import React, { useState, useEffect } from "react"
import ActionSelection from './ActionSelection';
import Parking from './Parking';
import "./guard.css";
import Plan from "../../components/Plan";
import { getAvailalbeSpace } from "../../services/service";

export default function Home() {
    const [availableSlots, setAvailableSlots] = useState(0); // 初始可停車位數量
    const [totalSlots, setTotalSlots] = useState(0);

    const [showActionSelection, setShowActionSelection] = useState(true);
    const [showParking, setShowParking] = useState(false);

    const handleParkingStatus = () => {
        setShowActionSelection(false);
    };

    const handleEnterParking = () => {
        setShowParking(true);
        setShowActionSelection(false); // 在進入 Parking 時隱藏框框
    };
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

    setSpaceNumber()
    // // 模擬後端數據更新
    // useEffect(() => {
    //     // 這裡模擬從後端獲取數據，實際情況需要根據你的後端設置
    //     const interval = setInterval(async () => {
    //         // 假設後端傳回的資訊中有可用位子數
    //         // const newAvailableSlots = Math.floor(Math.random() * 46); // 假設最大位子數為46
    //         // setAvailableSlots(newAvailableSlots);
    //         const { data } = await getAvailalbeSpace();
    //         setAvailableSlots(data.n_available_space);
    //         setTotalSlots(data.total_space);
    //     }, 30000); // 每30秒更新一次資訊
    //     return () => clearInterval(interval); // 清除interval
    // }, []);

    return (
        <div className="home-container">
            {showActionSelection && (
                <ActionSelection
                    onParkingStatus={handleParkingStatus}
                    onClose={handleEnterParking}
                 />
            )}
            {showParking ? (
                <Parking />
            ) : (
                <div>
                    <div className="header">
                        <h1 className='title'>停車場綜覽</h1>
                        <div>
                            <p1>目前空位： <span className="availnum">{availableSlots}</span> &nbsp;/ {totalSlots}</p1>
                        </div>
                    </div>
                    {/* 車位利用率折線圖 */}       
                    {/* 地圖 */}
                    <Plan guard={true}/>
                </div>
            )}
        </div>
    );
}