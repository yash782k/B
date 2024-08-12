import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import ChangePassword from './components/ChangePassword';
import AdminDashboard from './components/AdminDashboard';
import Welcome from './components/Welcome';
import CreateBranch from './components/CreateBranch';
import EditBranch from './components/EditBranch';
import ActiveLog from './components/ActiveLog';
import Leads from './components/Leads';
import Product from './components/Product';
import Customize from './components/Customize';
import CreateSuperAdmin from './components/CreateSuperAdmin'; // Import should be correct

const App = () => (
  <Router>
    <Routes>
      {/* Uncomment and use if you have a Landing component */}
      {/* <Route path="/" element={<Landing />} /> */}
      <Route path="/" element={<Login />} />
      <Route path="/change-password" element={<ChangePassword />} />
      <Route path="/admin-dashboard" element={<AdminDashboard />} />
      <Route path="/leads" element={<Leads />} />
      <Route path="/welcome" element={<Welcome />} />
      <Route path="/create-branch" element={<CreateBranch />} />
      <Route path="/edit-branch/:id" element={<EditBranch />} />
      <Route path="/product" element={<Product />} />
      <Route path="/customize" element={<Customize />} />
      <Route path="/active-log" element={<ActiveLog />} />
      <Route path="/create-superadmin" element={<CreateSuperAdmin />} />

    </Routes>
  </Router>
);

export default App;
