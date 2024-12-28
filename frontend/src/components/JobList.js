import React, { useState, useEffect } from 'react';

const JobListings = () => {
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // to show loading indicator

  // Fetch jobs from the backend when the page loads
  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/jobs'); // Make sure this URL is correct
      const data = await response.json();

      if (response.ok) {
        setJobs(data); // Set jobs state if response is successful
      } else {
        console.error('Failed to fetch jobs');
      }
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setIsLoading(false); // Set loading to false after data is fetched
    }
  };

  // Function to add border around the status
  const getStatusBorder = (status) => {
    return 'border-2 border-gray-500 p-2 rounded-full'; // Simple border for all statuses
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

      {/* Loading Indicator */}
      {isLoading ? (
        <p>Loading jobs...</p>
      ) : (
        <ul>
          {jobs.length === 0 ? (
            <p>No jobs found. Please add a job!</p>
          ) : (
            jobs.map((job) => (
              <li key={job._id} className="p-2 border-b flex justify-between items-center">
                <div>
                  <strong>{job.title}</strong> at {job.company}
                </div>

                {/* Display the status with a border */}
                <div className={getStatusBorder(job.status)}>
                  {job.status}
                </div>
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
};

export default JobListings;
