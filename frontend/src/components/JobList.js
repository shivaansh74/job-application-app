// JobListings.js (Main Page)
import React, { useState, useEffect } from 'react';

const JobListings = () => {
  const [jobs, setJobs] = useState([]);

  // Fetch jobs from the backend when the page loads
  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/jobs');
      const data = await response.json();
      setJobs(data);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Job Listings</h1>
      
      {/* Button to navigate to the Add Job page */}
      <button
        onClick={() => window.location.href = '/add-job'}
        className="bg-blue-500 text-white p-2 rounded mb-4"
      >
        Add New Job
      </button>

      {/* Display job listings */}
      <ul>
        {jobs.map((job) => (
          <li key={job._id} className="p-2 border-b">
            <strong>{job.title}</strong> at {job.company} - Status: {job.status}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default JobListings;
