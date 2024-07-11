import React, { useEffect, useState } from 'react';
import Popup from 'reactjs-popup';

const Favorite = () => {
    const [savedRecipes, setSavedRecipes] = useState([]);
    const [openPopupIndex, setOpenPopupIndex] = useState(null);

    useEffect(() => {
        fetchSavedRecipes();
    }, []);

    const fetchSavedRecipes = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/savedrecipes/getsaverecipes', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            if (!response.ok) {
                throw new Error('Failed to fetch saved recipes');
            }
            const data = await response.json();
            setSavedRecipes(data); 
        } catch (error) {
            console.error('Error fetching saved recipes:', error);
        }
    };

    const handleShowRecipe = (index) => {
        setOpenPopupIndex(index);
    };

    return (
      <div className='min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12'>
      <div className='relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20'>
        <div className='rounded-lg px-8 py-6 mx-auto my-8 max-w-3xl grid text-center'>
            <h2 className='text-2xl font-bold mb-4'> Favorite Recipe</h2>
            {savedRecipes.length === 0 ? (
                <p>Žádné uložené recepty</p>
            ) : (
                    <div className='flex justify-center rounded-xl text-center'>
                        {savedRecipes.map((recipe, index) => (
                            <div key={recipe._id} className='grid mt-2 ml-2 justify-items-center text-gray-700 bg-white shadow-xl w-96 rounded-xl bg-clip-border border border-gray-200 '>
                                <h2 className='text-xl font-bold'>{recipe.name}</h2>
                                <p>Categories: {recipe.categories.join(', ')}</p>
                                <div>
                                    <img 
                                        src={recipe.imageUrl} 
                                        alt={recipe.name} 
                                        className='w-40 h-40 justify-items-center object-cover' 
                                    />
                                </div>
                                <div>
                                    <p>Prep Time: {recipe.prepTime} minutes</p>
                                    <p>Cook Time: {recipe.cookTime} minutes</p>
                                    <p>Servings: {recipe.servings}</p>
                                    <p>Author: {recipe.author}</p>
                                </div>
                                <div>
                                    <button
                                        className='w-60 h-10 mt-2 mb-5 text-center text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-full border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100'
                                        onClick={() => handleShowRecipe(index)}
                                    >
                                        Show Recipe
                                    </button>
                                    {openPopupIndex === index && (
                                        <Popup open={true} modal onClose={() => setOpenPopupIndex(null)}>
                                            <div className='relative p-4 h-[900px] w-[700px] bg-gray-100 overflow-scroll shadow-xl rounded-lg'>
                                                <div className='p-4 h-auto w-[650px] bg-white rounded-lg shadow-xl'>
                                                    <button onClick={() => setOpenPopupIndex(null)} className='absolute top-2 right-2 text-gray-600 hover:text-gray-900 focus:outline-none'>
                                                        <svg xmlns='http://www.w3.org/2000/svg' className='h-6 w-6' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                                                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
                                                        </svg>
                                                    </button>
                                                    <div className='mb-2'>
                                                        <h3 className='font-bold'>Ingredients: </h3>
                                                        <ul className='list-none'>
                                                            {recipe.ingredients.map((ingredient, index) => (
                                                                <li key={index} className='flex items-center space-x-2'>
                                                                    <input 
                                                                        type="checkbox" 
                                                                        id={`ingredient-${index}`} 
                                                                        name={`ingredient-${index}`} 
                                                                        className='form-checkbox' 
                                                                    />
                                                                    <label 
                                                                        htmlFor={`ingredient-${index}`} 
                                                                        className='text-gray-700'>
                                                                        {ingredient.quantity} {ingredient.name}
                                                                    </label>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                    <div className='mb-2'>
                                                        <h3 className='font-bold'>Instructions: </h3>
                                                        <p>{recipe.instructions}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </Popup>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
            )}
        </div>
      </div>
    </div>
    );
};

export default Favorite;
