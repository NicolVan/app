import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { API_URL } from './constants';
import { AuthContext } from './AuthProvider';
import EditButtonShopList from './shoplistcomponent/EditButtonShopList';
import DeleteShoppingListButton from './shoplistcomponent/DeleteShoppingListButton';
import DeleteButtonShopList from './shoplistcomponent/DeleteButtoShopList';

const ShopList = () => {
  const [shoppingLists, setShoppingLists] = useState([]);
  const { user } = useContext(AuthContext);
  const [checkedItems, setCheckedItems] = useState({});

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

  const handleCheckboxChange = (listIndex, itemIndex) => {
    setCheckedItems(prevState => ({
      ...prevState,
      [`${listIndex}-${itemIndex}`]: !prevState[`${listIndex}-${itemIndex}`]
    }));
  };

  const handleEdit = (listId, updatedItem) => {
    setShoppingLists(prevLists =>
      prevLists.map(list =>
        list._id === listId
          ? {
              ...list,
              items: list.items.map(item =>
                item._id === updatedItem._id ? updatedItem : item
              )
            }
          : list
      )
    );
  };

  const handleDeleteItem = (listId, itemId) => {
    setShoppingLists(prevLists =>
      prevLists.map(list =>
        list._id === listId
          ? {
              ...list,
              items: list.items.filter(item => item._id !== itemId)
            }
          : list
      )
    );
  };
  
  const handleDeleteList = (listId) => {
    setShoppingLists(prevLists =>
      prevLists.filter(list => list._id !== listId)
    );
  };

  return (
    <div className='min-h-screen bg-orange-100 py-6 flex flex-col justify-center sm:py-12'>
      <div className='relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20 w-auto'>
        <div className='rounded-lg px-8 py-6 mx-auto my-8 grid text-center'>
          <h2 className='text-2xl font-bold mb-4'>Your Shopping Lists</h2>
          <div className='grid grid-cols-3 space-x-4 justify-center rounded-xl text-center'>
            {shoppingLists.map((list, listIndex) => (
              <div key={listIndex} className='relative grid mt-2 ml-2 justify-items-center text-gray-700 bg-white shadow-xl w-96 rounded-xl bg-clip-border border border-gray-200'>
                <h3 className='text-xl font-bold'>Shop list {listIndex + 1}</h3>
                <DeleteShoppingListButton
                  listId={list._id}
                  onDelete={handleDeleteList}
                  className='absolute top-2 right-2'
                />
                <div className='flex'>
                  <div className='grid grid-cols-1'>
                    {list.items.map((item, itemIndex) => (
                      <div key={itemIndex} className='flex items-center justify-between space-x-4 px-4 py-2'>
                        <div className='flex items-center space-x-2'>
                          <input
                            type="checkbox"
                            id={`item-${listIndex}-${itemIndex}`}
                            checked={checkedItems[`${listIndex}-${itemIndex}`] || false}
                            onChange={() => handleCheckboxChange(listIndex, itemIndex)}
                          />
                          <label
                            htmlFor={`item-${listIndex}-${itemIndex}`}
                            className={checkedItems[`${listIndex}-${itemIndex}`] ? 'line-through' : ''}
                          >
                            {item.quantity} {item.name}
                          </label>
                        </div>
                        <div className='flex items-center space-x-2'>
                          <EditButtonShopList
                            listId={list._id}
                            item={item}
                            onEdit={handleEdit}
                          />
                          <DeleteButtonShopList
                          listId={list._id}
                          itemId={item._id}
                          onDelete={() => handleDeleteItem(list._id, item._id)}
                        />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};  

export default ShopList;
