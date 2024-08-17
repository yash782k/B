// src/components/Welcome.js
import React from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebaseConfig';
import { useNavigate } from 'react-router-dom';

const Welcome = () => {
  const [user] = useAuthState(auth);
  const navigate = useNavigate();

  const handleLogout = () => {
    auth.signOut();
    navigate('/login');
  };

  return (
    <div>
      <h1>Welcome, {user ? user.email : 'User'}!</h1>
      <p>You have successfully logged in.</p>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Welcome;
