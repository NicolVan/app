import React, {useContext } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { AuthContext } from './AuthProvider';
import { API_URL } from './constants';

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { setUser, setIsAuthenticated } = useContext(AuthContext);
  

  const validationSchema = Yup.object({
    username: Yup.string().required('Required'),
    email: Yup.string().email('Invalid email address').required('Required'),
    password: Yup.string().min(6, 'Password must be at least 6 characters').required('Required'),
  });

  const onSubmit = async (values, { setSubmitting, setErrors }) => {
    try {
      const res = await axios.post(`${ API_URL }/auth/register`, values);
      const { user, token } = res.data;
      dispatch(setUser({ user, token }));
      localStorage.setItem('token', token);
      console.log('Registration successful. Redirecting to /profile...');
      navigate('/profile'); 
    } catch (err) {
      if (err.response && err.response.data) {
        setErrors({ submit: err.response.data.msg });
      }
      console.error('Server error:', err.response ? err.response.data : err.message);
    }
    setSubmitting(false);
  };

  const responseMessage = async (response) => {
    const { credential } = response;

    if (credential) {
      try {
        const res = await axios.post(`${ API_URL }/auth/google-login`, { token: credential });
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
    console.log(error);
  };
  return (
    <Formik
      initialValues={{ username: '', email: '', password: '' }}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      {({ isSubmitting, errors }) => (
        <Form>
          <div className='min-h-screen bg-orange-100 py-6 flex flex-col justify-center sm:py-12'>
            <div className='relative py-3 sm:max-w-xl sm:mx-auto'>
              <div className='relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20'>
                <div className='max-w-md mx-auto'>
                  <div>'
                    <h1 className='text-2xl font-semibold'>Register</h1>
                  </div>
                  <div className='divide-y divide-gray-200'>
                    <div className='py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7'>
                      <div className='relative'>
                        <Field
                          autoComplete='off'
                          id='username'
                          name='username'
                          type='text'
                          className='peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:border-rose-600'
                          placeholder='Username'
                        />
                        <label
                          htmlFor='username'
                          className='absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm'
                        >
                          Username
                        </label>
                        <ErrorMessage name='username' component='div' className='text-red-600 text-sm'/>
                      </div>
                      <div className='relative'>
                        <Field
                          autoComplete='off'
                          id='email'
                          name='email'
                          type='email'
                          className='peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:border-rose-600'
                          placeholder='Email address'
                        />
                        <label
                          htmlFor='email'
                          className='absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm'
                        >
                          Email Address
                        </label>
                        <ErrorMessage name='email' component='div' className='text-red-600 text-sm'/>
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
                        <ErrorMessage name='password' component='div' className='text-red-600 text-sm'/>
                      </div>
                      <div className='relative'>
                        {errors.submit && <div className='text-red-600 text-sm'>{errors.submit}</div>}
                        <button
                          type='submit'
                          className='bg-orange-300 text-white rounded-md px-2 py-1 hover:bg-orange-500'
                          disabled={isSubmitting}
                        >
                          Register
                        </button>
                      </div>
                      <div>
                        <GoogleLogin
                          clientId='299159331127-a0c2fph79ln76nno6hfnejm3b014mtgg.apps.googleusercontent.com'
                          buttonText='Register with Google'
                          onSuccess={responseMessage}
                          onFailure={errorMessage}
                          cookiePolicy={'single_host_origin'}
                        />
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
