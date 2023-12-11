import React from 'react';
import { Navigate, Routes, Route} from 'react-router-dom';
import "./App.css"
import Home from "./pages/Home"
import CarOwnerNav from "./pages/carowner/Nav"
import CarOwnerHome from "./pages/carowner/Home"
import CarOwnerSearch from "./pages/carowner/Search"
import GuardNav from "./pages/guard/Nav"
import GuardHome from "./pages/guard/Home"
import GuardHistory from "./pages/guard/History"
import GuardParking from "./pages/guard/Parking"
import GuardLeaving from "./pages/guard/Leaving"
import ProtectedRoute from './components/ProtectedRoutes';

export default function App() {
  // define all the Route(s)s here, nested "Routes"s lead to conflict error.
  return (
    <>
      <Routes>
        <Route index element={<Home/>} />
        <Route path="guard" element={
          <ProtectedRoute>
            <GuardNav />
          </ProtectedRoute>
          }>
          <Route index element={<GuardHome/> } />
          <Route path='history' element={<GuardHistory/>} />
          <Route path='parking' element={<GuardParking/>} />
          <Route path='leaving' element={<GuardLeaving/>} />
          <Route path='*' element={<Navigate to="/" replace />} />
        </Route>
        <Route path="carowner" element={<CarOwnerNav />}>
          <Route index element={<CarOwnerHome />} />
          <Route path="search" element={<CarOwnerSearch />} />
          <Route path='*' element={<Navigate to="/" replace />} />
        </Route>
        <Route path='*' element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
};

