import React, { useCallback, useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from './AuthProvider';
import { API_URL } from './constants'
import DeleteSuppliesButton from './suplicecomponent/DeleteSuppliesButton';
import EditSuppliesButton from './suplicecomponent/EditSuppliesButton';

const GetSupplies = () => {
    const [items, setItems] = useState([]);
    const [search, setSearch] = useState('');
    const [categories, setCategories] = useState([]);
    const { user } = useContext(AuthContext); 
    const cat = ['Vegetable','Fruit','Meat','Fish','Oil','Spice','Dairy','Pastries',
                 'Cereals','Legumes','Sweets','Pasta','Seafood','Tea','Coffee'];

    const fetchSupplies = useCallback(async () => {
        if (!user) return;
        try {
            const response = await axios.get(`${ API_URL }/supplies/getsupplies`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                params: {
                    search,
                    foodCat: categories.join(','),
                },
            });
            console.log('Fetched supplies:', response.data);
            setItems(response.data);
        } catch (error) {
            console.error('Error fetching supplies:', error);
        }
    }, [user, search, categories]);

    useEffect(() => {
        fetchSupplies();
    }, [fetchSupplies]);

    const handleSearchSupplies = () => {
        fetchSupplies();
    };

    const handleCategoryClick = (category) => {
        setCategories((prevCategories) => {
            if (prevCategories.includes(category)) {
                return prevCategories.filter((cat) => cat !== category);
            } else {
                return [...prevCategories, category];
            }
        });
    };
    
    const handleDelete = (id) => {
        setItems(items.filter(item => item._id !== id));
    };

    const handleEdit = (id, updatedItem) => {
        setItems(items.map(item => item._id === id ? updatedItem : item));
    };

    return (
        <div className='min-h-screen bg-orange-100 py-6 flex flex-col justify-center sm:py-12'>
            <div className='relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20'>
                <div className='rounded-lg px-8 py-6 mx-auto my-8 max-w-3xl grid text-center'>
                    <h2 className='text-2xl font-bold mb-4'>Supplies</h2>
                    <input
                        type='text'
                        placeholder='Search by name'
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className='justify-items-center text-center w-[700px] rounded-xl mt-5 border-0 py-1.5 pl-8 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-200 sm:text-sm sm:leading-6'
                    />
                    <div className='grid grid-cols-4 gap-5 justify-items-center mt-5'>
                        {cat.map((category) => (
                            <button
                                key={category}
                                onClick={() => handleCategoryClick(category)}
                                style={{
                                    backgroundColor: categories.includes(category) ? 'orange' : 'white',
                                }}
                                className='grid items-center justify-center py-2.5 w-24 h-32 text-center text-sm font-medium text-gray-900 focus:outline-none rounded-xl border border-gray-200 hover:bg-gray-100 hover:text-orange-500 focus:z-10 focus:ring-4 focus:ring-gray-100'
                                ><img
                                    src={`food/${category.toLowerCase().replace(/ /g, '_')}.jpg`}
                                    alt={category}
                                    className='w-full h-24 object-cover object-center rounded-lg mr-4'
                                    />
                                {category}
                            </button>
                        ))}
                    </div>
                        <button
                            onClick={handleSearchSupplies}
                            className='w-60 h-10 mt-2 mb-2 text-center text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-full border border-gray-200 hover:bg-orange-500 hover:text-white focus:z-10 focus:ring-4 focus:ring-gray-100'
                            >Search
                        </button>
                    </div>
                    <div className='grid'>
                        <div className='justify-center'>
                            {items.length === 0 ? (
                            <p className='text-black'>No supplies found</p>
                            ) : (
                            <ul> 
                                {items.map((item) => (
                                    <div key={item._id} className='relative border p-4 m-2 rounded-lg'>
                                        <p> {item.itemName} {item.quantity} {item.category}</p>
                                        <div className='flex justify-end space-x-2 mt-2'>
                                            <EditSuppliesButton
                                                id={item._id}
                                                item={item}
                                                onEdit={handleEdit}
                                                className='w-10 h-10 bg-white rounded-full shadow flex justify-center items-center'
                                            />
                                            <DeleteSuppliesButton
                                                id={item._id}
                                                onDelete={handleDelete}
                                                className='w-10 h-10 bg-white rounded-full shadow flex justify-center items-center border border-gray-200'
                                            />
                                        </div>
                                    </div>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GetSupplies;
