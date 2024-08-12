import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for redirection
import './Leads.css'; // Import the CSS file for styling
import logo from '../assets/logo.png'; // Correct the import path to where your logo is located
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebaseConfig'; // Import the auth instance from firebaseConfig

const Lead = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userName, setUserName] = useState('');
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserName(user.displayName || 'User');
      } else {
        setUserName('Guest');
      }
    });
    return () => unsubscribe();
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleAddLeadClick = () => {
    navigate('/add-lead'); // Redirect to the LeadForm component
  };

  return (
    <div className="lead-container">
      <nav className="navbar">
        <button className="navbar-toggle" onClick={toggleSidebar}>
          <span className="navbar-toggle-icon"></span>
          <span className="navbar-toggle-icon"></span>
          <span className="navbar-toggle-icon"></span>
        </button>
        <div className="navbar-logo">
          <img src={logo} alt="Logo" />
        </div>
        <div className="navbar-links">
          {/* Add more links as needed */}
        </div>
      </nav>

      {/* Add Lead button */}
      <div className="add-lead-container">
        <button className="add-lead-button" onClick={handleAddLeadClick}>
          Add Lead
        </button>
      </div>

      {sidebarOpen && (
        <div className="sidebar">
          <div className="sidebar-header">Welcome Back! {userName}</div>
          <div className="sidebar-section">
            <div className="sidebar-title">Leads</div>
            <ul>
              <li><button>Show all</button></li>
              <li><button>Fresh Lead</button></li>
              <li><button>Details Shared</button></li>
              <li><button>Demo Scheduled</button></li>
              <li><button>Demo Done</button></li>
              <li><button>Lead Lost</button></li>
              <li><button>Lead Won</button></li>
            </ul>
          </div>
          <div className="sidebar-section">
            <div className="sidebar-title">Clients</div>
            <ul>
              <li><button>Show All</button></li>
              <li><button>On-going subscriptions</button></li>
              <li><button>Expiring Soon</button></li>
              <li><button>Expired</button></li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default Lead;
