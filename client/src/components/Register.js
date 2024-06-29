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
          <div className='min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12'>
          <div className="relative py-3 sm:max-w-xl sm:mx-auto">
            <div>
              <img src='https://i.pinimg.com/564x/ce/a4/69/cea469e06b6c364991c959be9a51aa18.jpg'alt='fruit' 
              className='absolute inset-0 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl w-96 h-full'></img>
            </div>
            <div className='relative px-4 py-10 bg-white shadow-lg -skew-y-0 sm:skew-y-9 sm:-rotate-0 sm:rounded-3xl sm:p-20'>
            <div className='max-w-md mx-auto'>
                  <div>
                    <h1 className='text-2xl font-semibold'>Register</h1>
                  </div>
                  <div className='divide-y divide-gray-200'>
                    <div className='py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7'>
                      <div className='relative'>
            <Field
            autoComplete='off'
              id ='username'
              name ='username'
              type ='text'
              className='peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:border-rose-600'
              placeholder='username'
              />
            <label
              htmlFor='username'
              className='absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm'
              >Username
            </label>
            <ErrorMessage name='username' component='div' className='text-red-600 text-sm' />
            <div className='relative'>
            <Field
              autoComplete='off'
              id ='email'
              name ='email'
              type ='text'
              className='peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:border-rose-600'
              placeholder='Email address'
            />
            <label
              htmlFor='email'
              className='absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm'
              >Email Address
            </label>
            <ErrorMessage name='email' component='div' className='text-red-600 text-sm' />
            </div>

             <div className='relative'>
                        <Field
                          autoComplete='off'
                          id='password'
                          name='password'
                          type='password'
                          className='peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:border-rose-600'
                          placeholder='Password'
                        />
                        <label
                          htmlFor='password'
                          className='absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm'
                        >
                          Password
                        </label>
                        <ErrorMessage name='password' component='div' className='text-red-600 text-sm' />
                      </div>
                      <div className='relative'>
                      {errors.submit && <div>{errors.submit}</div>}
                        <button
                          type='button'
                          className='bg-cyan-500 text-white rounded-md px-2 py-1'
                          disabled={isSubmitting}
                        >
                          Register
                        </button>
                        </div>
          
                        </div>
          </div>
          </div>
          </div>
          </div>
          </div>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default Register;

