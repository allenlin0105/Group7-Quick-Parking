import React, { useState, useRef, useEffect } from 'react';
import './Plan.css';
import planData from './Plan.json'; // Path to your JSON file
import { useNavigate } from 'react-router-dom';
import PlanDialog from './PlanDialog';
import { getAvailableSpace, getWarnings } from '../services/service';

export default function Plan(props) {
    const { 
        editable = false,
        guard = false, 
        locatedSpaceId = null, 
        clickable = true,
        autoPark = false,
    } = props;
    const containerRef = useRef(null);
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
    const [warningSet, setWarningSet] = useState(new Set([]));

    const calculateCanvasPosition = () => {
        const canvas = canvasRef.current;
        return canvas ? canvas.getBoundingClientRect().top : 0;
    };
    useEffect(() => {
        const updateWarningSet = async () => {
            try {
                // Replace this with your actual logic to get warning list
                const fetchedWarnings = await getWarnings(); // This is a placeholder function
                console.log(fetchedWarnings);
                if (fetchedWarnings.data && fetchedWarnings.data.length !== 0) {
                    setCLickedSpacdId(Math.min(...fetchedWarnings.data)-1);
                }
                setWarningSet(new Set(fetchedWarnings.data)); // Assuming each warning has a unique 'id'
            } catch (e) {
                console.error("Error fetching warnings:", e);
            }
        };

        updateWarningSet();
    }, []); 
    useEffect(() => {
        if (!guard) {
            const setCanvasHeight = () => {
                const canvasTopPosition = calculateCanvasPosition();
                const viewportHeight = window.innerHeight;
                const canvasHeight = viewportHeight - canvasTopPosition;
        
                const container = containerRef.current;
                if (container) {
                    container.style.height = `${canvasHeight}px`;
                }
            };
        
            setCanvasHeight();
            window.addEventListener('resize', setCanvasHeight);
        
            return () => {
                window.removeEventListener('resize', setCanvasHeight);
            };
        }
    }, [guard]);
    
    useEffect(() => {
        let intervalId;

        // Function to randomly click an available space
        const randomClickAvailableSpace = () => {
            const availableSpaces = plan.filter(space => !space.occupied);
            if (availableSpaces.length === 0) {
                return; // No available spaces
            }
            
            const randomIndex = Math.floor(Math.random() * availableSpaces.length);
            const randomSpace = availableSpaces[randomIndex];
            
            // Simulate a click event
            const canvas = canvasRef.current;
            const rect = canvas.getBoundingClientRect();
            const simulatedX = randomSpace.x + rect.left;
            const simulatedY = randomSpace.y + rect.top;
            // console.log(simulatedX, simulatedY);
    
            // Dispatch a click event to the canvas
            const simulatedEvent = new MouseEvent('click', {
                clientX: simulatedX,
                clientY: simulatedY,
                bubbles: true,
                cancelable: true,
                view: window,
            });
            canvas.dispatchEvent(simulatedEvent);
        };

        // Check if autoPark is set and it's the initial page load, then start the interval
        if (autoPark && !open) {
            intervalId = setInterval(randomClickAvailableSpace, 2000); // Random click every 2 seconds
        }

        // Cleanup the interval when the component unmounts
        return () => {
            clearInterval(intervalId);
        };
    }, [autoPark, open, plan]);

    useEffect(() => {
        const handleGetAvailableSpace = async () => {
            try {
                // async and await is needed here.
                // const availSpaces = await carownerService.getAvailableSpace();
                const { data } = await getAvailableSpace();
                setPlan(prevPlan => prevPlan.map(space => {
                    if (data.space_list.includes(space.id-1)) {
                        return { ...space, occupied: false };
                    }
                    return { ...space, occupied: true };
                }));
            } catch (e) {
                console.error("Error:", e);
            }
        }
        if (editable === false)
            handleGetAvailableSpace();
    }, [open, editable])

    useEffect(() => {
        const drawCanvas = () => {
            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d');
            const planImage = new Image();
            planImage.src = '/images/plan.png';
            planImage.onload = () => {
                canvas.style.minWidth = `${planImage.naturalWidth}px`;
                canvas.style.minHeight = `${planImage.naturalHeight}px`;
                canvas.width = planImage.width;
                canvas.height = planImage.height;
                ctx.drawImage(planImage, 0, 0);
                if (isEditable) {
                    plan.forEach((space, index) => {
                        const carImage = new Image();
                        carImage.src = '/images/car.png';
                        carImage.onload = () => {
                            ctx.save();
                            ctx.translate(space.x, space.y);
                            ctx.rotate(space.r * Math.PI / 180);
                            
                            if (index === hoverSpacdId) {
                                ctx.shadowColor = 'blue';
                                ctx.shadowBlur = 20;
                            }
                            if (index === selectedSpacdId) {
                                ctx.shadowColor = 'red';
                                ctx.shadowBlur = 20;
                            }
                            ctx.drawImage(carImage, -space.w / 2, -space.h / 2, space.w, space.h);
                            ctx.restore();
                        };
                    });
                } else {
                    plan.forEach(space=> {
                        console.log(space)
                        // Check if the space is occupied
                        if (space.occupied) {
                            // Draw a car image if space is occupied
                            const carImage = new Image();
                            carImage.src = '/images/car.png';
                            carImage.onload = () => {
                                ctx.save();
                                ctx.translate(space.x, space.y);
                                ctx.rotate(space.r * Math.PI / 180);
                                if (guard) {
                                    ctx.globalAlpha = 0.66;
                                    if (warningSet.has(space.id - 1))
                                        ctx.fillStyle = '#D24545';
                                    else
                                        ctx.fillStyle = '#857C7C';  // Light background color for unoccupied
                                    ctx.fillRect(-space.w / 2,-space.h / 2, space.w, space.h);
                                    ctx.drawImage(carImage, -space.w / 2, -space.h / 2, space.w, space.h);
                                    ctx.globalAlpha = 1;
                                    ctx.font="bold 20px Inter";
                                    ctx.fillStyle = 'white'; // Text color
                                    ctx.textAlign = 'center'; // Center text horizontally
                                    ctx.textBaseline = 'middle'; // Center text vertically
                                    ctx.fillText(space.id.toString().padStart(2, '0'), 0, 0); // Draw text at the center of the rectangle
                                } else {
                                    ctx.drawImage(carImage, -space.w / 2, -space.h / 2, space.w, space.h);
                                }
                                ctx.restore();
                                // if (guard && warningSet.has(space.id-1)) {
                                // todo: rotate the warning correctly
                                //     const warnImage = new Image();
                                //     warnImage.src = '/images/warning.png';
                                //     warnImage.onload = () => {
                                //         ctx.save();
                                //         ctx.translate(space.x, space.y);
                                //         ctx.rotate(space.r * Math.PI / 180);
                                //         ctx.drawImage(warnImage, -13, space.h / 2 + 10);
                                //         ctx.restore();
                                //     }
                                // }
                                if ((locatedSpaceId && space.id === locatedSpaceId) ||
                                    (guard && space.id === clickedSpacdId)) {
                                    if (!guard) {
                                        const locImage = new Image();
                                        locImage.src = '/images/location.png';
                                        locImage.onload = () => {
                                            ctx.save();
                                            ctx.translate(space.x, space.y);
                                            const sz = 1.1, w = 37.21 / sz, h = 54.59 / sz;
                                            ctx.drawImage(locImage, (-w)/2, -(h), w, h);
                                            ctx.restore();
                                        }
                                    }
                                    // Scroll the window or container to the located space
                                    let scrollX = space.x - window.innerWidth / 2;
                                    // Ensure the scroll position is within the bounds
                                    const containerRect = containerRef.current.getBoundingClientRect();
                                    scrollX = Math.max(0, scrollX);
                                    scrollX = Math.min(containerRef.current.scrollWidth - containerRect.width, scrollX);
                                    console.log(scrollX, space.y);
                                    containerRef.current.scrollTo({
                                        left: scrollX,
                                        top: space.y - 60,
                                        behavior: 'smooth'
                                    });
                                }
                            };
                        } else {
                            // Draw a placeholder or empty space if not occupied
                            ctx.fillStyle = '#CFF7E8';  // Light background color for unoccupied
                            ctx.save();
                            ctx.translate(space.x, space.y);
                            ctx.rotate(space.r * Math.PI / 180);
                            ctx.fillRect(-space.w / 2,-space.h / 2, space.w, space.h);
                            ctx.font="bold 20px Inter";
                            ctx.fillStyle = 'black'; // Text color
                            ctx.textAlign = 'center'; // Center text horizontally
                            ctx.textBaseline = 'middle'; // Center text vertically
                            ctx.fillText(space.id.toString().padStart(2, '0'), 0, 0); // Draw text at the center of the rectangle
                            ctx.restore();
                            if (!guard && space.id === clickedSpacdId) {
                                const locImage = new Image();
                                locImage.src = '/images/location.png';
                                locImage.onload = () => {
                                    ctx.save();
                                    ctx.translate(space.x, space.y);
                                    const sz = 1.1, w = 37.21 / sz, h = 54.59 / sz;
                                    ctx.drawImage(locImage, (-w)/2, -(h), w, h);
                                    ctx.restore();
                                }
                    
                                // Scroll the window or container to the located space
                                let scrollX = space.x - window.innerWidth / 2;
                                // Ensure the scroll position is within the bounds
                                const containerRect = containerRef.current.getBoundingClientRect();
                                scrollX = Math.max(0, scrollX);
                                scrollX = Math.min(containerRef.current.scrollWidth - containerRect.width, scrollX);
                                containerRef.current.scrollTo({
                                    left: scrollX,
                                    top: space.y - 60,
                                    behavior: 'smooth'
                                });
                            }
                        }
                    });
                }
            };
        };
        drawCanvas();
    }, [plan, mouse, hoverSpacdId, selectedSpacdId, isEditable, guard, locatedSpaceId, clickedSpacdId, warningSet]);

    const isMouseOverspace = (x, y, space) => {
        // Translate mouse coordinates to the space's coordinate system
        const translatedX = x - space.x;
        const translatedY = y - space.y;
    
        // Rotate mouse coordinates in the reverse direction of the space's rotation
        const rotatedX = translatedX * Math.cos(-space.r * Math.PI / 180) - translatedY * Math.sin(-space.r * Math.PI / 180);
        const rotatedY = translatedX * Math.sin(-space.r * Math.PI / 180) + translatedY * Math.cos(-space.r * Math.PI / 180);
    
        // Check if the rotated mouse coordinates are within the space's width and height
        return rotatedX > -space.w / 2 && rotatedX < space.w / 2 &&
               rotatedY > -space.h / 2 && rotatedY < space.h / 2;
    }

    const handleCanvasClick = (event) => {
        if (!clickable)
            return;
        const rect = canvasRef.current.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        if (isEditable) {    
            const clickedSpacdId = plan.findIndex(space => {
                return isMouseOverspace(x, y, space);
            });
    
            if (clickedSpacdId !== -1) {
                setSelectedSpacdId(clickedSpacdId);
            } else {
                const newspace = { 
                    id: plan.length + 1, 
                    x: mouse.x, 
                    y: mouse.y, 
                    w: 50, h: 110, 
                    r: 0, occupied: true
                };
                setPlan([...plan, newspace]);
                setSelectedSpacdId(plan.length);
                setHoverSpacdId(plan.length);
            }
        } else if (guard) {
            const space = plan.find(space => {
                return isMouseOverspace(x, y, space);
            });
            if (space === undefined)
                return;
            // console.log(space.id);
            navigate('/guard/history', { state: { spaceId: space.id } })
        } else {
            const space = plan.find(space => {
                return isMouseOverspace(x, y, space);
            });
        if (space === undefined || locatedSpaceId !== null)
                return;
            if (!space.occupied) {
                setCLickedSpacdId(space.id);
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
            const hoverIndex = plan.findIndex(space => isMouseOverspace(x, y, space));
            setHoverSpacdId(hoverIndex !== -1 ? hoverIndex : null);
        }
        const space = plan.find(space => {
            return isMouseOverspace(x, y, space);
        });
        if (space === undefined || clickable === false ||
            (guard === false && locatedSpaceId !== null) ) {
            canvas.style.cursor = 'default';
        }
        else if (editable || guard) {
            canvas.style.cursor = 'pointer';
        } else if (guard === false && !space.occupied) {
            canvas.style.cursor = 'pointer';
        }
    };

    const updatespaceProperty = (index, property, value) => {
        const newData = [...plan];
        newData[index][property] = parseFloat(value);
        setPlan(newData);
    };

    const deletespace = () => {
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
        setIsEditable(!isEditable);
    };

    const togglespaceOccupied = () => {
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
        <div className="centered-div" ref={containerRef} style={{ textAlign: 'center' }}>
            <PlanDialog 
                open={open} 
                onClose={handleClose}
                spaceId={clickedSpacdId}
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
                            onChange={(e) => updatespaceProperty(selectedSpacdId, 'x', e.target.value)}
                        />
                    </label>
                    <label>
                        Y Position:
                        <input
                            type="number"
                            value={plan[selectedSpacdId].y}
                            onChange={(e) => updatespaceProperty(selectedSpacdId, 'y', e.target.value)}
                        />
                    </label>
                </div>
                <div className="input-row">
                    <label>
                        Width:
                        <input
                            type="number"
                            value={plan[selectedSpacdId].w}
                            onChange={(e) => updatespaceProperty(selectedSpacdId, 'w', e.target.value)}
                        />
                    </label>
                    <label>
                        Height:
                        <input
                            type="number"
                            value={plan[selectedSpacdId].h}
                            onChange={(e) => updatespaceProperty(selectedSpacdId, 'h', e.target.value)}
                        />
                    </label>
                </div>
                <div className="input-row">
                    <label>
                        Rotation:
                        <input
                            type="number"
                            value={plan[selectedSpacdId].r}
                            onChange={(e) => updatespaceProperty(selectedSpacdId, 'r', e.target.value)}
                        />
                    </label>
                    <button onClick={togglespaceOccupied}>
                        Toggle Occupied
                    </button>
                    <button onClick={deletespace}>Delete space</button>

                </div>
                <button onClick={downloadJson}>Download space Data</button>
            </div>
        )}
            {(editable) && (<button onClick={toggleEditMode}>
                {isEditable ? 'Switch to View Mode' : 'Switch to Edit Mode'}
            </button>)}
        </div>
    );
}
