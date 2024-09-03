import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Hotels = () => {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const response = await axios.get('https://wildlens-tours-backend-tqh1.onrender.com/api/hotels');
        const hotelsData = Array.isArray(response.data) ? response.data : [];
        setHotels(hotelsData);
      } catch (error) {
        setError('Failed to fetch hotels');
        setHotels([]);
      } finally {
        setLoading(false);
      }
    };
    fetchHotels();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="hotels">
      <h1>All Hotels</h1>
      <div className="hotel-list">
        {hotels.length > 0 ? (
          hotels.map((hotel) => (
            <div
              key={hotel._id}
              className="hotel-card"
              onClick={() => navigate(`/hotel/${hotel._id}`)} // Navigate to HotelDetails
              style={{ cursor: 'pointer' }} // Make the card clickable
            >
              {hotel.images && hotel.images.length > 0 ? (
                <img src={hotel.images[0]} alt={hotel.name} className="hotel-image" />
              ) : (
                <div className="hotel-image-placeholder">No Image Available</div>
              )}
              <div className="hotel-details">
                <h2>{hotel.name}</h2>
                <p>{hotel.location}</p>
                <p>Rating: {hotel.rating}</p>
                <p>{hotel.description}</p>
                <p>₹{hotel.pricePerNight.toLocaleString()} per night</p>
              </div>
            </div>
          ))
        ) : (
          <p>No hotels available.</p>
        )}
      </div>
    </div>
  );
};

export default Hotels;
