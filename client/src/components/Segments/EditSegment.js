import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import '../styles/CreateSegment.css';

const EditSegment = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [segmentData, setSegmentData] = useState({
    name: '',
    conditions: [{
      field: 'totalSpending',
      operator: '>',
      value: '',
      logicalOperator: 'AND'
    }]
  });

  useEffect(() => {
    fetchSegment();
  }, [id]);

  const fetchSegment = async () => {
    try {
      setLoading(true);
      const response = await fetch(`https://crm-gc6q.onrender.com/api/segments/${id}`, {
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch segment');
      }

      const data = await response.json();
      setSegmentData({
        name: data.name,
        conditions: data.conditions
      });
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`https://crm-gc6q.onrender.com/api/segments/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(segmentData)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update segment');
      }

      navigate(`/segments/${id}`);
    } catch (error) {
      setError(error.message);
      console.error('Error updating segment:', error);
    }
  };

  const addCondition = () => {
    setSegmentData(prev => ({
      ...prev,
      conditions: [...prev.conditions, {
        field: 'totalSpending',
        operator: '>',
        value: '',
        logicalOperator: 'AND'
      }]
    }));
  };

  const removeCondition = (index) => {
    setSegmentData(prev => ({
      ...prev,
      conditions: prev.conditions.filter((_, i) => i !== index)
    }));
  };

  if (loading) {
    return (
      <div className="create-segment">
        <div className="loading-spinner"></div>
        <p>Loading segment...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="create-segment">
        <h2>Error: {error}</h2>
        <button onClick={() => navigate('/segments')} className="cancel-button">
          Back to Segments
        </button>
      </div>
    );
  }

  return (
    <div className="create-segment">
      <h2>Edit Segment</h2>
      <form onSubmit={handleSubmit} className="segment-form">
        <div className="form-group">
          <label>Segment Name</label>
          <input
            type="text"
            value={segmentData.name}
            onChange={(e) => setSegmentData({
              ...segmentData,
              name: e.target.value
            })}
            required
          />
        </div>
        
        {segmentData.conditions.map((condition, index) => (
          <div key={index} className="condition-group">
            <select
              value={condition.field}
              onChange={(e) => {
                const newConditions = [...segmentData.conditions];
                newConditions[index].field = e.target.value;
                setSegmentData({...segmentData, conditions: newConditions});
              }}
            >
              <option value="totalSpending">Total Spending</option>
              <option value="visitCount">Visit Count</option>
              <option value="lastVisit">Last Visit</option>
            </select>
            
            <select
              value={condition.operator}
              onChange={(e) => {
                const newConditions = [...segmentData.conditions];
                newConditions[index].operator = e.target.value;
                setSegmentData({...segmentData, conditions: newConditions});
              }}
            >
              <option value=">">Greater than</option>
              <option value="<=">Less than or equal</option>
              <option value="NOT_VISITED_IN">Not visited in</option>
            </select>
            
            <input
              type="text"
              value={condition.value}
              onChange={(e) => {
                const newConditions = [...segmentData.conditions];
                newConditions[index].value = e.target.value;
                setSegmentData({...segmentData, conditions: newConditions});
              }}
              placeholder="Value"
            />
            
            {index > 0 && (
              <button
                type="button"
                onClick={() => removeCondition(index)}
                className="remove-condition"
              >
                Remove
              </button>
            )}

            {index < segmentData.conditions.length - 1 && (
              <select
                value={condition.logicalOperator}
                onChange={(e) => {
                  const newConditions = [...segmentData.conditions];
                  newConditions[index].logicalOperator = e.target.value;
                  setSegmentData({...segmentData, conditions: newConditions});
                }}
                className="logical-operator"
              >
                <option value="AND">AND</option>
                <option value="OR">OR</option>
              </select>
            )}
          </div>
        ))}
        
        <button type="button" onClick={addCondition} className="add-condition">
          Add Condition
        </button>
        
        <div className="form-actions">
          <button type="submit" className="submit-button">
            Update Segment
          </button>
          <button 
            type="button" 
            onClick={() => navigate(`/segments/${id}`)}
            className="cancel-button"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditSegment;