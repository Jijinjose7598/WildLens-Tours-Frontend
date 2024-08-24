import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';

const Booking = () => {
  const { tourId } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
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
  const [users, setUsers] = useState([]); // State to hold user data
  const [hotels, setHotels] = useState([]); // State to hold hotel options
  const [selectedHotel, setSelectedHotel] = useState(''); // State to store selected hotel
  
  useEffect(() => {
    const fetchTour = async () => {
      if (!tourId) {
        console.error('No tourId provided');
        return;
      }

      try {
        const response = await axios.get(`https://wildlens-tours-backend-q5lv.onrender.com/api/tours/tour/${tourId}`);
        setPricePerPerson(response.data.price);
      } catch (error) {
        console.error('Error fetching tour details:', error.response || error.message);
      }
    };

    fetchTour();
  }, [tourId]);

  useEffect(() => {
    const fetchHotelsAndTravels = async () => {
      try {
        const hotelsResponse = await axios.get('https://wildlens-tours-backend-q5lv.onrender.com/api/hotels/');
        setHotels(hotelsResponse.data);

        // Fetch travels data if needed
        // const travelsResponse = await axios.get('https://wildlens-tours-backend-q5lv.onrender.com/api/travels/');
        // setTravels(travelsResponse.data.data);
        
      } catch (error) {
        console.error('Error fetching hotels:', error.response || error.message);
      }
    };

    fetchHotelsAndTravels();
  }, []);

  useEffect(() => {
    const fetchHotelDetails = async () => {
      if (selectedHotel) {
        try {
          const response = await axios.get(`https://wildlens-tours-backend-q5lv.onrender.com/api/hotels/hotel/${selectedHotel}`);
          const hotel = response.data;
          setPricePerNight(hotel.pricePerNight);
        } catch (error) {
          console.error('Error fetching hotel details:', error.response || error.message);
        }
      }
    };

    fetchHotelDetails();
  }, [selectedHotel]);

 useEffect(() => {
  const fetchUsers = async () => {
    try {
      const response = await axios.get('https://wildlens-tours-backend-q5lv.onrender.com/api/users');
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


  useEffect(() => {
    calculateTotals();
  }, [adults, kids, pricePerPerson, pricePerNight]);

  const calculateTotals = () => {
    const totalParticipants = adults + kids;
    const calculatedSubTotal = (totalParticipants * pricePerPerson) + (pricePerNight || 0); // Add hotel charge to subtotal
    const calculatedGstAndTaxes = calculatedSubTotal * 0.15;
    const calculatedTotalCost = calculatedSubTotal + calculatedGstAndTaxes;

    setParticipants(totalParticipants);
    setSubTotal(calculatedSubTotal);
    setGstAndTaxes(calculatedGstAndTaxes);
    setTotalCost(calculatedTotalCost);
  };

  const handleCompanionChange = (index, email) => {
    const updatedCompanions = [...companions];
    updatedCompanions[index] = email;
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

    try {
      const bookingResponse = await axios.post('https://wildlens-tours-backend-q5lv.onrender.com/api/bookings/tour/create', {
        name,
        startDate,
        endDate,
        adults,
        kids,
        participants,
        companions,
        user: user._id,
        tour: tourId,
        hotel: selectedHotel,
       
      });

      const bookingId = bookingResponse.data._id; // Ensure booking ID is captured here

      // Mark booking as completed
      await axios.patch(`https://wildlens-tours-backend-q5lv.onrender.com/api/bookings/complete/${bookingId}`);

      navigate('/payment', {
        state: {
          amount: totalCost,
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
    <div className="booking-container" style={{ position: 'relative', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <div className="background-image" style={{ backgroundImage: "url('https://wildlense.com/cdn/shop/files/KANHA-TIGER-RESERVE_1880x.jpg?v=1685807236')", backgroundSize: 'cover', position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', filter: 'blur(4px)', zIndex: -1 }} />
      <div className="booking-card" style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 0 10px rgba(0,0,0,0.1)' }}>
        <div className="booking-card-body">
          <h5 className="card-title">Book Your Tour</h5>
          <form onSubmit={handleBooking}>
            <div className="mb-3">
              <label htmlFor="name" className="form-label">Name</label>
              <input type="text" className="form-control" id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter Your Name" required />
            </div>
            <div className="mb-3">
              <label htmlFor="startDate" className="form-label">Start Date</label>
              <input type="date" className="form-control" id="startDate" value={startDate} onChange={(e) => setStartDate(e.target.value)} required />
            </div>
            <div className="mb-3">
              <label htmlFor="endDate" className="form-label">End Date</label>
              <input type="date" className="form-control" id="endDate" value={endDate} onChange={(e) => setEndDate(e.target.value)} required />
            </div>
            <div className="mb-3">
              <label htmlFor="adults" className="form-label">No. of Adults</label>
              <input type="number" className="form-control" id="adults" value={adults} onChange={(e) => setAdults(parseInt(e.target.value, 10) || 0)} min="0" required />
            </div>
            <div className="mb-3">
              <label htmlFor="kids" className="form-label">No. of Kids</label>
              <input type="number" className="form-control" id="kids" value={kids} onChange={(e) => setKids(parseInt(e.target.value, 10) || 0)} min="0" required />
            </div>
            <div className="mb-3">
              <label htmlFor="participants" className="form-label">Total Participants</label>
              <input type="number" className="form-control" id="participants" value={participants} readOnly />
            </div>
            <div className="mb-3">
              <label htmlFor="companions" className="form-label">Travel Companions</label>
              {companions.map((companion, index) => (
                <div key={index} className="d-flex mb-2">
                  <select
                    className="form-select me-2"
                    value={companion}
                    onChange={(e) => handleCompanionChange(index, e.target.value)}
                  >
                    <option value="">Select Companion</option>
                    {users.map(user => (
                      <option key={user._id} value={user.email}>{user.email}</option>
                    ))}
                  </select>
                  <button type="button" className="btn btn-danger" onClick={() => handleRemoveCompanion(index)}>Remove</button>
                </div>
              ))}
              <button type="button" className="btn btn-primary" onClick={handleAddCompanion}>Add Companion</button>
            </div>

            <div className="mb-3">
              <label htmlFor="hotel" className="form-label">Select Hotel</label>
              <select
                className="form-control"
                id="hotel"
                value={selectedHotel}
                onChange={(e) => setSelectedHotel(e.target.value)}
                required
              >
                <option value="">Select a Hotel</option>
                {hotels?.map((hotel) => (
                  <option key={hotel._id} value={hotel._id}>{hotel.name}</option>
                ))}
              </select>
            </div>
           
            <button type="submit" className="btn btn-primary">proceed to payment</button>
          </form>
          <div className="booking-summary-box mt-3 p-3" style={{ border: '1px solid #ddd', borderRadius: '8px', backgroundColor: '#f8f9fa' }}>
            <h6 className="booking-summary-title" style={{ borderBottom: '1px solid #ddd', paddingBottom: '10px' }}>Booking Summary</h6>
            <p><strong>Tour Starting Date:</strong> {startDate}</p>
            <p><strong>Number of Persons:</strong> {participants}</p>
            <p><strong>Hotel Charge per Night:</strong> ₹{pricePerNight ? pricePerNight.toFixed(2) : '0.00'}</p>
            <p><strong>Cost per Person:</strong> ₹{pricePerPerson ? pricePerPerson.toFixed(2) : '0.00'}</p>
            <p><strong>Sub Total:</strong> ₹{subTotal ? subTotal.toFixed(2) : '0.00'}</p>
            <p><strong>GST and Taxes (15%):</strong> ₹{gstAndTaxes ? gstAndTaxes.toFixed(2) : '0.00'}</p>
            <p><strong>Total Cost:</strong> ₹{totalCost ? totalCost.toFixed(2) : '0.00'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Booking;
