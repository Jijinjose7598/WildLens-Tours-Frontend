import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { FaSearch, FaHome, FaCalendarAlt, FaTag, FaList, FaChevronLeft, FaChevronRight, FaUser, FaSignOutAlt, FaArrowCircleUp, FaPlus, FaUsers, FaHotel } from 'react-icons/fa';
import '../App.css';
import { useAuth } from '../context/AuthContext';


const Home = () => {
  const [tours, setTours] = useState([]);
  const [mostSellingPackages, setMostSellingPackages] = useState([]);
  const [users, setUsers] = useState([]);
  
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const scrollContainerRef = React.useRef(null);

  useEffect(() => {
    const fetchTours = async () => {
      try {
        const response = await axios.get('https://wildlens-tours-backend-tqh1.onrender.com/api/tours/');
        setTours(response.data.data);
      } catch (error) {
        console.error('Error fetching tours:', error.response || error.message);
      }
    };
    fetchTours();
  }, []);

  useEffect(() => {
    const fetchMostSellingPackages = async () => {
      try {
        const response = await axios.get('https://wildlens-tours-backend-tqh1.onrender.com/api/packages/most-selling');
        setMostSellingPackages(response.data.data);
      } catch (error) {
        console.error('Error fetching most selling packages:', error.response || error.message);
      }
    };
    fetchMostSellingPackages();
  }, []);



  const handleGetUsers = async () => {
    try {
      const response = await axios.get('https://wildlens-tours-backend-tqh1.onrender.com/api/users');
      setUsers(response.data.data);
    } catch (error) {
      console.error('Error fetching users:', error.response || error.message);
    }
  };

  const handleDeleteTour = async (tourId) => {
    try {
      await axios.delete(`https://wildlens-tours-backend-tqh1.onrender.com/api/tours/delete/${tourId}`);
      setTours(tours.filter((tour) => tour._id !== tourId));
    } catch (error) {
      console.error('Error deleting tour:', error.response || error.message);
    }
  };

  const handleDeletePackage = async (packageId) => {
    try {
      await axios.delete(`https://wildlens-tours-backend-tqh1.onrender.com/api/packages/delete/${packageId}`);
      setMostSellingPackages(mostSellingPackages.filter((pkg) => pkg._id !== packageId));
    } catch (error) {
      console.error('Error deleting package:', error.response || error.message);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error.response || error.message);
    }
  };

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const scrollAmount = direction === 'left' ? -300 : 300;
      container.scrollLeft += scrollAmount;
    }
  };

  const toggleMoreMenu = () => {
    setShowMoreMenu(!showMoreMenu);
  };

  const toggleProfileMenu = () => {
    setShowProfileMenu(!showProfileMenu);
  };

 

  return (
    <div>
      <div className="navbar fixed-top">
        <Link to="/search" className="navItem">
          <FaSearch size={24} />
          <span>Search</span>
        </Link>
        <Link to="/my-tour" className="navItem">
          <FaCalendarAlt size={24} />
          <span>My Tour</span>
        </Link>
        <Link to="/home" className="navItem">
          <FaHome size={24} />
          <span>Home</span>
        </Link>
        <Link to="/packages" className="navItem">
          <FaTag size={24} />
          <span>Packages</span>
        </Link>
        <Link to="/hotels" className="navItem">
          <FaHotel size={24} />
          <span>Hotels</span>
        </Link>
        <div className="navItem more-menu" onClick={toggleMoreMenu}>
          <FaList size={24} />
          <span>More</span>
          {showMoreMenu && (
            <div className="more-menu-content">
              <Link to="/contact" className="menu-option">Contact Us</Link>
              <Link to="/faq" className="menu-option">FAQ</Link>
              <Link to="/about" className="menu-option">About Us</Link>
              <button onClick={handleLogout} className="menu-option">
                <FaSignOutAlt size={16} style={{ marginRight: '8px' }} />
                Logout
              </button>
            </div>
          )}
        </div>
        <div className="navItem profile-menu" onClick={toggleProfileMenu}>
          <FaUser size={24} />
          {showProfileMenu && user && (
            <div className="profile-menu-content">
              <p>{user.name ? user.name : 'Guest'}</p>
              <Link to={`/profile/${user._id}`} className="menu-option">
                View Profile
              </Link>
              <button onClick={handleLogout} className="menu-option">
                <FaSignOutAlt size={16} style={{ marginRight: '8px' }} />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="content">
        <div className="billboard">
          <div className="billboard-content">
            <h1>Welcome to WildLens Tours</h1>
            <p>Explore, discover, and book your next wildlife tour.</p>
          </div>

         
        </div>

       

        {user && (user.isAdmin || user.isSuperAdmin) && (
          <div className="button-container">
            <button className="btn btn-primary addtour-btn" onClick={() => navigate('/create-tour')}>
              Add New Tour
            </button>
            <button className="btn btn-secondary getuser-btn" onClick={() => navigate('/users')}>
              View All Users
            </button>
          </div>
        )}

        <h2>Most Selling Packages</h2>
        <div className="relative-container">
          <button className="arrow-button arrow-left" onClick={() => scroll('left')}>
            <FaChevronLeft size={20} />
          </button>
          <div className="scroll-container" ref={scrollContainerRef}>
            {mostSellingPackages.length > 0 ? (
              mostSellingPackages.map((pkg) => (
                <div key={pkg._id} className="package-card">
                  <img src={pkg.images[0]} className="card-img-top" alt={pkg.name} />
                  <div className="package-card-body">
                    <h5 className="card-title">{pkg.title}</h5>
                    <p className="card-text">{pkg.description.substring(0, 100)}...</p>
                    <p className="card-text price">₹{pkg.price.toLocaleString()}/Person</p>
                    <Link to={`/packages/${pkg._id}`} className="btn btn-primary" style={{ marginBottom: "10px", width: "100px" }}>Details</Link>
                    {user && (user.isAdmin || user.isSuperAdmin) && (
                      <>
                        <button onClick={() => handleDeletePackage(pkg._id)} className="btn btn-danger">
                          Delete
                        </button>
                        <Link to={`/edit-package/${pkg._id}`} className="btn btn-warning ml-2" style={{ width: "60px" }}>
                          Edit
                        </Link>
                      </>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p>No most selling packages available.</p>
            )}
          </div>
          <button className="arrow-button arrow-right" onClick={() => scroll('right')}>
            <FaChevronRight size={20} />
          </button>
        </div>

        <h2>All Tours</h2>
        <div className="row">
          {tours.length > 0 ? (
            tours.map((tour) => (
              <div key={tour._id} className="col-md-6">
                <div className="tour-card">
                  <img src={tour.images[0]} className="card-img-top" alt={tour.name} />
                  <div className="card-body">
                    <h5 className="card-title">{tour.title}</h5>
                    <p className="card-text">{tour.description.substring(0, 100)}...</p>
                    <p className="card-text price">₹{tour.price.toLocaleString()}/Person</p>
                    <Link to={`/tours/${tour._id}`} className="btn btn-primary">Details</Link>

                    {user && (user.isAdmin || user.isSuperAdmin) && (
                      <>
                        <button onClick={() => handleDeleteTour(tour._id)} className="btn btn-danger">
                          Delete
                        </button>
                        <Link to={`/edit-tour/${tour._id}`} className="btn btn-warning ml-2">
                          Edit
                        </Link>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p>No tours available.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
