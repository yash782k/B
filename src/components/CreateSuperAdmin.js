import React, { useState,useEffect } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { db } from '../firebaseConfig';
import { sendEmail } from '../utils/sendEmail';
import { useNavigate } from 'react-router-dom';
import { Password } from '@mui/icons-material';
import './CreateSuperAdmin.css';

const CreateSuperAdmin = () => {
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({ ...prevState, [name]: value }));
  };

  const handleCreateSuperAdmin = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const { email, name, password } = formData;

    try {
      const auth = getAuth();
      await createUserWithEmailAndPassword(auth, email, password);

      await addDoc(collection(db, 'superadmins'), {
        email,
        name,
        password,
        role: 'superadmin',
      });

      await sendEmail(email, password, name, '', '', '');

      setSuccess('Super Admin created and email sent successfully.');
      navigate('/admin-dashboard');
    } catch (error) {
      console.error(error); // Added for debugging
      setError('Failed to create Super Admin. Please try again.');
    }
  };

  const [superAdmins, setSuperAdmins] = useState([]);

  useEffect(() => {
    setSuperAdmins([
      { id: 1, name: 'Vaibhav Ugile', email: 'vaibhavugile17@gmail.com', password:'ABCD' },
      { id: 2, name: 'Yash Agarwal', email: 'yashagarwal17@gmail.com', password:'ABCD' },
      { id: 3, name: 'Tapan Sarkar', email: 'tapansarker903@gmail.com', password: 'ABCD' },
    ]);
  }, []);

  return (    
    <div>
          <div className="super-admin-table">
          <h3>Recently Created Super Admin</h3>
          <table>
            <thead>
              <tr>
                <th>Sr. No.</th>
                <th>Name</th>
                <th>Email</th>
                <th>Password</th>
              </tr>
            </thead>
            <tbody>
              {superAdmins.length > 0 ? (
                superAdmins.map((admin, index) => (
                  <tr key={admin.id}>
                    <td>{index + 1}</td>
                    <td>{admin.name}</td>
                    <td>{admin.email}</td>
                    <td>{admin.password}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4">No Data Available</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      <h2>Create New Super Admin</h2>
      <form onSubmit={handleCreateSuperAdmin}>
        <div className='form'>
        <label>
          Name
        </label>
        <label>
          Email ID
        </label>
        <label>
         Password
        </label>
        </div>
        <br/>
        <div className='input'>
           <input 
            type="text" 
            name="name" 
            placeholder='Name'
            value={formData.name} 
            onChange={handleChange} 
            required 
          />
             <input 
            type="email" 
            name="email" 
            placeholder='Email'
            value={formData.email} 
            onChange={handleChange} 
            required 
          />
            <input 
            type="password" 
            name="password" 
            placeholder='Password'
            value={formData.password} 
            onChange={handleChange} 
            required 
          />
          </div>
          <br />
          <div className='btn'>
        <button type="submit">Create Super Admin</button>
        </div>
      </form>
      {error && <p>{error}</p>}
      {success && <p>{success}</p>}
    </div>
  );
};

export default CreateSuperAdmin;
