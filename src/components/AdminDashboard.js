import React, { useState, useEffect } from 'react';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { useNavigate } from 'react-router-dom';
import 'C:/Users/yash2/Downloads/TESTING-main/TESTING-main/src/components/AdminDashboard.css';
import editIcon from '../assets/Edit.png';
import deleteIcon from '../assets/Trash Can - Copy.png';
import logo1 from '../assets/screenshot-20240801-at-125204-pmremovebgpreview-1@2x.png';
import profileIcon from '../assets/Profile.png';
const Header = () => {
  const navigate = useNavigate();

  return (
    <header className="dashboard-header">
      <div className="header-logo">
        <img src={logo1} alt="Logo" />
      </div>
      <div className="header-profile">
        <img src={profileIcon} alt="Profile" onClick={() => navigate('/profile')} />
      </div>
    </header>
  );
};

const AdminDashboard = () => {
  const [branches, setBranches] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBranches = async () => {
      const branchesCollection = collection(db, 'branches');
      const branchSnapshot = await getDocs(branchesCollection);
      const branchList = branchSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setBranches(branchList);
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

  const calculateRemainingDays = (endDate) => {
    const end = new Date(endDate);
    const today = new Date();
    const diffTime = end - today;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const applyFilter = (branches) => {
    switch (activeFilter) {
      case 'ongoing':
        return branches.filter(branch => calculateRemainingDays(branch.endDate) > 0);
      case 'expiring':
        return branches.filter(branch => calculateRemainingDays(branch.endDate) > 0 && calculateRemainingDays(branch.endDate) <= 5);
      case 'expired':
        return branches.filter(branch => calculateRemainingDays(branch.endDate) <= 0);
      case 'all':
      default:
        return branches;
    }
  };

  const filteredBranches = applyFilter(branches).filter(branch => {
    const lowerCaseQuery = searchQuery.toLowerCase();
    return (
      branch.branchCode.toLowerCase().includes(lowerCaseQuery) ||
      branch.branchName.toLowerCase().includes(lowerCaseQuery) ||
      branch.emailId.toLowerCase().includes(lowerCaseQuery) ||
      branch.location.toLowerCase().includes(lowerCaseQuery) ||
      branch.ownerName.toLowerCase().includes(lowerCaseQuery) ||
      branch.subscriptionType.toLowerCase().includes(lowerCaseQuery) ||
      branch.startDate.toLowerCase().includes(lowerCaseQuery) ||
      branch.endDate.toLowerCase().includes(lowerCaseQuery) ||
      branch.amount.toString().includes(lowerCaseQuery) ||
      branch.numberOfUsers.toString().includes(lowerCaseQuery) ||
      (calculateRemainingDays(branch.endDate) > 0 ? 'active' : 'deactive').includes(lowerCaseQuery)
    );
  });

  return (
    <div>
      <Header />
      <h2 style={{ left: '25px', top: '126px', fontFamily: 'Public Sans', fontStyle: 'normal', fontWeight: '600', fontSize: '24px', lineHeight: '28px', color: '#000000' }}>
        Total Branches ({filteredBranches.length})
      </h2>
      <div className="filter-buttons-container">
        <span 
          className={activeFilter === 'all' ? 'active-filter' : ''} 
          onClick={() => setActiveFilter('all')}
        >
          Show All
        </span>
        <span 
          className={activeFilter === 'ongoing' ? 'active-filter' : ''} 
          onClick={() => setActiveFilter('ongoing')}
        >
          Ongoing Subscriptions
        </span>
        <span 
          className={activeFilter === 'expiring' ? 'active-filter' : ''} 
          onClick={() => setActiveFilter('expiring')}
        >
          Expiring Soon
        </span>
        <span 
          className={activeFilter === 'expired' ? 'active-filter' : ''} 
          onClick={() => setActiveFilter('expired')}
        >
          Expired
        </span>
      </div>
      <div className="create-branch-container">
        <button onClick={() => navigate('/create-branch')}>Add Branch</button>
      </div>
      <div className="search-bar-container">
        <input
          type="text"
          placeholder="Search branches..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>Serial No.</th>
              <th>Branch Code</th>
              <th>Branch Name/Email</th>
              <th>Location</th>
              <th>Owner Name</th>
              <th>Subscription Type</th>
              <th>Users</th>
              <th>Password</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Subscription Fees</th>
              <th>Remaining Days</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredBranches.map((branch, index) => (
              <tr key={branch.id}>
                <td>{index + 1}</td>
                <td>{branch.branchCode}</td>
                <td>{branch.branchName}<br />{branch.emailId}</td>
                <td>{branch.location}</td>
                <td>{branch.ownerName}</td>
                <td>{branch.subscriptionType}</td>
                <td>{branch.numberOfUsers}</td>
                <td>{branch.password}</td>
                <td>{branch.startDate}</td>
                <td>{branch.endDate}</td>
                <td>{branch.amount}</td>
                <td>{calculateRemainingDays(branch.endDate)}</td>
                <td className={calculateRemainingDays(branch.endDate) > 0 ? 'status-active' : 'status-deactive'}>
                  {calculateRemainingDays(branch.endDate) > 0 ? 'Active' : 'Deactive'}
                </td>
                <td className="actions">
                  <button onClick={() => handleEdit(branch.id)}>
                    <img src={editIcon} alt="Edit" className="icon" />
                  </button>
                  <button onClick={() => handleDelete(branch.id)}>
                    <img src={deleteIcon} alt="Delete" className="icon" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;
