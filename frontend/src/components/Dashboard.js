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
import { format, subDays } from 'date-fns';
import { useTheme } from '../contexts/ThemeContext';

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
    byStatus: {},
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
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/jobs/stats', {
        headers: {
          'Authorization': `Bearer ${token}`
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
    labels: Object.keys(stats.byStatus),
    datasets: [
      {
        data: Object.values(stats.byStatus),
        backgroundColor: [
          '#FCD34D', // yellow for applied
          '#60A5FA', // blue for interviewed
          '#34D399', // green for accepted
          '#F87171', // red for rejected
        ],
      },
    ],
  };

  const timelineChartData = {
    labels: timelineData.map(d => format(new Date(d.date), 'MMM d')),
    datasets: [
      {
        label: 'Applications',
        data: timelineData.map(d => d.count),
        borderColor: '#60A5FA',
        tension: 0.1,
      },
    ],
  };

  if (isLoading) return <div className="text-center">Loading dashboard...</div>;
  if (error) return <div className="text-center text-red-600">{error}</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Statistics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white dark:bg-dark-bg-secondary p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Total Applications</h3>
          <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{stats.total}</p>
        </div>
        <div className="bg-white dark:bg-dark-bg-secondary p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Response Rate</h3>
          <p className="text-3xl font-bold text-green-600 dark:text-green-400">
            {(stats.responseRate * 100).toFixed(1)}%
          </p>
        </div>
        <div className="bg-white dark:bg-dark-bg-secondary p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Success Rate</h3>
          <p className="text-3xl font-bold text-green-600 dark:text-green-400">
            {(stats.successRate * 100).toFixed(1)}%
          </p>
        </div>
        <div className="bg-white dark:bg-dark-bg-secondary p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Active Applications</h3>
          <p className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">
            {stats.byStatus.applied || 0}
          </p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-dark-bg-secondary p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Application Status</h3>
          <div className="h-64">
            <Pie 
              data={pieChartData} 
              options={{ 
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    labels: {
                      color: darkMode ? '#f3f4f6' : '#1f2937'
                    }
                  }
                }
              }} 
            />
          </div>
        </div>
        <div className="bg-white dark:bg-dark-bg-secondary p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Application Timeline</h3>
          <div className="h-64">
            <Line 
              data={timelineChartData} 
              options={{ 
                maintainAspectRatio: false,
                scales: {
                  y: {
                    beginAtZero: true,
                    ticks: {
                      stepSize: 1,
                      color: darkMode ? '#f3f4f6' : '#1f2937'
                    },
                    grid: {
                      color: darkMode ? '#374151' : '#e5e7eb'
                    }
                  },
                  x: {
                    ticks: {
                      color: darkMode ? '#f3f4f6' : '#1f2937'
                    },
                    grid: {
                      color: darkMode ? '#374151' : '#e5e7eb'
                    }
                  }
                },
                plugins: {
                  legend: {
                    labels: {
                      color: darkMode ? '#f3f4f6' : '#1f2937'
                    }
                  }
                }
              }} 
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 