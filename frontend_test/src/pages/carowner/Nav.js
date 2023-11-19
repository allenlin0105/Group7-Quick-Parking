import React from 'react'
import NavBar from '../../components/NavBar'
import { Outlet, useNavigate, useLocation } from 'react-router-dom';

export default function Nav() {
    const navigate = useNavigate();
    const location = useLocation();
    const isHome = location.pathname === '/carowner'
    const navSearch = (text) => {
        // console.log(text);
        navigate('/carowner/search/',  { state: { carId: text } });
    } 
    return (
        <>
            <NavBar home={isHome} search={true} searchCallBack={navSearch}/>
            <Outlet/>
        </>
    );
};
