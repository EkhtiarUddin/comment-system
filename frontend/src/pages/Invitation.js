import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import '../styles/Auth.scss';

const Invitation = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [valid, setValid] = useState(false);
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const validateInvitation = async () => {
      try {
        const response = await api.get(`/auth/invitation/${token}`);
        setValid(true);
        setEmail(response.data.data.email);
      } catch (error) {
        setError(error.response?.data?.data?.message || 'Invalid invitation');
        setValid(false);
      } finally {
        setLoading(false);
      }
    };

    validateInvitation();
  }, [token]);

  const handleContinue = () => {
    navigate('/register', { state: { invitationToken: token, email } });
  };

  if (loading) {
    return <div className="auth-container">Loading...</div>;
  }

  if (!valid) {
    return (
      <div className="auth-container">
        <h2>Invalid Invitation</h2>
        <p>{error}</p>
        <button onClick={() => navigate('/login')} className="auth-button">
          Go to Login
        </button>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <h2>Invitation Valid</h2>
      <p>Your invitation for {email} is valid. Click continue to register.</p>
      <button onClick={handleContinue} className="auth-button">
        Continue to Registration
      </button>
    </div>
  );
};

export default Invitation;
