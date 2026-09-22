const config = require('../config');

const classifyIncident = async (text) => {
  try {
    const response = await fetch(`${config.aiServiceUrl}/predict`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ text })
    });
    
    if (!response.ok) {
      console.warn(`AI Service returned ${response.status} for classification`);
      return null;
    }
    
    const data = await response.json();
    return {
      category: data.category,
      confidence: data.confidence
    };
  } catch (error) {
    console.warn('AI Service unavailable for classification:', error.message);
    return null;
  }
};

const getClusters = async (coordinates) => {
  try {
    const response = await fetch(`${config.aiServiceUrl}/cluster`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ coordinates })
    });
    
    if (!response.ok) {
      console.warn(`AI Service returned ${response.status} for clustering`);
      return [];
    }
    
    const data = await response.json();
    return data.clusters || [];
  } catch (error) {
    console.warn('AI Service unavailable for clustering:', error.message);
    return [];
  }
};

module.exports = {
  classifyIncident,
  getClusters
};
