import React, { useState, useEffect } from 'react';
import { Pie, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title
} from 'chart.js';
import { format } from 'date-fns';
import { useTheme } from '../contexts/ThemeContext';
import API_URL from '../config/api';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title
);

const Dashboard = () => {
  const { darkMode } = useTheme();
  const [stats, setStats] = useState({
    total: 0,
    byStatus: {
      applied: 0,
      interviewed: 0,
      accepted: 0,
      rejected: 0
    },
    responseRate: 0,
    successRate: 0
  });
  const [timelineData, setTimelineData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('jobTrackerToken');
      const response = await fetch(`${API_URL}/api/jobs/stats`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch dashboard data');
      }

      const data = await response.json();
      setStats(data.stats);
      setTimelineData(data.timeline);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError('Failed to load dashboard data');
    } finally {
      setIsLoading(false);
    }
  };

  const pieChartData = {
    labels: Object.entries(stats.byStatus)
      .filter(([_, value]) => value > 0)
      .map(([status]) => status.charAt(0).toUpperCase() + status.slice(1)),
    datasets: [
      {
        data: Object.entries(stats.byStatus)
          .filter(([_, value]) => value > 0)
          .map(([_, value]) => value),
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)', // blue-500 for applied
          'rgba(234, 179, 8, 0.8)',  // yellow-500 for interviewed
          'rgba(34, 197, 94, 0.8)',  // green-500 for accepted
          'rgba(239, 68, 68, 0.8)',  // red-500 for rejected
        ],
        borderColor: [
          'rgba(59, 130, 246, 1)',
          'rgba(234, 179, 8, 1)',
          'rgba(34, 197, 94, 1)',
          'rgba(239, 68, 68, 1)',
        ],
        borderWidth: 2,
      },
    ],
  };

  const timelineChartData = {
    labels: timelineData.map(d => format(new Date(d.date), 'MMM d')),
    datasets: [
      {
        label: 'Applications',
        data: timelineData.map(d => d.count),
        borderColor: 'rgba(59, 130, 246, 1)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
        fill: true,
        pointBackgroundColor: 'rgba(59, 130, 246, 1)',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };

  const pieChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 20,
          color: darkMode ? '#f3f4f6' : '#1f2937',
          font: {
            size: 12,
            weight: 'bold'
          }
        }
      },
      tooltip: {
        backgroundColor: darkMode ? 'rgba(17, 24, 39, 0.8)' : 'rgba(255, 255, 255, 0.8)',
        titleColor: darkMode ? '#f3f4f6' : '#1f2937',
        bodyColor: darkMode ? '#f3f4f6' : '#1f2937',
        padding: 12,
        borderColor: darkMode ? 'rgba(75, 85, 99, 0.3)' : 'rgba(209, 213, 219, 0.3)',
        borderWidth: 1,
      }
    },
    scales: {
      x: {
        display: false
      },
      y: {
        display: false
      }
    }
  };

  const timelineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: darkMode ? 'rgba(17, 24, 39, 0.8)' : 'rgba(255, 255, 255, 0.8)',
        titleColor: darkMode ? '#f3f4f6' : '#1f2937',
        bodyColor: darkMode ? '#f3f4f6' : '#1f2937',
        padding: 12,
        borderColor: darkMode ? 'rgba(75, 85, 99, 0.3)' : 'rgba(209, 213, 219, 0.3)',
        borderWidth: 1,
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: darkMode ? 'rgba(75, 85, 99, 0.2)' : 'rgba(209, 213, 219, 0.2)',
        },
        ticks: {
          stepSize: 1,
          color: darkMode ? '#f3f4f6' : '#1f2937',
          font: {
            size: 11
          }
        }
      },
      x: {
        grid: {
          display: false
        },
        ticks: {
          color: darkMode ? '#f3f4f6' : '#1f2937',
          font: {
            size: 11
          }
        }
      }
    }
  };

  if (isLoading) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
    </div>
  );

  if (error) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-red-500 bg-red-100 dark:bg-red-900/20 px-6 py-4 rounded-lg">
        {error}
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl shadow-lg p-6 transition-all duration-300 hover:bg-blue-100 dark:hover:bg-blue-900/30">
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-2">
            Total Applications
          </h3>
          <p className="text-4xl font-bold text-blue-600 dark:text-blue-400">
            {stats.total}
          </p>
        </div>
        <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-xl shadow-lg p-6 transition-all duration-300 hover:bg-yellow-100 dark:hover:bg-yellow-900/30">
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-2">
            Response Rate
          </h3>
          <p className="text-4xl font-bold text-yellow-600 dark:text-yellow-400">
            {(stats.responseRate * 100).toFixed(1)}%
          </p>
        </div>
        <div className="bg-green-50 dark:bg-green-900/20 rounded-xl shadow-lg p-6 transition-all duration-300 hover:bg-green-100 dark:hover:bg-green-900/30">
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-2">
            Success Rate
          </h3>
          <p className="text-4xl font-bold text-green-600 dark:text-green-400">
            {(stats.successRate * 100).toFixed(1)}%
          </p>
        </div>
        <div className="bg-red-50 dark:bg-red-900/20 rounded-xl shadow-lg p-6 transition-all duration-300 hover:bg-red-100 dark:hover:bg-red-900/30">
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-2">
            Rejection Rate
          </h3>
          <p className="text-4xl font-bold text-red-600 dark:text-red-400">
            {stats.total ? ((stats.byStatus.rejected / stats.total) * 100).toFixed(1) : '0.0'}%
          </p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-6">
            Application Status Distribution
          </h3>
          <div className="h-80">
            <Pie data={pieChartData} options={pieChartOptions} />
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-6">
            Application Timeline
          </h3>
          <div className="h-80">
            <Line data={timelineChartData} options={timelineChartOptions} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 