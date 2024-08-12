// src/components/EditBranch.js
import React, { useState, useEffect } from 'react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { useParams, useNavigate } from 'react-router-dom';
import './editBranch.css';
 
const EditBranch = () => {
  const { id } = useParams(); // Get branch ID from URL
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    emailId: '',
    branchCode: '',
    branchName: '',
    ownerName: '',
    subscriptionType: 'monthly',
    numberOfUsers: 5,
    amount: '',
    password: '',
    location: '',
    activeDate: '',
    deactiveDate: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Get today's date in yyyy-mm-dd format
  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    const fetchBranchData = async () => {
      try {
        const branchDoc = doc(db, 'branches', id);
        const branchSnapshot = await getDoc(branchDoc);
        if (branchSnapshot.exists()) {
          setFormData(branchSnapshot.data());
        } else {
          setError('Branch not found.');
        }
      } catch (error) {
        setError('Error fetching branch details.');
      }
    };

    fetchBranchData();
  }, [id]);

  // Function to handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({ ...prevState, [name]: value }));
  };

  // Function to increase or decrease the number of users
  const handleNumberChange = (operation) => {
    setFormData(prevState => ({
      ...prevState,
      numberOfUsers: operation === 'increase' ? prevState.numberOfUsers + 1 : Math.max(prevState.numberOfUsers - 1, 5),
    }));
  };

  const handleUpdateBranch = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const { activeDate } = formData;
    if (new Date(activeDate) < new Date(today)) {
      setError('Active date cannot be before today.');
      return;
    }

    try {
      const branchDoc = doc(db, 'branches', id);
      await updateDoc(branchDoc, formData);
      setSuccess('Branch details updated successfully.');
      navigate('/admin-dashboard');
    } catch (error) {
      setError('Failed to update branch details. Please try again.');
    }
  };

  return (
    <div className="edit-branch">
      <h2>Edit Branch</h2>
      <form onSubmit={handleUpdateBranch}>
        <label>
          Email ID:
          <input 
            type="email" 
            name="emailId" 
            value={formData.emailId} 
            onChange={handleChange} 
            required 
          />
        </label>
        <br />
        <label>
          Branch Code:
          <input 
            type="text" 
            name="branchCode" 
            value={formData.branchCode} 
            onChange={handleChange} 
            required 
          />
        </label>
        <br />
        <label>
          Branch Name:
          <input 
            type="text" 
            name="branchName" 
            value={formData.branchName} 
            onChange={handleChange} 
            required 
          />
        </label>
        <br />
        <label>
          Owner Name:
          <input 
            type="text" 
            name="ownerName" 
            value={formData.ownerName} 
            onChange={handleChange} 
            required 
          />
        </label>
        <br />
        <label>
          Subscription Type:
          <select 
            name="subscriptionType" 
            value={formData.subscriptionType} 
            onChange={handleChange}
          >
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
          </select>
        </label>
        <br />
        <label>
          Active Date:
          <input 
            type="date" 
            name="activeDate" 
            value={formData.activeDate} 
            onChange={handleChange} 
            min={today} 
            required 
          />
        </label>
        <br />
        <label>
          Deactive Date:
          <input 
            type="date" 
            name="deactiveDate" 
            value={formData.deactiveDate} 
            onChange={handleChange} 
            required 
          />
        </label>
        <br />
        <label>
          Number of Users:
          <button type="button" onClick={() => handleNumberChange('decrease')}>-</button>
          {formData.numberOfUsers}
          <button type="button" onClick={() => handleNumberChange('increase')}>+</button>
        </label>
        <br />
        <label>
          Amount:
          <input 
            type="number" 
            name="amount" 
            value={formData.amount} 
            onChange={handleChange} 
            required 
          />
        </label>
        <br />
        <label>
          Password:
          <input 
            type="password" 
            name="password" 
            value={formData.password} 
            onChange={handleChange} 
            required 
          />
        </label>
        <br />
        <label>
          Location:
          <input 
            type="text" 
            name="location" 
            value={formData.location} 
            onChange={handleChange} 
            required 
          />
        </label>
        <br />
        <button type="submit">Update Branch</button>
      </form>
      {error && <p className="error-message">{error}</p>}
      {success && <p className="success-message">{success}</p>}
    </div>
  );
};

export default EditBranch;
