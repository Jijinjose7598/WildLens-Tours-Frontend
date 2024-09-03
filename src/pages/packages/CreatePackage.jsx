import React from 'react';
import { Formik, Form, Field, FieldArray, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../../App.css'; // Import the CSS file for custom styles

const validationSchema = Yup.object({
  title: Yup.string().required('Title is required'),
  description: Yup.string().required('Description is required'),
  price: Yup.number().required('Price is required').positive('Price must be positive'),
  duration: Yup.number().required('Duration is required').positive('Duration must be positive'),
  overview: Yup.string().required('Overview is required'),
  highlights: Yup.array().of(Yup.string().required('Highlight is required')),
  images: Yup.array().of(Yup.string().url('Invalid URL')),
  features: Yup.object({
    food: Yup.boolean(),
    hotel: Yup.boolean(),
    taxi: Yup.boolean(),
  }),
});

const CreatePackage = () => {
  const navigate = useNavigate();

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const response = await axios.post('https://wildlens-tours-backend-tqh1.onrender.com/api/packages/create', values);
      console.log(response.data);
      navigate('/packages'); // Navigate back to the packages list after creation
    } catch (error) {
      console.error('Error creating package:', error);
    }
    setSubmitting(false);
  };

  return (
    <div className="container mt-4">
      <div className="card" style={{
        width: '70%',
        margin: '0 auto',
        padding: '20px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
      }}>
        <h1>Create New Package</h1>
        <Formik
          initialValues={{
            title: '',
            description: '',
            price: '',
            duration: '',
            features: {
              food: false,
              hotel: false,
              taxi: false,
            },
            overview: '',
            highlights: [''],
            images: [''],
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form>
              {/* Title Field */}
              <div className="form-group">
                <label htmlFor="title">Title</label>
                <Field name="title" type="text" className="form-control" />
                <ErrorMessage name="title" component="div" className="error-message" />
              </div>

              {/* Description Field */}
              <div className="form-group">
                <label htmlFor="description">Description</label>
                <Field name="description" as="textarea" className="form-control" />
                <ErrorMessage name="description" component="div" className="error-message" />
              </div>

              {/* Overview Field */}
              <div className="form-group">
                <label htmlFor="overview">Overview</label>
                <Field name="overview" as="textarea" className="form-control" />
                <ErrorMessage name="overview" component="div" className="error-message" />
              </div>

              {/* Highlights Field */}
              <div className="form-group">
                <label htmlFor="highlights">Highlights</label>
                <FieldArray name="highlights">
                  {({ push, remove, form }) => (
                    <>
                      {form.values.highlights.map((highlight, index) => (
                        <div key={index} className="form-group">
                          <Field
                            name={`highlights[${index}]`}
                            type="text"
                            className="form-control"
                            placeholder={`Highlight ${index + 1}`}
                          />
                          <ErrorMessage name={`highlights[${index}]`} component="div" className="error-message" />
                          <button type="button" className="btn btn-danger" onClick={() => remove(index)}>
                            Remove
                          </button>
                        </div>
                      ))}
                      <button type="button" className="btn btn-secondary" onClick={() => push('')}>
                        Add Another Highlight
                      </button>
                    </>
                  )}
                </FieldArray>
              </div>

              {/* Price Field */}
              <div className="form-group">
                <label htmlFor="price">Price (INR)</label>
                <Field name="price" type="number" className="form-control" />
                <ErrorMessage name="price" component="div" className="error-message" />
              </div>

              {/* Duration Field */}
              <div className="form-group">
                <label htmlFor="duration">Duration (in days)</label>
                <Field name="duration" type="number" className="form-control" />
                <ErrorMessage name="duration" component="div" className="error-message" />
              </div>

              {/* Features Field */}
              <div className="form-group">
                <label>Features</label>
                <div className="form-check">
                  <Field name="features.food" type="checkbox" className="form-check-input" />
                  <label htmlFor="features.food" className="form-check-label">Food</label>
                </div>
                <div className="form-check">
                  <Field name="features.hotel" type="checkbox" className="form-check-input" />
                  <label htmlFor="features.hotel" className="form-check-label">Hotel</label>
                </div>
                <div className="form-check">
                  <Field name="features.taxi" type="checkbox" className="form-check-input" />
                  <label htmlFor="features.taxi" className="form-check-label">Taxi</label>
                </div>
              </div>

              {/* Images Field */}
              <div className="form-group">
                <label htmlFor="images">Image URLs</label>
                <FieldArray name="images">
                  {({ push, remove, form }) => (
                    <>
                      {form.values.images.map((image, index) => (
                        <div key={index} className="form-group">
                          <Field
                            name={`images[${index}]`}
                            type="text"
                            className="form-control"
                            placeholder={`Image URL ${index + 1}`}
                          />
                          <ErrorMessage name={`images[${index}]`} component="div" className="error-message" />
                          <button type="button" className="btn btn-danger" onClick={() => remove(index)}>
                            Remove
                          </button>
                        </div>
                      ))}
                      <button type="button" className="btn btn-secondary" onClick={() => push('')}>
                        Add Another Image
                      </button>
                    </>
                  )}
                </FieldArray>
              </div>

              <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                Create Package
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default CreatePackage;
