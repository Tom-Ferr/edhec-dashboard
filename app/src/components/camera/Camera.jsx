// src/components/Camera.jsx
import React, { useRef, useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { availableOperators } from '../../data/operators';
import './camera.css';

const Camera = forwardRef(({ onCapture, overlayText = "Position code within frame" }, ref) => {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const [cameraActive, setCameraActive] = useState(false);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } },
      });
      streamRef.current = stream;
      setCameraActive(true);
    } catch (err) {
      console.error('Error accessing camera:', err);
      alert('Unable to access camera. Please check permissions.');
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
      setCameraActive(false);
    }
  };

  const handleCapture = async () => {
    if (!videoRef.current) return;

    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

    try {
      const { data: { text } } = await window.Tesseract.recognize(
        canvas,
        'eng',
        { logger: m => console.log(m) }
      );

      const matchedOperator = availableOperators.find(op => text.includes(op.code));

      if (matchedOperator) {
        onCapture(matchedOperator);
        stopCamera();
      } else {
        alert('Code not recognized!');
      }
    } catch (err) {
      console.error('OCR failed', err);
      alert('OCR failed. Try again.');
    }
  };

  useImperativeHandle(ref, () => ({
    startCamera,
    stopCamera,
    handleCapture
  }));

  useEffect(() => {
    if (cameraActive && videoRef.current && streamRef.current) {
      videoRef.current.srcObject = streamRef.current;
      videoRef.current.play().catch(err => console.error('Playback failed', err));
    }
  }, [cameraActive]);

  useEffect(() => () => stopCamera(), []);

  return (
    <div className="camera-container">
      {cameraActive ? (
        <div className="camera-view">
          <video ref={videoRef} autoPlay playsInline className="camera-feed" />
          <div className="scan-overlay">
            <div className="scan-frame"></div>
            <p className="overlay-text">{overlayText}</p>
          </div>
        </div>
      ) : (
        <div className="scanner-placeholder">
          <p>Camera ready for scanning</p>
          <button onClick={startCamera} className="start-camera-btn">Start Camera</button>
        </div>
      )}
    </div>
  );
});

export default Camera;
