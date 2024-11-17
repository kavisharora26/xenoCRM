import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../styles/SegmentDetail.css';

const SegmentDetail = () => {
  const [segment, setSegment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    fetchSegmentDetails();
  }, [id]);

  const fetchSegmentDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`https://crm-gc6q.onrender.com/api/segments/${id}`, {
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch segment');
      }

      const data = await response.json();
      setSegment(data);
    } catch (error) {
      console.error('Error fetching segment details:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this segment?')) {
      try {
        const response = await fetch(`https://crm-gc6q.onrender.com/api/segments/${id}`, {
          method: 'DELETE',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to delete segment');
        }

        navigate('/segments');
      } catch (error) {
        console.error('Error deleting segment:', error);
        setError(error.message);
      }
    }
  };

  if (loading) {
    return (
      <div className="segment-detail-loading">
        <div className="loading-spinner"></div>
        <p>Loading segment details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="segment-detail-error">
        <h2>{error}</h2>
        <button onClick={() => navigate('/segments')} className="back-button">
          Back to Segments
        </button>
      </div>
    );
  }

  if (!segment) {
    return (
      <div className="segment-detail-error">
        <h2>Segment Not Found</h2>
        <button onClick={() => navigate('/segments')} className="back-button">
          Back to Segments
        </button>
      </div>
    );
  }

  return (
    <div className="segment-detail-container">
      <div className="segment-detail-header">
        <button onClick={() => navigate('/segments')} className="back-button">
          ← Back to Segments
        </button>
        <div className="header-actions">
          <button 
            onClick={() => navigate(`/segments/edit/${id}`)} 
            className="edit-button"
          >
            Edit Segment
          </button>
          <button onClick={handleDelete} className="delete-button">
            Delete Segment
          </button>
        </div>
      </div>

      <div className="segment-detail-content">
        <div className="segment-detail-main">
          <h1>{segment.name}</h1>
          <div className="segment-stats">
            <div className="stat-card">
              <h3>Audience Size</h3>
              <p>{segment.audienceSize?.toLocaleString() || '0'}</p>
            </div>
            <div className="stat-card">
              <h3>Created Date</h3>
              <p>{new Date(segment.createdAt).toLocaleDateString()}</p>
            </div>
            <div className="stat-card">
              <h3>Last Updated</h3>
              <p>{new Date(segment.updatedAt).toLocaleDateString()}</p>
            </div>
          </div>
        </div>

        <div className="segment-detail-section">
          <h2>Segment Conditions</h2>
          <div className="criteria-list">
            {segment.conditions?.map((condition, index) => (
              <div key={index} className="criterion-card">
                <h4>{condition.field}</h4>
                <p>
                  {condition.operator} {condition.value}
                  {index < segment.conditions.length - 1 && (
                    <span className="logical-operator">
                      {condition.logicalOperator}
                    </span>
                  )}
                </p>
              </div>
            ))}
          </div>
        </div>

        {segment.campaigns && (
          <div className="segment-detail-section">
            <h2>Recent Campaigns</h2>
            <div className="campaigns-list">
              {segment.campaigns.length > 0 ? (
                segment.campaigns.map(campaign => (
                  <div key={campaign._id} className="campaign-card">
                    <h4>{campaign.name}</h4>
                    <p>Status: {campaign.status}</p>
                    <p>Sent: {new Date(campaign.sentDate).toLocaleDateString()}</p>
                  </div>
                ))
              ) : (
                <p className="no-campaigns">No campaigns have used this segment yet.</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SegmentDetail;