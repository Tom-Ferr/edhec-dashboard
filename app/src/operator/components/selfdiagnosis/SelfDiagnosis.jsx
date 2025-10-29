import React, { useState } from 'react';
import './selfDiagnosis.css';

const SelfDiagnosis = () => {
  const [checklist, setChecklist] = useState([
    { id: 1, question: 'Are all safety guards in place?', checked: false },
    { id: 2, question: 'Is the work area clean and organized?', checked: false },
    { id: 3, question: 'Are all tools properly stored?', checked: false },
    { id: 4, question: 'Any unusual noises from equipment?', checked: false },
    { id: 5, question: 'Proper PPE being worn?', checked: false }
  ]);

  const [notes, setNotes] = useState('');

  const toggleCheck = (id) => {
    setChecklist(checklist.map(item => 
      item.id === id ? { ...item, checked: !item.checked } : item
    ));
  };

  const submitDiagnosis = () => {
    const allChecked = checklist.every(item => item.checked);
    if (allChecked) {
      alert('Self-diagnosis completed successfully!');
    } else {
      alert('Please complete all checklist items');
    }
  };

  return (
    <div className="diagnosis-container">
      <h2>Self-Diagnosis Checklist</h2>
      <div className="checklist">
        {checklist.map(item => (
          <div key={item.id} className="checklist-item">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={item.checked}
                onChange={() => toggleCheck(item.id)}
              />
              <span className="checkmark"></span>
              {item.question}
            </label>
          </div>
        ))}
      </div>
      
      <div className="notes-section">
        <h3>Additional Notes</h3>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Enter any observations or concerns..."
          rows="4"
        />
      </div>

      <button onClick={submitDiagnosis} className="submit-btn">
        Submit Diagnosis
      </button>
    </div>
  );
};

export default SelfDiagnosis;