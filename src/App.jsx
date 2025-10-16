// App.jsx
import React, { useState } from 'react'
import { Route, Routes, useLocation, Navigate } from 'react-router-dom'

import Navbar from './components/Navbar'
import Home from './pages/Home'
import Cardetails from './pages/Cardetails'
import Cars from './pages/Cars'
import Mybookings from './pages/Mybookings'
import Footer from './components/Footer'

// ⬇️ Make sure these names match the actual component exports
import AddCar from './pages/owner/Addcar'
import ManageBookings from './pages/owner/Managebookings'
import Dashboard from './pages/owner/Dashboard'
import Layout from './pages/owner/Layout'
import ManageCars from './pages/owner/ManageCars'
import Login from './components/Login'

const App = () => {
  const [showlogin, setShowLogin] = useState(false)
  const location = useLocation()
  const isOwnerPath = location.pathname.startsWith('/owner')

  return (


    <>
 

    {showlogin && <Login setShowLogin={setShowLogin}/>}
      {!isOwnerPath && <Navbar setShowLogin={setShowLogin} />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/car-details/:id" element={<Cardetails />} />
        <Route path="/cars" element={<Cars />} />
        <Route path="/bookings" element={<Mybookings />} />
        <Route path="/mybookings" element={<Navigate to="/bookings" replace />} />
        <Route path="/my-bookings" element={<Navigate to="/bookings" replace />} />

        {/* OWNER NESTED ROUTES */}
        <Route path="/owner" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="add-car" element={<AddCar />} />
          {/* choose one and use it everywhere consistently */}
          <Route path="manage-cars" element={<ManageCars />} />
          <Route path="manage-bookings" element={<ManageBookings />} />
        </Route>

        {/* Optional: 404 */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {!isOwnerPath && <Footer />}
    </>
  )
}

export default App

