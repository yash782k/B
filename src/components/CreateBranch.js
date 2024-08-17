// src/components/CreateBranch.js
import React, { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { sendEmail } from '../utils/sendEmail';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
//import './createBranch.css';

const CreateBranch = () => {
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
  const navigate = useNavigate();

  // Get today's date in yyyy-mm-dd format
  const today = new Date().toISOString().split('T')[0];

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

  const handleCreateBranch = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const { emailId, branchCode, branchName, ownerName, subscriptionType, numberOfUsers, amount, password, location, activeDate, deactiveDate } = formData;

    if (new Date(activeDate) < new Date(today)) {
      setError('Active date cannot be before today.');
      return;
    }

    try {
      // Create user in Firebase Authentication
      const auth = getAuth();
      await createUserWithEmailAndPassword(auth, emailId, password);

      // Add branch details to Firestore
      await addDoc(collection(db, 'branches'), {
        emailId,
        branchCode,
        branchName,
        ownerName,
        subscriptionType,
        numberOfUsers,
        amount,
        password,
        location,
        activeDate,
        deactiveDate,
        firstLogin: true // Mark as first login
      });

      // Send email to the owner with credentials
      await sendEmail(emailId, password, ownerName, activeDate, deactiveDate, amount);

      setSuccess('Branch created, user account set up, and email sent successfully.');
      navigate('/admin-dashboard');
    } catch (error) {
      setError('Failed to create branch or user. Please try again.');
    }
  };

  return (
    <div className="create-branch">
      <h2>Create New Branch</h2>
      <form onSubmit={handleCreateBranch}>
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
        <button type="submit">Create Branch</button>
      </form>
      {error && <p className="error-message">{error}</p>}
      {success && <p className="success-message">{success}</p>}
    </div>
  );
};

export default CreateBranch;
