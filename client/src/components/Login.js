import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from './AuthProvider';
import { GoogleLogin } from '@react-oauth/google';
import axios from 'axios';

const Login = () => {
  const navigate = useNavigate();
  const { login, setIsAuthenticated  } = useContext(AuthContext);
  

  const initialValues = {
    email: '',
    password: ''
  };
  
  const validationSchema = Yup.object({
    email: Yup.string().email('Invalid email format').required('Email is required'),
    password: Yup.string().required('Password is required')
  });

  const onSubmit = async (values, { setSubmitting, setFieldError }) => {
    console.log('Submitting login form with values:', values); 
    try {
      await login(values.email, values.password);
      const token = localStorage.getItem('token');
      if (token) {
        navigate('/profile');
      } else {setFieldError('email', 'Login failed. Please try again. Enter a correct email or password');}
    } catch (error) {
      console.error('Error during login:', error);
    } finally {
      setSubmitting(false);
    }
  };
  const responseMessage = async (response) => {
    const { credential } = response;

    if (credential) {
      try {
        const res = await axios.post('http://localhost:5000/api/auth/google-login', { token: credential });
        console.log('Server Response:', res.data);
        localStorage.setItem('token', res.data.token)
        localStorage.setItem('user', JSON.stringify(res.data.user));
        setIsAuthenticated(true);
        console.log('Google login successful. Redirecting to /profile...');
        navigate('/profile');
        
      } catch (error) {
        console.error('Google login failed:', error.response ? error.response.data : error.message);
      }
    }
  };

  const errorMessage = (error) => {
    console.error('Google login error:', error);
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      {({ isSubmitting }) => (
        <Form>
          <div className='min-h-screen bg-orange-100 py-6 flex flex-col justify-center sm:py-12'>
            <div className='relative py-3 sm:max-w-xl sm:mx-auto'>
              <div className='relative px-4 py-10 bg-white shadow-lg -skew-y-0 sm:skew-y-9 sm:-rotate-0 sm:rounded-3xl sm:p-20'>
                <div className='max-w-md mx-auto'>
                  <div>
                    <h1 className='text-2xl font-semibold'>Login</h1>
                  </div>
                  <div className='divide-y divide-gray-200'>
                    <div className='py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7'>
                      <div className='relative'>
                        <Field
                          autoComplete='off'
                          id='email'
                          name='email'
                          type='text'
                          className='peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:border-rose-600'
                          placeholder='Email address'
                        />
                        <label
                          htmlFor='email'
                          className='absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm'
                        >
                          Email Address
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
                        <button
                          type='submit'
                          className='bg-orange-300 text-white rounded-md px-2 py-1 hover:bg-orange-500' 
                          disabled={isSubmitting}
                        >
                          Submit
                        </button>
                      </div>
                      <div>
                          <GoogleLogin onSuccess={responseMessage} onError={errorMessage} />
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

export default Login
