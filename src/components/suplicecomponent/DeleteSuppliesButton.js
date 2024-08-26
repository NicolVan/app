import React from 'react';
import { API_URL } from '../constants'
import axios from 'axios';
import trash from '../image/trash.png'

const DeleteSuppliesButton = ({ id, onDelete }) => {
  const handleDelete = async () => {
    try {
      const response =  await axios.request({
        url: `${ API_URL }/supplies/${id}`,
        method: 'Delete',
        headers: {
          'Authorization' : `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if(response.status === 200) {
        console.log('Delete response', response);
        alert('The item has been deleted')
        onDelete(id)
      }
    } catch (error) {
      alert('Error deleting supply');
  }
  }
    return(
        <>
          <div className='rtl'>
            <button onClick={handleDelete}
            className='w-10 h-10 bg-white rounded-full shadow flex justify-center items-center border border-gray-200'>
             <img 
              src={trash} 
              alt='trash'
              className='w-5 h-5' 
             />
            </button>
          </div>
        </>
    )
}
export default DeleteSuppliesButton;