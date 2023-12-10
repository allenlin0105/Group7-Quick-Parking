import React, { useState, useRef, useEffect } from 'react';
import './Plan.css';
import planData from './Plan.json'; // Path to your JSON file
import { useNavigate } from 'react-router-dom';
import PlanDialog from './PlanDialog';
import carownerService from '../services/spaceService'

export default function Plan(props) {
    const { editable = false, guard = false, locatedSpaceId = null} = props;
    const initPlan = editable ? [] : planData;
    const [plan, setPlan] = useState(initPlan);
    const [selectedSpacdId, setSelectedSpacdId] = useState(null);
    const [hoverSpacdId, setHoverSpacdId] = useState(null);
    const [clickedSpacdId, setCLickedSpacdId] = useState(null);
    const [mouse, setMouse] = useState({ x: 0, y: 0 });
    const [isEditable, setIsEditable] = useState(editable); // New state for edit mode
    const canvasRef = useRef(null);
    const navigate = useNavigate();
    const [open, setOpen] = useState(false); // https://mui.com/material-ui/react-dialog/#form-dialogs

    useEffect(() => {
        const handleGetAvailableSpace = async () => {
            try {
                // async and await is needed here.
                const availSpaces = await carownerService.getAvailableSpace();
                console.log(availSpaces);
                const updatedPlan = plan.map(space => {
                    if (availSpaces.space_list.includes(space.id)) {
                        return { ...space, occupied: false };
                    }
                    return { ...space, occupied: true };
                    });
                console.log(updatedPlan);
                setPlan(updatedPlan);
            } catch (e) {
                console.error("Error:", e);
            }
        }
        if (editable === false)
            handleGetAvailableSpace();
    }, [open])

    useEffect(() => {
        drawCanvas();
    }, [plan, mouse, hoverSpacdId, selectedSpacdId, isEditable]);



    const drawCanvas = () => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const planImage = new Image();
        planImage.src = 'images/plan.png';
        planImage.onload = () => {
            canvas.style.minWidth = `${planImage.naturalWidth}px`;
            canvas.style.minHeight = `${planImage.naturalHeight}px`;
            canvas.width = planImage.width;
            canvas.height = planImage.height;
            ctx.drawImage(planImage, 0, 0);
            if (isEditable) {
                plan.forEach((slot, index) => {
                    const carImage = new Image();
                    carImage.src = 'images/car.png';
                    carImage.onload = () => {
                        ctx.save();
                        ctx.translate(slot.x, slot.y);
                        ctx.rotate(slot.r * Math.PI / 180);
                        
                        if (index === hoverSpacdId) {
                            ctx.shadowColor = 'blue';
                            ctx.shadowBlur = 20;
                        }
                        if (index === selectedSpacdId) {
                            ctx.shadowColor = 'red';
                            ctx.shadowBlur = 20;
                        }
                        ctx.drawImage(carImage, -slot.w / 2, -slot.h / 2, slot.w, slot.h);
                        ctx.restore();
                    };
                });
            } else {
                plan.forEach(slot=> {
                    // console.log(slot)
                    // Check if the slot is occupied
                    if (slot.occupied) {
                        // Draw a car image if slot is occupied
                        const carImage = new Image();
                        carImage.src = 'images/car.png';
                        carImage.onload = () => {
                            ctx.save();
                            ctx.translate(slot.x, slot.y);
                            ctx.rotate(slot.r * Math.PI / 180);
                            if (guard) {
                                ctx.fillStyle = '#857C7C';  // Light background color for unoccupied
                                ctx.fillRect(-slot.w / 2,-slot.h / 2, slot.w, slot.h);
                            }
                            ctx.drawImage(carImage, -slot.w / 2, -slot.h / 2, slot.w, slot.h);
                            if (guard) {
                                ctx.font="bold 20px Inter";
                                ctx.fillStyle = 'white'; // Text color
                                ctx.textAlign = 'center'; // Center text horizontally
                                ctx.textBaseline = 'middle'; // Center text vertically
                                ctx.fillText(slot.id.toString().padStart(2, '0'), 0, 0); // Draw text at the center of the rectangle
                            } 
                            ctx.restore();
                        };
                    } else {
                        // Draw a placeholder or empty space if not occupied
                        ctx.fillStyle = '#CFF7E8';  // Light background color for unoccupied
                        ctx.save();
                        ctx.translate(slot.x, slot.y);
                        ctx.rotate(slot.r * Math.PI / 180);
                        ctx.fillRect(-slot.w / 2,-slot.h / 2, slot.w, slot.h);
                        ctx.font="bold 20px Inter";
                        ctx.fillStyle = 'black'; // Text color
                        ctx.textAlign = 'center'; // Center text horizontally
                        ctx.textBaseline = 'middle'; // Center text vertically
                        ctx.fillText(slot.id.toString().padStart(2, '0'), 0, 0); // Draw text at the center of the rectangle
                        ctx.restore();
                    }
                });
            }
        };
    };

    const isMouseOverslot = (x, y, slot) => {
        // Translate mouse coordinates to the slot's coordinate system
        const translatedX = x - slot.x;
        const translatedY = y - slot.y;
    
        // Rotate mouse coordinates in the reverse direction of the slot's rotation
        const rotatedX = translatedX * Math.cos(-slot.r * Math.PI / 180) - translatedY * Math.sin(-slot.r * Math.PI / 180);
        const rotatedY = translatedX * Math.sin(-slot.r * Math.PI / 180) + translatedY * Math.cos(-slot.r * Math.PI / 180);
    
        // Check if the rotated mouse coordinates are within the slot's width and height
        return rotatedX > -slot.w / 2 && rotatedX < slot.w / 2 &&
               rotatedY > -slot.h / 2 && rotatedY < slot.h / 2;
    }

    const handleCanvasClick = (event) => {
        const rect = canvasRef.current.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        if (isEditable) {    
            const clickedSpacdId = plan.findIndex(slot => {
                return isMouseOverslot(x, y, slot);
            });
    
            if (clickedSpacdId !== -1) {
                setSelectedSpacdId(clickedSpacdId);
            } else {
                const newslot = { 
                    id: plan.length + 1, 
                    x: mouse.x, 
                    y: mouse.y, 
                    w: 50, h: 110, 
                    r: 0, occupied: true
                };
                setPlan([...plan, newslot]);
                setSelectedSpacdId(plan.length);
                setHoverSpacdId(plan.length);
            }
        } else if (guard) {
            const slot = plan.find(slot => {
                return isMouseOverslot(x, y, slot);
            });
            if (slot === undefined)
                return;
            navigate('/guard/history', { state: { slotId: slot.id } })
        } else {
            const slot = plan.find(slot => {
                return isMouseOverslot(x, y, slot);
            });
            if (slot === undefined)
                return;
            if (!slot.occupied) {
                setCLickedSpacdId(slot.id);
                handleClickOpen();
            }
        }
    };

    const handleMouseMove = (event) => {
        const canvas = canvasRef.current;
        const rect = canvasRef.current.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        
        if (isEditable) {
            setMouse({ x: x, y: y });
            const hoverIndex = plan.findIndex(slot => isMouseOverslot(x, y, slot));
            setHoverSpacdId(hoverIndex !== -1 ? hoverIndex : null);
        }
        const slot = plan.find(slot => {
            return isMouseOverslot(x, y, slot);
        });
        if (slot === undefined ||
            (guard === false && locatedSpaceId !== null) ) {
            canvas.style.cursor = 'default';
        }
        else if (editable || guard) {
            canvas.style.cursor = 'pointer';
        } else if (guard === false && !slot.occupied) {
            canvas.style.cursor = 'pointer';
        }
    };

    const updateslotProperty = (index, property, value) => {
        const newData = [...plan];
        newData[index][property] = parseFloat(value);
        setPlan(newData);
    };

    const deleteslot = () => {
        if (selectedSpacdId !== null) {
            const newData = plan.filter((_, index) => index !== selectedSpacdId);
            setPlan(newData);
            setSelectedSpacdId(null);
        }
    };

    const downloadJson = () => {
        const dataStr = JSON.stringify(plan, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
        
        const exportFileDefaultName = 'plan.json';
    
        let linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
    };

    const toggleEditMode = () => {
        setIsEditable(!isEditable); // Toggle edit mode
    };

    const toggleslotOccupied = () => {
        if (selectedSpacdId !== null) {
            const newData = [...plan];
            newData[selectedSpacdId].occupied = !newData[selectedSpacdId].occupied;
            setPlan(newData);
        }
    };
    const handleClickOpen = () => {
        setOpen(true);
      };
    
    const handleClose = () => {
        setOpen(false);
    };

    return (
        <div className="centered-div" style={{ textAlign: 'center' }}>
            <PlanDialog 
                open={open} 
                onClose={handleClose}
                slotId={clickedSpacdId}
                contentText="To subscribe to this website, please enter your email address here. We will send updates occasionally."
                textFieldLabel="Email Address"
            />
            <canvas
                ref={canvasRef}
                onMouseMove={handleMouseMove}
                onClick={handleCanvasClick}
                style={{ maxWidth: '100%' }}
            ></canvas>
            {(isEditable) && (<div>Mouse Coordinates: X: {mouse.x}, Y: {mouse.y}</div>)}
            {(isEditable && selectedSpacdId !== null) && (
                <div className="control-panel">
                <div className="input-row">
                    <label>
                        X Position:
                        <input
                            type="number"
                            value={plan[selectedSpacdId].x}
                            onChange={(e) => updateslotProperty(selectedSpacdId, 'x', e.target.value)}
                        />
                    </label>
                    <label>
                        Y Position:
                        <input
                            type="number"
                            value={plan[selectedSpacdId].y}
                            onChange={(e) => updateslotProperty(selectedSpacdId, 'y', e.target.value)}
                        />
                    </label>
                </div>
                <div className="input-row">
                    <label>
                        Width:
                        <input
                            type="number"
                            value={plan[selectedSpacdId].w}
                            onChange={(e) => updateslotProperty(selectedSpacdId, 'w', e.target.value)}
                        />
                    </label>
                    <label>
                        Height:
                        <input
                            type="number"
                            value={plan[selectedSpacdId].h}
                            onChange={(e) => updateslotProperty(selectedSpacdId, 'h', e.target.value)}
                        />
                    </label>
                </div>
                <div className="input-row">
                    <label>
                        Rotation:
                        <input
                            type="number"
                            value={plan[selectedSpacdId].r}
                            onChange={(e) => updateslotProperty(selectedSpacdId, 'r', e.target.value)}
                        />
                    </label>
                    <button onClick={toggleslotOccupied}>
                        Toggle Occupied
                    </button>
                    <button onClick={deleteslot}>Delete slot</button>

                </div>
                <button onClick={downloadJson}>Download slot Data</button>
            </div>
        )}
            {(editable) && (<button onClick={toggleEditMode}>
                {isEditable ? 'Switch to View Mode' : 'Switch to Edit Mode'}
            </button>)}
        </div>
    );
}
