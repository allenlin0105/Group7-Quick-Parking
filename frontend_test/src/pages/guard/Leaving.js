import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './guard.css'; // 添加你的樣式文件
import Plan from '../../components/Plan';
import { getCars, findCar, leave } from '../../services/service';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import "../../components/PlanDialog.css"

export default function Leaving() {
    const navigate = useNavigate();
    const [locSpaceId, setLocSpaceId] = useState(null);
    const [parkingInfo, setParkingInfo] = useState(null);
    const [cars, setCars] = useState([]);
    const [open, setOpen] = useState(false);
    const [plate, setPlate] = useState(null);

    useEffect(() => {
        const handleGetCars = async () => {
            try {
                const { data } = await getCars();
                setCars(data.cars)
            } catch (e) {
                console.error("Error:", e);
            }
        }
        if (!open)
            handleGetCars();
    }, [open]);
    
    useEffect(() => {
        // console.log(cars);
        const handleFindCar = async () => {
            let found = false;
            while (!found && cars.length > 0) {

                const randomIndex = Math.floor(Math.random() * cars.length);
                const randomPlate = cars[randomIndex];
                try {
                    const { data } = await findCar(randomPlate);

                    if (data.space_id === -1) {
                        continue;
                    }
            
                    setPlate(randomPlate);
                    found = true;
    
                    const startTimestamp = data.start_time * 1000; // Convert seconds to milliseconds
                    const usedTimestamp = data.used_time * 1000; // Convert seconds to milliseconds
        
                    const formatTimestamp = (timestamp) => {
                        const date = new Date(timestamp);
                        const year = date.getFullYear();
                        const month = (date.getMonth() + 1).toString().padStart(2, '0');
                        const day = date.getDate().toString().padStart(2, '0');
                        const hours = date.getHours().toString().padStart(2, '0');
                        const minutes = date.getMinutes().toString().padStart(2, '0');
                        return `${year}/${month}/${day} ${hours}:${minutes}`;
                    };
        
                    const startTime = formatTimestamp(startTimestamp);
                    const endTime = formatTimestamp(startTimestamp + usedTimestamp);
    
                    const hoursUsed = Math.floor(usedTimestamp / (60 * 60 * 1000));
                    const minutesUsed = Math.floor((usedTimestamp % (60 * 60 * 1000)) / (60 * 1000));
                    
                    const usedTime = `${hoursUsed} 小時 ${minutesUsed} 分鐘`
        
                    // Update the parking info with UTC timestamps
                    setParkingInfo({ ...data, startTime: startTime, usedTime: usedTime, endTime: endTime });
                    setLocSpaceId(data.space_id);
                } catch (e) {
                    console.error("Error:", e);
                }
            }
        }
        if (!open && cars.length > 0) {
            handleFindCar();
        }
    }, [cars]);

    // 使用 useEffect 在組件渲染後立即導航到新的 URL
    useEffect(() => {
        navigate('/guard/leaving');
    }, [navigate]);
    const buttonStyle = {
        bgcolor: '#1b2928', // Grey background
        color: 'white', // White text color
        '&:hover': {
          bgcolor: 'darkgrey',
          color: 'black'
        },
        borderRadius: '10px', // Rectangle shape with slight rounding
        fontSize: '1em',
        paddingTop: '6px',
        paddingBottom: '3px',
        paddingLeft: '10px',
        paddingRight: '10px'
      }

    const handleCheckLeave = () => {
        // Handle the leaving process here
        // For example, update the backend about the car leaving
        const handleLeave = async (space_id) => {
            try {
                await leave(space_id);
            } catch (e) {
                console.error("Error:", e);
            }
        }
        handleLeave(parkingInfo.space_id);
        setOpen(false);
        setLocSpaceId(null);
        setParkingInfo(null);
    };

    const handleOpenDialog = () => {
        setOpen(true);
    }
    return (
        <div className="home-container">
            {locSpaceId && parkingInfo ? (
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <h1 className='title'>停車車位 <span className="posi_num">{locSpaceId}</span></h1>
                    <Button variant="contained" onClick={handleOpenDialog} sx={{...buttonStyle, fontWeight: 'bold'}}>
                        離場
                    </Button>
                    </div>
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
                    <p className = "info">到目前共計&nbsp; {parkingInfo.usedTime}</p>
                    <div style={{ height: '0.2em' }} /> {/* 更小的空行 */}
                    <p className = "info">停車位置</p>
                    <Plan clickable={false} locatedSpaceId={locSpaceId}/>
                </div>
            ) : (
                <div>
                    <h1 className='title'>離場系統</h1>
                    <Plan clickable={false} locatedSpaceId={null}/>
                </div>
            )}
            <Dialog open={open} onClose={() => setOpen(false)} 
                PaperProps={{
                    style: { 
                    borderRadius: '10px',
                    width: '100%',  // Set width
                    maxWidth: 480,
                    padding: 5
                    // maxHeight: 386, // Set max height
                }
              }}>
                <DialogTitle>
                    <span className="reg-string">
                        {`確定離場 `}
                    </span>
                    <span className="reg-string reg-plate">
                        {plate}
                    </span>
                </DialogTitle>
                <DialogContent sx={{fontSize: "18px", lineHeight: '1.75'}}>
                    <div className="dialog-row">
                        <span>
                            {`停放開始時間： ${parkingInfo?.startTime}`}
                        </span>
                    </div>
                    <div className="dialog-row">
                        <span>
                            {`目前時間： ${parkingInfo?.endTime}`}
                        </span>
                    </div>
                    <div className="dialog-row">
                        <span>
                            {`到目前共計 ${parkingInfo?.usedTime}`}
                        </span>
                    </div>
                </DialogContent>
                <DialogActions  sx={{fontSize: "18px"}}>
                    <Button onClick={() => setOpen(false)} sx={buttonStyle}>取消</Button>
                    <Button onClick={handleCheckLeave} autoFocus  sx={buttonStyle}>
                        確認
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}