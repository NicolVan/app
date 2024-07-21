import React from 'react';
import axios from 'axios';
import { API_URL } from '../constants';
import trash from '../image/trash.png';

const DeleteShoppingListButton = ({ listId, onDelete }) => {
  const handleDelete = async () => {
    try {
      const response = await axios.request({
        url: `${API_URL}/shoppingList/${listId}`,
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.status === 200) {
        alert('The shopping list has been deleted');
        onDelete(listId);
      }
    } catch (error) {
      console.error('Error deleting shopping list:', error);
      alert('Error deleting shopping list');
    }
  };

  return (
    <button onClick={handleDelete} className='absolute top-2 right-2 text-black py-2 px-4 rounded'>
    <img src={trash} alt='trash'
      className='w-4 h-4'
    />
    </button>
  );
};

export default DeleteShoppingListButton;
