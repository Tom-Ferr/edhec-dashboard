import React, { useState } from 'react';
import './tasks.css';

const Tasks = () => {
  const [tasks, setTasks] = useState([
    { id: 1, title: 'Clean Mixer-01', description: 'Thorough cleaning of mixer unit', status: 'pending', priority: 'high' },
    { id: 2, title: 'Quality Check', description: 'Check product quality parameters', status: 'in-progress', priority: 'medium' },
    { id: 3, title: 'Stock Inventory', description: 'Count flavoring stock', status: 'pending', priority: 'low' }
  ]);

  const updateTaskStatus = (taskId, newStatus) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, status: newStatus } : task
    ));
  };

  return (
    <div className="tasks-container">
      <h2>Daily Tasks</h2>
      <div className="tasks-list">
        {tasks.map(task => (
          <div key={task.id} className={`task-item ${task.priority}`}>
            <div className="task-info">
              <h3>{task.title}</h3>
              <p>{task.description}</p>
            </div>
            <span className={`status-badge ${task.status}`}>
              {task.status.replace('-', ' ')}
            </span>
            <div className="task-actions">
              {task.status === 'pending' && (
                <button 
                  onClick={() => updateTaskStatus(task.id, 'in-progress')}
                  className="start-btn"
                >
                  Start
                </button>
              )}
              {task.status === 'in-progress' && (
                <button 
                  onClick={() => updateTaskStatus(task.id, 'completed')}
                  className="complete-btn"
                >
                  Complete
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Tasks;