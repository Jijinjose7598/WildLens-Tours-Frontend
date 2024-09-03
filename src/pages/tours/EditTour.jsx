import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import { Formik, Field, Form, FieldArray } from 'formik';
import * as Yup from 'yup';

const validationSchema = Yup.object({
  title: Yup.string().required('Title is required'),
  description: Yup.string().required('Description is required'),
  location: Yup.object({
    country: Yup.string().required('Country is required'),
    city: Yup.string().required('City is required'),
  }),
  duration: Yup.number().required('Duration is required').positive('Duration must be positive'),
  price: Yup.number().required('Price is required').positive('Price must be positive'),
  capacity: Yup.number().required('Capacity is required').positive('Capacity must be positive'),
  images: Yup.array().of(Yup.string().url('Invalid URL')),
  overview: Yup.string().required('Overview is required'),
  highlights: Yup.array().of(Yup.string()).min(1, 'At least one highlight is required'),
  schedule: Yup.array().of(Yup.string().required('Schedule date is required')), // Validation for schedule
});

const EditTour = () => {
  const { tourId } = useParams();
  const [tour, setTour] = useState({
    title: '',
    description: '',
    location: { country: '', city: '' },
    duration: '',
    price: '',
    capacity: '',
    images: [''],
    overview: '',
    highlights: [''],
    schedule: [''], // Initialize schedule field
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTour = async () => {
      try {
        const response = await axios.get(`https://wildlens-tours-backend-tqh1.onrender.com/api/tours/tour/${tourId}`);
        setTour(response.data);
      } catch (error) {
        console.error('Error fetching tour:', error);
      }
    };
    fetchTour();
  }, [tourId]);

  const handleSubmit = async (values) => {
    try {
      await axios.patch(`https://wildlens-tours-backend-tqh1.onrender.com/api/tours/update/${tourId}`, values);
      navigate('/');
    } catch (error) {
      console.error('Error updating tour:', error.response || error.message);
    }
  };

  return (
    <div className="container mt-5">
      <div className="touredit-card">
        <div className="touredit-card-header">
          <h5>Edit Tour</h5>
          <button className="btn btn-link" onClick={() => navigate(-1)}>
            <FaArrowLeft /> Back
          </button>
        </div>
        <div className="touredit-card-body">
          <Formik
            initialValues={tour}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ values, setFieldValue }) => (
              <Form>
                {/* Title Field */}
                <div className="mb-3">
                  <label htmlFor="title" className="form-label">Title</label>
                  <Field
                    type="text"
                    id="title"
                    name="title"
                    className="form-control"
                  />
                </div>

                {/* Description Field */}
                <div className="mb-3">
                  <label htmlFor="description" className="form-label">Description</label>
                  <Field
                    as="textarea"
                    id="description"
                    name="description"
                    className="form-control"
                    rows="3"
                  />
                </div>

                {/* Location Fields */}
                <div className="mb-3">
                  <label htmlFor="country" className="form-label">Country</label>
                  <Field
                    type="text"
                    id="country"
                    name="location.country"
                    className="form-control"
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="city" className="form-label">City</label>
                  <Field
                    type="text"
                    id="city"
                    name="location.city"
                    className="form-control"
                  />
                </div>

                {/* Duration Field */}
                <div className="mb-3">
                  <label htmlFor="duration" className="form-label">Duration (days)</label>
                  <Field
                    type="number"
                    id="duration"
                    name="duration"
                    className="form-control"
                  />
                </div>

                {/* Price Field */}
                <div className="mb-3">
                  <label htmlFor="price" className="form-label">Price</label>
                  <Field
                    type="number"
                    id="price"
                    name="price"
                    className="form-control"
                  />
                </div>

                {/* Capacity Field */}
                <div className="mb-3">
                  <label htmlFor="capacity" className="form-label">Capacity</label>
                  <Field
                    type="number"
                    id="capacity"
                    name="capacity"
                    className="form-control"
                  />
                </div>

                {/* Images Field */}
                <div className="mb-3">
                  <label htmlFor="images" className="form-label">Image URLs</label>
                  <FieldArray name="images">
                    {({ push, remove }) => (
                      <>
                        {values.images.map((image, index) => (
                          <div key={index} className="input-group mb-2">
                            <Field
                              type="text"
                              className="form-control"
                              name={`images[${index}]`}
                              placeholder={`Image URL ${index + 1}`}
                            />
                            <button
                              type="button"
                              className="btn btn-danger"
                              onClick={() => remove(index)}
                            >
                              Remove
                            </button>
                          </div>
                        ))}
                        <button
                          type="button"
                          className="btn btn-secondary"
                          onClick={() => push('')}
                        >
                          Add Another Image
                        </button>
                      </>
                    )}
                  </FieldArray>
                </div>

                {/* Overview Field */}
                <div className="mb-3">
                  <label htmlFor="overview" className="form-label">Overview</label>
                  <Field
                    as="textarea"
                    id="overview"
                    name="overview"
                    className="form-control"
                    rows="3"
                  />
                </div>

                {/* Highlights Field */}
                <div className="mb-3">
                  <label htmlFor="highlights" className="form-label">Highlights</label>
                  <FieldArray name="highlights">
                    {({ push, remove }) => (
                      <>
                        {values.highlights.map((highlight, index) => (
                          <div key={index} className="input-group mb-2">
                            <Field
                              type="text"
                              className="form-control"
                              name={`highlights[${index}]`}
                              placeholder={`Highlight ${index + 1}`}
                            />
                            <button
                              type="button"
                              className="btn btn-danger"
                              onClick={() => remove(index)}
                            >
                              Remove
                            </button>
                          </div>
                        ))}
                        <button
                          type="button"
                          className="btn btn-secondary"
                          onClick={() => push('')}
                        >
                          Add Another Highlight
                        </button>
                      </>
                    )}
                  </FieldArray>
                </div>

                {/* Schedule Field */}
                <div className="mb-3">
                  <label htmlFor="schedule" className="form-label">Schedule</label>
                  <FieldArray name="schedule">
                    {({ push, remove }) => (
                      <>
                        {values.schedule.map((date, index) => (
                          <div key={index} className="input-group mb-2">
                            <Field
                              type="date"
                              className="form-control"
                              name={`schedule[${index}]`}
                              placeholder={`Schedule Date ${index + 1}`}
                            />
                            <button
                              type="button"
                              className="btn btn-danger"
                              onClick={() => remove(index)}
                            >
                              Remove
                            </button>
                          </div>
                        ))}
                        <button
                          type="button"
                          className="btn btn-secondary"
                          onClick={() => push('')}
                        >
                          Add Another Schedule
                        </button>
                      </>
                    )}
                  </FieldArray>
                </div>

                <button type="submit" className="btn btn-primary">Update Tour</button>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default EditTour;
