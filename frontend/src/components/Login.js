import React from 'react';
import { Form, Input, Button, Card, message, Typography } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate, Link } from 'react-router-dom';
import { API_BASE_URL } from '../config/config';
import { api } from '../services/api';

const { Title } = Typography;

const Login = () => {
  const navigate = useNavigate();

  const handleLogin = async (values) => {
    try {
      console.log('Attempting login with:', values);

      const response = await api.post('/api/auth/login', {
        username: values.username,
        password: values.password
      });

      console.log('Login response:', response.data);

      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        message.success('Login successful!');
        navigate('/jobs');
      } else {
        message.error('Login failed - no token received');
      }
    } catch (error) {
      console.error('Login error:', error);
      message.error(error.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      background: '#f0f2f5',
      padding: '24px'
    }}>
      <Title level={2} style={{ marginBottom: '48px', textAlign: 'center' }}>
        Job Application Tracker
      </Title>
      
      <Card style={{ width: '100%', maxWidth: '400px' }}>
        <Form
          name="login"
          onFinish={handleLogin}
          layout="vertical"
          size="large"
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: 'Please input your username!' }]}
          >
            <Input 
              prefix={<UserOutlined />} 
              placeholder="Username" 
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Input.Password 
              prefix={<LockOutlined />} 
              placeholder="Password" 
            />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" style={{ width: '100%', marginBottom: '12px' }}>
              Log in
            </Button>
            <div style={{ textAlign: 'center' }}>
              <div style={{ marginBottom: '8px' }}>
                Don't have an account? <Link to="/register">Register here</Link>
              </div>
              <div>
                <Link to="/forgot-password" style={{ color: '#ff4d4f' }}>Forgot Password?</Link>
              </div>
            </div>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default Login; 