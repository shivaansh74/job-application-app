import React, { useState } from 'react';
import { Form, Input, Button, message, Steps, Typography, Alert } from 'antd';
import { useNavigate, Link } from 'react-router-dom';
import { UserOutlined, MailOutlined, LockOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { api } from '../services/api';

const { Step } = Steps;
const { Title } = Typography;

const ForgotPassword = () => {
    const [currentStep, setCurrentStep] = useState(0);
    const [verificationCode, setVerificationCode] = useState('');
    const [userInfo, setUserInfo] = useState(null);
    const [showVerificationAlert, setShowVerificationAlert] = useState(false);
    const navigate = useNavigate();

    const onVerifyIdentity = async (values) => {
        try {
            const response = await api.post('/api/auth/verify-identity', values);
            if (response.data.success) {
                setUserInfo(response.data.user);
                setVerificationCode(response.data.verificationCode); // For testing only
                setShowVerificationAlert(true);
                setCurrentStep(1);
            }
        } catch (error) {
            message.error(error.response?.data?.message || 'Verification failed');
        }
    };

    const onVerifyCode = async (values) => {
        if (values.code === verificationCode) {
            message.success('Code verified successfully!');
            setCurrentStep(2);
        } else {
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
                    <Button type="primary" htmlType="submit" style={{ width: '100%', marginBottom: '12px' }}>
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
                        <Input placeholder="Enter the verification code shown above" />
                    </Form.Item>
                    <Button type="primary" htmlType="submit" style={{ width: '100%', marginBottom: '12px' }}>
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
                    <Button type="primary" htmlType="submit" style={{ width: '100%', marginBottom: '12px' }}>
                        Reset Password
                    </Button>
                </Form>
            )
        }
    ];

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
                maxWidth: 500, 
                margin: '20px auto',
                padding: '20px',
                boxShadow: '0 0 10px rgba(0,0,0,0.1)',
                borderRadius: '8px',
                background: 'white',
                flex: 1
            }}>
                <Title level={3} style={{ textAlign: 'center', marginBottom: '24px' }}>
                    Reset Password
                </Title>

                {showVerificationAlert && (
                    <Alert
                        message="Verification Code"
                        description={`Your verification code is: ${verificationCode}`}
                        type="success"
                        showIcon
                        closable
                        onClose={() => setShowVerificationAlert(false)}
                        style={{ marginBottom: '24px' }}
                    />
                )}

                <Steps current={currentStep} style={{ marginBottom: '24px' }}>
                    {steps.map(item => (
                        <Step key={item.title} title={item.title} />
                    ))}
                </Steps>

                <div style={{ marginTop: '24px' }}>
                    {steps[currentStep].content}
                </div>

                <div style={{ textAlign: 'center', marginTop: '24px' }}>
                    <Button 
                        icon={<ArrowLeftOutlined />} 
                        onClick={() => navigate('/login')}
                    >
                        Back to Login
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword; 