import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const JobList = () => {
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchJobs = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/jobs', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch jobs');
      }
      
      const data = await response.json();
      setJobs(data);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      setError('Failed to load jobs');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this job application?')) {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:5000/api/jobs/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to delete job');
        }

        fetchJobs(); // Refresh the list
      } catch (error) {
        console.error('Error deleting job:', error);
        alert('Failed to delete job');
      }
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      applied: 'bg-yellow-100 text-yellow-800',
      interviewed: 'bg-blue-100 text-blue-800',
      accepted: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  if (isLoading) return <div className="text-center">Loading...</div>;
  if (error) return <div className="text-center text-red-600">{error}</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Job Applications</h1>
        <Link
          to="/add-job"
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
        >
          Add New Job
        </Link>
      </div>

      {jobs.length === 0 ? (
        <p className="text-center text-gray-600">No job applications yet. Add your first one!</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {jobs.map((job) => (
            <div
              key={job._id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-1">
                      {job.title}
                    </h2>
                    <p className="text-gray-600 font-medium">{job.company}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(job.status)}`}>
                    {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                  </span>
                </div>

                {(job.location || job.salary || job.notes) && (
                  <div className="mt-4 space-y-2 text-sm">
                    {job.location && (
                      <p className="text-gray-600">
                        <span className="font-medium">Location:</span> {job.location}
                      </p>
                    )}
                    {job.salary && (
                      <p className="text-gray-600">
                        <span className="font-medium">Salary:</span> {job.salary}
                      </p>
                    )}
                    {job.notes && (
                      <div className="text-gray-600">
                        <span className="font-medium">Notes:</span>
                        <p className="mt-1 whitespace-pre-wrap">{job.notes}</p>
                      </div>
                    )}
                  </div>
                )}

                <div className="mt-6 flex justify-end space-x-3">
                  <Link
                    to={`/edit-job/${job._id}`}
                    className="px-3 py-1 text-sm font-medium text-blue-600 hover:text-blue-800"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(job._id)}
                    className="px-3 py-1 text-sm font-medium text-red-600 hover:text-red-800"
                  >
                    Delete
                  </button>
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
