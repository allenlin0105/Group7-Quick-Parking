import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './guard.css'; // 添加你的樣式文件
import Plan from '../../components/Plan';
import { getCars, findCar, leave } from '../../services/service';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import "../../components/PlanDialog.css"
import { calculateDurationInHours } from "../../lib/utils"
import { format } from "date-fns"

export default function Leaving() {
    const navigate = useNavigate();
    const [spaceId, setSpaceId] = useState(null);
    const [startTime, setStartTime] = useState(null);
    const [cars, setCars] = useState([]);
    const [open, setOpen] = useState(false);
    const [carId, setCarId] = useState(null);
    const [startTimeStr, setStartTimeStr] = useState('');
    const [currentTimeStr, setCurrentTimeStr] = useState('');
    const [duration, setDuration] = useState('');

    useEffect(() => {
        const handleGetCars = async () => {
            try {
                const { data } = await getCars();
                setCars(data.cars)
            } catch (e) {
                console.error("Error:", e);
            }
        }
        if (!open && spaceId === null)
            handleGetCars();
    }, [open, spaceId]);
    
    useEffect(() => {
        let timeoutId;
    
        const handleFindCar = async () => {
            let found = false;
            while (!found && cars.length > 0) {
                const randomIndex = Math.floor(Math.random() * cars.length);
                const randomCarId = cars[randomIndex];
    
                try {
                    const { data } = await findCar(randomCarId);
    
                    if (data.space_id === -1) {
                        continue;
                    }
    
                    setCarId(randomCarId);
                    setSpaceId(data.space_id + 1);
                    setStartTime(data.start_time);
                    found = true;
                } catch (e) {
                    console.error("Error:", e);
                    found = true;
                }
            }
        };
    
        if (!open && cars.length > 0) {
            timeoutId = setTimeout(() => {
                handleFindCar();
            }, 2000); // Trigger after 2 seconds
        }
    
        return () => {
            clearTimeout(timeoutId); // Clear timeout when the component unmounts or dependencies change
        };
    }, [cars, open]);


    useEffect(() => {
        const interval = setInterval(() => {
            const localTime = new Date();
            setCurrentTimeStr(format(localTime, 'yyyy/MM/dd HH:mm'));
            setDuration(calculateDurationInHours(startTime, localTime.toUTCString()));
        }, 1000);
        setStartTimeStr(format(new Date(startTime), 'yyyy/MM/dd HH:mm'))
        return () => clearInterval(interval);
    }, [startTime])
    

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
        handleLeave(spaceId);
        setOpen(false);
        setSpaceId(null);
        setStartTime(null);
    };

    const handleOpenDialog = () => {
        setOpen(true);
    }

    const handleCloseDialog = () => {
        setSpaceId(null);
        setOpen(false)
    }

    return (
        <div className="home-container">
            {spaceId ? (
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <h1 className='title'><span style={{color: '#3d995f'}}>{carId}</span> 停在車位 <span className="posi_num">{spaceId}</span> </h1>
                    <Button variant="contained" onClick={handleCloseDialog} sx={{...buttonStyle, fontWeight: 'bold'}}>
                        取消
                    </Button>
                    <Button variant="contained" onClick={handleOpenDialog} sx={{...buttonStyle, fontWeight: 'bold'}}>
                        離場
                    </Button>
                    </div>
                    <h2 className='subtitle'>時間資訊</h2>
                    <p className = "info">開始停放時間：
                        {startTimeStr}
                    </p>
                    <p className = "info">目前時間：{currentTimeStr}</p>
                    <p className = "info">到目前共計 {duration} 小時</p>
                    <h2 className='subtitle'>停車位置</h2>
                    <Plan clicakble={false} locatedSpaceId={spaceId}/> {/* TODO: pass the availableParking*/}
                    </div>
            ) : (
                <div>
                    <h1 className='title'>離場系統</h1>
                    <Plan clickable={false} locatedSpaceId={null}/>
                </div>
            )}
            <Dialog open={open} onClose={handleCloseDialog} 
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
                    <span className="reg-string" style={{color: '#3d995f'}}>
                        {carId}
                    </span>
                </DialogTitle>
                <DialogContent sx={{fontSize: "18px", lineHeight: '1.75'}}>
                    <div className="dialog-row">
                        <span>
                            {`停放開始時間： ${startTimeStr}`}
                        </span>
                    </div>
                    <div className="dialog-row">
                        <span>
                            {`目前時間： ${currentTimeStr}`}
                        </span>
                    </div>
                    <div className="dialog-row">
                        <span>
                            {`到目前共計 ${duration} 小時`}
                        </span>
                    </div>
                </DialogContent>
                <DialogActions  sx={{fontSize: "18px"}}>
                    <Button onClick={handleCloseDialog} sx={buttonStyle}>取消</Button>
                    <Button onClick={handleCheckLeave} autoFocus  sx={buttonStyle}>
                        確認
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}