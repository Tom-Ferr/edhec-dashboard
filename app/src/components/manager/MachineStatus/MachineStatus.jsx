import React from "react";
import { Play, Pause, Wrench, AlertTriangle } from "lucide-react";

export default function MachineStatus({ machines }) {
  const getStatusIcon = (status) => {
    switch (status) {
      case "running":
        return <Play className="w-4 h-4 text-green-500" />;
      case "idle":
        return <Pause className="w-4 h-4 text-yellow-500" />;
      case "maintenance":
        return <Wrench className="w-4 h-4 text-blue-500" />;
      default:
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "running":
        return "bg-green-100 text-green-800";
      case "idle":
        return "bg-yellow-100 text-yellow-800";
      case "maintenance":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-red-100 text-red-800";
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Machine Status</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {machines.map((machine) => (
          <div key={machine.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium text-gray-900">{machine.name}</h3>
              {getStatusIcon(machine.status)}
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Status:</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(machine.status)}`}>
                  {machine.status}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Efficiency:</span>
                <span className="font-medium text-gray-900">{machine.efficiency}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Output:</span>
                <span className="font-medium text-gray-900">{machine.output}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}