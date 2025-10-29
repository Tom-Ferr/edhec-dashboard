import React, { useState, useRef } from 'react';
import Camera from '../../../components/camera/Camera';
import './scan.css';

const Scan = () => {
  const [scanResult, setScanResult] = useState('');
  const [scanHistory, setScanHistory] = useState([]);
  const cameraRef = useRef();

  const handleCapture = () => {
    const machines = ['Mixer-01', 'Freezer-02', 'Packaging-A', 'Quality-Check'];
    const randomMachine = machines[Math.floor(Math.random() * machines.length)];
    const result = `${randomMachine} scanned at ${new Date().toLocaleTimeString()}`;
    setScanResult(result);
    setScanHistory(prev => [result, ...prev.slice(0, 4)]);
  };

  const handleManualEntry = () => {
    const code = prompt('Enter machine code:');
    if (code) {
      const result = `${code} entered manually at ${new Date().toLocaleTimeString()}`;
      setScanResult(result);
      setScanHistory(prev => [result, ...prev.slice(0, 4)]);
    }
  };

  return (
    <div className="scan-container">
      <h2>Machine Scan</h2>

      <div className="scan-interface">
        <Camera
          ref={cameraRef}
          onCapture={handleCapture}
          overlayText="Position QR code within frame"
          captureLabel="Capture Scan"
        />

        {/* Add camera control buttons */}
        <div className="camera-buttons">
          <button className="capture-btn" onClick={() => cameraRef.current.handleCapture()}>
            Validate Scan
          </button>
          <button className="stop-camera-btn" onClick={() => cameraRef.current.stopCamera()}>
            Stop Camera
          </button>
        </div>

        <div className="scan-buttons">
          <button onClick={handleManualEntry} className="manual-btn">
            Manual Entry
          </button>
        </div>
      </div>

      {scanResult && (
        <div className="scan-result">
          <h3>Last Scan Result:</h3>
          <p>{scanResult}</p>
        </div>
      )}

      <div className="scan-history">
        <h3>Recent Scans</h3>
        {scanHistory.length > 0 ? (
          <ul>
            {scanHistory.map((scan, index) => (
              <li key={index}>{scan}</li>
            ))}
          </ul>
        ) : (
          <p>No scans yet</p>
        )}
      </div>
    </div>
  );
};

export default Scan;