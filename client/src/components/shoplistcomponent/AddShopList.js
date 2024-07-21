import React, { useState, useContext } from 'react';
import axios from 'axios';
import { API_URL } from '../constants';
import { AuthContext } from '../AuthProvider';

const AddShopList = () => {
    const [items, setItems] = useState([{ name: '', quantity: '' }]);  
    const [message, setMessage] = useState('');
    const { user } = useContext(AuthContext);

    const addItem = () => {
        setItems([...items, { name: '', quantity: 1 }]);
    };

    const handleChange = (index, event) => {
        const newItems = [...items];
        newItems[index][event.target.name] = event.target.value;
        setItems(newItems);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!user) {
            setMessage('You must be logged in to add supplies.');
            return;
        }
        try {
            await axios.post(`${API_URL}/shoppingList/addshoplist`, {
                userId: user._id,
                items,
            }, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setMessage('Shopping list added successfully!');
            setItems([{ name: '', quantity: '' }]); 
        } catch (error) {
            setMessage(`Error: ${error.response.data.error}`);
        }
    };

    return (
        <div className='min-h-screen bg-orange-100 py-6 flex flex-col justify-center sm:py-12'>
            <div className='relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20'>
                <div className='rounded-lg px-8 py-6 mx-auto my-8 max-w-3xl grid text-center'>
                    <h2 className='text-2xl text-center'>Create Shop List</h2>
                    <form onSubmit={handleSubmit}>
                        {items.map((item, index) => (
                            <div key={index}>
                                <label>Item Name:</label>
                                <input
                                    type='text'
                                    name='name'
                                    value={item.name}
                                    onChange={(e) => handleChange(index, e)}
                                    required
                                    className='w-full text-center rounded-xl border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm mb-2'
                                />
                                <label>Quantity:</label>
                                <input
                                    type='number'
                                    name='quantity'
                                    value={item.quantity}
                                    onChange={(e) => handleChange(index, e)}
                                    required
                                    className='w-full text-center rounded-xl border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm mb-2'
                                />
                            </div>
                        ))}
                        <button type='button' onClick={addItem} className='w-40 h-10 text-center mb-2 text-sm font-medium text-gray-900 bg-white rounded-full border border-gray-200 hover:bg-gray-100 focus:ring-4 focus:ring-gray-100'>
                        +
                        </button>
                        <button type='submit' className='w-40 h-10 text-center text-sm font-medium text-gray-900 bg-white rounded-full border border-gray-200 hover:bg-gray-100 focus:ring-4 focus:ring-gray-100'>
                           Create Shop List
                        </button>
                    </form>
                    {message && <p>{message}</p>}
                </div>
            </div>
        </div>
    );
};

export default AddShopList;