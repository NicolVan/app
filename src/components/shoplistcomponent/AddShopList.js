import React, { useState, useContext } from 'react';
import axios from 'axios';
import { API_URL } from '../constants';
import { AuthContext } from '../AuthProvider';
import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage, FieldArray } from 'formik';
import * as Yup from 'yup';

const AddShopList = () => {
  const [message, setMessage] = useState('');
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const initialValues = {
    items: [{ name: '', quantity: '' }]
  };

  const validationSchema = Yup.object().shape({
    items: Yup.array().of(
      Yup.object().shape({
        name: Yup.string().required('Name is empty'),
        quantity: Yup.number()
          .required('Quantity is empty')
          .positive('Quantity must be greater than zero')
          .integer('Quantity must be an integer'),
      })
    ).min(1, 'At least one item is required')
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    if (!user) {
      setMessage('You must be logged in to add supplies.');
      setSubmitting(false);
      return;
    }

    try {
      await axios.post(`${API_URL}/shoppingList/addshoplist`, {
        userId: user._id,
        items: values.items
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setMessage('Shopping list added successfully!');
    } catch (error) {
      setMessage(`Error: ${error.response?.data?.error || error.message}`);
    }
    
    setSubmitting(false);
  };

  const navigateToShopList = () => {
    navigate('/shoplist')
  }
   return (
    <div className='p-4'>
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ isSubmitting }) => (
        <Form>
          <div className='min-h-screen bg-orange-100 py-6 flex flex-col justify-center sm:py-12'>
            <div className='relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20'>
              <div className='rounded-lg px-8 py-6 mx-auto my-8 max-w-3xl grid text-center'>
                <h2 className='text-2xl text-center mb-4'>Items</h2>
                <FieldArray name='items'>
                  {({ push, remove }) => (
                    <div className='space-y-4'>
                      {initialValues.items.map((item, index) => (
                        <div key={index} className='flex flex-col space-y-2 mb-4'>
                          <div className='flex space-x-2'>
                            <Field
                              name={`items[${index}].name`}
                              type='text'
                              className='w-full justify-items-center text-center w-auto rounded-xl border-0 py-1.5 pl-8 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 mb-2'
                              placeholder='Item Name'
                            />
                            <ErrorMessage
                              name={`items[${index}].name`}
                              component='div'
                              className='text-red-500 text-sm'
                            />
                          </div>
                          <div className='flex space-x-2'>
                            <Field
                              name={`items[${index}].quantity`}
                              type='number'
                              className='w-full justify-items-center text-center w-auto rounded-xl border-0 py-1.5 pl-8 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 mb-2'
                              placeholder='Quantity'
                            />
                            <ErrorMessage
                              name={`items[${index}].quantity`}
                              component='div'
                              className='text-red-500 text-sm'
                            />
                          </div>
                          <div className='flex space-x-2'>
                            <button
                              type='button'
                              className='w-10 h-10 text-center text-sm font-medium text-gray-900 bg-white rounded-full border border-gray-200 hover:bg-orange-500 hover:text-white focus:ring-4 focus:ring-gray-100'
                              onClick={() => push({ name: '', quantity: '' })}
                            >
                              +
                            </button>
                            {initialValues.items.length > 1 && (
                              <button
                                type='button'
                                className='bg-red-500 text-white p-2 rounded mt-2'
                                onClick={() => remove(index)}
                              >
                                Remove Item
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                      <button
                        type='submit'
                        className='w-40 h-10 text-center text-sm font-medium text-gray-900 bg-white rounded-full border border-gray-200 hover:bg-orange-500 hover:text-white focus:ring-4 focus:ring-gray-100'
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? 'Submitting...' : 'Submit'}
                      </button>
                      <button
                        type='button'
                        onClick={navigateToShopList}
                        className='w-40 h-10 text-center text-sm font-medium text-gray-900 bg-white rounded-full border border-gray-200 hover:bg-orange-500 hover:text-white focus:ring-4 focus:ring-gray-100'
                      >
                        Show All Shop Lists
                      </button>
                    </div>
                  )}
                </FieldArray>
              </div>
            </div>
          </div>
        </Form>
      )}
    </Formik>
    {message && <div className='text-black mt-4'>{message}</div>}
  </div>
);
};
export default AddShopList;
