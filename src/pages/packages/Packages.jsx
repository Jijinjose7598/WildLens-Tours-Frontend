import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useLocation, useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FaUtensils, FaBed, FaCar } from 'react-icons/fa'; // Import icons
import '../../App.css'; // Import the CSS file

const Packages = () => {
  const [packages, setPackages] = useState([]);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const { user } = useAuth();
  const { pathname } = useLocation();
  const { packageId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPackages = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await axios.get('http://localhost:3001/api/packages/');
        setPackages(response.data.data);
      } catch (error) {
        console.error('Error fetching packages:', error);
        setError('Failed to fetch packages. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchPackages();
  }, []);

  useEffect(() => {
    if (pathname.startsWith('/packages/') && packageId) {
      const fetchPackageDetails = async () => {
        setLoading(true);
        setError('');
        try {
          const response = await axios.get(`http://localhost:3001/api/packages/${packageId}`);
          setSelectedPackage(response.data.data);
        } catch (error) {
          console.error('Error fetching package details:', error);
          setError('Failed to fetch package details. Please try again later.');
        } finally {
          setLoading(false);
        }
      };

      fetchPackageDetails();
    }
  }, [pathname, packageId]);

  const handleDeletePackage = async (pkgId) => {
    if (window.confirm('Are you sure you want to delete this package?')) {
      try {
        await axios.delete(`http://localhost:3001/api/packages/delete/${pkgId}`);
        setPackages(packages.filter((pkg) => pkg._id !== pkgId));
      } catch (error) {
        console.error('Error deleting package:', error);
        setError('Failed to delete package. Please try again later.');
      }
    }
  };

  if (!user) {
    return <p>Loading...</p>;
  }

  if (loading) {
    return <p>Loading packages...</p>;
  }

  if (error) {
    return <p className="text-danger">{error}</p>;
  }

  if (pathname.startsWith('/packages/') && selectedPackage) {
    return (
      <div className="container mt-4">
        <h1>{selectedPackage.title}</h1>
        <img src={selectedPackage.images[0]} className="img-fluid" alt={selectedPackage.title} />
        <h3>Overview</h3>
        <p>{selectedPackage.description}</p>
        <h3>Highlights</h3>
        <p>Some highlights about the package...</p>
        <h3>Reviews</h3>
        <p>Some reviews about the package...</p>
        <h3>Book Now</h3>
        <button className="btn btn-primary">Book Now</button>
        {user.isAdmin || user.isSuperAdmin ? (
          <div className="mt-2">
            <Link to={`/packages/edit/${selectedPackage._id}`} className="btn btn-secondary">
              Edit Package
            </Link>
          </div>
        ) : null}
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h1>Packages</h1>
      {user.isAdmin || user.isSuperAdmin ? (
        <div className="text-right mb-4">
          <Link to="/packages/create" className="btn btn-primary addpackage-btn">
            Add New Package
          </Link>
        </div>
      ) : null}
      {packages.length === 0 ? (
        <p>No packages available at the moment.</p>
      ) : (
        <div className="card-container">
          {packages.map((pkg) => (
            <div key={pkg._id} className="package-card">
              <img src={pkg.images[0]} className="card-img-top" alt={pkg.title} />
              <div className="package-card-body">
                <h5 className="card-title">{pkg.title}</h5>
                <p className="card-text">{pkg.description.substring(0, 100)}...</p>
                <div className="package-icons">
                  {pkg.includesFood && <FaUtensils title="Food Included" />}
                  {pkg.includesHotel && <FaBed title="Hotel Included" />}
                  {pkg.includesTravel && <FaCar title="Travel Included" />}
                </div>
             
                  <Link to={`/packages/${pkg._id}`} className=" btn btn-primary">
                    View Details
                  </Link>
               
              {user && (user.isAdmin || user.isSuperAdmin) && (
  <>
    <Link to={`/edit-package/${pkg._id}`} className="btn btn-secondary mt-2">
      Edit
    </Link>
    <button
      onClick={() => handleDeletePackage(pkg._id)}
      className="btn btn-danger mt-2"
    >
      Delete
    </button>
  </>
)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Packages;
