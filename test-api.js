const axios = require('axios');

const BASE_URL = 'https://job-application-app-y28m.onrender.com';

async function testEndpoints() {
    try {
        // 1. Test Health Check
        const health = await axios.get(`${BASE_URL}/`);
        console.log('Server health:', health.data);

        // 2. Test Login to get token
        const login = await axios.post(`${BASE_URL}/api/auth/login`, {
            username: 'testuser1',
            password: 'password123'
        });
        console.log('Login:', login.data);

        // Set token for subsequent requests
        const token = login.data.token;
        const config = {
            headers: { 
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        };

        // 3. Test Get Jobs with token
        const jobs = await axios.get(`${BASE_URL}/api/jobs`, config);
        console.log('Jobs:', jobs.data);

        // 4. Test Add Job with token
        const addJob = await axios.post(`${BASE_URL}/api/jobs`, {
            company: 'Test Company',
            position: 'Developer',
            status: 'applied',
            location: 'Remote'
        }, config);
        console.log('Add Job:', addJob.data);

    } catch (error) {
        console.error('Test failed:', error.response?.data || error.message);
    }
}

testEndpoints();