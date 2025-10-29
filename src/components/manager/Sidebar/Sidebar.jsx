import React, { useState } from "react";
import { 
  LayoutDashboard, 
  Factory, 
  Settings,
  ChevronLeft,
  ChevronRight,
  Package,
  Truck,
  Warehouse
} from "lucide-react";

const menu = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "floor-plan", label: "Factory Floor", icon: Factory },
  { id: "settings", label: "Settings", icon: Settings },
];

export default function Sidebar({ activeItem, setActiveItem }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className={`bg-gray-900 text-white flex flex-col h-full transition-all duration-300 ${
      collapsed ? 'w-16' : 'w-64'
    }`}>
      {/* Logo Section */}
      <div className={`p-4 border-b border-gray-700 transition-all duration-300 ${
        collapsed ? 'px-3' : 'px-6'
      }`}>
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
            <Factory className="w-5 h-5" />
          </div>
          {!collapsed && (
            <span className="text-xl font-bold whitespace-nowrap">Uni-Creamdash</span>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3">
        <div className="space-y-1">
          {menu.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveItem(item.id)}
                className={`flex items-center w-full p-3 rounded-lg transition-all duration-200 group ${
                  activeItem === item.id
                    ? "bg-blue-500 text-white shadow-lg"
                    : "text-gray-300 hover:bg-gray-800 hover:text-white"
                } ${collapsed ? 'justify-center' : 'space-x-3'}`}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {!collapsed && (
                  <span className="font-medium whitespace-nowrap">{item.label}</span>
                )}
                
                {/* Tooltip for collapsed state */}
                {collapsed && (
                  <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-sm rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-50">
                    {item.label}
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Factory Status - Hidden when collapsed */}
        {!collapsed && (
          <div className="mt-6 p-3 bg-gray-800 rounded-lg">
            <h3 className="text-sm font-medium text-gray-400 mb-2">Factory Status</h3>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-white">Operational</span>
            </div>
            <div className="mt-2 text-xs text-gray-400">
              12 machines active
            </div>
          </div>
        )}

        {/* Simple status indicator when collapsed */}
        {collapsed && (
          <div className="mt-6 flex justify-center">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" title="Operational"></div>
          </div>
        )}
      </nav>

      {/* Collapse Button */}
      <div className="p-3 border-t border-gray-700">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex items-center justify-center w-full p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors duration-200"
        >
          {collapsed ? (
            <ChevronRight className="w-5 h-5" />
          ) : (
            <>
              <ChevronLeft className="w-5 h-5" />
              <span className="ml-2 text-sm whitespace-nowrap">Collapse</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}