// src/components/Register.js
import React from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { setUser } from '../features/auth/authSlice';

const Register = () => {
  const dispatch = useDispatch();

  const validationSchema = Yup.object({
    name: Yup.string().required('Required'),
    email: Yup.string().email('Invalid email address').required('Required'),
    password: Yup.string().min(6, 'Password must be at least 6 characters').required('Required'),
  });

  const onSubmit = async (values, { setSubmitting, setErrors }) => {
    console.log(values); 
    try {
      const res = await axios.post('http://localhost:5000/api/auth/register', values);
      const { user, token } = res.data; 
      dispatch(setUser({ user, token }));
    } catch (err) {
      if (err.response && err.response.data) {
        setErrors({ submit: err.response.data.msg });
      }
      console.error(err.response.data); 
    }
    setSubmitting(false);
  };

  return (
    <Formik
      initialValues={{ name: '', email: '', password: '' }}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      {({ isSubmitting, errors }) => (
        <Form>
          <div>
            <label>Name</label>
            <Field type="text" name="name" />
            <ErrorMessage name="name" component="div" />
          </div>
          <div>
            <label>Email</label>
            <Field type="email" name="email" />
            <ErrorMessage name="email" component="div" />
          </div>
          <div>
            <label>Password</label>
            <Field type="password" name="password" />
            <ErrorMessage name="password" component="div" />
          </div>
          {errors.submit && <div>{errors.submit}</div>}
          <button type="button" disabled={isSubmitting}>
            Register
          </button>
        </Form>
      )}
    </Formik>
  );
};

export default Register;

