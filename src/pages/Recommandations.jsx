import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Recommendations = ({ userId }) => {
  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        // Fetch recommendations based on user preferences
        const response = await axios.get(`https://wildlens-tours-backend-q5lv.onrender.com/api/recommendations/${userId}`);
        setRecommendations(response.data);
      } catch (error) {
        console.error('Error fetching recommendations:', error.message);
      }
    };

    fetchRecommendations();
  }, [userId]);

  return (
    <div>
      <h2>Recommended Tours for You</h2>
      <div className="recommendation-list">
        {recommendations.length > 0 ? (
          recommendations.map((rec) => (
            <div key={rec._id} className="recommendation-card">
              <h5>{rec.title}</h5>
              <p>{rec.description}</p>
              <button>View Details</button>
            </div>
          ))
        ) : (
          <p>No recommendations available.</p>
        )}
      </div>
    </div>
  );
};

export default Recommendations;
