import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API_URL from '../config/api';

const JobList = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');

  const fetchJobs = async () => {
    try {
      const token = localStorage.getItem('token');
      console.log('Token:', token);

      if (!token) {
        throw new Error('No authentication token found');
      }

      console.log('Fetching from:', `${API_URL}/api/jobs`);
      const response = await fetch(`${API_URL}/api/jobs`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        credentials: 'include'
      });

      console.log('Response status:', response.status);

      if (!response.ok) {
        const errorData = await response.text();
        console.error('Error response:', errorData);
        throw new Error(`Failed to fetch jobs: ${errorData}`);
      }

      const data = await response.json();
      console.log('Fetched jobs:', data);
      setJobs(data);
    } catch (error) {
      console.error('Detailed error:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const filteredJobs = jobs.filter(job => 
    statusFilter === 'all' ? true : job.status === statusFilter
  );

  const getStatusCount = (status) => {
    const count = jobs.filter(job => job.status === status).length;
    return count > 0 ? ` (${count})` : '';
  };

  const getStatusStyles = (status, isActive) => {
    const baseStyles = "px-4 py-2 rounded-md text-sm font-medium transition-colors border ";
    
    if (status === 'all') {
      return baseStyles + (isActive 
        ? "border-blue-300 bg-blue-50 text-blue-600 dark:border-blue-500 dark:bg-blue-900/20 dark:text-blue-400"
        : "border-gray-200 text-gray-600 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600 dark:border-gray-600 dark:text-gray-400 dark:hover:border-blue-500 dark:hover:bg-blue-900/10");
    }

    const statusStyles = {
      applied: {
        default: "border-yellow-200 bg-yellow-50 text-yellow-600 hover:border-yellow-300 hover:bg-yellow-100 dark:border-yellow-800 dark:bg-yellow-900/10 dark:text-yellow-400 dark:hover:bg-yellow-900/20",
        active: "border-yellow-300 bg-yellow-100 text-yellow-700 dark:border-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-300"
      },
      interviewed: {
        default: "border-blue-200 bg-blue-50 text-blue-600 hover:border-blue-300 hover:bg-blue-100 dark:border-blue-800 dark:bg-blue-900/10 dark:text-blue-400 dark:hover:bg-blue-900/20",
        active: "border-blue-300 bg-blue-100 text-blue-700 dark:border-blue-700 dark:bg-blue-900/20 dark:text-blue-300"
      },
      accepted: {
        default: "border-green-200 bg-green-50 text-green-600 hover:border-green-300 hover:bg-green-100 dark:border-green-800 dark:bg-green-900/10 dark:text-green-400 dark:hover:bg-green-900/20",
        active: "border-green-300 bg-green-100 text-green-700 dark:border-green-700 dark:bg-green-900/20 dark:text-green-300"
      },
      rejected: {
        default: "border-red-200 bg-red-50 text-red-600 hover:border-red-300 hover:bg-red-100 dark:border-red-800 dark:bg-red-900/10 dark:text-red-400 dark:hover:bg-red-900/20",
        active: "border-red-300 bg-red-100 text-red-700 dark:border-red-700 dark:bg-red-900/20 dark:text-red-300"
      }
    };

    return baseStyles + (isActive ? statusStyles[status].active : statusStyles[status].default);
  };

  if (loading) return <div className="text-center">Loading...</div>;
  if (error) return <div className="text-center text-red-600">Error: {error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6">
          Job Applications
        </h1>
        <div className="inline-flex space-x-2">
          {['all', 'applied', 'interviewed', 'accepted', 'rejected'].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={getStatusStyles(status, statusFilter === status)}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
              {status !== 'all' && getStatusCount(status)}
            </button>
          ))}
        </div>
      </div>

      <div className="flex justify-end mb-6">
        <Link
          to="/add-job"
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition-colors"
        >
          Add New Job
        </Link>
      </div>

      {filteredJobs.length === 0 ? (
        <p className="text-center text-gray-600 dark:text-gray-400">
          {statusFilter === 'all' 
            ? 'No job applications yet. Add your first one!'
            : `No jobs with status "${statusFilter}"`}
        </p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredJobs.map((job) => (
            <div
              key={job._id}
              className="bg-white dark:bg-dark-bg-secondary p-6 rounded-lg shadow hover:shadow-lg transition-shadow"
            >
              <div className="flex justify-between items-start">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  {job.title}
                </h3>
                <span className={`px-2 py-1 text-sm rounded-full ${
                  job.status === 'applied' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100' :
                  job.status === 'interviewed' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100' :
                  job.status === 'accepted' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100' :
                  'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100'
                }`}>
                  {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                </span>
              </div>

              <div className="mt-4 space-y-2">
                <p className="text-gray-700 dark:text-gray-300">
                  <span className="font-medium">Company:</span> {job.company}
                </p>
                
                {job.location && (
                  <p className="text-gray-700 dark:text-gray-300">
                    <span className="font-medium">Location:</span> {job.location}
                  </p>
                )}
                
                {job.salary && (
                  <p className="text-gray-700 dark:text-gray-300">
                    <span className="font-medium">Salary:</span> {job.salary}
                  </p>
                )}

                {job.notes && (
                  <div className="mt-3">
                    <p className="font-medium text-gray-700 dark:text-gray-300">Notes:</p>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mt-1 whitespace-pre-wrap">
                      {job.notes}
                    </p>
                  </div>
                )}

                <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center">
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Added: {new Date(job.createdAt).toLocaleDateString()}
                  </div>
                  <Link
                    to={`/edit-job/${job._id}`}
                    className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium"
                  >
                    Edit
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default JobList;
