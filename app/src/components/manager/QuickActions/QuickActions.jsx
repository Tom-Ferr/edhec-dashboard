import React from "react";
import { Plus, Download, Upload, RotateCcw } from "lucide-react";

export default function QuickActions() {
  const actions = [
    {
      icon: Plus,
      label: "New Batch",
      description: "Start new production batch",
      color: "bg-blue-500 hover:bg-blue-600"
    },
    {
      icon: Download,
      label: "Export Data",
      description: "Download production reports",
      color: "bg-green-500 hover:bg-green-600"
    },
    {
      icon: Upload,
      label: "Import Recipe",
      description: "Upload new product recipe",
      color: "bg-purple-500 hover:bg-purple-600"
    },
    {
      icon: RotateCcw,
      label: "Restart Line",
      description: "Reset production line",
      color: "bg-orange-500 hover:bg-orange-600"
    }
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {actions.map((action, index) => {
          const Icon = action.icon;
          return (
            <button
              key={index}
              className={`${action.color} text-white rounded-lg p-4 text-left transition-all hover:shadow-lg transform hover:-translate-y-1`}
            >
              <Icon className="w-6 h-6 mb-2" />
              <div className="font-medium">{action.label}</div>
              <div className="text-sm opacity-90">{action.description}</div>
            </button>
          );
        })}
      </div>
    </div>
  );
}