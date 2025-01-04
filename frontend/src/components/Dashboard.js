import React from 'react';
import { Row, Col, Card, Statistic, Progress } from 'antd';
import { 
  PieChart, Pie, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  Cell
} from 'recharts';

const statusColors = {
  applied: '#1890ff',
  interviewed: '#faad14',
  accepted: '#52c41a',
  rejected: '#ff4d4f'
};

const Dashboard = ({ jobs }) => {
  // Calculate statistics
  const totalApplications = jobs.length;
  const statusCounts = jobs.reduce((acc, job) => {
    acc[job.status] = (acc[job.status] || 0) + 1;
    return acc;
  }, {});

  // Prepare data for pie chart
  const pieData = Object.entries(statusCounts).map(([status, count]) => ({
    name: status.charAt(0).toUpperCase() + status.slice(1),
    value: count
  }));

  // Updated bar chart data preparation - group by date
  const dateData = jobs.reduce((acc, job) => {
    const date = new Date(job.applied_date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
    acc[date] = (acc[date] || 0) + 1;
    return acc;
  }, {});

  const barData = Object.entries(dateData)
    .sort((a, b) => new Date(a[0]) - new Date(b[0])) // Sort by date
    .map(([date, count]) => ({
      date,
      applications: count
    }));

  return (
    <div style={{ padding: '24px' }}>
      <Row gutter={[16, 16]}>
        {/* Status Progress Bars - Moved to top */}
        <Col xs={24}>
          <Card title="Application Status Breakdown">
            <Row gutter={[16, 16]}>
              {Object.entries(statusCounts).map(([status, count]) => (
                <Col xs={24} sm={12} md={6} key={status}>
                  <div style={{ padding: '0 16px' }}>
                    <Progress
                      percent={Math.round((count / totalApplications) * 100)}
                      strokeColor={statusColors[status]}
                      format={() => `${count} ${status}`}
                    />
                  </div>
                </Col>
              ))}
            </Row>
          </Card>
        </Col>

        {/* Statistics Cards */}
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Total Applications"
              value={totalApplications}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Interview Rate"
              value={((statusCounts.interviewed || 0) / totalApplications * 100).toFixed(1)}
              suffix="%"
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Acceptance Rate"
              value={((statusCounts.accepted || 0) / totalApplications * 100).toFixed(1)}
              suffix="%"
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Rejection Rate"
              value={((statusCounts.rejected || 0) / totalApplications * 100).toFixed(1)}
              suffix="%"
              valueStyle={{ color: '#ff4d4f' }}
            />
          </Card>
        </Col>

        {/* Charts */}
        <Col xs={24} md={12}>
          <Card title="Application Status">
            <div style={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label={({
                      cx,
                      cy,
                      midAngle,
                      innerRadius,
                      outerRadius,
                      value,
                      name
                    }) => {
                      const RADIAN = Math.PI / 180;
                      const radius = 25 + innerRadius + (outerRadius - innerRadius);
                      const x = cx + radius * Math.cos(-midAngle * RADIAN);
                      const y = cy + radius * Math.sin(-midAngle * RADIAN);
                      return (
                        <text
                          x={x}
                          y={y}
                          fill={statusColors[name.toLowerCase()]}
                          textAnchor={x > cx ? 'start' : 'end'}
                          dominantBaseline="central"
                        >
                          {`${name} (${value})`}
                        </text>
                      );
                    }}
                  >
                    {pieData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={statusColors[entry.name.toLowerCase()]} 
                      />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>

        <Col xs={24} md={12}>
          <Card title="Applications by Date">
            <div style={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="date"
                    interval={0}
                    angle={-45}
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis 
                    tickCount={5}
                    allowDecimals={false}
                    domain={[0, 'dataMax + 1']}
                  />
                  <Tooltip />
                  <Bar 
                    dataKey="applications" 
                    fill="#1890ff"
                    barSize={30}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard; 