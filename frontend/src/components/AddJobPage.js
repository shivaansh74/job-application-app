// src/components/AddJobPage.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function AddJobPage({ setJobs }) {
  const [title, setTitle] = useState('');
  const [company, setCompany] = useState('');
  const [status, setStatus] = useState('applied');
  const navigate = useNavigate(); // For navigation after form submission

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newJob = { title, company, status };

    const response = await fetch('http://localhost:5000/api/jobs', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newJob),
    });

    const data = await response.json();
    setJobs(prevJobs => [...prevJobs, data]); // Add new job to the list

    // Redirect back to the home page after submitting
    navigate('/');
  };

  return (
    <div className="add-job-page">
      <h4>Add New Job</h4>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Job Title:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Company:</label>
          <input
            type="text"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Status:</label>
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="applied">Applied</option>
            <option value="interviewed">Interviewed</option>
            <option value="rejected">Rejected</option>
            <option value="accepted">Accepted</option>
          </select>
        </div>
        <button type="submit">Add Job</button>
      </form>
    </div>
  );
}

export default AddJobPage;
