import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles/Dashboard.css';

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalCustomers: 0,
    activeSegments: 0,
    campaignsSent: 0,
    engagementRate: 0
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        setStats({
          totalCustomers: 1234,
          activeSegments: 5,
          campaignsSent: 12,
          engagementRate: 67.5
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <p>Welcome back! Here's what's happening with your campaigns.</p>
      </div>

      <div className="quick-actions">
        <button 
          onClick={() => navigate('/campaigns/create')} 
          className="action-button"
        >
          Create Campaign
        </button>
        <button 
          onClick={() => navigate('/segments/create')} 
          className="action-button secondary-button"
        >
          New Segment
        </button>
      </div>
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Customers</h3>
          <div className="stat-value">{stats.totalCustomers.toLocaleString()}</div>
          <div className="stat-change positive">
            +12.5% from last month
          </div>
        </div>
        <div className="stat-card">
          <h3>Active Segments</h3>
          <div className="stat-value">{stats.activeSegments}</div>
          <div className="stat-change">
            +2 new segments
          </div>
        </div>
        <div className="stat-card">
          <h3>Campaigns Sent</h3>
          <div className="stat-value">{stats.campaignsSent}</div>
          <div className="stat-change positive">
            +3 this month
          </div>
        </div>
        <div className="stat-card">
          <h3>Engagement Rate</h3>
          <div className="stat-value">{stats.engagementRate}%</div>
          <div className="stat-change negative">
            -2.1% from last campaign
          </div>
        </div>
      </div>
      <div className="dashboard-grid">
        <div className="chart-container">
          <div className="chart-header">
            <h2 className="chart-title">Campaign Performance</h2>
            <div className="chart-legend">
              <div className="legend-item">
                <div className="legend-dot" style={{ backgroundColor: '#2563eb' }}></div>
                Opens
              </div>
              <div className="legend-item">
                <div className="legend-dot" style={{ backgroundColor: '#059669' }}></div>
                Clicks
              </div>
            </div>
          </div>
          <div style={{ height: '300px', background: '#f9fafb' }}></div>
        </div>
        <div className="activity-card">
          <h2>Recent Activity</h2>
          <div className="activity-list">
            <div className="activity-item">
              <div className="activity-icon">📊</div>
              <div className="activity-content">
                <h4>New Campaign Created</h4>
                <p>Summer Sale Announcement</p>
                <span className="activity-time">2 hours ago</span>
              </div>
            </div>
            <div className="activity-item">
              <div className="activity-icon">👥</div>
              <div className="activity-content">
                <h4>Segment Updated</h4>
                <p>High-Value Customers</p>
                <span className="activity-time">5 hours ago</span>
              </div>
            </div>
            <div className="activity-item">
              <div className="activity-icon">📈</div>
              <div className="activity-content">
                <h4>Campaign Completed</h4>
                <p>Spring Collection Launch</p>
                <span className="activity-time">1 day ago</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;