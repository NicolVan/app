import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import Popup from 'reactjs-popup';


const Recipe = () => {
  const [recipes, setRecipes] = useState([]);
  const [search, setSearch] = useState('');
  const [categories, setCategories] = useState('');
  const cat = ['Soup', 'Dessert', 'Lunch', 'Dinner', 'Meal', 'Vegan', 'Pasta', 'Salad', 'Cake', 'Breakfast'];

  const fetchRecipes = useCallback(async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/recipes', {
        params: {
          search,
          categories,
        },
      });
      setRecipes(response.data);
      console.log('Fetched recipes:', response.data); 
    } catch (error) {
      console.error('Error fetching recipes:', error);
    }
  }, [search, categories]);

  useEffect(() => {
    fetchRecipes();
  }, [fetchRecipes]);

  const handleCategoryClick = (category) => {
    setCategories((prevCategories) => {
      if (prevCategories.includes(category)) {
        return prevCategories.split(',').filter(cat => cat !== category).join(',');
      } else {
        return prevCategories ? `${prevCategories},${category}` : category;
      }
    });
  };

  return (
    <div className='grid mt-2 bg-green-700 text-center justify-center items-center text-gray-700 h-screen'>
      <h1 className='text-2xl font-bold mb-4 text-white'>Recipes</h1>
      <div className='w-full flex flex-col items-center mb-4'>
        <input
          type='text'
          placeholder='Search by name'
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className='justify-items-center text-center w-[700px] rounded-xl mt-5 border-0 py-1.5 pl-8 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-200 sm:text-sm sm:leading-6'
        />
        <div className='grid grid-cols-5 gap-5 justify-items-center mt-5'>
          {cat.map((category) => (
            <button
              key={category}
              onClick={() => handleCategoryClick(category)}
              style={{
                backgroundColor: categories.includes(category) ? 'lightgray' : 'white',
              }}
              className='grid items-center justify-center py-2.5 w-32 h-48 text-center text-sm font-medium text-gray-900 focus:outline-none rounded-xl border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100'
            >
              <img
                src={`picture/${category.toLowerCase().replace(/ /g, '_')}.jpg`}
                alt={category}
                className='w-full h-32 object-cover object-center rounded-lg mr-4'
              />
              {category}
            </button>
          ))}
        </div>
        <button 
          onClick={fetchRecipes}
          className='w-60 h-10 mt-2 mb-2 text-center text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-full border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100'
        >
          Search
        </button>
      </div>
      <div className='items-center'>
        {recipes.length === 0 ? (
          <p className='text-white'>Recipe not found</p>
        ) : (
          <div className='flex flex-wrap justify-center'>
            {recipes.map((recipe,index) => (
              <div key={index} className='grid mt-2 ml-2 justify-items-center text-gray-700 bg-white shadow-md w-96 rounded-xl bg-clip-border'>
                <h2 className='text-xl font-bold'>{recipe.name}</h2>
                <p>Categories: {recipe.category.join(', ')}</p>
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
                <Popup trigger={<button className='w-60 h-10 mt-2 mb-5 text-center text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-full border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100'>
                    Show Recipe
                  </button>} modal>
                    {close => (
                      <div className='p-4 h-full w-[700px] bg-white overflow-scroll'>
                        <button onClick={close} className='absolute top-2 right-2 text-gray-600 hover:text-gray-900 focus:outline-none'>
                          <svg xmlns='http://www.w3.org/2000/svg' className='h-6 w-6' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
                          </svg>
                        </button>
                        <div className='mb-2'>
                          <h3 className='font-bold'>Ingredients:</h3>
                          <ul className='list-disc list-inside'>
                            {recipe.ingredients.map((ingredient, index) => (
                              <li key={index}>{ingredient.quantity} {ingredient.name}</li>
                            ))}
                          </ul>
                        </div>
                        <div className='mb-2'>
                          <h3 className='font-bold'>Instructions:</h3>
                          <p>{recipe.instructions}</p>
                        </div>
                      </div>
                    )}
                  </Popup>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Recipe;

