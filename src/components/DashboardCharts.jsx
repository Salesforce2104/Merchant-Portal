"use client";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
} from "chart.js";
import { Bar, Doughnut, Line } from "react-chartjs-2";
import { Loader2, DollarSign, CreditCard } from "lucide-react";
import Badge from "@/components/ui/Badge";
import { useTransactions, useConversations } from "@/hooks/useUserData";
import { formatDisplayData } from "@/lib/utils";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

export default function DashboardCharts() {
  // Use hooks for data fetching
  const { data: transactionsRes, isLoading: isTransLoading } = useTransactions({
    limit: 50,
  });

  const { data: conversationsRes, isLoading: isConvLoading } = useConversations(
    { pageSize: 100 }
  );

  const isLoading = isTransLoading || isConvLoading;

  const transactions = transactionsRes?.transactions || [];
  const conversations = conversationsRes?.conversations || [];

  const recentConversations = conversations.slice(0, 10);

  // Process Transaction Data
  const statusCountsTrans = {};
  transactions.forEach((t) => {
    const status = t.status || "Unknown";
    statusCountsTrans[status] = (statusCountsTrans[status] || 0) + 1;
  });

  const transactionData = {
    labels: Object.keys(statusCountsTrans),
    datasets: [
      {
        label: "Transaction Count",
        data: Object.values(statusCountsTrans),
        backgroundColor: "rgba(0, 86, 210, 0.7)", // Primary Blue
        borderColor: "rgba(0, 86, 210, 1)",
        borderWidth: 1,
        borderRadius: 4,
      },
    ],
  };

  // Process Conversation Data
  const statusCountsConv = {};
  conversations.forEach((c) => {
    const status = c.status || "Unknown";
    statusCountsConv[status] = (statusCountsConv[status] || 0) + 1;
  });

  const conversationData = {
    labels: Object.keys(statusCountsConv),
    datasets: [
      {
        label: "# of Conversations",
        data: Object.values(statusCountsConv),
        backgroundColor: [
          "rgba(0, 200, 83, 0.7)", // Green (Success/Paid)
          "rgba(255, 171, 0, 0.7)", // Amber (Pending)
          "rgba(213, 0, 0, 0.7)", // Red (Failed)
          "rgba(0, 150, 255, 0.7)", // Blue
          "rgba(150, 150, 150, 0.7)", // Grey
        ],
        borderColor: [
          "rgba(0, 200, 83, 1)",
          "rgba(255, 171, 0, 1)",
          "rgba(213, 0, 0, 1)",
          "rgba(0, 150, 255, 1)",
          "rgba(150, 150, 150, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
        display: false, // Hide legend for single-series bar chart if desired, but top is okay
      },
      title: {
        display: true,
        text: "Distribution by Status",
      },
    },
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1, // Since we are counting, integers look better
        },
      },
    },
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8 w-full">
      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Transaction Chart */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 min-h-[400px]">
          <h3 className="text-lg font-semibold mb-4 text-gray-900">
            Transactions by Status
          </h3>
          <div className="h-[300px]">
            {transactionData ? (
              <Bar options={chartOptions} data={transactionData} />
            ) : (
              <p className="text-center mt-10 text-gray-400">
                No data available
              </p>
            )}
          </div>
        </div>

        {/* Conversation Chart */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 min-h-[400px]">
          <h3 className="text-lg font-semibold mb-4 text-gray-900">
            Conversation Status Distribution
          </h3>
          <div className="h-[300px] flex justify-center">
            {conversationData ? (
              <Doughnut options={chartOptions} data={conversationData} />
            ) : (
              <p className="text-center mt-10 text-gray-400">
                No data available
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Recent Conversions Table */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold mb-6 text-gray-900">
          Recent Conversions
        </h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50 text-gray-600 uppercase text-xs font-semibold tracking-wider">
              <tr>
                <th className="px-6 py-3 text-center whitespace-nowrap">
                  Status
                </th>
                <th className="px-6 py-3 text-center whitespace-nowrap">
                  Created
                </th>
                <th className="px-6 py-3 text-center whitespace-nowrap">
                  Address(s)
                </th>
                <th className="px-6 py-3 text-center whitespace-nowrap">
                  Customer Ref
                </th>
                <th className="px-6 py-3 text-center whitespace-nowrap">
                  Type
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200 text-sm">
              {recentConversations.length > 0 ? (
                recentConversations.map((conv, idx) => (
                  <tr key={idx} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <Badge status={conv.status} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-500 text-center">
                      <div className="font-medium text-gray-900">
                        {conv.created}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-900 text-center">
                      {formatDisplayData(conv.address)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-900 text-center">
                      {formatDisplayData(conv.customerRef)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="flex gap-2 justify-center">
                        <div
                          className="h-7 w-7 rounded-full bg-green-100 text-green-700 flex items-center justify-center transition-transform hover:scale-110 cursor-pointer shadow-sm border border-green-200"
                          title="Payment"
                        >
                          <DollarSign className="h-4 w-4" />
                        </div>
                        <div
                          className="h-7 w-7 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center transition-transform hover:scale-110 cursor-pointer shadow-sm border border-amber-200"
                          title="Payment Method"
                        >
                          <CreditCard className="h-4 w-4" />
                        </div>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="5"
                    className="px-6 py-8 text-center text-gray-500"
                  >
                    No recent conversions found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
