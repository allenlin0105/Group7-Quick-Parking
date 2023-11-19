import React from "react"
import { useLocation } from 'react-router-dom'

export default function Search() {
    const location = useLocation();
    // "|| {}" make sure it is not undefined or null, so the destructure is safe.
    const { carId } = location.state || {};
    return <h1>{carId}</h1>
};