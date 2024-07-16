import React, { useEffect, useState, useContext } from 'react';
import Popup from 'reactjs-popup';
import { API_URL } from './constants';
import UnsaveRecipeButton from './recipecomponent/UnsaveRecipeButton';
import { AuthContext } from './AuthProvider';
import axios from 'axios';

const Favorite = () => {
    const { user } = useContext(AuthContext);
    const [savedRecipes, setSavedRecipes] = useState([]);
    const [openPopupIndex, setOpenPopupIndex] = useState(null);
    const [categoryFilter, setCategoryFilter] = useState('');
    const [nameFilter, setNameFilter] = useState('');
    const [selectedIngredients, setSelectedIngredients] = useState([])
    const categories = ['Soup', 'Dessert', 'Lunch', 'Dinner', 'Meal', 'Vegan', 'Pasta', 'Salad', 'Cake', 'Breakfast'];

    useEffect(() => {
        const fetchSavedRecipes = async () => {
        const userId = user?._id
        try {
         const queryParams = new URLSearchParams();
         queryParams.append('userId', userId);
         if (categoryFilter) {
           queryParams.append('categories', categoryFilter);
         }
         if (nameFilter) {
           queryParams.append('name', nameFilter);
         }
        const storeUser = JSON.parse(localStorage.getItem('user'));
        if(storeUser){
            queryParams.append('userId', storeUser._id);
        }
        
        const response = await fetch(`${API_URL}/savedrecipes/getsaverecipes?${queryParams.toString()}`, {
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

    fetchSavedRecipes();
  }, [categoryFilter, nameFilter])

  const handleCategoryClick = (category) => {
    setCategoryFilter(category === categoryFilter ? '' : category);
};

  const handleNameFilterChange = (event) => {
      setNameFilter(event.target.value);
  };

  const handleShowRecipe = (index) => {
      setOpenPopupIndex(index);
  };

  const handleUnsaveRecipe = (recipeId) => {
    console.log('Unsaving recipe locally:', recipeId);
    setSavedRecipes((prev) => {
        const updatedRecipes = prev.filter(recipe => recipe._id !== recipeId); 
        if (user) {
            localStorage.setItem(`savedRecipes_${user._id}`, JSON.stringify(updatedRecipes));
        }
        return updatedRecipes; 
    });
};

const handleCheckboxChange = (ingredient) => {
    setSelectedIngredients((prev) =>
      prev.includes(ingredient)
        ? prev.filter((item) => item !== ingredient)
        : [...prev, ingredient]
    );
  };

  const generateShoppingList = async () => {
    const shoppingList = savedRecipes.reduce((acc, recipe) => {
      recipe.ingredients.forEach(ing => {
        if (selectedIngredients.includes(ing.name)) {
          acc.push({
            name: ing.name,
            quantity: 1, 
            purchased: false,
          });
        }
      });
      return acc;
    }, []);
  
    if (user) {
      try {
        await axios.post(`${API_URL}/shoppingList/addshoplist`, {
          userId: user._id,
          items: shoppingList,
        });
        alert(`Shopping List:\n${shoppingList.map(item => `${item.name} (Quantity: ${item.quantity})`).join('\n')}`);
      } catch (error) {
        console.error('Error adding shopping list:', error);
        alert('Failed to add shopping list. Please try again.');
      }
    } else {
      alert('Please log in to create a shopping list.');
    }
  };

    return (
      <div className='min-h-screen bg-orange-100 py-6 flex flex-col justify-center sm:py-12'>
          <div className='relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20'>
              <div className='rounded-lg px-8 py-6 mx-auto my-8 max-w-3xl grid text-center'>
                  <h2 className='text-2xl font-bold mb-4'>Favorite Recipe</h2>
                  <div className='filter-form'>
                  <input
                    type='text'
                    placeholder='Search by name'
                    value={nameFilter}
                        onChange={handleNameFilterChange}
                        className='justify-items-center text-center w-[700px] rounded-xl mt-5 border-0 py-1.5 pl-8 text-orange-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-200 sm:text-sm sm:leading-6'
                     />
                    
                    <div className='grid grid-cols-5 gap-5 justify-items-center mt-5'>
                {categories.map((category) => (
                    <button
                        key={category}
                        onClick={() => handleCategoryClick(category)}
                        style={{
                            backgroundColor: categoryFilter === category ? 'orange' : 'white',
                        }}
                        className='grid items-center justify-center py-2.5 w-32 h-48 text-center text-sm font-medium text-gray-900 focus:outline-none rounded-xl border border-gray-200 hover:bg-gray-100 hover:text-orange-500 focus:z-10 focus:ring-4 focus:ring-gray-100'
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

            </div>
                  {savedRecipes.length === 0 ? (
                      <p>Recipe not found</p>
                  ) : (
                      <div className='flex justify-center rounded-xl text-center'>
                          {savedRecipes.map((recipe, index) => (
                              <div key={recipe._id} className='grid mt-2 ml-2 justify-items-center text-gray-700 bg-white shadow-xl w-80 rounded-xl bg-clip-border border border-gray-200'>
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
                                      <button
                                          className='w-32 h-10 mt-2 mb-5 text-center text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-full border border-gray-200 hover:bg-orange-500 hover:text-white focus:ring-4 focus:ring-gray-100'
                                          onClick={() => handleShowRecipe(index)}
                                      > Show Recipe
                                      </button>
                                      <UnsaveRecipeButton 
                                        recipeId={recipe._id}
                                        user={user}
                                        handleUnsaveRecipe={handleUnsaveRecipe}
                                    />
                                        {openPopupIndex === index && (
                                          <>
                                              <div className="fixed inset-0 bg-black bg-opacity-50 z-40"></div>
                                              <Popup open={true} onClose={() => setOpenPopupIndex(null)}>
                                                  <div className='relative p-4 h-[900px] w-[700px] bg-gray-100 overflow-scroll shadow-xl rounded-lg'>
                                                      <div className='p-4 h-auto w-[650px] bg-white rounded-lg shadow-xl'>
                                                          <button onClick={() => setOpenPopupIndex(null)} className='absolute top-2 right-2 text-gray-600 hover:text-gray-900 focus:outline-none'>
                                                              <svg xmlns='http://www.w3.org/2000/svg' className='h-6 w-6' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                                                                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
                                                              </svg>
                                                          </button>
                                                          <div className='mb-2'>
                                                              <h3 className='font-bold'>Information:</h3>
                                                              <p>Prep Time: {recipe.prepTime} minutes</p>
                                                              <p>Cook Time: {recipe.cookTime} minutes</p>
                                                              <p>Servings: {recipe.servings}</p>
                                                              <p>Author: {recipe.author}</p>
                                                          </div>
                                                          <div className='mb-2'>
                                                              <h3 className='font-bold'>Ingredients: </h3>
                                                              <ul className='list-none'>
                                                                  {recipe.ingredients.map((ingredient, index) => (
                                                                      <li key={index} className='flex items-center space-x-2'>
                                                                          <input 
                                                                              type="checkbox" 
                                                                              id={`ingredient-${index}`} 
                                                                              name={`ingredient-${index}`} 
                                                                              checked={selectedIngredients.includes(ingredient.name)}
                                                                            onChange={() => handleCheckboxChange(ingredient.name)}
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
                                                          <button onClick={generateShoppingList}
                                                            className='w-60 h-10 mt-2 mb-5 text-center text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-full border border-gray-200 hover:bg-orange-500 hover:text-white focus:z-10 focus:ring-4 focus:ring-gray-100'
                                                            >Generate Shopping List</button>
                                                          <div className='mb-2'>
                                                              <h3 className='font-bold'>Instructions: </h3>
                                                              <p>{recipe.instructions}</p>
                                                          </div>
                                                      </div>
                                                  </div>
                                              </Popup>
                                          </>
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
