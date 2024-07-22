import React, { useState } from 'react';
import axios from 'axios';
import { AuthContext } from '../AuthProvider';
import { useContext } from 'react';
import { API_URL } from '../constants'
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const AddSupplies = () => {
    const { user } = useContext(AuthContext);
    const [message, setMessage] = useState('');
    const categories = ['ml', 'g', 'l','kg','ks'];
    const foodCategories =  ['Vegetable','Fruit','Meat','Fish','Oil','Spice','Dairy','Pastries',
      'Cereals','Legumes','Sweets','Pasta','Seafood','Tea','Coffe'];

      const validationSchema = Yup.object().shape({
        itemName: Yup.string().required('Please enter an item name'),
        quantity: Yup.number()
          .required('Please enter a quantity')
          .positive('Quantity must be greater than zero')
          .integer('Quantity must be an integer'),
        category: Yup.string().oneOf(categories, 'Invalid category').required('Please select a category'),
        foodCat: Yup.string().oneOf(foodCategories, 'Invalid food category').required('Please select a food category'),
      });

      const handleSubmit = async (values, { setSubmitting }) => {
        if (!user) {
          setMessage('You must be logged in to add supplies.');
          setSubmitting(false);
          return;
        }
    
        try {
          const response = await axios.post(`${API_URL}/supplies/saveSupplies`, {
            userId: user._id,
            ...values
          }, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
          });
          setMessage(`Item ${response.data.itemName} added successfully!`);
        } catch (error) {
          setMessage(`Error: ${error.response?.data?.error || error.message}`);
        }
    
        setSubmitting(false);
      };
  
    return (
      <Formik
         initialValues={{
          itemName: '',
          category: [],
          quantity: '',
          foodCat: [],
         }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form>
          <div className='min-h-screen bg-orange-100 py-6 flex flex-col justify-center sm:py-12'>
              <div className='relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20'>
                <div className='rounded-lg px-8 py-6 mx-auto my-8 max-w-3xl grid text-center'>
                  <h2 className='text-2xl text-center mb-4'>Add Supplies</h2>
                  <div className='mb-4'>
                    <label htmlFor='itemName' className='block text-left'>Item Name:</label>
                    <Field
                      id='itemName'
                      name='itemName'
                      type='text'
                      className='w-full rounded-xl border-0 py-1.5 pl-8 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
                    />
                    <ErrorMessage name='itemName' component='div' className='text-red-500 text-sm' />
                  </div>
                  <div className='mb-4'>
                    <label htmlFor='quantity' className='block text-left'>Quantity:</label>
                    <Field
                      id='quantity'
                      name='quantity'
                      type='number'
                      className='w-full rounded-xl border-0 py-1.5 pl-8 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
                    />
                      <ErrorMessage name='quantity' component='div' className='text-red-500 text-sm' />
                  </div>
                  <div className='mb-4'>
                    <label htmlFor='category' className='block text-left'>Category:</label>
                    <Field as='select' id='category' name='category' className='w-full rounded-xl border-0 py-1.5 pl-8 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'>
                      <option value='' label='Select weight' />
                      {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </Field>
                    <ErrorMessage name='category' component='div' className='text-red-500 text-sm' />
                </div>
                <div className='mb-4'>
                  <label htmlFor='foodCat' className='block text-left'>Food Category:</label>
                  <Field as='select' id='foodCat' name='foodCat' className='w-full rounded-xl border-0 py-1.5 pl-8 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'>
                    <option value='' label='Select category' />
                    {foodCategories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </Field>
                  <ErrorMessage name='foodCat' component='div' className='text-red-500 text-sm' />
                </div>
                <button
                  type='submit'
                  className='justify-center w-40 h-10 text-center mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-full border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700'
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Adding...' : 'Add Supply'}
                </button>
                {message && <p className='text-black mt-4'>{message}</p>}
              </div>
            </div>'
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default AddSupplies;