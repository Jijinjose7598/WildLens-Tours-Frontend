import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Payment from './pages/Payment';
import Home from './pages/Home';
import Packages from './pages/packages/Packages';
import PackageDetail from './pages/packages/PackageDetail';
import EditPackage from './pages/packages/EditPackage';
import CreatePackage from './pages/packages/CreatePackage'; 
import Search from './pages/Search';
import CreateTour from './pages/tours/CreateTour';
import TourDetail from './pages/tours/TourDetail';
import BookingForm from './pages/tours/BookingForm';
import { AuthProvider } from './context/AuthContext'; 
import UserList from './pages/UserList';
import EditTour from './pages/tours/EditTour';
import MyTours from './pages/MyList';
import Hotels from './pages/Hotels'
import HotelDetails from './pages/HotelDetails';


function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Set the default path to redirect to the login page */}
        <Route path="/"  />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
         <Route path="/payment" element={<Payment />} />
       <Route path="/hotels" element={<Hotels />} />
        <Route path="/home" element={<Home />} />
        <Route path="/packages" element={<Packages />} />
        <Route path="/packages/:packageId" element={<PackageDetail />} />
        <Route path="/edit-package/:packageId" element={<EditPackage />} />
        <Route path="/my-tour" element={<MyTours />} />
        <Route path="/packages/create" element={<CreatePackage />} />
        <Route path="/search" element={<Search />} />
        <Route path="/create-tour" element={<CreateTour />} />
        <Route path="/edit-tour/:tourId" element={<EditTour />} />
        <Route path="/tours/:tourId" element={<TourDetail />} />
        <Route path="/booking/:tourId" element={<BookingForm />} />
        <Route path="/users" element={<UserList />} />
        <Route path="/hotel/:hotelId" element={<HotelDetails />} />
         
      </Routes>
    </AuthProvider>
  );
}

export default App;
