import React, { useState, useEffect, useMemo } from "react"
import Parking from './Parking';
import "./guard.css";
import Plan from "../../components/Plan";
import { getAvailalbeSpace } from "../../services/service";
import DayUsagePlot from "./DayUsagePlot.js";
import { format } from "date-fns"

export default function Home() {
    const [availableSlots, setAvailableSlots] = useState(0); // 初始可停車位數量
    const [totalSlots, setTotalSlots] = useState(0);
    const [today, setToday] = useState(new Date());

    useEffect(() => {
      // Set the date when the component mounts
      setToday(new Date());
    }, []); // Empty dependency array ensures this runs only once

    // const today = new Date()
    // if(todayDate) {
    //     const today = new Date()
    //     setTodayDate(format(today, 'yyyy-MM-dd'))
    //     console.log('todayDate', todayDate)
    // }

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
    useEffect(() => {
        setSpaceNumber()
    },[])

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
            <div>
                <div className="header">
                    <h1 className='title'>停車場綜覽</h1>
                    <div>
                        <p>目前空位： <span className="availnum" data-testid="availSpace">{availableSlots}</span> &nbsp;/&nbsp; <span data-testid="totalSpace">{totalSlots}</span></p>
                    </div>
                </div>
                {/* 車位利用率折線圖 */}       
                {/* 地圖 */}
                <h2 className='subtitle'>當日使用率</h2>
                <DayUsagePlot date={format(today, 'yyyy-MM-dd')}/>
                <h2 className='subtitle'>目前停車場狀況</h2>
                <Plan guard={true}/>
            </div>
        </div>
    );
}