import React from 'react';
import { Form, Input, Button, Card, message, Typography } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';
import { useNavigate, Link } from 'react-router-dom';
import { API_BASE_URL } from '../config/config';
import { api } from '../services/api';

const { Title } = Typography;

const Register = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const handleRegister = async (values) => {
    try {
      // Check if passwords match
      if (values.password !== values.confirmPassword) {
        message.error('Passwords do not match!');
        return;
      }

      const response = await api.post('/api/auth/register', {
        username: values.username,
        email: values.email,
        password: values.password
      });

      if (response.data.success) {
        message.success({
          content: 'User registered successfully!',
          icon: '✅'
        });
        navigate('/login');
      } else {
        message.error({
          content: response.data.message || 'Registration failed',
          icon: '❌'
        });
      }
    } catch (error) {
      console.error('Register error:', error);
      message.error({
        content: error.response?.data?.message || 'Registration failed',
        icon: '❌'
      });
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
        Create Account
      </Title>
      
      <Card style={{ width: '100%', maxWidth: '400px' }}>
        <Form
          form={form}
          name="register"
          onFinish={handleRegister}
          layout="vertical"
          size="large"
        >
          <Form.Item
            name="username"
            rules={[
              { required: true, message: 'Please input your username!' },
              { min: 3, message: 'Username must be at least 3 characters long' }
            ]}
          >
            <Input 
              prefix={<UserOutlined />} 
              placeholder="Username" 
            />
          </Form.Item>

          <Form.Item
            name="email"
            rules={[
              { required: true, message: 'Please input your email!' },
              { type: 'email', message: 'Please enter a valid email!' }
            ]}
          >
            <Input 
              prefix={<MailOutlined />} 
              placeholder="Email" 
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[
              { required: true, message: 'Please input your password!' },
              { min: 6, message: 'Password must be at least 6 characters long' }
            ]}
          >
            <Input.Password 
              prefix={<LockOutlined />} 
              placeholder="Password" 
            />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            dependencies={['password']}
            rules={[
              { required: true, message: 'Please confirm your password!' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Passwords do not match!'));
                },
              }),
            ]}
          >
            <Input.Password 
              prefix={<LockOutlined />} 
              placeholder="Confirm Password" 
            />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Register
            </Button>
          </Form.Item>

          <div style={{ textAlign: 'center' }}>
            Already have an account? <Link to="/login">Log in!</Link>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default Register; 