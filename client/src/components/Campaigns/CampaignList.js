import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/CampaignList.css';

const CampaignList = () => {
  const [campaigns, setCampaigns] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    try {
      const response = await fetch('https://crm-gc6q.onrender.com/api/campaigns', {
        credentials: 'include'
      });
      const data = await response.json();
      setCampaigns(data);
    } catch (error) {
      console.error('Error fetching campaigns:', error);
    }
  };

  return (
    <div className="campaign-list">
      <div className="campaign-header">
        <h2>Campaigns</h2>
        <button 
          onClick={() => navigate('/campaigns/create')}
          className="create-button"
        >
          Create New Campaign
        </button>
      </div>
      <div className="campaign-grid">
        {campaigns.map(campaign => (
          <div key={campaign._id} className="campaign-card">
            <h3>{campaign.name}</h3>
            <p>Status: {campaign.status}</p>
            <p>Sent: {campaign.sentCount}</p>
            <p>Failed: {campaign.failedCount}</p>
            <button 
              onClick={() => navigate(`/campaigns/${campaign._id}`)}
              className="view-button"
            >
              View Details
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CampaignList;