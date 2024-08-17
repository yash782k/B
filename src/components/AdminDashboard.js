// src/components/AdminDashboard.js
import React, { useState, useEffect } from 'react';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const [branches, setBranches] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const branchesCollection = collection(db, 'branches');
        const branchSnapshot = await getDocs(branchesCollection);
        const branchList = branchSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setBranches(branchList);
      } catch (error) {
        console.error('Error fetching branches:', error);
      }
    };

    fetchBranches();
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, 'branches', id));
      setBranches(branches.filter(branch => branch.id !== id));
    } catch (error) {
      console.error('Error deleting branch:', error);
    }
  };

  const handleEdit = (id) => {
    navigate(`/edit-branch/${id}`);
  };

  return (
    <div>
      <h2>Admin Dashboard</h2>
      <button onClick={() => navigate('/create-branch')}>Create Branch</button>
      <div>
        {branches.map(branch => (
          <div key={branch.id} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #ccc', padding: '10px' }}>
            <div>
              <p><strong>Branch Name:</strong> {branch.branchName}</p>
              <p><strong>Location:</strong> {branch.branchLocation}</p>
              {/* Display other branch details as needed */}
            </div>
            <div>
              <button onClick={() => handleEdit(branch.id)}>Edit</button>
              <button onClick={() => handleDelete(branch.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
