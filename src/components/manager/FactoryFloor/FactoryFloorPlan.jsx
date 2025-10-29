import React, { useState, useRef, useEffect } from 'react';
import './FactoryFloorPlan.css';

const FactoryFloorPlan = () => {
  // State management
  const [machines, setMachines] = useState([]);
  const [conveyors, setConveyors] = useState([]);
  const [selectedTool, setSelectedTool] = useState(null);
  const [draggedMachine, setDraggedMachine] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionStart, setConnectionStart] = useState(null);

  // Available machine types
  const machineTypes = [
    { id: 'mixer', name: 'Mixer', color: '#4CAF50', icon: '⚗️' },
    { id: 'processor', name: 'Processor', color: '#2196F3', icon: '⚙️' },
    { id: 'packer', name: 'Packer', color: '#FF9800', icon: '📦' },
    { id: 'shipper', name: 'Shipper', color: '#9C27B0', icon: '🚚' },
    { id: 'storage', name: 'Storage', color: '#795548', icon: '🏪' }
  ];

  // Refs
  const floorRef = useRef(null);

  // Reset factory to empty state
  const resetFactory = () => {
    setMachines([]);
    setConveyors([]);
    setIsConnecting(false);
    setConnectionStart(null);
  };

  // Handle machine drag start
  const handleMachineDragStart = (machineType, e) => {
    setDraggedMachine(machineType);
    e.dataTransfer.setData('text/plain', machineType.id);
    e.dataTransfer.effectAllowed = 'copy';
  };

  // Handle floor drop
  const handleFloorDrop = (e) => {
    e.preventDefault();
    if (!draggedMachine) return;

    const rect = floorRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const newMachine = {
      id: `machine-${Date.now()}`,
      type: draggedMachine.id,
      name: `${draggedMachine.name} ${machines.length + 1}`,
      x: Math.max(0, x - 40),
      y: Math.max(0, y - 40),
      status: 'idle',
      progress: 0
    };

    setMachines(prev => [...prev, newMachine]);
    setDraggedMachine(null);
  };

  // Handle drag over
  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  };

  // Start connection between machines
  const startConnection = (machineId, e) => {
    e.stopPropagation();
    setIsConnecting(true);
    setConnectionStart(machineId);
  };

  // Complete connection
  const completeConnection = (targetMachineId, e) => {
    e.stopPropagation();
    if (isConnecting && connectionStart && connectionStart !== targetMachineId) {
      const newConveyor = {
        id: `conveyor-${Date.now()}`,
        from: connectionStart,
        to: targetMachineId,
        status: 'active'
      };
      setConveyors(prev => [...prev, newConveyor]);
    }
    setIsConnecting(false);
    setConnectionStart(null);
  };

  // Delete machine
  const deleteMachine = (machineId, e) => {
    e.stopPropagation();
    setMachines(prev => prev.filter(m => m.id !== machineId));
    setConveyors(prev => prev.filter(c => c.from !== machineId && c.to !== machineId));
  };

  // Simulate production
  useEffect(() => {
    const interval = setInterval(() => {
      setMachines(prev => prev.map(machine => {
        if (machine.status === 'processing') {
          const newProgress = Math.min(100, machine.progress + Math.random() * 10);
          return {
            ...machine,
            progress: newProgress,
            status: newProgress >= 100 ? 'completed' : 'processing'
          };
        }
        
        // Randomly start processing if idle and has input
        if (machine.status === 'idle' && Math.random() > 0.7) {
          return { ...machine, status: 'processing', progress: 0 };
        }
        
        // Reset completed machines after delay
        if (machine.status === 'completed' && Math.random() > 0.9) {
          return { ...machine, status: 'idle', progress: 0 };
        }
        
        return machine;
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Get machine status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'processing': return '#2196F3';
      case 'completed': return '#4CAF50';
      case 'error': return '#F44336';
      default: return '#9E9E9E';
    }
  };

  // Calculate conveyor path
  const calculateConveyorPath = (fromMachine, toMachine) => {
    if (!fromMachine || !toMachine) return '';
    
    const startX = fromMachine.x + 40;
    const startY = fromMachine.y + 40;
    const endX = toMachine.x + 40;
    const endY = toMachine.y + 40;
    
    // Create a curved path
    const midX = (startX + endX) / 2;
    return `M ${startX} ${startY} C ${midX} ${startY} ${midX} ${endY} ${endX} ${endY}`;
  };

  return (
    <div className="factory-floor-plan">
      {/* Toolbar */}
      <div className="factory-toolbar">
        <div className="toolbar-header">
          <h3>Factory Tools</h3>
          <button 
            className="reset-btn"
            onClick={resetFactory}
            title="Reset Factory Floor"
          >
            🔄 Reset
          </button>
        </div>
        
        <div className="tools-grid">
          {machineTypes.map(machine => (
            <div
              key={machine.id}
              className="tool-item"
              draggable
              onDragStart={(e) => handleMachineDragStart(machine, e)}
              onClick={() => setSelectedTool(machine.id)}
            >
              <div className="tool-icon" style={{ backgroundColor: machine.color }}>
                {machine.icon}
              </div>
              <span>{machine.name}</span>
            </div>
          ))}
        </div>
        
        <div className="connection-mode">
          <button 
            className={`connect-btn ${isConnecting ? 'active' : ''}`}
            onClick={() => setIsConnecting(!isConnecting)}
          >
            {isConnecting ? 'Connecting...' : 'Connect Machines'}
          </button>
          <small>Click to toggle connection mode</small>
        </div>
      </div>

      {/* Factory Floor */}
      <div className="factory-floor-container">
        <div 
          ref={floorRef}
          className="factory-floor"
          onDrop={handleFloorDrop}
          onDragOver={handleDragOver}
        >
          {/* Grid Background */}
          <div className="floor-grid" />
          
          {/* Conveyors */}
          <svg className="conveyors-layer">
            <defs>
              <marker
                id="arrowhead"
                markerWidth="10"
                markerHeight="7"
                refX="9"
                refY="3.5"
                orient="auto"
              >
                <polygon points="0 0, 10 3.5, 0 7" fill="#666" />
              </marker>
            </defs>
            {conveyors.map(conveyor => {
              const fromMachine = machines.find(m => m.id === conveyor.from);
              const toMachine = machines.find(m => m.id === conveyor.to);
              
              if (!fromMachine || !toMachine) return null;
              
              return (
                <path
                  key={conveyor.id}
                  d={calculateConveyorPath(fromMachine, toMachine)}
                  className="conveyor-path"
                  stroke={getStatusColor(conveyor.status)}
                />
              );
            })}
          </svg>

          {/* Machines */}
          {machines.map(machine => {
            const machineType = machineTypes.find(mt => mt.id === machine.type);
            return (
              <div
                key={machine.id}
                className="machine"
                style={{
                  left: `${machine.x}px`,
                  top: `${machine.y}px`,
                  borderColor: machineType?.color
                }}
                onClick={(e) => {
                  if (isConnecting) {
                    if (connectionStart) {
                      completeConnection(machine.id, e);
                    } else {
                      startConnection(machine.id, e);
                    }
                  }
                }}
              >
                <div 
                  className="machine-icon"
                  style={{ backgroundColor: machineType?.color }}
                >
                  {machineType?.icon}
                </div>
                
                <div className="machine-info">
                  <div className="machine-name">{machine.name}</div>
                  <div className="machine-status" style={{ color: getStatusColor(machine.status) }}>
                    {machine.status}
                  </div>
                </div>
                
                {/* Progress Bar */}
                {machine.status === 'processing' && (
                  <div className="progress-bar">
                    <div 
                      className="progress-fill"
                      style={{ 
                        width: `${machine.progress}%`,
                        backgroundColor: machineType?.color
                      }}
                    />
                  </div>
                )}
                
                {/* Connection Points */}
                <div className="connection-points">
                  <div 
                    className="connection-point input"
                    onMouseDown={(e) => startConnection(machine.id, e)}
                  />
                  <div 
                    className="connection-point output"
                    onMouseDown={(e) => startConnection(machine.id, e)}
                  />
                </div>
                
                {/* Delete Button */}
                <button 
                  className="delete-machine"
                  onClick={(e) => deleteMachine(machine.id, e)}
                >
                  ×
                </button>
              </div>
            );
          })}

          {/* Drop Zone Overlay */}
          {draggedMachine && (
            <div className="drop-zone-overlay">
              Drop machine here
            </div>
          )}

          {/* Empty State */}
          {machines.length === 0 && !draggedMachine && (
            <div className="empty-state">
              <div className="empty-state-icon">🏭</div>
              <h3>Empty Factory Floor</h3>
              <p>Drag machines from the toolbar to get started</p>
            </div>
          )}
        </div>

        {/* Status Panel */}
        <div className="status-panel">
          <h4>Factory Status</h4>
          <div className="status-info">
            <div>Machines: {machines.length}</div>
            <div>Conveyors: {conveyors.length}</div>
            <div>Active: {machines.filter(m => m.status === 'processing').length}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FactoryFloorPlan;