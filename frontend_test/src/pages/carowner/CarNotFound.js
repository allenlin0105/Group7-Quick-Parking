import React, { useState, useEffect } from "react"
import { useLocation } from 'react-router-dom'
import Plan from "../../components/Plan"

export default function CarNotFound() {
    const location = useLocation();
    // "|| {}" make sure it is not undefined or null, so the destructure is safe.
    const { carId } = location.state || '';

    return (
        <div className="carowner-container">
            <div>
                <h1 className='title'><span style={{color: '#3d995f'}}>{carId}</span> 不在停車場！</h1>
            </div>
        </div>
    );
}
