import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { API_URL } from './constants';
import { AuthContext } from './AuthProvider';

const ShopList = () => {
  const [shoppingLists, setShoppingLists] = useState([]);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchShoppingLists = async () => {
      if (user) {
        try {
          const response = await axios.get(`${API_URL}/shoppingList?userId=${user._id}`);
          setShoppingLists(response.data);
        } catch (error) {
          console.error('Error fetching shopping lists:', error);
        }
      }
    };

    fetchShoppingLists();
  }, [user]);

  return (
    <>
      <div className='min-h-screen bg-orange-100 py-6 flex flex-col justify-center sm:py-12'>
        <div className='relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20'>
          <div className='rounded-lg px-8 py-6 mx-auto my-8 max-w-3xl grid text-center'>
            <h2>Your Shopping Lists</h2>
            {shoppingLists.map((list, index) => (
              <div key={index}>
                <h3>List {index + 1}</h3>
                <ul>
                  {list.items.map((item, idx) => (
                    <li key={idx}>
                      {item.name} (Quantity: {item.quantity})
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default ShopList;
