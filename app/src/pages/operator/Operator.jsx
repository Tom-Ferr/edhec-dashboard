// src/pages/Operator.jsx
import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Camera from '../../components/camera/Camera';
import { SendArrowIcon } from '../../components/icons/SendArrowIcon';
import './operator.css';


const Operator = () => {
  const [employeeCode, setEmployeeCode] = useState('');
  const cameraRef = useRef();
  const navigate = useNavigate();

  const handleCameraCapture = (operator) => {
    localStorage.setItem('operatorUser', JSON.stringify(operator));
    navigate('/operator/app');
  };

  const handleManualSubmit = (e) => {
    e.preventDefault();
    if (employeeCode.trim()) {
      const userData = {
        id: employeeCode,
        name: `Operator ${employeeCode}`,
        role: 'operator',
      };
      localStorage.setItem('operatorUser', JSON.stringify(userData));
      navigate('/operator/app');
    }
  };

  return (
    <div className="operator-container">
      <header className="login-header">
        <h1 className="title-login">Operator Access</h1>
        <p className="text-login">Scan your ID card or enter code manually</p>
      </header>

      <main className="operator-main">
        <div className="camera-wrapper">
          <Camera
            ref={cameraRef}
            onCapture={handleCameraCapture}
            overlayText="Scan your operator ID"
          />
        </div>

        <div className="camera-buttons">
          <button className="capture-btn" onClick={() => cameraRef.current.handleCapture()}>Validate</button>
          <button className="stop-camera-btn" onClick={() => cameraRef.current.stopCamera()}>Stop Camera</button>
        </div>
      </main>

      <footer className="manual-entry">
        <p>Or enter code manually:</p>
        <form onSubmit={handleManualSubmit} className="manual-form">
          <input
            type="text"
            placeholder="Enter employee code"
            value={employeeCode}
            onChange={(e) => setEmployeeCode(e.target.value)}
          />
          <button type="submit" className="send-btn" aria-label="Send code">
            <SendArrowIcon size={22} color="white" />
          </button>
        </form>
      </footer>
    </div>
  );
};

export default Operator;
