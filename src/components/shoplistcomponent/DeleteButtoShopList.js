import React, { useState } from 'react';
import axios from 'axios';
import { API_URL } from '../constants';
import trash from '../image/trash.png';

const DeleteButtonShopList = ({ listId, itemId, onDelete }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      const response = await axios.delete(`${API_URL}/shoppingList/${listId}/item/${itemId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.status === 200) {
        console.log('Delete response', response);
        alert('The item has been deleted');
        onDelete(itemId);
      }
    } catch (error) {
      console.error('Error deleting item:', error);
      alert('Error deleting item: ' + (error.response?.data?.message || error.message));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='rtl'>
      <button
        onClick={handleDelete}
        className='w-10 h-10 bg-white rounded-full shadow flex justify-center items-center border border-gray-200'
        aria-label='Delete item'
        disabled={isLoading}
      >
        <img
          src={trash}
          alt='trash'
          className='w-5 h-5'
        />
      </button>
      {isLoading && <span className='ml-2 text-sm text-gray-500'>Deleting...</span>}
    </div>
  );
};

export default DeleteButtonShopList;
