import React, { useState } from 'react';
import Alerts from '../alerts/Alerts';
import Tasks from '../tasks/Tasks';
import SelfDiagnosis from '../selfdiagnosis/SelfDiagnosis';
import Scan from '../scan/Scan';
import { AlertIcon } from '../../../components/icons/AlertIcon';
import { TasksIcon } from '../../../components/icons/TasksIcon';
import { CheckIcon } from '../../../components/icons/CheckIcon';
import { ScanIcon } from '../../../components/icons/ScanIcon';
import { LogoutIcon } from '../../../components/icons/LogoutIcon';
import './operatorDashboard.css';

const OperatorDashboard = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState('alerts');
  const [startX, setStartX] = useState(null);

  const tabs = [
    { id: 'alerts', label: 'Alerts', icon: <AlertIcon size={22} color="currentColor" /> },
    { id: 'tasks', label: 'Tasks', icon: <TasksIcon size={22} color="currentColor" /> },
    { id: 'selfdiagnosis', label: 'Check', icon: <CheckIcon size={22} color="currentColor" /> },
    { id: 'scan', label: 'Scan', icon: <ScanIcon size={22} color="currentColor" /> }
  ];

  const handleTouchStart = (e) => {
    setStartX(e.touches[0].clientX);
  };

  const handleTouchMove = (e) => {
    if (!startX) return;
    
    const currentX = e.touches[0].clientX;
    const diff = startX - currentX;

    if (Math.abs(diff) > 50) {
      const currentIndex = tabs.findIndex(tab => tab.id === activeTab);
      let newIndex;
      
      if (diff > 0) {
        newIndex = Math.min(currentIndex + 1, tabs.length - 1);
      } else {
        newIndex = Math.max(currentIndex - 1, 0);
      }
      
      setActiveTab(tabs[newIndex].id);
      setStartX(null);
    }
  };

  const handleTouchEnd = () => {
    setStartX(null);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'alerts':
        return <Alerts />;
      case 'tasks':
        return <Tasks />;
      case 'selfdiagnosis':
        return <SelfDiagnosis />;
      case 'scan':
        return <Scan />;
      default:
        return <Alerts />;
    }
  };

  return (
    <div 
      className="operator-dashboard"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Header */}
      <header className="operator-header">
        <div className="header-info">
          <h1>Miko Operator</h1>
          <span className="user-name">{user?.name || 'Operator'}</span>
        </div>
        <button onClick={onLogout} className="logout-btn">
          <LogoutIcon size={16} color="white" />
          <span style={{ marginLeft: '8px' }}>Logout</span>
        </button>
      </header>
  
      {/* Main Content - REMOVED SWIPE INDICATOR */}
      <main className="operator-content">
        {renderContent()}
      </main>
  
      {/* Bottom Navigation */}
      <nav className="bottom-nav">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`nav-btn ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <span className="nav-icon">{tab.icon}</span>
            <span className="nav-label">{tab.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
};

export default OperatorDashboard;