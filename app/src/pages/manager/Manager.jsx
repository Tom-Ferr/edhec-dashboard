import React, { useState } from "react";
import Sidebar from "../../components/manager/Sidebar/Sidebar";
import Dashboard from "../../components/manager/Dashboard/Dashboard";
import FloorPlan from "../../components/manager/FactoryFloor/FactoryFloorPlan";
import Settings from "../../components/manager/Settings/Settings";

export default function App() {
  const [activeItem, setActiveItem] = useState("dashboard");

  return (
    <div className="flex h-screen font-sans bg-gray-50">
      {/* Sidebar with fixed width */}
      <div className="w-64 flex-shrink-0">
        <Sidebar activeItem={activeItem} setActiveItem={setActiveItem} />
      </div>
      
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Unilever Styled Header */}
        <header className="bg-gradient-to-r from-blue-600 to-blue-800 shadow-lg border-b border-blue-900 px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {/* Unilever Logo Placeholder */}
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-md">
                  <span className="text-blue-600 font-bold text-lg unilever-header">U</span>
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white tracking-wide unilever-header-bold">
                    UNI-CREAMDASH
                  </h1>
                  <p className="text-blue-100 text-sm font-medium unilever-header">Ice Cream Factory Manager</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Status Indicator */}
              <div className="hidden md:flex items-center space-x-2 bg-blue-500 bg-opacity-30 px-3 py-1 rounded-full border border-blue-400">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-white text-sm font-medium unilever-header">Live Production</span>
              </div>
              
              {/* User Profile - Unilever Style */}
              <div className="flex items-center space-x-3 bg-white bg-opacity-20 px-4 py-2 rounded-xl border border-white border-opacity-30 backdrop-blur-sm">
                <div className="w-9 h-9 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-white text-sm font-bold unilever-header">AD</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-white text-sm font-bold unilever-header-bold">ADMIN USER</span>
                  <span className="text-blue-100 text-xs unilever-header">Factory Supervisor</span>
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-auto p-6 bg-gray-50">
          {activeItem === "dashboard" && <Dashboard />}
          {activeItem === "floor-plan" && <FloorPlan />}
          {activeItem === "settings" && <Settings />}
        </main>
      </div>
    </div>
  );
}