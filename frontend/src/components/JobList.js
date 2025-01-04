import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API_URL from '../config/api';
import { getAuthToken } from '../utils/auth';

const JobList = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const navigate = useNavigate();

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const token = getAuthToken();
      
      if (!token) {
        console.log('No token found, redirecting to login');
        navigate('/login');
        return;
      }

      console.log('Fetching with token:', token);
      
      const response = await fetch(`${API_URL}/api/jobs`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        credentials: 'include'
      });

      if (response.status === 401) {
        console.log('Token expired or invalid, redirecting to login');
        navigate('/login');
        return;
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Received data:', data);
      
      if (Array.isArray(data)) {
        setJobs(data);
      } else {
        console.error('Received non-array data:', data);
        setJobs([]);
      }
    } catch (error) {
      console.error('Error fetching jobs:', error);
      setError('Failed to load jobs');
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteJob = async (id) => {
    if (window.confirm('Are you sure you want to delete this job?')) {
      try {
        const token = getAuthToken();
        await fetch(`${API_URL}/api/jobs/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        fetchJobs(); // Refresh the list
      } catch (error) {
        console.error('Error deleting job:', error);
      }
    }
  };

  const getStatusCount = (status) => {
    if (!Array.isArray(jobs)) return 0;
    return jobs.filter(job => job.status === status).length;
  };

  const filteredJobs = statusFilter === 'all' 
    ? jobs 
    : (Array.isArray(jobs) ? jobs.filter(job => job.status === statusFilter) : []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'applied':
        return 'bg-blue-100 text-blue-800';
      case 'interviewed':
        return 'bg-yellow-100 text-yellow-800';
      case 'accepted':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return <div className="text-center mt-8">Loading...</div>;
  }

  if (error) {
    return <div className="text-center mt-8 text-red-600">{error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">My Job Applications</h1>
        <Link
          to="/add-job"
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          Add New Job
        </Link>
      </div>

      <div className="flex justify-center gap-4 mb-6">
        <button
          onClick={() => setStatusFilter('all')}
          className={`px-4 py-2 rounded-md transition-colors ${
            statusFilter === 'all'
              ? 'bg-gray-200 text-gray-800 font-medium'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          All {Array.isArray(jobs) && jobs.length > 0 ? `(${jobs.length})` : ''}
        </button>
        {['applied', 'interviewed', 'accepted', 'rejected'].map(status => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`px-4 py-2 rounded-md transition-colors ${
              statusFilter === status
                ? `bg-${status === 'applied' ? 'blue' : 
                     status === 'interviewed' ? 'yellow' : 
                     status === 'accepted' ? 'green' : 
                     'red'}-200 text-${status === 'applied' ? 'blue' : 
                     status === 'interviewed' ? 'yellow' : 
                     status === 'accepted' ? 'green' : 
                     'red'}-800 font-medium`
                : `bg-${status === 'applied' ? 'blue' : 
                     status === 'interviewed' ? 'yellow' : 
                     status === 'accepted' ? 'green' : 
                     'red'}-100 text-${status === 'applied' ? 'blue' : 
                     status === 'interviewed' ? 'yellow' : 
                     status === 'accepted' ? 'green' : 
                     'red'}-600 hover:bg-${status === 'applied' ? 'blue' : 
                     status === 'interviewed' ? 'yellow' : 
                     status === 'accepted' ? 'green' : 
                     'red'}-200`
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
            {getStatusCount(status) > 0 ? ` (${getStatusCount(status)})` : ''}
          </button>
        ))}
      </div>

      {filteredJobs.length === 0 ? (
        <div className="text-center text-gray-500 mt-8">
          No jobs found. {statusFilter === 'all' ? 'Add your first job application!' : 'Try a different filter.'}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredJobs.map((job) => {
            console.log('Job ID:', job._id);
            return (
              <div
                key={job._id}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">{job.title}</h2>
                    <p className="text-gray-600">{job.company}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(job.status)}`}>
                    {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                  </span>
                </div>

                {job.location && (
                  <p className="text-gray-600 mb-2">
                    <span className="font-medium">Location:</span> {job.location}
                  </p>
                )}
                
                {job.salary && (
                  <p className="text-gray-600 mb-2">
                    <span className="font-medium">Salary:</span> {job.salary}
                  </p>
                )}

                {job.notes && (
                  <p className="text-gray-600 mb-4">
                    <span className="font-medium">Notes:</span> {job.notes}
                  </p>
                )}

                <div className="border-t pt-4 mt-4 flex justify-between items-center">
                  <div className="text-sm text-gray-500">
                    Added: {new Date(job.createdAt).toLocaleDateString()}
                  </div>
                  <div className="space-x-3">
                    <Link
                      to={`/edit-job/${job._id}`}
                      onClick={() => console.log('Clicking edit for job:', job._id)}
                      className="text-blue-600 border border-blue-600 px-3 py-1 rounded-md hover:bg-blue-50"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDeleteJob(job._id)}
                      className="text-red-600 border border-red-600 px-3 py-1 rounded-md hover:bg-red-50"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default JobList;
