import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';

const PackageBooking = () => {
  const { packageId } = useParams(); // Changed from tourId to packageId
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  // State variables
  const [name, setName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [adults, setAdults] = useState(0);
  const [kids, setKids] = useState(0);
  const [participants, setParticipants] = useState(0);
  const [pricePerPerson, setPricePerPerson] = useState(0);
  const [pricePerNight, setPricePerNight] = useState(0); // State for hotel price per night
  const [subTotal, setSubTotal] = useState(0);
  const [gstAndTaxes, setGstAndTaxes] = useState(0);
  const [totalCost, setTotalCost] = useState(0);
  const [companions, setCompanions] = useState(['']);
  const [users, setUsers] = useState([]); // State to hold user options
  const [hotels, setHotels] = useState([]); // State to hold hotel options
  const [selectedHotel, setSelectedHotel] = useState(''); // State to store selected hotel

  // Fetch package details
  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchPackage = async () => {
      try {
        const response = await axios.get(`https://wildlens-tours-backend-tqh1.onrender.com/api/packages/package/${packageId}`); // Adjust API endpoint for package
        console.log(response.data);
        setPricePerPerson(response.data.data.price);
      } catch (error) {
        console.error('Error fetching package details:', error.response || error.message);
      }
    };

    fetchPackage();
  }, [packageId, user, navigate]);

  // Fetch hotels
  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const response = await axios.get('https://wildlens-tours-backend-tqh1.onrender.com/api/hotels/');
        setHotels(response.data);
      } catch (error) {
        console.error('Error fetching hotels:', error.response || error.message);
      }
    };

    fetchHotels();
  }, []);

  // Fetch selected hotel details
  useEffect(() => {
    const fetchHotelDetails = async () => {
      if (selectedHotel) {
        try {
          const response = await axios.get(`https://wildlens-tours-backend-tqh1.onrender.com/api/hotels/hotel/${selectedHotel}`);
          const hotel = response.data;
          setPricePerNight(hotel.pricePerNight);
        } catch (error) {
          console.error('Error fetching hotel details:', error.response || error.message);
        }
      } else {
        setPricePerNight(0); // Reset if no hotel is selected
      }
    };

    fetchHotelDetails();
  }, [selectedHotel]);

  // Fetch users for companions dropdown
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('https://wildlens-tours-backend-tqh1.onrender.com/api/users');
        // Access the data field which contains the array of users
        if (Array.isArray(response.data.data)) {
          setUsers(response.data.data);
        } else {
          console.error('Unexpected response format for users:', response.data);
        }
      } catch (error) {
        console.error('Error fetching users:', error.response || error.message);
      }
    };

    fetchUsers();
  }, []);

  // Calculate totals whenever relevant state changes
  useEffect(() => {
    calculateTotals();
  }, [adults, kids, pricePerPerson, pricePerNight, endDate, startDate]);

  const calculateNights = () => {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = end - start;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  const calculateTotals = () => {
    const totalParticipants = adults + kids;
    const nights = calculateNights();
    const calculatedSubTotal = (totalParticipants * pricePerPerson) + (pricePerNight * nights);
    const calculatedGstAndTaxes = calculatedSubTotal * 0.15;
    const calculatedTotalCost = calculatedSubTotal + calculatedGstAndTaxes;

    setParticipants(totalParticipants);
    setSubTotal(calculatedSubTotal);
    setGstAndTaxes(calculatedGstAndTaxes);
    setTotalCost(calculatedTotalCost);
  };

  const handleCompanionChange = (index, value) => {
    const updatedCompanions = [...companions];
    updatedCompanions[index] = value;
    setCompanions(updatedCompanions);
  };

  const handleAddCompanion = () => {
    setCompanions([...companions, '']);
  };

  const handleRemoveCompanion = (index) => {
    const updatedCompanions = companions.filter((_, i) => i !== index);
    setCompanions(updatedCompanions);
  };

  const handleBooking = async (event) => {
    event.preventDefault();
    calculateTotals();

    if (!user) {
      alert('You need to be logged in to make a booking.');
      navigate('/login');
      return;
    }

    // Validate dates and other inputs as needed
    if (new Date(endDate) < new Date(startDate)) {
      alert('End date cannot be before start date.');
      return;
    }

    try {
      const bookingResponse = await axios.post('https://wildlens-tours-backend-tqh1.onrender.com/api/bookings/package/create', {
        name,
        startDate,
        endDate,
        adults,
        kids,
        participants,
        companions,
        user: user._id,
        package: packageId, // Use `package` instead of `tour`
        hotel: selectedHotel, // Include selected hotel
      });

      const bookingId = bookingResponse.data._id; // Ensure booking ID is captured here

      // Optionally, mark booking as completed if needed
      // await axios.patch(`https://wildlens-tours-backend-tqh1.onrender.com/api/bookings/complete/${bookingId}`);

      navigate('/payment', {
        state: {
          amount: totalCost,
          bookingId: bookingId, // Pass booking ID if needed
          user: user._id,
          paymentDate: new Date().toISOString(),
          method: 'Credit Card',
        },
      });
    } catch (error) {
      console.error('Error details:', error.response || error.message);
      alert('There was an error processing your booking.');
    }
  };

  return (
    <div
      className="booking-container"
      style={{
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '20px',
      }}
    >
      <div
        className="background-image"
        style={{
          backgroundImage: "url('https://wildlense.com/cdn/shop/files/KANHA-TIGER-RESERVE_1880x.jpg?v=1685807236')",
          backgroundSize: 'cover',
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          filter: 'blur(4px)',
          zIndex: -1,
        }}
      />
      <div
        className="booking-card"
        style={{
          backgroundColor: '#fff',
          padding: '20px',
          borderRadius: '8px',
          boxShadow: '0 0 10px rgba(0,0,0,0.1)',
          maxWidth: '600px',
          width: '100%',
          overflowY: 'auto',
          maxHeight: '90vh',
        }}
      >
        <div className="booking-card-body">
          <h5 className="card-title">Book Your Package</h5>
          <form onSubmit={handleBooking}>
            {/* Name Field */}
            <div className="mb-3">
              <label htmlFor="name" className="form-label">
                Name
              </label>
              <input
                type="text"
                className="form-control"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter Your Name"
                required
              />
            </div>

            {/* Start Date Field */}
            <div className="mb-3">
              <label htmlFor="startDate" className="form-label">
                Start Date
              </label>
              <input
                type="date"
                className="form-control"
                id="startDate"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
              />
            </div>

            {/* End Date Field */}
            <div className="mb-3">
              <label htmlFor="endDate" className="form-label">
                End Date
              </label>
              <input
                type="date"
                className="form-control"
                id="endDate"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                required
              />
            </div>

            {/* Number of Adults Field */}
            <div className="mb-3">
              <label htmlFor="adults" className="form-label">
                No. of Adults
              </label>
              <input
                type="number"
                className="form-control"
                id="adults"
                value={adults}
                onChange={(e) => setAdults(parseInt(e.target.value, 10) || 0)}
                min="0"
                required
              />
            </div>

            {/* Number of Kids Field */}
            <div className="mb-3">
              <label htmlFor="kids" className="form-label">
                No. of Kids
              </label>
              <input
                type="number"
                className="form-control"
                id="kids"
                value={kids}
                onChange={(e) => setKids(parseInt(e.target.value, 10) || 0)}
                min="0"
                required
              />
            </div>

            {/* Total Participants Field */}
            <div className="mb-3">
              <label htmlFor="participants" className="form-label">
                Total Participants
              </label>
              <input type="number" className="form-control" id="participants" value={participants} readOnly />
            </div>

            {/* Travel Companions Field */}
            <div className="mb-3">
              <label htmlFor="companions" className="form-label">
                Travel Companions
              </label>
              {companions.map((companion, index) => (
                <div key={index} className="d-flex mb-2">
                  <select
                    className="form-select me-2"
                    value={companion}
                    onChange={(e) => handleCompanionChange(index, e.target.value)}
                  >
                    <option value="">Select Companion</option>
                    {users.map((userOption) => (
                      <option key={userOption._id} value={userOption._id}>
                        {userOption.name} ({userOption.email})
                      </option>
                    ))}
                  </select>
                  <button type="button" className="btn btn-danger" onClick={() => handleRemoveCompanion(index)}>
                    Remove
                  </button>
                </div>
              ))}
              <button type="button" className="btn btn-primary" onClick={handleAddCompanion}>
                Add Companion
              </button>
            </div>

            {/* Hotel Selection Field */}
            <div className="mb-3">
              <label htmlFor="hotel" className="form-label">
                Select Hotel
              </label>
              <select
                className="form-select"
                id="hotel"
                value={selectedHotel}
                onChange={(e) => setSelectedHotel(e.target.value)}
                required
              >
                <option value="">Select a Hotel</option>
                {hotels.map((hotel) => (
                  <option key={hotel._id} value={hotel._id}>
                    {hotel.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Booking Summary */}
            <div
              className="booking-summary-box mt-3 p-3"
              style={{ border: '1px solid #ddd', borderRadius: '8px', backgroundColor: '#f8f9fa' }}
            >
              <h6 className="booking-summary-title" style={{ borderBottom: '1px solid #ddd', paddingBottom: '10px' }}>
                Booking Summary
              </h6>
              <p>
                <strong>Package Starting Date:</strong> {startDate}
              </p>
              <p>
                <strong>End Date:</strong> {endDate}
              </p>
              <p>
                <strong>Number of Nights:</strong> {calculateNights()}
              </p>
              <p>
                <strong>Number of Persons:</strong> {participants}
              </p>
              <p>
                <strong>Hotel Charge per Night:</strong> ₹{pricePerNight ? pricePerNight.toFixed(2) : '0.00'}
              </p>
              <p>
                <strong>Cost per Person:</strong> ₹{pricePerPerson ? pricePerPerson.toFixed(2) : '0.00'}
              </p>
              <p>
                <strong>Sub Total:</strong> ₹{subTotal ? subTotal.toFixed(2) : '0.00'}
              </p>
              <p>
                <strong>GST and Taxes (15%):</strong> ₹{gstAndTaxes ? gstAndTaxes.toFixed(2) : '0.00'}
              </p>
              <p>
                <strong>Total Cost:</strong> ₹{totalCost ? totalCost.toFixed(2) : '0.00'}
              </p>
            </div>

            {/* Submit Button */}
            <button type="submit" className="btn btn-success mt-3">
              Proceed to Payment
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PackageBooking;
