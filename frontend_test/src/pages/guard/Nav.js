import React from 'react'
import NavBar from '../../components/NavBar.js'
import { Outlet, useLocation } from 'react-router-dom';

export default function Nav() {
    const location = useLocation();
    const isHome = location.pathname === '/guard'
    return (
        <>
            <NavBar home={isHome} search={false}/>
            <Outlet/>
        </>
    );
};