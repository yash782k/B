import React, { useState } from 'react';
import { Button, Checkbox, TextField } from '@mui/material';
import { signInWithEmailAndPassword, getAuth } from 'firebase/auth';
import { collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { useNavigate } from 'react-router-dom';
import './login.css';
import Logo from '../assets/logo.png';
import BgAbstract from '../assets/sd.jpg';
import { fetchRealTimeDate } from '../utils/fetchRealTimeDate';

const HARD_CODED_ADMIN_EMAIL = 'admin@example.com'; // Admin email
const HARD_CODED_ADMIN_PASSWORD = 'admin123'; // Admin password

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    const auth = getAuth();

    try {
      if (email === HARD_CODED_ADMIN_EMAIL && password === HARD_CODED_ADMIN_PASSWORD) {
        navigate('/admin-dashboard');
        return;
      }

      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const branchQuery = query(collection(db, 'branches'), where('emailId', '==', email));
      const querySnapshot = await getDocs(branchQuery);

      if (querySnapshot.empty) {
        setError('No branch found for this user.');
        setLoading(false);
        return;
      }

      const branchData = querySnapshot.docs[0].data();
      const today = await fetchRealTimeDate();

      console.log('Today\'s Date:', today);
      console.log('Active Date:', branchData.activeDate);
      console.log('Deactive Date:', branchData.deactiveDate);

      const activeDate = new Date(branchData.activeDate);
      const deactiveDate = new Date(branchData.deactiveDate);

      if (today < activeDate) {
        setMessage('Plan not active.');
        setLoading(false);
        return;
      }

      if (today > deactiveDate) {
        setMessage('Plan is expired.');
        setLoading(false);
        return;
      }

      if (branchData.firstLogin) {
        navigate('/change-password');
        const branchDoc = doc(db, 'branches', querySnapshot.docs[0].id);
        await updateDoc(branchDoc, { firstLogin: false });
        return;
      }

      if (branchData.branchCode === 'SUPERADMIN123') {
        navigate('/admin-dashboard');
      } else {
        navigate('/welcome');
      }

    } catch (error) {
      console.error('Login error:', error);
      setError('Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <img src={BgAbstract} alt="Background" className="background-image" />

      <div className="logo-container">
        <img src={Logo} alt="Logo" className="logo-image" />
      </div>

      <div className="welcome-text">
        Welcome <br /> Back!
      </div>

      <div className="form-container">
        <div className="title">Sign In</div>
        <div className="subtitle">
          Welcome back! Please sign in to your account
        </div>

        <form onSubmit={handleLogin} className="login-form">
          <div className="form-group">
            <TextField
              label="Email ID"
              variant="outlined"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              fullWidth
            />
          </div>
          <div className="form-group">
            <TextField
              label="Password"
              variant="outlined"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              fullWidth
            />
          </div>

          <div className="remember-me">
            <Checkbox defaultChecked />
            <label>Remember</label>
          </div>

          <div className="forgot-password">
            Forgot your password
          </div>

          <Button fullWidth variant="contained" type="submit" disabled={loading}>
            {loading ? 'Logging in...' : 'Sign In'}
          </Button>

          {error && <p className="error-message">{error}</p>}
          {message && <p className="status-message">{message}</p>}
        </form>
      </div>
    </div>
  );
};

export default Login;
