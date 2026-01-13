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
import { Users, UserPlus, Calendar, Maximize2 } from "lucide-react";
import { useState } from "react";
import Modal from "@/components/ui/Modal";

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

export default function AdminDashboardCharts({ users = [], transactions = [] }) {
  const [expandedChart, setExpandedChart] = useState(null); // 'users' | 'transactions' | null
  // --- Process Data ---
  const totalUsers = users.length;

  // 1. Generate all 12 months for the current year
  const currentYear = new Date().getFullYear();
  const allMonths = Array.from({ length: 12 }, (_, i) => {
    const d = new Date(currentYear, i, 1);
    return d.toLocaleString("default", { month: "short", year: "numeric" });
  });

  // 2. Map user data to these months
  const usersByMonth = users.reduce((acc, user) => {
    if (!user.createdAt) return acc;
    const date = new Date(user.createdAt);
    if (date.getFullYear() !== currentYear) return acc;

    const key = date.toLocaleString("default", {
      month: "short",
      year: "numeric",
    });
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

  // 3. Map transaction data to these months
  const txByMonth = transactions.reduce((acc, tx) => {
    if (!tx.createdAt) return acc; // Ensure field exists
    const date = new Date(tx.createdAt);
    if (date.getFullYear() !== currentYear) return acc;

    const key = date.toLocaleString("default", {
      month: "short",
      year: "numeric"
    });
    acc[key] = (acc[key] || 0) + 1; // Count transactions
    // OR acc[key] = (acc[key] || 0) + tx.amount; // if we wanted Volume
    return acc;
  }, {});

  const chartData = {
    labels: allMonths, // Always show Jan - Dec
    datasets: [
      {
        label: "New Registrations",
        data: allMonths.map((m) => usersByMonth[m] || 0), // Fill 0 for empty months
        backgroundColor: "rgba(31, 60, 136, 0.8)", // #1F3C88 brand color
        hoverBackgroundColor: "#1F3C88",
        borderRadius: 4,
        maxBarThickness: 60,
      },
    ],
  };

  const txChartData = {
    labels: allMonths,
    datasets: [
      {
        label: "Transactions",
        data: allMonths.map((m) => txByMonth[m] || 0), // Use dynamic data
        borderColor: "rgba(147, 51, 234, 1)",
        backgroundColor: "rgba(147, 51, 234, 0.1)",
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false, // Critical for fixed height
    plugins: {
      legend: {
        display: false, // Cleaner single-series chart
      },
      title: {
        display: true,
        text: "User Growth Over Time",
        color: "#64748b",
        font: {
          size: 14,
          weight: 500
        },
        padding: {
          bottom: 20
        }
      },
      tooltip: {
        backgroundColor: "rgba(255, 255, 255, 0.95)",
        titleColor: "#1e293b",
        bodyColor: "#475569",
        borderColor: "#e2e8f0",
        borderWidth: 1,
        padding: 12,
        cornerRadius: 8,
        displayColors: false,
        callbacks: {
          label: (context) => `${context.raw} Users`
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        suggestedMax: 10,
        title: {
          display: true,
          text: 'Number of Users',
          font: { weight: 'bold' }
        },
        ticks: {
          stepSize: 50,
          precision: 0
        },
        grid: {
          color: "rgba(0, 0, 0, 0.05)",
        }
      },
      x: {
        title: {
          display: true,
          text: 'Month',
          font: { weight: 'bold' }
        },
        grid: {
          display: false,
        }
      }
    }
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
            <div className="rounded-full bg-gray-100 p-3 text-gray-900">
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
              <div>
                <p className="text-lg font-bold text-gray-900 truncate max-w-[150px]">
                  {users.length > 0
                    ? (() => {
                      const latest = [...users].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0];
                      return new Date(latest.createdAt).toLocaleDateString();
                    })()
                    : "N/A"}
                </p>
                {users.length > 0 && (
                  <p className="text-xs text-gray-500 truncate mt-1">
                    {(() => {
                      const latest = [...users].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0];
                      return latest.email || latest.name || "Unknown";
                    })()}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* User Growth Chart */}
        <div className="rounded-lg bg-white p-6 shadow-sm border border-gray-100 relative group">
          <button
            onClick={() => setExpandedChart('users')}
            className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all opacity-0 group-hover:opacity-100"
            title="Expand Chart"
          >
            <Maximize2 className="h-5 w-5" />
          </button>
          <div className="h-[350px] w-full cursor-pointer" onClick={() => setExpandedChart('users')}>
            <Bar options={options} data={chartData} />
          </div>
        </div>

        {/* Transaction Volume Chart */}
        <div className="rounded-lg bg-white p-6 shadow-sm border border-gray-100 relative group">
          <button
            onClick={() => setExpandedChart('transactions')}
            className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all opacity-0 group-hover:opacity-100"
            title="Expand Chart"
          >
            <Maximize2 className="h-5 w-5" />
          </button>
          <div className="h-[350px] w-full cursor-pointer" onClick={() => setExpandedChart('transactions')}>
            <Line
              options={{
                ...options,
                plugins: {
                  ...options.plugins,
                  title: {
                    ...options.plugins.title,
                    text: 'Total Transactions Of All Users',
                  }
                },
                scales: {
                  ...options.scales,
                  y: {
                    ...options.scales.y,
                    title: { display: true, text: 'Transaction Volume', font: { weight: 'bold' } },
                    suggestedMax: 500,
                    ticks: { stepSize: 100 }
                  }
                }
              }}
              data={txChartData}
            />
          </div>
        </div>
      </div>

      {/* Expanded Chart Modal */}
      <Modal
        isOpen={!!expandedChart}
        onClose={() => setExpandedChart(null)}
        title={expandedChart === 'users' ? "User Growth Detailed View" : "Transaction Analysis"}
        maxWidth="max-w-5xl"
      >
        <div className="h-[500px] w-full p-4">
          {expandedChart === 'users' && (
            <Bar options={{ ...options, maintainAspectRatio: false }} data={chartData} />
          )}
          {expandedChart === 'transactions' && (
            <Line
              options={{
                ...options,
                maintainAspectRatio: false,
                plugins: { ...options.plugins, title: { display: false } }, // Hide title in modal as modal has generic title
                scales: {
                  ...options.scales,
                  y: {
                    ...options.scales.y,
                    title: { display: true, text: 'Transaction Volume', font: { weight: 'bold' } },
                    suggestedMax: 500,
                    ticks: { stepSize: 100 }
                  }
                }
              }}
              data={txChartData}
            />
          )}
        </div>
      </Modal>
    </div>
  );
}
