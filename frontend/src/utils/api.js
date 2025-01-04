import axios from 'axios';

const api = axios.create({
  baseURL: 'https://job-application-app-y28m.onrender.com/', // Your backend API URL
});

export default api;
