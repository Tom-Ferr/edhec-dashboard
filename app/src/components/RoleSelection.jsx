import React from 'react';
import { useNavigate } from 'react-router-dom';

// SVG Path Constants
const SVG_PATHS = {
  BRIEFCASE: {
    CASE: "M4 8a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8z",
    HANDLE: "M8 6V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2",
    LEFT_SIDE: "M8 6v12",
    RIGHT_SIDE: "M16 6v12"
  },
  USER_COG: {
    CIRCLES: [
      "M18 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z",
      "M9 7a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"
    ],
    PATHS: [
      "M10 15H6a4 4 0 0 0-4 4v2",
      "m21.7 16.4-.9-.3",
      "m15.2 13.9-.9-.3",
      "m16.6 18.7.3-.9",
      "m19.1 12.2.3-.9",
      "m19.6 18.7-.4-1",
      "m16.8 12.3-.4-1",
      "m14.3 16.6 1-.4",
      "m20.7 13.8 1-.4"
    ]
  },
  QR_CODE: {
    RECTANGLES: [
      "M3 3h5v5H3z",
      "M16 3h5v5h-5z", 
      "M3 16h5v5H3z"
    ],
    PATHS: [
      "M21 16h-3a2 2 0 0 0-2 2v3",
      "M21 21v.01",
      "M12 7v3a2 2 0 0 1-2 2H7",
      "M3 12h.01",
      "M12 3h.01",
      "M12 16v.01",
      "M16 12h1",
      "M21 12v.01",
      "M12 21v-1"
    ]
  }
};

// Role configuration
const ROLE_CONFIG = {
  manager: {
    title: 'Manager Mode',
    description: 'Monitor production, manage floor plan, view analytics and alerts',
    buttonText: 'Enter as Manager',
    icon: 'briefcase',
    buttonVariant: 'primary',
    route: '/manager'
  },
  operator: {
    title: 'Operator Mode', 
    description: 'Scan your ID card to access tasks, alerts, and status reporting',
    buttonText: 'Scan Operator ID',
    icon: 'user-cog',
    buttonVariant: 'outline',
    route: '/operator'
  }
};

// SVG Icon Components
const BriefcaseIcon = ({ className = "", ...props }) => (
  <svg 
    {...props} 
    className={`icon-base ${className}`} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    {/* Rounded rectangle for the case */}
    <rect x="4" y="8" width="16" height="10" rx="2" ry="2" />
    {/* Handle */}
    <path d={SVG_PATHS.BRIEFCASE.HANDLE} />
    {/* Left side */}
    <path d={SVG_PATHS.BRIEFCASE.LEFT_SIDE} />
    {/* Right side */}
    <path d={SVG_PATHS.BRIEFCASE.RIGHT_SIDE} />
  </svg>
);

const UserCogIcon = ({ className = "", ...props }) => (
  <svg 
    {...props} 
    className={`icon-base ${className}`} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <circle cx="18" cy="15" r="3" />
    <circle cx="9" cy="7" r="4" />
    {SVG_PATHS.USER_COG.PATHS.map((path, index) => (
      <path key={index} d={path} />
    ))}
  </svg>
);

const QrCodeIcon = ({ className = "", ...props }) => (
  <svg 
    {...props} 
    className={`icon-base ${className}`} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <rect x="3" y="3" width="5" height="5" rx="1" />
    <rect x="16" y="3" width="5" height="5" rx="1" />
    <rect x="3" y="16" width="5" height="5" rx="1" />
    {SVG_PATHS.QR_CODE.PATHS.map((path, index) => (
      <path key={index} d={path} />
    ))}
  </svg>
);

// Role Card Component
const RoleCard = ({ role, onSelect }) => {
  const config = ROLE_CONFIG[role];
  
  const getIcon = () => {
    switch (config.icon) {
      case 'briefcase':
        return <BriefcaseIcon className="role-icon" />;
      case 'user-cog':
        return <UserCogIcon className="role-icon" />;
      default:
        return null;
    }
  };

  const getButtonIcon = () => {
    switch (config.icon) {
      case 'briefcase':
        return <BriefcaseIcon className="button-icon" />;
      case 'user-cog':
        return <QrCodeIcon className="button-icon" />;
      default:
        return null;
    }
  };

  return (
    <div 
      className={`shadcn-card ${role}-card`} 
      data-testid={`card-${role}-mode`}
    >
      <div className="card-content">
        <div className="icon-container">
          {getIcon()}
        </div>
        
        <div className="text-content">
          <h2 className="card-title">{config.title}</h2>
          <p className="card-description">{config.description}</p>
        </div>
        
        <button 
          className={`shadcn-button shadcn-button-${config.buttonVariant}`}
          data-testid={`button-${role}-mode`}
          onClick={() => onSelect(config.route)}
        >
          {getButtonIcon()}
          <span className="button-text">{config.buttonText}</span>
        </button>
      </div>
    </div>
  );
};

// Main Role Selection Component
const RoleSelection = () => {
  const navigate = useNavigate();

  const handleRoleSelect = (route) => {
    // For operator route, we need to set a flag that we're navigating
    // This prevents Authentication.jsx from clearing storage
    if (route === '/operator') {
      localStorage.setItem('navigatingToOperator', 'true');
    }
    navigate(route);
  };

  return (
    <div className="role-selection">
      <div className="role-container">
        <header className="role-header">
          <h1 className="app-title">Miko Factory Dashboard</h1>
          <p className="app-subtitle">Ice Cream Production Monitoring by Unilever</p>
        </header>

        <div className="cards-grid">
          <RoleCard role="manager" onSelect={handleRoleSelect} />
          <RoleCard role="operator" onSelect={handleRoleSelect} />
        </div>

        <footer className="role-footer">
          <p className="footer-text">
            © 2025 Unilever - Miko Factory Management System
          </p>
        </footer>
      </div>
    </div>
  );
};

export default RoleSelection;