import React from "react";
import { Package, Factory, TrendingUp, AlertCircle } from "lucide-react";

const stats = [
  {
    title: "Total Production",
    value: "2,150L",
    change: "+12%",
    trend: "up",
    icon: Package,
    color: "blue"
  },
  {
    title: "Active Machines",
    value: "8/12",
    change: "2 idle",
    trend: "neutral",
    icon: Factory,
    color: "green"
  },
  {
    title: "Efficiency Rate",
    value: "94.2%",
    change: "+3.2%",
    trend: "up",
    icon: TrendingUp,
    color: "purple"
  },
  {
    title: "Issues Reported",
    value: "3",
    change: "-1 from yesterday",
    trend: "down",
    icon: AlertCircle,
    color: "orange"
  }
];

export default function StatsGrid() {
  const getColorClasses = (color, trend) => {
    const colors = {
      blue: { bg: "bg-blue-50", text: "text-blue-700", icon: "text-blue-600" },
      green: { bg: "bg-green-50", text: "text-green-700", icon: "text-green-600" },
      purple: { bg: "bg-purple-50", text: "text-purple-700", icon: "text-purple-600" },
      orange: { bg: "bg-orange-50", text: "text-orange-700", icon: "text-orange-600" }
    };
    
    const trendColors = {
      up: "text-green-600",
      down: "text-red-600",
      neutral: "text-gray-600"
    };
    
    return { ...colors[color], trend: trendColors[trend] };
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        const colors = getColorClasses(stat.color, stat.trend);
        
        return (
          <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                <p className={`text-sm ${colors.trend} mt-1`}>{stat.change}</p>
              </div>
              <div className={`p-3 rounded-lg ${colors.bg}`}>
                <Icon className={`w-6 h-6 ${colors.icon}`} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}