import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import ChangePassword from './components/ChangePassword';
import AdminDashboard from './components/AdminDashboard';
import Welcome from './components/Welcome';
import CreateBranch from './components/CreateBranch';
import EditBranch from './components/EditBranch';

const App = () => (
  <Router>
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/change-password" element={<ChangePassword />} />
      <Route path="/admin-dashboard" element={<AdminDashboard />} />
      <Route path="/welcome" element={<Welcome />} />
      <Route path="/create-branch" element={<CreateBranch />} />
      <Route path="/edit-branch/:id" element={<EditBranch />} />

      {/* Add more routes as needed */}
    </Routes>
  </Router>
);

export default App;
