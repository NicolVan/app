import React from 'react';
import axios from 'axios';
import { API_URL } from '../constants';

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
    x
    </button>
  );
};

export default DeleteShoppingListButton;
