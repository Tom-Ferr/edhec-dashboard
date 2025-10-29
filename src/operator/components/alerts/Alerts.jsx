import React from 'react';
import { WarningIcon } from '../../../components/icons/WarningIcon';
import { ErrorIcon } from '../../../components/icons/ErrorIcon';
import { InfoIcon } from '../../../components/icons/InfoIcon';
import './alerts.css';

const Alerts = () => {
  const alerts = [
    { id: 1, type: 'warning', message: 'Mixer temperature high', time: '10:30 AM', machine: 'Mixer-01' },
    { id: 2, type: 'info', message: 'Regular maintenance due', time: '09:15 AM', machine: 'Freezer-02' },
    { id: 3, type: 'error', message: 'Conveyor belt speed low', time: '08:45 AM', machine: 'Conveyor-A' }
  ];

  const getIcon = (type) => {
    switch (type) {
      case 'warning':
        return <WarningIcon size={24} color="#ffa502" />;
      case 'error':
        return <ErrorIcon size={24} color="#ff4757" />;
      case 'info':
        return <InfoIcon size={24} color="#3742fa" />;
      default:
        return <InfoIcon size={24} color="#3742fa" />;
    }
  };

  return (
    <div className="alerts-container">
      <h2>Alerts & Notifications</h2>
      <div className="alerts-list">
        {alerts.map(alert => (
          <div key={alert.id} className={`alert-item ${alert.type}`}>
            <div className="alert-icon">
              {getIcon(alert.type)}
            </div>
            <div className="alert-content">
              <h3>{alert.message}</h3>
              <p>Machine: {alert.machine}</p>
              <span className="alert-time">{alert.time}</span>
            </div>
            <button className="acknowledge-btn">Acknowledge</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Alerts;