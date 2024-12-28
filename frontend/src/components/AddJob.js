// AddJob.js (Add Job Page)
import React, { useState, useEffect } from 'react';

const AddJob = () => {
  const [title, setTitle] = useState('');
  const [company, setCompany] = useState('');
  const [status, setStatus] = useState('');
  const [isFormValid, setIsFormValid] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !company || !status) {
      alert('Please fill out all fields.');
      return;
    }

    // Create a job object
    const newJob = { title, company, status };

    try {
      // POST request to add job
      const response = await fetch('http://localhost:5000/api/jobs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newJob),
      });

      const result = await response.json();

      if (response.ok) {
        // Show success popup
        setShowPopup(true);

        // Redirect to the main job listings page after a short delay
        setTimeout(() => {
          window.location.href = '/';
        }, 3000); // Redirect after 3 seconds
      } else {
        alert('Failed to add job.');
      }
    } catch (error) {
      console.error('Error adding job:', error);
      alert('Failed to add job.');
    }
  };

  const handleCancel = () => {
    window.location.href = '/'; // Redirect to the job listings page
  };

  useEffect(() => {
    if (title && company && status) {
      setIsFormValid(true);
    } else {
      setIsFormValid(false);
    }
  }, [title, company, status]);

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Add a New Job</h1>
      
      <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="title" className="block">Job Title</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label htmlFor="company" className="block">Company</label>
          <input
            type="text"
            id="company"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            required
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label htmlFor="status" className="block">Status</label>
          <select
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            required
            className="w-full p-2 border rounded"
          >
            <option value="">Select Status</option>
            <option value="Applied" className="bg-blue-200 text-blue-800">Applied</option>
            <option value="Interviewed" className="bg-blue-100 text-blue-700">Interviewed</option>
            <option value="Accepted" className="bg-green-200 text-green-800">Accepted</option>
            <option value="Rejected" className="bg-red-200 text-red-800">Rejected</option>
          </select>
        </div>
        <div className="col-span-2">
          <button
            type="submit"
            disabled={!isFormValid}
            className={`w-full py-2 rounded ${isFormValid ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-500'}`}
          >
            Add Job
          </button>
        </div>
        <div className="col-span-2">
          <button
            type="button"
            onClick={handleCancel}
            className="w-full bg-gray-500 text-white py-2 rounded mt-2"
          >
            Cancel
          </button>
        </div>
      </form>

      {showPopup && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold">Job Added Successfully!</h2>
            <p className="mt-2">Your job has been added to the list.</p>
            <button
              onClick={() => setShowPopup(false)}
              className="mt-4 bg-green-500 text-white px-4 py-2 rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddJob;
