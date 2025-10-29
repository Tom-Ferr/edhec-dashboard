import React, { useState, useEffect } from 'react';
import OperatorDashboard from '../operatordashboard/OperatorDashboard';
import { useNavigate } from 'react-router-dom';
import operatorapp from './operatorApp.css';

const OperatorApp = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    console.log('🔍 OperatorApp - Checking for user...');
    
    const storedUser = localStorage.getItem('operatorUser');
    
    if (!storedUser) {
      console.log('❌ No user found, redirecting to operator login');
      navigate('/operator');
      return;
    }
    
    const userData = JSON.parse(storedUser);
    console.log('✅ User authenticated:', userData);
    setUser(userData);
    setLoading(false);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('operatorUser');
    navigate('/');
  };

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        backgroundColor: 'lightblue'
      }}>
        <div style={{ 
          fontSize: '1.5rem', 
          color: 'darkblue',
          textAlign: 'center'
        }}>
          Loading Operator Dashboard...
        </div>
      </div>
    );
  }

  return (
    <div className="operator-app-wrapper">
      <div className="operator-app-container">
        <OperatorDashboard user={user} onLogout={handleLogout} />
      </div>
    </div>
  );
};

export default OperatorApp;
