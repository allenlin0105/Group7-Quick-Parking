import React from 'react'
import NavBar from '../../components/NavBar'
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { findCar } from '../../services/service';

export default function Nav() {
    const location = useLocation();
    const isHome = location.pathname === '/carowner'
   
    return (
        <>
            <NavBar home={isHome} search={true}/>
            <Outlet/>
        </>
    );
};
