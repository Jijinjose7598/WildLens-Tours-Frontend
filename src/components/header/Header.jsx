import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { logout } from '../../redux/reducers/authSlice'; // Import the logout action

function Header() {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await axios.post('http://localhost:3000/api/auth/logout', null, {
        withCredentials: true,
      });

      dispatch(logout()); // Dispatch the logout action
      navigate('/login');
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  return (
    <header className="header">
      <nav>
        <ul>
          {!isAuthPage && (
            <>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/search">Search</Link></li>
              <li><Link to="/booking">Booking</Link></li>
              {isAuthenticated && (
                <li><button onClick={handleLogout}>Logout</button></li>
              )}
            </>
          )}
        </ul>
      </nav>
    </header>
  );
}

export default Header;
