import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../styles/CampaignDetail.css';

const CampaignDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [campaign, setCampaign] = useState(null);
  const [segments, setSegments] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editedCampaign, setEditedCampaign] = useState(null);

  useEffect(() => {
    fetchCampaignDetails();
    fetchSegments();
  }, [id]);

  const fetchCampaignDetails = async () => {
    try {
      const response = await fetch(`https://crm-gc6q.onrender.com/api/campaigns/${id}`, {
        credentials: 'include'
      });
      const data = await response.json();
      setCampaign(data);
      setEditedCampaign(data);
    } catch (error) {
      console.error('Error fetching campaign details:', error);
    }
  };

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

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedCampaign(campaign);
  };

  const handleSave = async () => {
    try {
      const response = await fetch(`https://crm-gc6q.onrender.com/api/campaigns/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(editedCampaign)
      });

      if (response.ok) {
        const updatedCampaign = await response.json();
        setCampaign(updatedCampaign);
        setIsEditing(false);
      }
    } catch (error) {
      console.error('Error updating campaign:', error);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this campaign?')) {
      try {
        const response = await fetch(`https://crm-gc6q.onrender.com/api/campaigns/${id}`, {
          method: 'DELETE',
          credentials: 'include'
        });

        if (response.ok) {
          navigate('/campaigns');
        }
      } catch (error) {
        console.error('Error deleting campaign:', error);
      }
    }
  };

  if (!campaign) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="campaign-details-container">
      <div className="campaign-details-header">
        <h2>Campaign Details</h2>
        {!isEditing && (
          <div className="button-group">
            <button className="edit-button" onClick={handleEdit}>
              Edit
            </button>
            <button className="delete-button" onClick={handleDelete}>
              Delete
            </button>
          </div>
        )}
      </div>

      <div className="campaign-details-content">
        {isEditing ? (
          <div className="edit-form">
            <div className="form-group">
              <label>Campaign Name:</label>
              <input
                type="text"
                value={editedCampaign.name}
                onChange={(e) =>
                  setEditedCampaign({ ...editedCampaign, name: e.target.value })
                }
              />
            </div>
            
            <div className="form-group">
              <label>Segment:</label>
              <select
                value={editedCampaign.segmentId}
                onChange={(e) =>
                  setEditedCampaign({ ...editedCampaign, segmentId: e.target.value })
                }
              >
                {segments.map(segment => (
                  <option key={segment._id} value={segment._id}>
                    {segment.name} (Audience: {segment.audienceSize})
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Message Template:</label>
              <textarea
                value={editedCampaign.message}
                onChange={(e) =>
                  setEditedCampaign({ ...editedCampaign, message: e.target.value })
                }
                placeholder="Use [Name] to personalize the message"
              />
            </div>

            <div className="button-group">
              <button className="save-button" onClick={handleSave}>
                Save
              </button>
              <button className="cancel-button" onClick={handleCancelEdit}>
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="campaign-info">
            <div className="info-group">
              <label>Campaign Name:</label>
              <span>{campaign.name}</span>
            </div>
            <div className="info-group">
              <label>Status:</label>
              <span>{campaign.status}</span>
            </div>
            <div className="info-group">
              <label>Segment:</label>
              <span>
                {segments.find(s => s._id === campaign.segmentId)?.name || 'Loading...'}
              </span>
            </div>
            <div className="info-group">
              <label>Message Template:</label>
              <span>{campaign.message}</span>
            </div>
            <div className="info-group">
              <label>Statistics:</label>
              <div className="stats">
                <span>Sent: {campaign.sentCount}</span>
                <span>Failed: {campaign.failedCount}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CampaignDetails;