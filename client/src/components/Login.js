import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useDispatch } from 'react-redux';
import { login  as loginAction } from '../redux/actions/userActions';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from './AuthProvider';

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const initialValues = {
    email: '',
    password: ''
  };

  const validationSchema = Yup.object({
    email: Yup.string().email('Invalid email format').required('Email is required'),
    password: Yup.string().required('Password is required')
  });

  const onSubmit = async (values, { setSubmitting }) => {
    console.log('Submitting login form with values:', values); 
    try {
      await login(values.email, values.password);
      const token = localStorage.getItem('token');
      console.log('Token after login:', token); 
      navigate('/profile'); 
    } catch (error) {
      console.error('Error during login:', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      {({ isSubmitting }) => (
        <Form>
          <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
            <div className="relative py-3 sm:max-w-xl sm:mx-auto">
              <div className="">
              <img src='https://i.pinimg.com/564x/18/bf/2b/18bf2b49e5140637f33938195a786429.jpg'alt='fruit' 
              className='absolute inset-0 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl  w-96 h-full'></img>
              </div>
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
                          className='bg-cyan-500 text-white rounded-md px-2 py-1'
                          disabled={isSubmitting}
                        >
                          Submit
                        </button>
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

export default Login;
