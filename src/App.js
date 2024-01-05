// App.js
import './App.css';
import React, { useState, useEffect } from 'react';
import { BrowserRouter, Link, Route, Routes, Outlet, Navigate } from 'react-router-dom';
import { Home, About, Contact, Login, Register, Patientdashboard, Inputdat, Admindashboard } from './pages';


function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  useEffect(() => {
    // Check the login status when the component mounts
    const checkLoginStatus = () => {
      const storedLoginStatus = localStorage.getItem('isLoggedIn');
      setIsLoggedIn(storedLoginStatus === 'true');
    };

    checkLoginStatus();
  }, []);
  
  const handleLogin = () => {
    // Handle login and update isLoggedIn state
    localStorage.setItem('isLoggedIn', 'true');
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    // Handle logout and update isLoggedIn state
    localStorage.setItem('isLoggedIn', 'false');   
    setIsLoggedIn(false);
  };

  return (
    <BrowserRouter>
      <header className="w-full flex items-center bg-white sm:px-8 px-4 py-4 border-b border-b-[#e6ebf4]">
        <Link to="" className="w-full text-xl font-semibold object-contain font-inter font-medium bg-[#6469ff] text-white px-4 py-2 rounded-md">Medical History</Link>
        <section className="w-full flex justify-end gap-5">
          {isLoggedIn ? (
            <>
              <Link to="/home" className="font-inter font-medium bg-[#6469ff] text-white px-4 py-2 rounded-md">Home</Link>
              <Link to="/input-data" className="font-inter font-medium bg-[#6469ff] text-white px-4 py-2 rounded-md">Implementation</Link>
              <Link to="/about-page" className="font-inter font-medium bg-[#6469ff] text-white px-4 py-2 rounded-md">About</Link>
              <Link to="/contact-page" className="font-inter font-medium bg-[#6469ff] text-white px-4 py-2 rounded-md">Contact us</Link>              
              <button onClick={handleLogout} className="font-inter font-medium bg-[#6469ff] text-white px-4 py-2 rounded-md">Logout</button>
            </>
          ) : (
            <>
              <Link to="/about-page" className="font-inter font-medium bg-[#6469ff] text-white px-4 py-2 rounded-md">About</Link>
              <Link to="/contact-page" className="font-inter font-medium bg-[#6469ff] text-white px-4 py-2 rounded-md">Contact us</Link>
              <Link to="/login-page" className="font-inter font-medium bg-[#6469ff] text-white px-4 py-2 rounded-md">Login</Link>
              <Link to="/" className="font-inter font-medium bg-[#6469ff] text-white px-4 py-2 rounded-md">Sign Up</Link>
            </>
          )}
        </section>
      </header>
      <main className="sm:p-8 px-4 py-8 w-full bg-white min-h-[calc(100vh - 73px)]">
        <Routes>
          <Route
            path="/home"
            element={isLoggedIn ? <Home /> : <Navigate to="/login-page" />}
          />
          <Route path='/about-page' element={<About />} />
          <Route path='/contact-page' element={<Contact />} />        
          <Route
            path='/login-page'
            element={<Login onLogin={handleLogin} />}
          />
          
          <Route path='/' element={<Register />} />
          <Route
            path='/patient-dashboard'
            element={isLoggedIn ? <Patientdashboard /> : <Navigate to="/login-page" />}
          />
          <Route
            path='/input-data'
            element={isLoggedIn ? <Inputdat /> : <Navigate to="/login-page" />}
          />
          <Route
            path='/admin-dashboard'
            element={isLoggedIn ? <Admindashboard /> : <Navigate to="/login-page" />}
          />
        </Routes>
        <Outlet />
      </main>
    </BrowserRouter>
  );
}

export default App;
