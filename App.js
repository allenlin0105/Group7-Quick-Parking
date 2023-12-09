import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import "./App.css"
import Home from "./pages/Home"
import CarOwnerNav from "./pages/carowner/Nav"
import CarOwnerHome from "./pages/carowner/Home"
import CarOwnerSearch from "./pages/carowner/Search"
import GuardNav from "./pages/guard/Nav"
import GuardHome from "./pages/guard/Home"
import GuardHistory from "./pages/guard/History"
import GuardMap from "./pages/guard/Map"
import GuardParking from "./pages/guard/Parking"


export default function App() {
  // define all the Route(s)s here, nested "Routes"s lead to conflict error.
  return (
    <Router>
      <Routes>
        <Route index element={<Home />} />
        <Route path="guard" element={<GuardNav />}>
          <Route index element={<GuardHome />} />
          <Route path='parking' element={<GuardParking />} />
          <Route path='history' element={<GuardHistory />} />
          <Route path='map' element={<GuardMap />} />
          <Route path='*' element={<Navigate to="/" replace />} />
        </Route>
        <Route path="carowner" element={<CarOwnerNav />}>
          <Route index element={<CarOwnerHome />} />
          <Route path="search" element={<CarOwnerSearch />} />
          <Route path='*' element={<Navigate to="/" replace />} />
        </Route>
        <Route path='*' element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}
