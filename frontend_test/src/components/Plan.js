import React, { useState, useRef, useEffect } from 'react';
import './Plan.css';
import planData from './Plan.json'; // Path to your JSON file

export default function Plan(props) {
    const { editable = false, guard = false } = props;
    const initPlan = editable ? [] : planData;
    const [plan, setPlan] = useState(initPlan);
    const [selectedslotIndex, setSelectedslotIndex] = useState(null);
    const [hoverslotIndex, setHoverslotIndex] = useState(null);
    const [mouse, setMouse] = useState({ x: 0, y: 0 });
    const [isEditable, setIsEditable] = useState(editable); // New state for edit mode
    const canvasRef = useRef(null);

    useEffect(() => {
        drawCanvas();
    }, [plan, mouse, hoverslotIndex, selectedslotIndex, isEditable]);

    const drawCanvas = () => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const planImage = new Image();
        planImage.src = 'images/plan.png';
        planImage.onload = () => {
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
                        
                        if (index === hoverslotIndex) {
                            ctx.shadowColor = 'blue';
                            ctx.shadowBlur = 20;
                        }
                        if (index === selectedslotIndex) {
                            ctx.shadowColor = 'red';
                            ctx.shadowBlur = 20;
                        }
                        ctx.drawImage(carImage, -slot.w / 2, -slot.h / 2, slot.w, slot.h);
                        ctx.restore();
                    };
                });
            } else {
                plan.forEach(slot=> {
                    console.log(slot)
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
        return x > slot.x - slot.w / 2 &&
               x < slot.x + slot.w / 2 &&
               y > slot.y - slot.h / 2 &&
               y < slot.y + slot.h / 2;
    }

    const handleCanvasClick = (event) => {
        if (!isEditable)
            return;
        const rect = canvasRef.current.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        const clickedslotIndex = plan.findIndex(slot => {
            return isMouseOverslot(x, y, slot);
        });

        if (clickedslotIndex !== -1) {
            setSelectedslotIndex(clickedslotIndex);
        } else {
            const newslot = { 
                id: plan.length + 1, 
                x: mouse.x, 
                y: mouse.y, 
                w: 50, h: 110, 
                r: 0, occupied: true
            };
            setPlan([...plan, newslot]);
            setSelectedslotIndex(plan.length);
            setHoverslotIndex(plan.length);
        }
    };

    const handleMouseMove = (event) => {
        if (!isEditable)
            return;
        const rect = canvasRef.current.getBoundingClientRect();
        const mouseX = event.clientX - rect.left;
        const mouseY = event.clientY - rect.top;
        setMouse({ x: mouseX, y: mouseY });

        const hoverIndex = plan.findIndex(slot => isMouseOverslot(mouseX, mouseY, slot));
        setHoverslotIndex(hoverIndex !== -1 ? hoverIndex : null);
    };

    const updateslotProperty = (index, property, value) => {
        const newData = [...plan];
        newData[index][property] = parseFloat(value);
        setPlan(newData);
    };

    const deleteslot = () => {
        if (selectedslotIndex !== null) {
            const newData = plan.filter((_, index) => index !== selectedslotIndex);
            setPlan(newData);
            setSelectedslotIndex(null);
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
        if (selectedslotIndex !== null) {
            const newData = [...plan];
            newData[selectedslotIndex].occupied = !newData[selectedslotIndex].occupied;
            setPlan(newData);
        }
    };

    return (
        <div className="centered-div" style={{ textAlign: 'center' }}>
            <canvas
                ref={canvasRef}
                onMouseMove={handleMouseMove}
                onClick={handleCanvasClick}
                style={{ maxWidth: '100%' }}
            ></canvas>
            {(isEditable) && (<div>Mouse Coordinates: X: {mouse.x}, Y: {mouse.y}</div>)}
            {(isEditable && selectedslotIndex !== null) && (
                <div className="control-panel">
                <div className="input-row">
                    <label>
                        X Position:
                        <input
                            type="number"
                            value={plan[selectedslotIndex].x}
                            onChange={(e) => updateslotProperty(selectedslotIndex, 'x', e.target.value)}
                        />
                    </label>
                    <label>
                        Y Position:
                        <input
                            type="number"
                            value={plan[selectedslotIndex].y}
                            onChange={(e) => updateslotProperty(selectedslotIndex, 'y', e.target.value)}
                        />
                    </label>
                </div>
                <div className="input-row">
                    <label>
                        Width:
                        <input
                            type="number"
                            value={plan[selectedslotIndex].w}
                            onChange={(e) => updateslotProperty(selectedslotIndex, 'w', e.target.value)}
                        />
                    </label>
                    <label>
                        Height:
                        <input
                            type="number"
                            value={plan[selectedslotIndex].h}
                            onChange={(e) => updateslotProperty(selectedslotIndex, 'h', e.target.value)}
                        />
                    </label>
                </div>
                <div className="input-row">
                    <label>
                        Rotation:
                        <input
                            type="number"
                            value={plan[selectedslotIndex].r}
                            onChange={(e) => updateslotProperty(selectedslotIndex, 'r', e.target.value)}
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
