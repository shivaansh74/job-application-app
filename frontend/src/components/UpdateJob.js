import React, { useState } from "react";
import axios from "axios";

const UpdateJob = ({ jobId }) => {
  const [formData, setFormData] = useState({
    position: "",
    company: "",
    status: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.patch(`http://localhost:5000/api/jobs/${jobId}`, formData);
      alert("Job updated successfully!");
    } catch (error) {
      console.error("Error updating job:", error);
    }
  };

  return (
    <div>
      <h2>Update Job</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="position"
          placeholder="Position"
          value={formData.position}
          onChange={handleChange}
        />
        <input
          type="text"
          name="company"
          placeholder="Company"
          value={formData.company}
          onChange={handleChange}
        />
        <input
          type="text"
          name="status"
          placeholder="Status (e.g., applied, interviewing)"
          value={formData.status}
          onChange={handleChange}
        />
        <button type="submit">Update Job</button>
      </form>
    </div>
  );
};

export default UpdateJob;
