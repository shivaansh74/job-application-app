import React, { useState, useEffect } from "react";
import AddJob from "./components/AddJob";
import DeleteConfirmationModal from "./components/DeleteConfirmationModal";
import "./App.css";

function App() {
  const [jobs, setJobs] = useState([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [jobToDelete, setJobToDelete] = useState(null);
  const [currentPage, setCurrentPage] = useState("list"); // Tracks the current page

  useEffect(() => {
    const fetchJobs = async () => {
      const response = await fetch("http://localhost:5000/api/jobs");
      const data = await response.json();
      setJobs(data);
    };
    fetchJobs();
  }, []);

  const handleDelete = (id) => {
    setShowDeleteModal(true);
    setJobToDelete(id);
  };

  const confirmDelete = async () => {
    await fetch(`http://localhost:5000/api/jobs/${jobToDelete}`, {
      method: "DELETE",
    });
    setJobs(jobs.filter((job) => job._id !== jobToDelete));
    setShowDeleteModal(false);
    setJobToDelete(null);
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
  };

  const handleStatusChange = async (event, id) => {
    const newStatus = event.target.value;
    await fetch(`http://localhost:5000/api/jobs/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
    setJobs(
      jobs.map((job) =>
        job._id === id ? { ...job, status: newStatus } : job
      )
    );
  };

  const handleAddJob = async (newJob) => {
    setJobs([...jobs, newJob]);
    setCurrentPage("list"); // Navigate back to the job list page
  };

  return (
    <div className="container">
      {currentPage === "list" && (
        <>
          <h2>Job Tracker</h2>
          <h3>Your Job Applications</h3>
          {jobs.length === 0 ? (
            <div>
              <p>No applications yet.</p>
              <button onClick={() => setCurrentPage("add")}>Add Job</button>
            </div>
          ) : (
            <>
              <button onClick={() => setCurrentPage("add")}>Add Job</button>
              <ul>
                {jobs
                  .filter(
                    (job) => statusFilter === "" || job.status === statusFilter
                  )
                  .map((job) => (
                    <li key={job._id} className="job-card">
                      <div className="job-info">
                        <h4>{job.title}</h4>
                        <p>Company: {job.company}</p>
                        <p>Status: {job.status}</p>
                      </div>
                      <div>
                        <label htmlFor={`status-${job._id}`}>Status:</label>
                        <select
                          id={`status-${job._id}`}
                          value={job.status}
                          onChange={(event) => handleStatusChange(event, job._id)}
                        >
                          <option value="applied">Applied</option>
                          <option value="interviewed">Interviewed</option>
                          <option value="rejected">Rejected</option>
                          <option value="accepted">Accepted</option>
                        </select>
                      </div>
                      <div className="button-container">
                        <button
                          onClick={() => handleDelete(job._id)}
                          className="trash-btn"
                        >
                          🗑️
                        </button>
                      </div>
                    </li>
                  ))}
              </ul>
            </>
          )}
        </>
      )}
      {currentPage === "add" && <AddJob onAddJob={handleAddJob} />}
      {showDeleteModal && (
        <DeleteConfirmationModal
          onConfirm={confirmDelete}
          onCancel={cancelDelete}
        />
      )}
    </div>
  );
}

export default App;
