import React, { useState } from 'react';
import DeleteConfirmationModal from './DeleteConfirmationModal';

function JobList() {
  const [jobs, setJobs] = useState([
    { id: 1, title: 'Software Engineer', company: 'Tech Co' },
    { id: 2, title: 'Data Scientist', company: 'Data Corp' },
  ]);
  const [showModal, setShowModal] = useState(false);
  const [jobToDelete, setJobToDelete] = useState(null);

  const handleDeleteClick = (id) => {
    setJobToDelete(id);
    setShowModal(true);
  };

  const confirmDelete = () => {
    setJobs(jobs.filter((job) => job.id !== jobToDelete));
    setShowModal(false);
    setJobToDelete(null);
  };

  const cancelDelete = () => {
    setShowModal(false);
    setJobToDelete(null);
  };

  return (
    <div>
      {jobs.map((job) => (
        <div key={job.id} style={{ marginBottom: '10px' }}>
          <p>
            <strong>{job.title}</strong> at {job.company}
          </p>
          <button
            className="trash-btn"
            style={{ backgroundColor: 'red', color: 'white', cursor: 'pointer' }}
            onClick={() => handleDeleteClick(job.id)}
          >
            🗑️
          </button>
        </div>
      ))}
      {showModal && (
        <DeleteConfirmationModal onConfirm={confirmDelete} onCancel={cancelDelete} />
      )}
    </div>
  );
}

export default JobList;
