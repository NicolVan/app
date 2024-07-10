import React, { useState } from 'react';
import axios from 'axios';
import { AuthContext } from '../AuthProvider';
import { useContext } from 'react';

const AddSupplies = () => {
    const [itemName, setItemName] = useState('');
    const [quantity, setQuantity] = useState('');
    const { user } = useContext(AuthContext);
    const [message, setMessage] = useState('');
    const [category, setCategory] = useState('');
    const [foodCat, setFoodCat] = useState('');

    const categories = ['ml', 'g', 'l','kg'];
    const cat =  ['Vegetable','Fruit','Meat','Fish','Oil','Spice','Dairy','Pastries',
      'Cereals','Legumes','Sweets','Pasta','Seafood','Tea','Coffe'];

    const handleSubmit = async (e) => {
      e.preventDefault();
        if (!user) {
         setMessage('You must be logged in to add supplies.');
          return;
      }
    try {
        const response = await axios.post(`http://localhost:5000/api/supplies/saveSupplies`, {
          userId: user._id, 
          itemName,
          quantity,
          category,
          foodCat
        }, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setMessage(`Supply ${response.data.itemName} added successfully!`);
        setItemName(''); 
        setQuantity('');
        setCategory('');
        setFoodCat('');
      } catch (error) {
        setMessage(`Error: ${error.response.data.error}`);
      }
    };
  
    return (
        <div className='min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12'>
            <div className='relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20'>
                <div className='rounded-lg px-8 py-6 mx-auto my-8 max-w-3xl grid text-center'>
                    <h2 className='text-2xl text-center'>Add Supplies</h2>
                    <form onSubmit={handleSubmit}>
                    <div>
                        <label>Item Name:</label>
                        <input
                            type="text"
                            value={itemName}
                            onChange={(e) => setItemName(e.target.value)}
                            required
                            className='w-full justify-items-center text-center w-auto rounded-xl border-0 py-1.5 pl-8 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 mb-2'
                        />
                    </div>
                    <div>
                        <label>Quantity:</label>
                        <input
                            type="number"
                            value={quantity}
                            onChange={(e) => setQuantity(e.target.value)}
                            required
                            className='w-full justify-items-center text-center w-auto rounded-xl border-0 py-1.5 pl-8 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 mb-2'
                        />
                    </div>
                    <div className='mb-2'>
                        <select
                          value={category}
                          onChange={(e) => setCategory(e.target.value)}
                          required
                          className='w-full rounded-xl border-0 py-1.5 pl-8 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'>
                            <option value="" disabled>Select category</option>
                            {categories.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                          ))}
                        </select>
                    </div>
                    <div className='mb-2'>
                      <p>Food Category:</p>
                        <select
                          value={foodCat}
                          onChange={(e) => setFoodCat(e.target.value)}
                          required
                          className='w-full rounded-xl border-0 py-1.5 pl-8 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'>
                            <option value="" disabled>Select category</option>
                            {cat.map(c => (
                            <option key={c} value={c}>{c}</option>
                          ))}
                        </select>
                    </div>
                    <button type="submit" 
                        className='justify-center w-40 h-10 text-center me-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-full border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700'
                        >Add Supply</button>
                    </form>
                    {message && <p>{message}</p>}
                </div>
            </div>
        </div>
      );
    };

export default AddSupplies;