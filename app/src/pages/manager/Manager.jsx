import React, { useState } from "react";
import Sidebar from "../../components/manager/Sidebar/Sidebar";
import Dashboard from "../../components/manager/Dashboard/Dashboard";
import FloorPlan from "../../components/manager/FactoryFloor/FactoryFloorPlan";
import Settings from "../../components/manager/Settings/Settings";

export default function App() {
  const [activeItem, setActiveItem] = useState("dashboard");

  return (
    <div className="flex h-screen font-sans bg-gray-50">
      <Sidebar activeItem={activeItem} setActiveItem={setActiveItem} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-semibold text-gray-900">Uni-Creamdash Manager</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">AD</span>
                </div>
                <span className="text-sm font-medium text-gray-700">Admin User</span>
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