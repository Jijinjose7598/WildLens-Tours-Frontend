import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import BookingForm from './PackageBooking.jsx.jsx';
import ReviewForm from './ReviewForm.jsx';
import '../../App.css'; // Ensure this CSS file contains modal styles

const PackageDetail = () => {
  const { packageId } = useParams();
  const [pkg, setPkg] = useState(null);
  const [error, setError] = useState(null);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const fetchPackage = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/api/packages/package/${packageId}`);
        setPkg(response.data.data);
        
      } catch (error) {
        setError('Error fetching package. Please try again later.');
        console.error('Error fetching package:', error);
      }
    };

    fetchPackage();
  }, [packageId]);

  const handleBookNowClick = () => {
    setShowBookingForm(true);
  };

  const handleCloseForm = () => {
    setShowBookingForm(false);
  };

  const handlePrevImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex === 0 ? pkg.images.length - 1 : prevIndex - 1));
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex === pkg.images.length - 1 ? 0 : prevIndex + 1));
  };

  const handleShowReviewForm = () => {
    setShowReviewForm(true);
  };

  const handleCloseReviewForm = () => {
    setShowReviewForm(false);
  };

  if (error) {
    return <p>{error}</p>;
  }

  if (!pkg) {
    return <p>Loading...</p>;
  }

  return (
    <div className="container mt-4">
      <h2>{pkg.title}</h2>

      <div className="image-slideshow">
        {pkg.images && pkg.images.length > 0 ? (
          <>
            <button onClick={handlePrevImage} className="btn btn-secondary">←</button>
            <img src={pkg.images[currentImageIndex]} alt={pkg.title} className="img-fluid mb-4" />
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
          <p>{pkg.description || 'No description available'}</p>
        </div>
      </div>

      <div className="section-container">
        <div className="h3-box">
          <h3>Highlights</h3>
        </div>
        <div className="content-box">
          <ul>
            {pkg.highlights && pkg.highlights.length > 0 ? (
              pkg.highlights.map((highlight, index) => <li key={index}>{highlight}</li>)
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
            {pkg.reviews && pkg.reviews.length > 0 ? (
              pkg.reviews.map((review, index) => (
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

      <div className="book-now">
        <button onClick={handleBookNowClick} className="btn btn-primary">Book Now</button>
      </div>

      <div className="add-review">
        <button onClick={handleShowReviewForm} className="btn btn-secondary">Add Review</button>
      </div>

      {/* Booking Form Modal */}
      {showBookingForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="close-modal" onClick={handleCloseForm}>×</button>
            <BookingForm packageId={packageId} onClose={handleCloseForm} />
          </div>
        </div>
      )}

      {/* Review Form Modal */}
      {showReviewForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="close-modal" onClick={handleCloseReviewForm}>×</button>
            <ReviewForm packageId={packageId} onClose={handleCloseReviewForm} />
          </div>
        </div>
      )}
    </div>
  );
};

export default PackageDetail;
