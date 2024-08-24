import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage, FieldArray } from 'formik';
import * as Yup from 'yup';
import { FaArrowLeft } from 'react-icons/fa';

const EditPackage = () => {
  const { packageId } = useParams();
  const [pkg, setPkg] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPackage = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/packages/package/${packageId}`);
        setPkg(response.data.data);
      } catch (error) {
        console.error('Error fetching package:', error);
      }
    };

    fetchPackage();
  }, [packageId]);

  const validationSchema = Yup.object({
    title: Yup.string().required('Title is required'),
    description: Yup.string().required('Description is required'),
    price: Yup.number().required('Price is required'),
    duration: Yup.number().required('Duration is required'),
    images: Yup.array().of(Yup.string().url().required('Image URL is required')),
    features: Yup.object().shape({
      food: Yup.boolean(),
      hotel: Yup.boolean(),
      taxi: Yup.boolean(),
    }),
    isBestSelling: Yup.boolean(),
    overview: Yup.string(),
    highlights: Yup.array().of(Yup.string().required('Highlight is required')),
  });

  const handleSubmit = async (values) => {
    try {
      const updatedPackage = {
        ...values,
        images: values.images.map((url) => url.trim()),
      };
      await axios.patch(`http://localhost:3001/api/packages/package/update/${packageId}`, updatedPackage);
      navigate(`/packages/${packageId}`);
    } catch (error) {
      console.error('Error updating package:', error);
    }
  };

  if (!pkg) {
    return <p>Loading...</p>;
  }

  return (
    <div className="container mt-4">
      <h1>Edit Package</h1>
       <button className="btn btn-link" onClick={() => navigate(-1)}>
            <FaArrowLeft /> Back
          </button>
      <Formik
        initialValues={{
          title: pkg.title || '',
          description: pkg.description || '',
          price: pkg.price || '',
          duration: pkg.duration || '',
          images: pkg.images || [''],
          features: pkg.features || { food: false, hotel: false, taxi: false },
          isBestSelling: pkg.isBestSelling || false,
          overview: pkg.overview || '',
          highlights: pkg.highlights || [''],
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ values, setFieldValue, isSubmitting }) => (
          <Form>
            <div className="form-group mb-2">
              <label htmlFor="title">Title</label>
              <Field type="text" name="title" className="form-control" />
              <ErrorMessage name="title" component="div" className="text-danger" />
            </div>

            <div className="form-group mb-2">
              <label htmlFor="description">Description</label>
              <Field as="textarea" name="description" className="form-control" />
              <ErrorMessage name="description" component="div" className="text-danger" />
            </div>

            <div className="form-group mb-2">
              <label htmlFor="price">Price</label>
              <Field type="number" name="price" className="form-control" />
              <ErrorMessage name="price" component="div" className="text-danger" />
            </div>

            <div className="form-group mb-2">
              <label htmlFor="duration">Duration (Days)</label>
              <Field type="number" name="duration" className="form-control" />
              <ErrorMessage name="duration" component="div" className="text-danger" />
            </div>

            <div className="form-group mb-2">
              <label htmlFor="images">Image URLs</label>
              <FieldArray name="images">
                {({ push, remove }) => (
                  <div>
                    {values.images.map((image, index) => (
                      <div key={index} className="d-flex mb-2">
                        <Field type="text" name={`images[${index}]`} className="form-control" placeholder="Image URL" />
                        <button
                          type="button"
                          className="btn btn-danger ml-2"
                          onClick={() => remove(index)}
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      className="btn btn-secondary mt-2"
                      onClick={() => push('')}
                    >
                      Add New Image
                    </button>
                  </div>
                )}
              </FieldArray>
              <ErrorMessage name="images" component="div" className="text-danger" />
            </div>

            <div className="form-group mb-2">
              <label htmlFor="features">Features</label>
              <div>
                <label>
                  <Field type="checkbox" name="features.food" />
                  Food
                </label>
                <label>
                  <Field type="checkbox" name="features.hotel" />
                  Hotel
                </label>
                <label>
                  <Field type="checkbox" name="features.taxi" />
                  Taxi
                </label>
              </div>
              <ErrorMessage name="features" component="div" className="text-danger" />
            </div>

            <div className="form-group mb-2">
              <label htmlFor="isBestSelling">Best Selling</label>
              <Field type="checkbox" name="isBestSelling" />
            </div>

            <div className="form-group mb-2">
              <label htmlFor="overview">Overview</label>
              <Field as="textarea" name="overview" className="form-control" />
              <ErrorMessage name="overview" component="div" className="text-danger" />
            </div>

            <div className="form-group mb-2">
              <label htmlFor="highlights">Highlights</label>
              <FieldArray name="highlights">
                {({ push, remove }) => (
                  <div>
                    {values.highlights.map((highlight, index) => (
                      <div key={index} className="d-flex mb-2">
                        <Field type="text" name={`highlights[${index}]`} className="form-control" placeholder="Highlight" />
                        <button
                          type="button"
                          className="btn btn-danger ml-2"
                          onClick={() => remove(index)}
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      className="btn btn-secondary mt-2"
                      onClick={() => push('')}
                    >
                      Add New Highlight
                    </button>
                  </div>
                )}
              </FieldArray>
              <ErrorMessage name="highlights" component="div" className="text-danger" />
            </div>

            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
              Update Package
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default EditPackage;
