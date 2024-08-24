import React, { useEffect, useState,useContext } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const HotelDetails = () => {
 const { user } = useContext(AuthContext);
  const { hotelId } = useParams();
  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [recommendation, setRecommendation] = useState('');

  useEffect(() => {
    const fetchHotelDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/api/hotels/${hotelId}`);
        setHotel(response.data);
      } catch (error) {
        setError('Failed to fetch hotel details');
      } finally {
        setLoading(false);
      }
    };
    fetchHotelDetails();
  }, [hotelId]);

// Frontend
const handleRecommendationSubmit = async (e) => {
  e.preventDefault();
  try {
    const response = await axios.post(`http://localhost:3001/api/hotels/hotel/${hotelId}/recommendations`, {
      userName: user.name,
      message: recommendation,
    });
    setHotel(response.data.data);  // Access the correct property from the response
    setRecommendation('');    // Clear the input field after submission
  } catch (error) {
    console.error('Failed to submit recommendation:', error.response || error.message);
  }
};



  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  if (!hotel) return <p>Hotel not found</p>;

  return (
    <div className="hotel-details-page">
      <h1>{hotel.name}</h1>
      <div className="hotel-images">
        {hotel.images && hotel.images.length > 0 ? (
          hotel.images.map((image, index) => (
            <img key={index} src={image} alt={`Hotel ${index + 1}`} className="hotel-detail-image" />
          ))
        ) : (
          <p>No images available</p>
        )}
      </div>
      <div className="hotel-recommendations">
        <h2>Recommendations</h2>
        <ul>
          {hotel.recommendations && hotel.recommendations.length > 0 ? (
            hotel.recommendations.map((rec, index) => (
              <li key={index}><strong>{rec.userName}:</strong> {rec.message}</li>
            ))
          ) : (
            <p>No recommendations available</p>
          )}
        </ul>
      </div>
      <form onSubmit={handleRecommendationSubmit}>
        <h3>Add Your Recommendation</h3>
        <textarea
          value={recommendation}
          onChange={(e) => setRecommendation(e.target.value)}
          placeholder="Write your recommendation here"
          required
        />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default HotelDetails;
