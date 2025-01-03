import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API_URL from '../config/api';

const JobList = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchJobs = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/jobs`, {
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
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteJob = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/jobs/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete job');
      }

      // Refresh the job list after deletion
      fetchJobs();
    } catch (error) {
      console.error('Error deleting job:', error);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>Job List</h1>
      <Link to="/add-job">Add Job</Link>
      <ul>
        {jobs.map((job) => (
          <li key={job._id}>
            <Link to={`/edit-job/${job._id}`}>{job.title}</Link>
            <button onClick={() => deleteJob(job._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default JobList;
