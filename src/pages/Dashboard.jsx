import React, { useEffect, useState } from "react";
import { getDashboardStats } from "../services/api";
import StatsCard from "../components/StatsCard";
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
  Filler, // Imported for the area fill effect under the line chart
} from "chart.js";
import { Doughnut, Line } from "react-chartjs-2"; // Uncommented the chart imports

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler, // Registered the Filler plugin
);

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getDashboardStats();
        setStats(data);
      } catch (error) {
        console.error("Failed to fetch stats:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading)
    return (
      <div className="flex justify-center p-12">
        <span className="material-symbols-outlined animate-spin text-4xl text-primary">
          progress_activity
        </span>
      </div>
    );

  if (!stats)
    return <div className="p-10 text-center">Failed to load data.</div>;

  // --- CHART DATA PREPARATION ---

  // 1. Line Chart: Registration Activity (Using static trend data from current backend)
  const lineChartData = {
    // Static labels representing the 7 data points in stats.requestsTrend
    labels: ["Day 1", "Day 2", "Day 3", "Day 4", "Day 5", "Day 6", "Today"],
    datasets: [
      {
        label: "New Registrations",
        data: stats.requestsTrend || [0, 0, 0, 0, 0, 0, 0], // Fallback if missing
        fill: true,
        backgroundColor: "rgba(0, 119, 182, 0.1)", // Light blue fill
        borderColor: "#0077B6", // Solid blue line
        tension: 0.4, // Makes the line smooth/curvy
        pointRadius: 4,
        pointBackgroundColor: "#0077B6",
      },
    ],
  };

  const lineOptions = {
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false }, // Hides the top legend since the title explains it
    },
    scales: {
      y: { beginAtZero: true }, // Ensures the Y-axis starts at 0
    },
  };

  // 2. Doughnut Chart: Verification Ratio
  const pieChartData = {
    labels: ["Approved", "Pending/Rejected"],
    datasets: [
      {
        data: stats.approvedVsRejected || [0, 0], // The [approvedTotal, pendingTotal] array
        backgroundColor: ["#10b981", "#f59e0b"], // Green and Amber
        hoverBackgroundColor: ["#059669", "#d97706"],
        borderWidth: 0,
        hoverOffset: 4,
      },
    ],
  };

  const pieOptions = {
    maintainAspectRatio: false,
    cutout: "70%", // Creates the thin ring effect
    plugins: {
      legend: { position: "bottom" },
    },
  };

  return (
    <div className="p-6 space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Doctors"
          value={stats.totalDoctors}
          icon="medical_services" // Changed icon to be more medical
        />
        <StatsCard
          title="Total Vendors"
          value={stats.totalVendors}
          icon="storefront" // Changed icon
        />
        <StatsCard
          title="Pending Review"
          value={stats.pendingTotal}
          valueColor="text-amber-500"
          icon="history"
        />
        <StatsCard
          title="Total Approved"
          value={stats.approvedTotal}
          valueColor="text-green-600"
          icon="verified"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Line Chart Container (Takes up 2/3 width on large screens) */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
          <h3 className="text-lg font-bold mb-4 text-slate-800 dark:text-white">
            Registration Activity (Last 7 Days)
          </h3>
          <div className="h-72">
            <Line data={lineChartData} options={lineOptions} />
          </div>
        </div>

        {/* Doughnut Chart Container (Takes up 1/3 width) */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
          <h3 className="text-lg font-bold mb-4 text-slate-800 dark:text-white">
            Verification Status
          </h3>
          <div className="h-72 flex justify-center pb-4">
            <Doughnut data={pieChartData} options={pieOptions} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
