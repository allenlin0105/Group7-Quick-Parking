import React, { useState }  from "react"
import "./carowner.css"
import Plan from "../../components/Plan";
import { getAvailalbeSpace } from "../../services/service";
import { useNavigate } from 'react-router-dom';
import { findCar } from '../../services/service';
import SearchBar from "../../components/SearchBar";

export default function Home() {
    const [availableSlots, setAvailableSlots] = useState(46); // 初始可停車位數量
    const [totalSlots, setTotalSlots] = useState(0);

    const setSpaceNumber = async() => {
        const { data } = await getAvailalbeSpace();
        setAvailableSlots(data.n_available_space);
        setTotalSlots(data.total_space);
    }
    setSpaceNumber();

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
            <div></div>
            <div style={{display: 'flex', alignItems: 'center'}}>
                <SearchBar searchCallBack={navSearch}/>
            </div>
            <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                <div>
                    <p>停車場空位： <span className="availnum">{availableSlots}</span> &nbsp;/ {totalSlots}</p>
                </div>         
            </div>
            <Plan clickable={false}/>
        </div>
    )
};