import React from 'react';
import { Form, Input, Button, message, Typography } from 'antd';
import { useNavigate, Link } from 'react-router-dom';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { api } from '../services/api';

const { Title } = Typography;

const Login = () => {
    const navigate = useNavigate();

    const onFinish = async (values) => {
        try {
            // Clear any existing token
            localStorage.removeItem('token');
            delete api.defaults.headers.common['Authorization'];

            const response = await api.post('/api/auth/login', {
                username: values.username,
                password: values.password
            });

            if (response.data.success) {
                // Save new token
                localStorage.setItem('token', response.data.token);
                
                // Set new authorization header
                api.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
                
                message.success('Login successful!');

                // Force a page reload after successful login
                window.location.href = '/jobs';
            } else {
                message.error(response.data.message || 'Login failed');
            }
        } catch (error) {
            console.error('Login error:', error);
            message.error(error.response?.data?.message || 'Login failed. Please try again.');
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <div style={{ 
                textAlign: 'center', 
                padding: '40px 0',
                background: '#f0f2f5'
            }}>
                <Title style={{ 
                    margin: 0,
                    color: '#000000',
                    fontSize: '32px',
                    textTransform: 'uppercase',
                    letterSpacing: '2px',
                    textShadow: '1px 1px 2px rgba(0,0,0,0.1)'
                }}>
                    Job Application Tracker
                </Title>
            </div>

            <div style={{ 
                width: '100%',
                maxWidth: '600px',
                margin: '20px auto',
                padding: '40px',
                boxShadow: '0 0 10px rgba(0,0,0,0.1)',
                borderRadius: '8px',
                background: 'white',
                flex: 1
            }}>
                <Title level={3} style={{ 
                    textAlign: 'center', 
                    marginBottom: '32px',
                    color: '#000000'
                }}>
                    Sign In
                </Title>
                
                <Form
                    name="login"
                    onFinish={onFinish}
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
                            style={{ height: '45px' }}
                        />
                    </Form.Item>

                    <Form.Item
                        name="password"
                        rules={[{ required: true, message: 'Please input your password!' }]}
                    >
                        <Input.Password 
                            prefix={<LockOutlined />}
                            placeholder="Password"
                            style={{ height: '45px' }}
                        />
                    </Form.Item>

                    <Form.Item>
                        <Button 
                            type="primary" 
                            htmlType="submit" 
                            style={{ 
                                width: '100%', 
                                marginBottom: '16px',
                                height: '45px',
                                fontSize: '16px'
                            }}
                        >
                            Sign In
                        </Button>
                        <div style={{ 
                            textAlign: 'center',
                            fontSize: '16px'
                        }}>
                            <div style={{ marginBottom: '12px' }}>
                                Don't have an account? <Link to="/register">Register here</Link>
                            </div>
                            <div>
                                <Link to="/forgot-password" style={{ color: '#ff4d4f' }}>Forgot Password?</Link>
                            </div>
                        </div>
                    </Form.Item>
                </Form>
            </div>
        </div>
    );
};

export default Login; 