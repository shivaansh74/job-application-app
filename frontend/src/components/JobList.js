import React, { useState, useEffect } from 'react';
import { Card, Button, message, Layout, Space, Typography, Row, Col, Tag, Tabs, Modal } from 'antd';
import { LogoutOutlined, PlusOutlined, EditOutlined, DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import JobForm from './JobForm';
import { api } from '../services/api';
import Dashboard from './Dashboard';

const { Header, Content } = Layout;
const { Title, Text } = Typography;
const { confirm } = Modal;

const API_BASE_URL = 'https://job-application-app-y28m.onrender.com';

const statusColors = {
  applied: '#1890ff',
  interviewed: '#faad14',
  accepted: '#52c41a',
  rejected: '#ff4d4f'
};

const cardStyles = {
  cardContainer: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    margin: '0 8px'
  },
  contentContainer: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column'
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '12px 24px',
    borderTop: '1px solid #f0f0f0',
    marginTop: 'auto'
  },
  editButton: {
    border: '1px solid #1890ff',
    color: '#1890ff',
    background: 'transparent',
    width: '45%'
  },
  deleteButton: {
    border: '1px solid #ff4d4f',
    color: '#ff4d4f',
    background: 'transparent',
    width: '45%'
  }
};

const JobList = () => {
  const [jobs, setJobs] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [filterStatus, setFilterStatus] = useState(null);
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  const fetchJobs = async () => {
    try {
      const response = await api.get('/api/jobs');
      setJobs(response.data);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      message.error('Failed to fetch jobs');
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const showDeleteConfirm = (job) => {
    confirm({
      title: 'Are you sure you want to delete this job application?',
      icon: <ExclamationCircleOutlined style={{ color: '#ff4d4f' }} />,
      content: (
        <div>
          <p><strong>Company:</strong> {job.company}</p>
          <p><strong>Position:</strong> {job.position}</p>
        </div>
      ),
      okText: 'Yes, delete it',
      okType: 'danger',
      cancelText: 'No, keep it',
      onOk() {
        handleDelete(job.id);
      },
    });
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/jobs/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) throw new Error('Failed to delete');
      message.success('Job application deleted successfully');
      fetchJobs();
    } catch (error) {
      console.error('Error deleting job:', error);
      message.error('Failed to delete job application');
    }
  };

  const filteredJobs = filterStatus ? jobs.filter(job => job.status === filterStatus) : jobs;

  const StatusFilter = () => (
    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 24 }}>
      <Row gutter={[16, 16]} justify="center">
        <Col>
          <Button
            style={{
              borderColor: '#000000',
              backgroundColor: 'white',
              color: '#000000',
              borderRadius: '4px',
              padding: '4px 15px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              borderWidth: !filterStatus ? '2px' : '1px'
            }}
            onClick={() => setFilterStatus(null)}
          >
            All ({jobs.length})
          </Button>
        </Col>
        {['applied', 'interviewed', 'accepted', 'rejected'].map(status => (
          <Col key={status}>
            <Button
              style={{
                borderColor: statusColors[status],
                backgroundColor: filterStatus === status ? statusColors[status] : 'white',
                color: filterStatus === status ? 'white' : statusColors[status],
                borderRadius: '4px',
                padding: '4px 15px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
              onClick={() => setFilterStatus(filterStatus === status ? null : status)}
            >
              <div style={{
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                backgroundColor: statusColors[status]
              }} />
              {status.charAt(0).toUpperCase() + status.slice(1)}
              <Text style={{ marginLeft: 8 }}>
                ({jobs.filter(job => job.status === status).length})
              </Text>
            </Button>
          </Col>
        ))}
      </Row>
    </div>
  );

  return (
    <Layout>
      <Header style={{ 
        background: '#fff', 
        display: 'flex', 
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0 24px',
        borderBottom: '1px solid #f0f0f0'
      }}>
        <div style={{ flex: 1, textAlign: 'center' }}>
          <Title level={2} style={{ margin: '16px 0' }}>
            Job Application Tracker
          </Title>
        </div>
        <Button 
          type="primary"
          danger
          icon={<LogoutOutlined />} 
          onClick={handleLogout}
          style={{ 
            position: 'absolute', 
            right: 24,
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          Logout
        </Button>
      </Header>
      
      <Content style={{ padding: '24px', background: '#f0f2f5' }}>
        <div style={{ background: '#fff', padding: '24px', borderRadius: '8px' }}>
          <Tabs 
            defaultActiveKey="applications"
            centered
          >
            <Tabs.TabPane tab="Applications" key="applications">
              <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between' }}>
                <Text>Total Applications: {jobs.length}</Text>
                <Button 
                  type="primary" 
                  icon={<PlusOutlined />} 
                  onClick={() => setIsModalVisible(true)}
                >
                  Add Job
                </Button>
              </div>

              <StatusFilter />

              <Row 
                gutter={[24, 24]}
                style={{ 
                  margin: '0 -8px',
                  padding: '0 16px'
                }}
              >
                {filteredJobs.map(job => (
                  <Col xs={24} sm={12} md={8} lg={6} key={job.id}>
                    <Card
                      hoverable
                      style={cardStyles.cardContainer}
                      bodyStyle={cardStyles.contentContainer}
                    >
                      <div style={{ textAlign: 'center' }}>
                        <Title level={4} style={{ marginBottom: 16 }}>{job.company}</Title>
                        <Space direction="vertical" size="small" style={{ width: '100%' }}>
                          <Text strong style={{ fontSize: '16px' }}>{job.position}</Text>
                          
                          <Tag color={statusColors[job.status]} style={{ margin: '8px 0' }}>
                            {job.status.toUpperCase()}
                          </Tag>
                          
                          <Text type="secondary">
                            Applied: {new Date(job.applied_date).toLocaleDateString()}
                          </Text>
                          
                          {job.salary && (
                            <Text type="secondary" strong style={{ color: '#52c41a' }}>
                              ${Number(job.salary).toLocaleString()}
                            </Text>
                          )}
                          
                          {job.notes && (
                            <div style={{ marginTop: 8 }}>
                              <Text type="secondary" strong>Notes:</Text>
                              <div style={{ 
                                background: '#f5f5f5', 
                                padding: '8px', 
                                borderRadius: '4px',
                                marginTop: '4px',
                                textAlign: 'left'
                              }}>
                                <Text type="secondary">{job.notes}</Text>
                              </div>
                            </div>
                          )}
                        </Space>
                      </div>

                      <div style={cardStyles.buttonContainer}>
                        <Button
                          type="primary"
                          icon={<EditOutlined />}
                          style={cardStyles.editButton}
                          onClick={() => {
                            setEditingJob(job);
                            setIsModalVisible(true);
                          }}
                        >
                          Edit
                        </Button>
                        <Button
                          danger
                          icon={<DeleteOutlined />}
                          style={cardStyles.deleteButton}
                          onClick={() => showDeleteConfirm(job)}
                        >
                          Delete
                        </Button>
                      </div>
                    </Card>
                  </Col>
                ))}
              </Row>

              <JobForm
                visible={isModalVisible}
                onCancel={() => {
                  setIsModalVisible(false);
                  setEditingJob(null);
                }}
                onSubmit={async (values) => {
                  try {
                    if (editingJob) {
                      await api.put(`/api/jobs/${editingJob.id}`, values);
                    } else {
                      await api.post('/api/jobs', values);
                    }
                    
                    message.success(`Job ${editingJob ? 'updated' : 'added'} successfully`);
                    setIsModalVisible(false);
                    setEditingJob(null);
                    fetchJobs();
                  } catch (error) {
                    console.error('Error saving job:', error);
                    message.error('Failed to save job');
                  }
                }}
                initialValues={editingJob}
              />
            </Tabs.TabPane>
            <Tabs.TabPane tab="Dashboard" key="dashboard">
              <Dashboard jobs={jobs} />
            </Tabs.TabPane>
          </Tabs>
        </div>
      </Content>
    </Layout>
  );
};

export default JobList;