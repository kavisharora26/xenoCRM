import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/CreateCampaign.css';

const CreateCampaign = () => {
  const navigate = useNavigate();
  const [segments, setSegments] = useState([]);
  const [campaignData, setCampaignData] = useState({
    name: '',
    segmentId: '',
    message: ''
  });

  useEffect(() => {
    fetchSegments();
  }, []);

  const fetchSegments = async () => {
    try {
      const response = await fetch('https://crm-gc6q.onrender.com/api/segments', {
        credentials: 'include'
      });
      const data = await response.json();
      setSegments(data);
    } catch (error) {
      console.error('Error fetching segments:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('https://crm-gc6q.onrender.com/api/campaigns', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(campaignData)
      });
      
      if (response.ok) {
        navigate('/campaigns');
      }
    } catch (error) {
      console.error('Error creating campaign:', error);
    }
  };

  return (
    <div className="create-campaign">
      <h2>Create New Campaign</h2>
      <form onSubmit={handleSubmit} className="campaign-form">
        <div className="form-group">
          <label>Campaign Name</label>
          <input
            type="text"
            value={campaignData.name}
            onChange={(e) => setCampaignData({
              ...campaignData,
              name: e.target.value
            })}
            required
          />
        </div>
        
        <div className="form-group">
          <label>Select Segment</label>
          <select
            value={campaignData.segmentId}
            onChange={(e) => setCampaignData({
              ...campaignData,
              segmentId: e.target.value
            })}
            required
          >
            <option value="">Select a segment</option>
            {segments.map(segment => (
              <option key={segment._id} value={segment._id}>
                {segment.name} (Audience: {segment.audienceSize})
              </option>
            ))}
          </select>
        </div>
        
        <div className="form-group">
          <label>Message Template</label>
          <textarea
            value={campaignData.message}
            onChange={(e) => setCampaignData({
              ...campaignData,
              message: e.target.value
            })}
            placeholder="Use [Name] to personalize the message"
            required
          />
        </div>
        
        <div className="form-actions">
          <button type="submit" className="submit-button">Create Campaign</button>
          <button 
            type="button" 
            onClick={() => navigate('/campaigns')}
            className="cancel-button"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateCampaign;