import React from "react";
import { AlertTriangle, CheckCircle, Info, X } from "lucide-react";

export default function AlertsPanel() {
  const alerts = [
    {
      type: "warning",
      icon: AlertTriangle,
      title: "Mixer A1 Temperature High",
      description: "Temperature reading 5°C above normal",
      time: "2 minutes ago",
      active: true
    },
    {
      type: "success",
      icon: CheckCircle,
      title: "Batch #004 Completed",
      description: "Successfully produced 500L Vanilla Cream",
      time: "1 hour ago",
      active: false
    },
    {
      type: "info",
      icon: Info,
      title: "Scheduled Maintenance",
      description: "Line B maintenance scheduled for tomorrow",
      time: "3 hours ago",
      active: true
    }
  ];

  const getAlertColor = (type) => {
    switch (type) {
      case "warning": return "bg-yellow-50 border-yellow-200";
      case "success": return "bg-green-50 border-green-200";
      case "info": return "bg-blue-50 border-blue-200";
      default: return "bg-gray-50 border-gray-200";
    }
  };

  const getIconColor = (type) => {
    switch (type) {
      case "warning": return "text-yellow-600";
      case "success": return "text-green-600";
      case "info": return "text-blue-600";
      default: return "text-gray-600";
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">System Alerts</h2>
        <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full">
          3 Active
        </span>
      </div>

      <div className="space-y-3">
        {alerts.map((alert, index) => {
          const Icon = alert.icon;
          return (
            <div
              key={index}
              className={`border rounded-lg p-3 ${getAlertColor(alert.type)} ${alert.active ? 'ring-1 ring-opacity-50' : 'opacity-75'}`}
            >
              <div className="flex items-start space-x-3">
                <Icon className={`w-5 h-5 mt-0.5 ${getIconColor(alert.type)}`} />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-gray-900 text-sm">{alert.title}</h3>
                    {alert.active && (
                      <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{alert.description}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-gray-500">{alert.time}</span>
                    <button className="text-xs text-gray-400 hover:text-gray-600">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <button className="w-full mt-4 text-center text-sm text-blue-600 hover:text-blue-700 font-medium">
        View All Alerts
      </button>
    </div>
  );
}