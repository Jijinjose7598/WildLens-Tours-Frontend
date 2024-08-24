import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import BookingForm from './BookingForm';
import TourReview from './TourReview';
import '../../App.css';

const TourDetail = () => {
  const { tourId } = useParams();
  const navigate = useNavigate();
  const [tour, setTour] = useState(null);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false); // State for showing review form
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const fetchTour = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/api/tours/tour/${tourId}`);
        setTour(response.data);
      } catch (error) {
        console.error('Error fetching tour details:', error.response || error.message);
      }
    };

    fetchTour();
  }, [tourId]);

  const handleBookNowClick = () => {
    setShowBookingForm(true);
  };

  const handleCloseBookingForm = () => {
    setShowBookingForm(false);
  };

  const handleAddReviewClick = () => {
    setShowReviewForm(true);
  };

  const handleCloseReviewForm = () => {
    setShowReviewForm(false);
  };

  const handlePrevImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex === 0 ? tour.images.length - 1 : prevIndex - 1));
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex === tour.images.length - 1 ? 0 : prevIndex + 1));
  };

  if (!tour) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mt-4">
      <h2>{tour.title}</h2>
      
      <div className="image-slideshow">
        {tour.images && tour.images.length > 0 ? (
          <>
            <button onClick={handlePrevImage} className="btn btn-secondary">←</button>
            <img src={tour.images[currentImageIndex]} alt={tour.title} className="img-fluid mb-4" />
            <button onClick={handleNextImage} className="btn btn-secondary">→</button>
          </>
        ) : (
          <p>No images available</p>
        )}
      </div>
      
      <div className="section-container">
        <div className="h3-box">
          <h3>Overview</h3>
        </div>
        <div className="content-box">
          <p>{tour.description || 'No description available'}</p>
        </div>
      </div>

      <div className="section-container">
        <div className="h3-box">
          <h3>Highlights</h3>
        </div>
        <div className="content-box">
          <ul>
            {tour.highlights && tour.highlights.length > 0 ? (
              tour.highlights.map((highlight, index) => <li key={index}>{highlight}</li>)
            ) : (
              <li>No highlights available</li>
            )}
          </ul>
        </div>
      </div>

      <div className="section-container">
        <div className="h3-box">
          <h3>Reviews</h3>
        </div>
        <div className="content-box">
          <div>
            {tour.reviews && tour.reviews.length > 0 ? (
              tour.reviews.map((review, index) => (
                <div key={index} className="review">
                  <h5>{review.user}</h5>
                  <p>{review.comment}</p>
                  <p>Rating: {review.rating}/5</p>
                </div>
              ))
            ) : (
              <p>No reviews available.</p>
            )}
          </div>
        </div>
      </div>

      <div className="actions">
        <button onClick={handleBookNowClick} className="btn btn-primary">Book Now</button>
        <button onClick={handleAddReviewClick} className="btn btn-secondary">Add Review</button>
      </div>

      {/* Booking Form Modal */}
      {showBookingForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="close-modal" onClick={handleCloseBookingForm}>×</button>
            <BookingForm tourId={tourId} onClose={handleCloseBookingForm} />
          </div>
        </div>
      )}

      {/* Review Form Modal */}
      {showReviewForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="close-modal" onClick={handleCloseReviewForm}>×</button>
            <TourReview tourId={tourId} onClose={handleCloseReviewForm} />
          </div>
        </div>
      )}
    </div>
  );
};

export default TourDetail;
