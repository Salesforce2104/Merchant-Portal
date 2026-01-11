"use client";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
} from "chart.js";
import { Bar, Line } from "react-chartjs-2";
import { Users, UserPlus, Calendar } from "lucide-react";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function AdminDashboardCharts({ users = [] }) {
  // --- Process Data ---
  const totalUsers = users.length;

  // Calculate New Users per Month (or Day if recent)
  // For simplicity, let's group by Month-Year
  const usersByMonth = users.reduce((acc, user) => {
    if (!user.createdAt) return acc;
    const date = new Date(user.createdAt);
    const key = date.toLocaleString("default", {
      month: "short",
      year: "numeric",
    });
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

  // Sort months chronologically
  const sortedMonths = Object.keys(usersByMonth).sort((a, b) => {
    return new Date(a) - new Date(b); // This might need better parsing but usually works for standard formats
  });

  const chartData = {
    labels: sortedMonths,
    datasets: [
      {
        label: "New Registrations",
        data: sortedMonths.map((m) => usersByMonth[m]),
        backgroundColor: "rgba(59, 130, 246, 0.5)", // Blue-500
        borderColor: "rgb(59, 130, 246)",
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "User Growth Over Time",
      },
    },
  };

  // Calculate generic "Active" metric (e.g. users with recent login/updatedAt if available, otherwise just count)
  // Since we don't have 'lastLogin', just show Total Users

  // Calculate recent signups (last 30 days)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const recentSignups = users.filter(
    (u) => new Date(u.createdAt) > thirtyDaysAgo
  ).length;

  return (
    <div className="space-y-6">
      {/* Metrics Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-lg bg-white p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="rounded-full bg-blue-100 p-3 text-blue-600">
              <Users className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Total Users</p>
              <p className="text-2xl font-bold text-gray-900">{totalUsers}</p>
            </div>
          </div>
        </div>

        <div className="rounded-lg bg-white p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="rounded-full bg-green-100 p-3 text-green-600">
              <UserPlus className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">
                New (Last 30 Days)
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {recentSignups}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-lg bg-white p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="rounded-full bg-purple-100 p-3 text-purple-600">
              <Calendar className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Latest Signup</p>
              <p className="text-sm font-bold text-gray-900 truncate max-w-[150px]">
                {users.length > 0
                  ? new Date(
                      users[users.length - 1].createdAt
                    ).toLocaleDateString()
                  : "N/A"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-1">
        <div className="rounded-lg bg-white p-6 shadow-sm border border-gray-100">
          <Bar options={options} data={chartData} />
        </div>
      </div>
    </div>
  );
}
