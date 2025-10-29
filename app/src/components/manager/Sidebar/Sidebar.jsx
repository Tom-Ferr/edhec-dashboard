import React, { useState } from "react";
import { 
  LayoutDashboard, 
  Factory, 
  Settings,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { getRandomManagerName, getRandomStatusMessage } from "../../../data/managerNames";
import './sidebar.css';

// Menu Configuration
const MENU_ITEMS = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "floor-plan", label: "Factory Floor", icon: Factory },
  { id: "settings", label: "Settings", icon: Settings },
];

// SVG Path Constants
const SVG_PATHS = {
  WAVE_CURVE: "M -10,0 L -10,100 C 25,80 75,120 110,60 L 110,0 Z"
};

export default function Sidebar({ activeItem, setActiveItem }) {
  const [collapsed, setCollapsed] = useState(false);
  const [managerName] = useState(getRandomManagerName());
  const [statusMessage] = useState(getRandomStatusMessage());

  // Curved Corner SVG Component
  const CurvedCorner = () => (
    <div className="curved-corner-container">
      <svg 
        width="120%" 
        height="100%" 
        viewBox="0 0 100 100" 
        preserveAspectRatio="none"
        className="curved-corner-svg"
      >
        <path 
          d={SVG_PATHS.WAVE_CURVE} 
          fill="var(--blue-main)"
        />
      </svg>
    </div>
  );

  // Navigation Item Component
  const NavItem = ({ item }) => {
    const Icon = item.icon;
    const isActive = activeItem === item.id;
    
    return (
      <button
        onClick={() => setActiveItem(item.id)}
        className={`nav-item ${isActive ? 'nav-item-active' : 'nav-item-inactive'} ${
          collapsed ? 'nav-item-collapsed' : 'nav-item-expanded'
        }`}
      >
        <Icon className="nav-icon" />
        {!collapsed && (
          <span className="nav-label">{item.label}</span>
        )}
        
        {collapsed && (
          <div className="nav-tooltip">
            {item.label}
          </div>
        )}
      </button>
    );
  };

  // Miko Logo Component
  const MikoLogo = () => (
    <div className="miko-logo">
      <div className="miko-icon">M</div>
    </div>
  );

  // Manager ID Card Component - Miko inspired
  const ManagerCard = () => (
    <div className="manager-card">
      <div className="manager-header">
        <MikoLogo />
        <div className="manager-info">
          <div className="manager-name">{managerName}</div>
          <div className="manager-role">Factory Manager</div>
        </div>
      </div>
      
      <div className="factory-status">
        <div className="status-content">
          <div className="status-indicator">
            <div className="status-dot"></div>
            <span className="status-text">{statusMessage}</span>
          </div>
          <div className="production-stats">
            <div className="stat-item">
              <span className="stat-number">12</span>
              <span className="stat-label">Machines</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">8</span>
              <span className="stat-label">Active</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">95%</span>
              <span className="stat-label">Efficiency</span>
            </div>
          </div>
        </div>
        <div className="miko-signature">Powered by Miko</div>
      </div>
    </div>
  );

  // Collapsed Manager Indicator
  const CollapsedManagerIndicator = () => (
    <div className="collapsed-manager-indicator">
      <div className="miko-logo-small">
        <div className="miko-icon-small">M</div>
      </div>
      <div className="collapsed-status-dot"></div>
    </div>
  );

  // Collapse Button Component
  const CollapseButton = () => (
    <button
      onClick={() => setCollapsed(!collapsed)}
      className="collapse-button"
    >
      {collapsed ? (
        <ChevronRight className="collapse-icon" />
      ) : (
        <>
          <ChevronLeft className="collapse-icon" />
          <span className="collapse-text">Collapse</span>
        </>
      )}
    </button>
  );

  return (
    <div className="sidebar-container">
      <div className="sidebar-background">
        <div className={`pink-sidebar ${collapsed ? 'w-16' : 'w-[226px]'}`}>
          <CurvedCorner />
          <div className="sidebar-content">
            <nav className="sidebar-nav">
              <div className="nav-menu">
                {MENU_ITEMS.map((item) => (
                  <NavItem key={item.id} item={item} />
                ))}
              </div>
            </nav>

            {/* Centered Manager Section */}
            <div className="manager-section">
              {!collapsed ? <ManagerCard /> : <CollapsedManagerIndicator />}
            </div>

            <div className="collapse-section">
              <CollapseButton />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}