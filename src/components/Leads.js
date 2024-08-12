import React, { useState, useEffect } from 'react';
import { collection, addDoc, getDocs, updateDoc, doc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import './Leads.css'; // Add your custom styling here

const Leads = () => {
  const [leads, setLeads] = useState([]);
  const [filteredLeads, setFilteredLeads] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    mobileNo: '',
    emailId: '',
    businessType: '',
    demoDate: '',
    demoTime: '',
    status: 'Fresh Lead',
  });
  const [filter, setFilter] = useState('ALL Details');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const leadsCollection = collection(db, 'leads');
        const leadSnapshot = await getDocs(leadsCollection);
        const leadList = leadSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setLeads(leadList);
        setFilteredLeads(leadList);
      } catch (error) {
        setError('Error fetching leads.');
      }
    };

    fetchLeads();
  }, []);

  useEffect(() => {
    if (filter === 'ALL Details') {
      setFilteredLeads(leads);
    } else {
      setFilteredLeads(leads.filter(lead => lead.status === filter));
    }
  }, [filter, leads]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      await addDoc(collection(db, 'leads'), formData);
      setSuccess('Lead added successfully.');
      setFormData({
        name: '',
        mobileNo: '',
        emailId: '',
        businessType: '',
        demoDate: '',
        demoTime: '',
        status: 'Fresh Lead',
      });
      setShowForm(false);
      // Re-fetch leads
      const leadsCollection = collection(db, 'leads');
      const leadSnapshot = await getDocs(leadsCollection);
      const leadList = leadSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setLeads(leadList);
    } catch (error) {
      setError('Failed to add lead.');
    }
  };

  const handleFilterClick = (filterValue) => {
    setFilter(filterValue);
    setShowForm(false); // Close the form when changing filters
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      const leadDoc = doc(db, 'leads', id);
      await updateDoc(leadDoc, { status: newStatus });
      // Re-fetch leads
      const leadsCollection = collection(db, 'leads');
      const leadSnapshot = await getDocs(leadsCollection);
      const leadList = leadSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setLeads(leadList);
    } catch (error) {
      setError('Failed to update lead status.');
    }
  };

  return (
    <div className="leads">
      <h2>Leads</h2>
      <div className="filters">
        <button onClick={() => handleFilterClick('ALL Details')}>ALL Details</button>
        <button onClick={() => handleFilterClick('Fresh Lead')}>Fresh Lead</button>
        <button onClick={() => handleFilterClick('Details Share')}>Details Share</button>
        <button onClick={() => handleFilterClick('Demo Schedule')}>Demo Schedule</button>
        <button onClick={() => handleFilterClick('Demo Done')}>Demo Done</button>
        <button onClick={() => handleFilterClick('Loss')}>Loss</button>
        <button onClick={() => handleFilterClick('Successful')}>Successful</button>
      </div>
      <button className="create-btn" onClick={() => setShowForm(true)}>Generate Fresh Lead</button>
      {showForm && (
        <form onSubmit={handleSubmit} className="lead-form">
          <label>Name:
            <input type="text" name="name" value={formData.name} onChange={handleChange} required />
          </label>
          <label>Mobile No:
            <input type="text" name="mobileNo" value={formData.mobileNo} onChange={handleChange} required />
          </label>
          <label>Email ID:
            <input type="email" name="emailId" value={formData.emailId} onChange={handleChange} required />
          </label>
          <label>Business Type:
            <input type="text" name="businessType" value={formData.businessType} onChange={handleChange} required />
          </label>
          <label>Demo Date:
            <input type="date" name="demoDate" value={formData.demoDate} onChange={handleChange} required />
          </label>
          <label>Demo Time:
            <input type="time" name="demoTime" value={formData.demoTime} onChange={handleChange} required />
          </label>
          <label>Status:
            <select name="status" value={formData.status} onChange={handleChange} required>
              <option value="Fresh Lead">Fresh Lead</option>
              <option value="Demo Schedule">Demo Schedule</option>
              <option value="Demo Done">Demo Done</option>
              <option value="Loss">Loss</option>
              <option value="Successful">Successful</option>
            </select>
          </label>
          <button type="submit">Add Lead</button>
          <button type="button" className="cancel-btn" onClick={() => setShowForm(false)}>Cancel</button>
        </form>
      )}
      <div className="lead-list">
        {filteredLeads.map(lead => (
          <div key={lead.id} className="lead-item">
            <p><strong>Name:</strong> {lead.name}</p>
            <p><strong>Mobile No:</strong> {lead.mobileNo}</p>
            <p><strong>Email ID:</strong> {lead.emailId}</p>
            <p><strong>Business Type:</strong> {lead.businessType}</p>
            <p><strong>Demo Date:</strong> {lead.demoDate}</p>
            <p><strong>Demo Time:</strong> {lead.demoTime}</p>
            <p><strong>Status:</strong>
              <select value={lead.status} onChange={(e) => handleStatusChange(lead.id, e.target.value)}>
                <option value="Fresh Lead">Fresh Lead</option>
                <option value="Demo Schedule">Demo Schedule</option>
                <option value="Demo Done">Demo Done</option>
                <option value="Loss">Loss</option>
                <option value="Successful">Successful</option>
              </select>
            </p>
          </div>
        ))}
      </div>
      {error && <p className="error-message">{error}</p>}
      {success && <p className="success-message">{success}</p>}
    </div>
  );
};

export default Leads;
