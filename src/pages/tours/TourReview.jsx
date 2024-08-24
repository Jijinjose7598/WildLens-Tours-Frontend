import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import '../../App.css'; // Import the CSS file for custom styles

const TourReview= ({ tourId, onClose }) => {
  return (
    <div className="review-card">
      <h3 className="review-title">Write a Review</h3>
      <Formik
        initialValues={{ user: '', comment: '', rating: '' }}
        validationSchema={Yup.object({
          user: Yup.string().required('Username is required'),
          comment: Yup.string().required('Comment is required'),
          rating: Yup.number()
            .required('Rating is required')
            .min(1, 'Rating must be at least 1')
            .max(5, 'Rating must be at most 5'),
        })}
        onSubmit={async (values, { setSubmitting, resetForm }) => {
          try {
            const response = await axios.post(
              `https://wildlens-tours-backend-q5lv.onrender.com/api/tours/tour/${tourId}/review`,
              values
            );
            console.log(response.data);
            resetForm();
            onClose();
          } catch (error) {
            console.error('Error submitting review:', error);
          }
          setSubmitting(false);
        }}
      >
        {({ isSubmitting }) => (
          <Form className="review-form">
            <div className="form-group">
              <label htmlFor="user" className="form-label">Username</label>
              <Field name="user" type="text" className="form-input" />
              <ErrorMessage name="user" component="div" className="error-message" />
            </div>

            <div className="form-group">
              <label htmlFor="comment" className="form-label">Comment</label>
              <Field name="comment" as="textarea" className="form-textarea" />
              <ErrorMessage name="comment" component="div" className="error-message" />
            </div>

            <div className="form-group">
              <label htmlFor="rating" className="form-label">Rating</label>
              <Field name="rating" type="number" min="1" max="5" className="form-input" />
              <ErrorMessage name="rating" component="div" className="error-message" />
            </div>

            <div className="form-buttons">
              <button type="submit" className="submit-button" disabled={isSubmitting}>
                Submit Review
              </button>
              <button type="button" className="cancel-button" onClick={onClose}>
                Cancel
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default TourReview;
