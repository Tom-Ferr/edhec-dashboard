import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import './App.css';
import Authentication from './pages/Authentication';
import Manager from './pages/manager/Manager';
import Operator from './pages/operator/Operator';
import OperatorApp from './operator/components/operatorapp/OperatorApp'; // Import your actual operator app

// Debug component to see current route
const RouteDebugger = () => {
  const location = useLocation();
  console.log('📍 Current route:', location.pathname);
  return null;
};

function App() {
  return (
    <Router>
      <RouteDebugger />
      <div className="App">
        <Routes>
          <Route path="/" element={<Authentication />} />
          <Route path="/manager" element={<Manager />} />
          <Route path="/operator" element={<Operator />} /> {/* Landing page with login options */}
          <Route path="/operator/app" element={<OperatorApp />} /> {/* Actual operator app */}
          <Route path="*" element={<Authentication />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
