import React, { useState, useEffect } from "react"
import { useLocation } from 'react-router-dom'
import Plan from "../../components/Plan"

export default function Search() {
    const location = useLocation();
    // "|| {}" make sure it is not undefined or null, so the destructure is safe.
    const { carId } = location.state || {};

    // 假設後端提供的資訊初始值為空
    const [parkingInfo, setParkingInfo] = useState(null);

    // 模擬後端請求資料
    useEffect(() => {
        // 假設有車牌號碼
        if (carId) {
            // 假設發送車牌號碼到後端查詢
            // 在這裡模擬後端傳回的資訊，實際情況需要根據你的後端設置
            // 這裡的setTimeout只是模擬獲取資訊的時間，實際情況下是從後端獲取資料
            setTimeout(() => {
                // 假設從後端獲取的資訊包含停車位、開始停放時間等
                const backendParkingInfo = {
                    availableParking: 5, // 假設剩餘停車位為5
                    startTime: new Date('2023-12-01T08:30:00'), // 假設開始停放時間為指定時間
                };
                setParkingInfo(backendParkingInfo);
            }, 2000); // 模擬後端請求時間
        }
    }, [carId]);

    const calculateTotalParkingTime = (startTime) => {
        const currentTime = new Date();
        const diff = currentTime - startTime;
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        return `${days} 天 ${hours} 小時 ${minutes} 分鐘`;
    };

    return (
        <div className="home-container">
            {carId && parkingInfo ? (
                <div>
                    <h1 className='title'>停車車位 <span className="posi_num">{parkingInfo.availableParking}</span> </h1>
                    <p className = "info">開始停放時間：
                        <span style = {{ fontWeight: 'bold' }}>
                            {parkingInfo.startTime.toLocaleString('default', {
                                year: 'numeric',
                                month: '2-digit',
                                day: '2-digit',
                                hour12: false,
                                hour: '2-digit',
                                minute: '2-digit',
                            })}
                        </span>
                    </p>
                    <p className = "info">目前時間：{new Date().toLocaleString('default', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                        hour12: false,
                        hour: '2-digit',
                        minute: '2-digit',
                    })}</p>
                    <p className = "info">到目前共計&nbsp; {calculateTotalParkingTime(parkingInfo.startTime)}</p>
                    <div style={{ height: '0.2em' }} /> {/* 更小的空行 */}
                    <p className = "info">停車位置</p>
                    <Plan clicakble={false} locatedSpaceId={5}/> {/* TODO: pass the availableParking*/}
                </div>
            ) : (
                <div>
                    <h1 className='title'>查無入場紀錄！</h1>
                    <Plan clicakble={false} locatedSpaceId={null}/> {/* TODO: pass the availableParking*/}
                </div>
            )}
        </div>
    );
}
