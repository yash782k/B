// Layout.js
import React from 'react';
import { Outlet } from 'react-router-dom'; // For React Router v6
import { NavLink } from 'react-router-dom';
import './Profile.css';

const Layout = () => {
  return (
    <div className="dashboard-container1">
      <header className="header">
        <div className="logo">
          <img src="logo.png" alt="BOREZY Logo" />
        </div>
        <div className="profile">
          <h3>Shreyash Kapse</h3>
          <p>Super Admin <br /> Tukaram Kapse Pvt. Ltd.</p>
        </div>
      </header>
      <div className='profile1'>
        <nav>
        <ul>
    <li><NavLink to="/profile">Overview</NavLink></li>
    <li><NavLink to="/superadmin">Super Admin</NavLink></li>
    <li><NavLink to="/transaction">Transaction</NavLink></li>
    <li><NavLink to="/settings">Settings</NavLink></li>
  </ul>
        </nav>
      </div>
      <main>
        <Outlet /> {/* Render the nested route content here */}
      </main>
    </div>
  );
};

export default Layout;
