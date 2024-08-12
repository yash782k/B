import React, { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { db } from '../firebaseConfig';
import { sendEmail } from '../utils/sendEmail';
import { useNavigate } from 'react-router-dom';

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

  return (
    <div>
      <h2>Create New Super Admin</h2>
      <form onSubmit={handleCreateSuperAdmin}>
        <label>
          Email:
          <input 
            type="email" 
            name="email" 
            value={formData.email} 
            onChange={handleChange} 
            required 
          />
        </label>
        <br />
        <label>
          Name:
          <input 
            type="text" 
            name="name" 
            value={formData.name} 
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
        <button type="submit">Create Super Admin</button>
      </form>
      {error && <p>{error}</p>}
      {success && <p>{success}</p>}
    </div>
  );
};

export default CreateSuperAdmin;
