import React, { useState, useEffect } from "react"
import { useLocation } from 'react-router-dom'
import Plan from "../../components/Plan"
import { calculateDurationInHours } from "../../lib/utils"
import { format } from "date-fns"

export default function Search() {
    const location = useLocation();
    // "|| {}" make sure it is not undefined or null, so the destructure is safe.
    const { carId, spaceId, startTime } = location.state || {};

    // 假設後端提供的資訊初始值為空
    // const [parkingInfo, setParkingInfo] = useState(null);

    // // 模擬後端請求資料
    // useEffect(() => {
    //     // 假設有車牌號碼
    //     if (carId) {
    //         // 假設發送車牌號碼到後端查詢
    //         // 在這裡模擬後端傳回的資訊，實際情況需要根據你的後端設置
    //         // 這裡的setTimeout只是模擬獲取資訊的時間，實際情況下是從後端獲取資料
    //         setTimeout(() => {
    //             // 假設從後端獲取的資訊包含停車位、開始停放時間等
    //             const backendParkingInfo = {
    //                 availableParking: 5, // 假設剩餘停車位為5
    //                 startTime: new Date('2023-12-01T08:30:00'), // 假設開始停放時間為指定時間
    //             };
    //             setParkingInfo(backendParkingInfo);
    //         }, 2000); // 模擬後端請求時間
    //     }
    // }, [carId]);

    // const calculateTotalParkingTime = (startTime) => {
    //     const currentTime = new Date();
    //     const diff = currentTime - startTime;
    //     const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    //     const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    //     const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    //     return `${days} 天 ${hours} 小時 ${minutes} 分鐘`;
    // };
    const [startTimeStr, setStartTimeStr] = useState('');
    const [currentTimeStr, setCurrentTimeStr] = useState('');
    const [duration, setDuration] = useState('');

    useEffect(() => {
        const interval = setInterval(() => {
        const localTime = new Date();
        setCurrentTimeStr(format(localTime, 'yyyy/MM/dd HH:mm'));
        setDuration(calculateDurationInHours(startTime, localTime.toLocaleString()));
        }, 1000);
        setStartTimeStr(format(new Date(startTime), 'yyyy/MM/dd HH:mm'))
        return () => clearInterval(interval);
    }, [])

    return (
        <div className="carowner-container">
            <div>
                <h1 className='title'><span style={{color: '#3d995f'}}>{carId}</span> 停在車位 <span className="posi_num">{spaceId}</span> </h1>
                <h2 className='subtitle'>時間資訊</h2>
                <p className = "info">開始停放時間：
                    {startTimeStr}
                </p>
                <p className = "info">目前時間：{currentTimeStr}</p>
                <p className = "info">到目前共計 {duration} 小時</p>
                <h2 className='subtitle'>停車位置</h2>
                <Plan clicakble={false} locatedSpaceId={spaceId}/> {/* TODO: pass the availableParking*/}
            </div>
        </div>
    );
}
