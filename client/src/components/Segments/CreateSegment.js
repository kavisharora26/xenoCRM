import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/CreateSegment.css';

const CreateSegment = () => {
  const navigate = useNavigate();
  const [segmentData, setSegmentData] = useState({
    name: '',
    conditions: [{
      field: 'totalSpending',
      operator: '>',
      value: '',
      logicalOperator: 'AND'
    }]
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('https://crm-gc6q.onrender.com/api/segments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(segmentData)
      });
      
      if (response.ok) {
        navigate('/segments');
      }
    } catch (error) {
      console.error('Error creating segment:', error);
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

  return (
    <div className="create-segment">
      <h2>Create New Segment</h2>
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
          </div>
        ))}
        
        <button type="button" onClick={addCondition} className="add-condition">
          Add Condition
        </button>
        
        <div className="form-actions">
          <button type="submit" className="submit-button">Create Segment</button>
          <button 
            type="button" 
            onClick={() => navigate('/segments')}
            className="cancel-button"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateSegment;