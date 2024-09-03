import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const MyTours = () => {
  const [completedTourBookings, setCompletedTourBookings] = useState([]);
  const [bookedTourBookings, setBookedTourBookings] = useState([]);
  const [completedPackageBookings, setCompletedPackageBookings] = useState([]);
  const [bookedPackageBookings, setBookedPackageBookings] = useState([]);
  const [showCancelForm, setShowCancelForm] = useState(false);
  const [cancellationReason, setCancellationReason] = useState('');
  const [currentBookingId, setCurrentBookingId] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axios.get(`https://wildlens-tours-backend-tqh1.onrender.com/api/users/${user._id}/bookings`);
        console.log(response.data);

        const now = new Date();

        // Separate completed and booked tours
        const completedTours = response.data.tourBookings.filter(booking => new Date(booking.endDate) <= now);
        const bookedTours = response.data.tourBookings.filter(booking => new Date(booking.endDate) > now);
        setCompletedTourBookings(completedTours);
        setBookedTourBookings(bookedTours);

        // Separate completed and booked packages
        const completedPackages = response.data.packageBookings.filter(booking => new Date(booking.endDate) <= now);
        const bookedPackages = response.data.packageBookings.filter(booking => new Date(booking.endDate) > now);
        setCompletedPackageBookings(completedPackages);
        setBookedPackageBookings(bookedPackages);

      } catch (error) {
        console.error('Error fetching user bookings:', error.response || error.message);
      }
    };

    if (user) {
      fetchBookings();
    }
  }, [user]);

  const handleCancel = (bookingId) => {
    setCurrentBookingId(bookingId);
    setShowCancelForm(true);
  };

  const confirmCancel = async () => {
    try {
      await axios.patch(`https://wildlens-tours-backend-tqh1.onrender.com/api/bookings/canceled/${currentBookingId}`, {
        reason: cancellationReason
      });
      
      // Update state to reflect the cancellation
      setShowCancelForm(false);
      setCancellationReason('');
      
      // Show success alert
      alert('Booking successfully canceled.');

      if (currentBookingId) {
        setBookedTourBookings(bookedTourBookings.filter(booking => booking._id !== currentBookingId));
        setBookedPackageBookings(bookedPackageBookings.filter(booking => booking._id !== currentBookingId));
      }
    } catch (error) {
      console.error('Error canceling booking:', error.response || error.message);
      // Show error alert
      alert('Failed to cancel booking. Please try again.');
    }
  };

  return (
    <div className="container mt-4">
      <h1>My Bookings</h1>

      <h2>Completed Tours And Packages</h2>
      {completedPackageBookings.length > 0 ? (
        <div className="row">
          {completedPackageBookings.map((booking) => (
            <div key={booking._id} className="col-md-6">
              <div className="package-mytour-card">
                <div className="package-mytour-card-body">
                  <h5 className="card-date"><strong>User Name:</strong> {booking.userName}</h5>
                  <p className="card-text1">Companions: {booking.companions.join(', ')}</p>
                  <p className="card-text1"><strong>Participants:</strong> {booking.participants}</p>
                  <p className="card-text1">Status: {booking.paymentStatus}</p>
                  <h5 className="card-date"><strong>Start Date:</strong> {booking.startDate}</h5>
                  <h5 className="card-date"><strong>End Date:</strong> {booking.endDate}</h5>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>No packages completed yet.</p>
      )}

      <h2>Booked Tours And Packages</h2>
      {bookedPackageBookings.length > 0 ? (
        <div className="row">
          {bookedPackageBookings.map((booking) => (
            <div key={booking._id} className="col-md-4">
              <div className="package-mytour-card">
                <div className="package-mytour-card-body">
                  <h5 className="card-date"><strong>User Name:</strong> {booking.userName}</h5>
                  <p className="card-text1">Companions: {booking.companions.join(', ')}</p>
                  <p className="card-text1"><strong>Participants:</strong> {booking.participants}</p>
                  <p className="card-text1">Status: {booking.paymentStatus}</p>
                  <h5 className="card-date"><strong>Start Date:</strong> {booking.startDate}</h5>
                  <h5 className="card-date"><strong>End Date:</strong> {booking.endDate}</h5>
                  <button
                    className="btn btn-danger mt-2"
                    onClick={() => handleCancel(booking._id)}
                  >
                    Cancel Tour
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>No packages booked yet.</p>
      )}

      {/* Conditional rendering of cancellation form */}
      {showCancelForm && (
        <div className="overlay">
          <div className="cancellation-form">
            <h3>Provide Cancellation Reason</h3>
            <textarea
              value={cancellationReason}
              onChange={(e) => setCancellationReason(e.target.value)}
              placeholder="Enter the reason for cancellation"
              rows="4"
              className="form-control"
            />
            <button
              className="btn btn-primary mt-2"
              onClick={confirmCancel}
            >
              Confirm Cancel
            </button>
            <button
              className="btn btn-secondary mt-2"
              onClick={() => setShowCancelForm(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyTours;
