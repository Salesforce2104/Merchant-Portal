"use client";

import { useEffect, useState } from "react";
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
import api from "@/lib/axios";
import { Loader2 } from "lucide-react";
import Badge from "@/components/ui/Badge";

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
  const [isLoading, setIsLoading] = useState(true);
  const [transactionData, setTransactionData] = useState(null);
  const [conversationData, setConversationData] = useState(null);
  const [recentTransactions, setRecentTransactions] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Parallel fetch
        const [transRes, convRes] = await Promise.all([
          api.get("/auth/transactions", { params: { limit: 50 } }),
          api.get("/auth/conversations", { params: { pageSize: 100 } }),
        ]);

        if (transRes.data.success) {
          processTransactionData(transRes.data.transactions);
          setRecentTransactions(transRes.data.transactions.slice(0, 10));
        }

        if (convRes.data.success) {
          processConversationData(convRes.data.conversations);
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const processTransactionData = (transactions) => {
    // Group transactions by "status" (e.g. Compliant, Failed, Pending)
    // This avoids issues if date/amount are sparse or uniform.
    const statusCounts = {};
    transactions.forEach((t) => {
      const status = t.status || "Unknown";
      statusCounts[status] = (statusCounts[status] || 0) + 1;
    });

    setTransactionData({
      labels: Object.keys(statusCounts),
      datasets: [
        {
          label: "Transaction Count",
          data: Object.values(statusCounts),
          backgroundColor: "rgba(0, 86, 210, 0.7)", // Primary Blue
          borderColor: "rgba(0, 86, 210, 1)",
          borderWidth: 1,
          borderRadius: 4,
        },
      ],
    });
  };

  const processConversationData = (conversations) => {
    // Count by status
    const statusCounts = {};
    conversations.forEach((c) => {
      const status = c.status || "Unknown";
      statusCounts[status] = (statusCounts[status] || 0) + 1;
    });

    setConversationData({
      labels: Object.keys(statusCounts),
      datasets: [
        {
          label: "# of Conversations",
          data: Object.values(statusCounts),
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
    });
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
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer Ref
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200 text-sm">
              {recentTransactions.length > 0 ? (
                recentTransactions.map((tx, idx) => (
                  <tr key={idx} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge status={tx.status} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                      {tx.created}
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-900">
                      {tx.description}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-900 font-bold">
                      {tx.amount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                      {tx.customerRef}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="5"
                    className="px-6 py-8 text-center text-gray-500"
                  >
                    No recent transactions found.
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
