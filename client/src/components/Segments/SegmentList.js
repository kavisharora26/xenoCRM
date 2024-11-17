import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/SegmentList.css';

const SegmentList = () => {
  const [segments, setSegments] = useState([]);
  const navigate = useNavigate();

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

  return (
    <div className="segment-list">
      <div className="segment-header">
        <h2>Audience Segments</h2>
        <button 
          onClick={() => navigate('/segments/create')}
          className="create-button"
        >
          Create New Segment
        </button>
      </div>
      <div className="segment-grid">
        {segments.map(segment => (
          <div key={segment._id} className="segment-card">
            <h3>{segment.name}</h3>
            <p>Audience Size: {segment.audienceSize}</p>
            <p>Created: {new Date(segment.createdAt).toLocaleDateString()}</p>
            <button 
              onClick={() => navigate(`/segments/${segment._id}`)}
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

export default SegmentList;