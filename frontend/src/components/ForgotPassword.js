import React, { useState } from 'react';
import { Form, Input, Button, message, Steps } from 'antd';
import { useNavigate } from 'react-router-dom';
import { UserOutlined, MailOutlined, LockOutlined } from '@ant-design/icons';
import { api } from '../services/api';

const { Step } = Steps;

const ForgotPassword = () => {
    const [currentStep, setCurrentStep] = useState(0);
    const [verificationCode, setVerificationCode] = useState('');
    const [userInfo, setUserInfo] = useState(null);
    const navigate = useNavigate();

    const onVerifyIdentity = async (values) => {
        try {
            const response = await api.post('/api/auth/verify-identity', values);
            if (response.data.success) {
                setUserInfo(response.data.user);
                message.success('Identity verified! Check your email for the verification code.');
                setCurrentStep(1);
            }
        } catch (error) {
            message.error(error.response?.data?.message || 'Verification failed');
        }
    };

    const onVerifyCode = async (values) => {
        try {
            const response = await api.post('/api/auth/verify-code', {
                email: userInfo.email,
                code: values.code
            });
            if (response.data.success) {
                setVerificationCode(values.code);
                setCurrentStep(2);
            }
        } catch (error) {
            message.error('Invalid verification code');
        }
    };

    const onResetPassword = async (values) => {
        try {
            const response = await api.post('/api/auth/reset-password', {
                email: userInfo.email,
                code: verificationCode,
                newPassword: values.newPassword
            });
            if (response.data.success) {
                message.success('Password reset successfully!');
                navigate('/login');
            }
        } catch (error) {
            message.error('Failed to reset password');
        }
    };

    const steps = [
        {
            title: 'Verify Identity',
            content: (
                <Form onFinish={onVerifyIdentity} layout="vertical">
                    <Form.Item
                        name="email"
                        label="Email"
                        rules={[
                            { required: true, message: 'Please input your email!' },
                            { type: 'email', message: 'Please enter a valid email!' }
                        ]}
                    >
                        <Input prefix={<MailOutlined />} placeholder="Enter your email" />
                    </Form.Item>
                    <Form.Item
                        name="username"
                        label="Username"
                        rules={[{ required: true, message: 'Please input your username!' }]}
                    >
                        <Input prefix={<UserOutlined />} placeholder="Enter your username" />
                    </Form.Item>
                    <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
                        Verify Identity
                    </Button>
                </Form>
            )
        },
        {
            title: 'Verify Code',
            content: (
                <Form onFinish={onVerifyCode} layout="vertical">
                    <Form.Item
                        name="code"
                        label="Verification Code"
                        rules={[{ required: true, message: 'Please input the verification code!' }]}
                    >
                        <Input placeholder="Enter the code sent to your email" />
                    </Form.Item>
                    <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
                        Verify Code
                    </Button>
                </Form>
            )
        },
        {
            title: 'Reset Password',
            content: (
                <Form onFinish={onResetPassword} layout="vertical">
                    <Form.Item
                        name="newPassword"
                        label="New Password"
                        rules={[
                            { required: true, message: 'Please input your new password!' },
                            { min: 6, message: 'Password must be at least 6 characters!' }
                        ]}
                    >
                        <Input.Password prefix={<LockOutlined />} placeholder="Enter new password" />
                    </Form.Item>
                    <Form.Item
                        name="confirmPassword"
                        label="Confirm Password"
                        dependencies={['newPassword']}
                        rules={[
                            { required: true, message: 'Please confirm your password!' },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue('newPassword') === value) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(new Error('Passwords do not match!'));
                                },
                            }),
                        ]}
                    >
                        <Input.Password prefix={<LockOutlined />} placeholder="Confirm new password" />
                    </Form.Item>
                    <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
                        Reset Password
                    </Button>
                </Form>
            )
        }
    ];

    return (
        <div style={{ 
            maxWidth: 500, 
            margin: '50px auto', 
            padding: '20px',
            boxShadow: '0 0 10px rgba(0,0,0,0.1)',
            borderRadius: '8px',
            background: 'white'
        }}>
            <h2 style={{ textAlign: 'center', marginBottom: '24px' }}>Reset Password</h2>
            
            <Steps current={currentStep} style={{ marginBottom: '24px' }}>
                {steps.map(item => (
                    <Step key={item.title} title={item.title} />
                ))}
            </Steps>

            <div style={{ marginTop: '24px' }}>
                {steps[currentStep].content}
            </div>
        </div>
    );
};

export default ForgotPassword; 