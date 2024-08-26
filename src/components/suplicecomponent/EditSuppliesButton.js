import React, { useState } from 'react';
import axios from 'axios';
import { API_URL } from '../constants';
import editIcon from '../image/pencil.png';

const EditSuppliesButton = ({ id, item, onEdit }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editItem, setEditItem] = useState({ ...item });

    const openModal = () => {
        setEditItem({ ...item });
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditItem({ ...editItem, [name]: value });
    };

    const handleEditSubmit = async () => {
        try {
            const response = await axios.put(`${API_URL}/supplies/editsupplies/${id}`, editItem, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            onEdit(id, response.data);
            closeModal();
        } catch (error) {
            console.error('Error updating item:', error);
        }
    };

    const categories = ['ml', 'g', 'l', 'kg', 'ks'];
    const foodCategories = [
        'Vegetable', 'Fruit', 'Meat', 'Fish', 'Oil', 'Spice', 
        'Dairy', 'Pastries', 'Cereals', 'Legumes', 
        'Sweets', 'Pasta', 'Seafood', 'Tea', 'Coffee'
    ];

    return (
        <>
            <button 
                onClick={openModal} 
                className='w-10 h-10 bg-white rounded-full shadow flex justify-center items-center'>
                    <img src={editIcon} alt='edit' className='w-5 h-5' />
            </button>

            {isModalOpen && (
                <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50'>
                    <div className='bg-white rounded-lg p-6 shadow-lg w-80 relative'>
                        <span 
                            onClick={closeModal} 
                            className='absolute top-2 right-2 text-xl cursor-pointer'
                        >&times;
                        </span>
                        <h2 className='text-lg font-semibold mb-4'>Edit Item</h2>
                        <div>
                            <label>Item Name:</label>
                            <input
                                type='text'
                                name='itemName'
                                value={editItem.itemName}
                                onChange={handleInputChange}
                                required
                                className='w-full rounded-xl border-0 py-1.5 pl-8 text-gray-900 ring-1 ring-gray-300 focus:ring-2 focus:ring-indigo-600 mb-2'
                            />
                        </div>
                        <div>
                            <label>Quantity:</label>
                            <input
                                type='number'
                                name='quantity'
                                value={editItem.quantity}
                                onChange={handleInputChange}
                                required
                                className='w-full rounded-xl border-0 py-1.5 pl-8 text-gray-900 ring-1 ring-gray-300 focus:ring-2 focus:ring-indigo-600 mb-2'
                            />
                        </div>
                        <div className='mb-2'>
                            <label>Select Weight:</label>
                            <select
                                name='category'
                                value={editItem.category}
                                onChange={handleInputChange}
                                required
                                className='w-full rounded-xl border-0 py-1.5 pl-8 text-gray-900 ring-1 ring-gray-300 focus:ring-2 focus:ring-indigo-600'
                            >
                                <option value="" disabled>Select weight</option>
                                {categories.map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>
                        <div className='mb-2'>
                            <label>Food Category:</label>
                            <select
                                name='foodCat'
                                value={editItem.foodCat}
                                onChange={handleInputChange}
                                required
                                className='w-full rounded-xl border-0 py-1.5 pl-8 text-gray-900 ring-1 ring-gray-300 focus:ring-2 focus:ring-indigo-600'
                            >
                                <option value='' disabled>Select category</option>
                                {foodCategories.map(c => (
                                    <option key={c} value={c}>{c}</option>
                                ))}
                            </select>
                        </div>
                        <button 
                            onClick={handleEditSubmit} 
                            className='w-60 h-10 mt-2 mb-2 text-center text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-full border border-gray-200 hover:bg-orange-500 hover:text-white focus:z-10 focus:ring-4 focus:ring-gray-100'>
                            Edit
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

export default EditSuppliesButton;
