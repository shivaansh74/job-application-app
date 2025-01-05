import React from 'react';
import { Form, Input, Button, message } from 'antd';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../services/api';
import { UserOutlined, MailOutlined, LockOutlined } from '@ant-design/icons';

const Register = () => {
    const navigate = useNavigate();

    const onFinish = async (values) => {
        try {
            const response = await api.post('/api/auth/register', {
                username: values.username,
                email: values.email,
                password: values.password
            });

            if (response.data.success) {
                message.success({
                    content: 'Registration successful! Please login.',
                    duration: 3
                });
                navigate('/login');
            }
        } catch (error) {
            console.error('Registration error:', error);
            message.error(
                error.response?.data?.message || 
                'Registration failed. Please try again.'
            );
        }
    };

    return (
        <div style={{ 
            maxWidth: 400, 
            margin: '100px auto', 
            padding: '20px',
            boxShadow: '0 0 10px rgba(0,0,0,0.1)',
            borderRadius: '8px',
            background: 'white'
        }}>
            <h2 style={{ 
                textAlign: 'center', 
                marginBottom: '24px',
                color: '#000000',
                fontSize: '24px',
                fontWeight: '600'
            }}>
                Create Account
            </h2>
            
            <Form
                name="register"
                onFinish={onFinish}
                layout="vertical"
                requiredMark={false}
            >
                <Form.Item
                    name="username"
                    label="Username"
                    rules={[
                        { required: true, message: 'Please input your username!' },
                        { min: 3, message: 'Username must be at least 3 characters!' }
                    ]}
                >
                    <Input 
                        prefix={<UserOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
                        placeholder="Enter your username" 
                    />
                </Form.Item>

                <Form.Item
                    name="email"
                    label="Email"
                    rules={[
                        { required: true, message: 'Please input your email!' },
                        { type: 'email', message: 'Please enter a valid email!' }
                    ]}
                >
                    <Input 
                        prefix={<MailOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
                        placeholder="Enter your email" 
                    />
                </Form.Item>

                <Form.Item
                    name="password"
                    label="Password"
                    rules={[
                        { required: true, message: 'Please input your password!' },
                        { min: 6, message: 'Password must be at least 6 characters!' }
                    ]}
                >
                    <Input.Password 
                        prefix={<LockOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
                        placeholder="Enter your password" 
                    />
                </Form.Item>

                <Form.Item
                    name="confirm"
                    label="Confirm Password"
                    dependencies={['password']}
                    rules={[
                        { required: true, message: 'Please confirm your password!' },
                        ({ getFieldValue }) => ({
                            validator(_, value) {
                                if (!value || getFieldValue('password') === value) {
                                    return Promise.resolve();
                                }
                                return Promise.reject(new Error('The passwords do not match!'));
                            },
                        }),
                    ]}
                >
                    <Input.Password 
                        prefix={<LockOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
                        placeholder="Confirm your password" 
                    />
                </Form.Item>

                <Form.Item>
                    <Button 
                        type="primary" 
                        htmlType="submit" 
                        style={{ width: '100%', marginBottom: '12px' }}
                    >
                        Register
                    </Button>
                    <div style={{ textAlign: 'center' }}>
                        Already have an account? {' '}
                        <Link to="/login" style={{ color: '#1890ff' }}>
                            Login here
                        </Link>
                    </div>
                </Form.Item>
            </Form>
        </div>
    );
};

export default Register; 