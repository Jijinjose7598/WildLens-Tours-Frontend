import React, { useState } from 'react';
import axios from 'axios';

function CreateTour() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: {
      country: '',
      city: '',
    },
    duration: '',
    price: '',
    capacity: '',
    overview: '',
    highlights: '',
    images: [''], // Add initial image URL field
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const handleLocationChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      location: {
        ...prevData.location,
        [id]: value,
      },
    }));
  };

  const handleImageChange = (e, index) => {
    const updatedImages = [...formData.images];
    updatedImages[index] = e.target.value;
    setFormData({ ...formData, images: updatedImages });
  };

  const handleAddImageField = () => {
    setFormData({
      ...formData,
      images: [...formData.images, ''],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData); // Log form data for debugging
    try {
      const response = await axios.post('http://localhost:3001/api/tours/create', formData);
      console.log(response.data);
      if (response.status === 201) {
        alert('Tour created successfully!');
        setFormData({
          title: '',
          description: '',
          location: {
            country: '',
            city: '',
          },
          duration: '',
          price: '',
          capacity: '',
          overview: '',
          highlights: '',
          images: [''], // Reset images field
        });
      }
    } catch (error) {
      console.error('Error creating tour:', error);
      alert('Error creating tour');
    }
  };

  return (
    <div className="container d-flex justify-content-center mt-5" style={{
      backgroundImage: "url('https://encrypted-tbn3.gstatic.com/licensed-image?q=tbn:ANd9GcT8dj1YVsGUU-PMEpMMhiJtXrn0NhoXOAsNVDORyV-Id2s7Zan4KLeV3pFVFyqtvy9e0upoP0qkYIGd0w1Lt1Np6l3HMGo8fvyh2D8tlg')",
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      height: '100%',
      width: '100vw',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '20px'
    }}>
      <div className="tourcreate-card" style={{
        width: '70%',
        background: 'rgba(255, 255, 255, 0.8)', // White with 80% opacity
        border: '1px solid #ddd',
        borderRadius: '10px',
        padding: '20px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)'
      }}>
        <div className="tourcard-body">
          <h5 className="card-title">Create New Tour</h5>
          <h6 className="card-subtitle mb-2 text-body-secondary">Fill in the details to create a new tour</h6>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="title" className="form-label">Title</label>
              <input type="text" className="form-control" id="title" value={formData.title} onChange={handleChange} required />
            </div>

            <div className="mb-3">
              <label htmlFor="description" className="form-label">Description</label>
              <textarea className="form-control" id="description" rows="3" value={formData.description} onChange={handleChange} required></textarea>
            </div>

            <div className="mb-3">
              <label htmlFor="country" className="form-label">Country</label>
              <input type="text" className="form-control" id="country" value={formData.location.country} onChange={handleLocationChange} required />
            </div>

            <div className="mb-3">
              <label htmlFor="city" className="form-label">City</label>
              <input type="text" className="form-control" id="city" value={formData.location.city} onChange={handleLocationChange} required />
            </div>

            <div className="mb-3">
              <label htmlFor="duration" className="form-label">Duration (in days)</label>
              <input type="number" className="form-control" id="duration" value={formData.duration} onChange={handleChange} required />
            </div>

            <div className="mb-3">
              <label htmlFor="price" className="form-label">Price</label>
              <input type="number" className="form-control" id="price" value={formData.price} onChange={handleChange} required />
            </div>

            <div className="mb-3">
              <label htmlFor="capacity" className="form-label">Capacity</label>
              <input type="number" className="form-control" id="capacity" value={formData.capacity} onChange={handleChange} required />
            </div>

            <div className="mb-3">
              <label htmlFor="overview" className="form-label">Overview</label>
              <textarea className="form-control" id="overview" rows="3" value={formData.overview} onChange={handleChange} required></textarea>
            </div>

            <div className="mb-3">
              <label htmlFor="highlights" className="form-label">Highlights</label>
              <input type="text" className="form-control" id="highlights" value={formData.highlights} onChange={handleChange} required />
            </div>

            <div className="mb-3">
              <label htmlFor="images" className="form-label">Image URLs</label>
              {formData.images.map((image, index) => (
                <div key={index} className="mb-3">
                  <input
                    type="text"
                    className="form-control"
                    value={image}
                    onChange={(e) => handleImageChange(e, index)}
                    placeholder={`Image URL ${index + 1}`}
                  />
                </div>
              ))}
              <button type="button" className="btn btn-secondary" onClick={handleAddImageField}>
                Add Another Image
              </button>
            </div>

            <button type="submit" className="btn btn-primary createtour-btn">Create Tour</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CreateTour;
