import React, { useState, useEffect } from "react"
import { useLocation } from 'react-router-dom'
import Plan from "../../components/Plan"
import { calculateDurationInHours } from "../../lib/utils"
import { format } from "date-fns"

export default function Search() {
    const location = useLocation();
    // "|| {}" make sure it is not undefined or null, so the destructure is safe.
    const { carId, spaceId, startTime } = location.state || {};

    const [startTimeStr, setStartTimeStr] = useState('');
    const [currentTimeStr, setCurrentTimeStr] = useState('');
    const [duration, setDuration] = useState('');

    useEffect(() => {
        const interval = setInterval(() => {
            const localTime = new Date();
            setCurrentTimeStr(format(localTime, 'yyyy/MM/dd HH:mm'));
            setDuration(calculateDurationInHours(startTime, localTime.toUTCString()));
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
