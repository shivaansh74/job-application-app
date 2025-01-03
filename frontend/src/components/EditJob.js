import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const EditJob = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    status: '',
    location: '',
    salary: '',
    notes: ''
  });

  useEffect(() => {
    console.log('Current job ID:', id); // Debug log
    const fetchJob = async () => {
      try {
        console.log('Fetching job with ID:', id);
        const response = await fetch(`http://localhost:5000/api/jobs/${id}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Job not found. It may have been deleted.');
          }
          throw new Error(`Server error: ${response.status}`);
        }

        const data = await response.json();
        console.log('Received job data:', data);

        if (!data) {
          throw new Error('No data received from server');
        }

        setFormData({
          title: data.title || '',
          company: data.company || '',
          status: data.status || 'applied',
          location: data.location || '',
          salary: data.salary || '',
          notes: data.notes || ''
        });
      } catch (error) {
        console.error('Error fetching job:', error);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchJob();
  }, [id]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      console.log('Submitting update for job:', id); // Debug log
      console.log('Update data:', formData); // Debug log

      const response = await fetch(`http://localhost:5000/api/jobs/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      console.log('Update response status:', response.status); // Debug log

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('Update result:', result); // Debug log

      navigate('/');
    } catch (error) {
      console.error('Error updating job:', error);
      setError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container max-w-2xl mx-auto py-8 px-4">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
          <button
            onClick={() => navigate('/')}
            className="mt-4 bg-red-100 text-red-700 px-4 py-2 rounded hover:bg-red-200"
          >
            Return to Job List
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-2xl mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Edit Job</h1>
        <p className="text-gray-600 mt-2">Update job application details</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Job Title
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g. Frontend Developer"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Company
            </label>
            <input
              type="text"
              name="company"
              value={formData.company}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g. Google"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <div className="relative">
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                required
                className={`w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  formData.status === 'applied' ? 'bg-blue-50 text-blue-800' :
                  formData.status === 'interviewed' ? 'bg-yellow-50 text-yellow-800' :
                  formData.status === 'accepted' ? 'bg-green-50 text-green-800' :
                  formData.status === 'rejected' ? 'bg-red-50 text-red-800' :
                  ''
                }`}
              >
                <option value="applied" className="bg-blue-50 text-blue-800">Applied</option>
                <option value="interviewed" className="bg-yellow-50 text-yellow-800">Interviewed</option>
                <option value="accepted" className="bg-green-50 text-green-800">Accepted</option>
                <option value="rejected" className="bg-red-50 text-red-800">Rejected</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Location
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g. Remote, New York"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Salary
            </label>
            <input
              type="text"
              name="salary"
              value={formData.salary}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g. $100,000/year"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notes
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[100px]"
              placeholder="Add any additional notes..."
            />
          </div>
        </div>

        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Updating...' : 'Update Job'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/')}
            className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditJob;
