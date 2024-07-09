import React, { useState } from 'react';
import axios from 'axios';
import trash from './image/trash.png';

const AddRecipe = () => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState([]);
  const [instructions, setInstructions] = useState('');
  const [prepTime, setPrepTime] = useState('');
  const [cookTime, setCookTime] = useState('');
  const [servings, setServings] = useState('');
  const [author, setAuthor] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [ingredients, setIngredients] = useState([{ name: '', quantity: '' }]);

  const categories = ['Breakfast', 'Lunch', 'Dinner', 'Dessert', 'Snack'];

  const addRecipe = () => {
    if (!name || !category || !instructions || !prepTime || !cookTime || !servings || !author || !imageUrl || ingredients.some(ing => !ing.name || !ing.quantity)) {
      alert('Please fill out all fields correctly.');
      return;
    }

    const newRecipe = {
      name,
      category,
      instructions,
      prepTime: parseInt(prepTime),
      cookTime: parseInt(cookTime),
      servings: parseInt(servings),
      author,
      imageUrl,
      ingredients
    };

    axios.post('http://localhost:5000/api/recipes', newRecipe)
      .then(response => {
        console.log('Recipe added successfully:', response.data);
        alert('Recipe added Succesfully')
        clearForm();
        
      })
      .catch(error => console.error('Error adding recipe:', error));
  };

  const handleIngredientChange = (index, field, value) => {
    const newIngredients = [...ingredients];
    newIngredients[index][field] = value;
    setIngredients(newIngredients);
  };

  const addIngredient = () => {
    setIngredients([...ingredients, { name: '', quantity: '' }]);
  };

  const removeIngredient = (index) => {
    const newIngredients = ingredients.filter((_, i) => i !== index);
    setIngredients(newIngredients);
  };

  const renderFormInput = (placeholder, value, setter, type = 'text') => (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={e => setter(e.target.value)}
      className='w-full justify-items-center text-center w-auto rounded-xl border-0 py-1.5 pl-8 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 mb-2'
    />
  );

  const clearForm = () => {
    setName('');
    setCategory([]);
    setInstructions('');
    setPrepTime('');
    setCookTime('');
    setServings('');
    setAuthor('');
    setImageUrl('');
    setIngredients([{ name: '', quantity: '' }]);
  };

  return (
    <div className='bg-gray-200 h-screen'>
      <div className='border rounded-lg px-8 py-6 mx-auto max-w-2xl bg-white'>
          <h2 className='text-2xl text-center'>Share Recipe</h2>
          <p className='mt-5 '>Name recipe:</p>
          {renderFormInput('Name', name, setName)}
          <p className=''>Dish type:</p>
          <select
            multiple
            value={category}
            onChange={e => setCategory(Array.from(e.target.selectedOptions, option => option.value))}
            className='w-full justify-items-center text-center w-auto rounded-xl border-0 py-1.5 pl-8 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 mb-2'
            >{categories.map(cat => (
            < option key={cat} value={cat}>{cat}</option>
          ))}
          </select>
          <p className=''>Preparation Time:</p>
          {renderFormInput('45 min', prepTime, setPrepTime, 'number')}'
          <p className=''>Cook time:</p>
          {renderFormInput('30 min', cookTime, setCookTime, 'number')}
          <p className=''>No. of Servings:</p>
          {renderFormInput('5', servings, setServings, 'number')}
          <p className=''>Author name:</p>
          {renderFormInput('Author', author, setAuthor)}
          <p className=''>Image URL:</p>
          { renderFormInput('Image URL', imageUrl, setImageUrl)}
          <p className=''>Instruction:</p>
        <textarea 
         placeholder='Instructions' 
          value={instructions} 
         onChange={e => setInstructions(e.target.value)} 
         className='justify-items-center text-center w-full h-96 rounded-xl border-0 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 mb-2' 
        />
        <h3 className='font-bold mb-2 text-white'>Ingredients</h3>
          {ingredients.map((ingredient, index) => (
          <div key={index} className='mb-2 flex items-center justify-center w-full'>
            {renderFormInput('milk', ingredient.name, (value) => handleIngredientChange(index, 'name', value))}
            {renderFormInput('2 spoon', ingredient.quantity, (value) => handleIngredientChange(index, 'quantity', value))}
            <button 
              onClick={addIngredient} 
              className='w-10 h-10 me-2 mb-2 rounded-full text-center text-sm font-medium text-gray-900 focus:outline-none bg-white border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700'
            > + </button>
            <button 
              onClick={() => removeIngredient(index)} 
              className='w-10 h-10 me-2 mb-2 text-center bg-white object-center justify-center items-center grid text-sm font-medium text-gray-900 focus:outline-none rounded-full border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700'
              ><img src={trash} className='w-5 h-5 object-center' alt='Remove'/>
            </button>
          </div>
        ))}
        <button 
         onClick={addRecipe} 
         className='justify-center w-full h-10 text-center me-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-full border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700'
         >Add Recipe
         </button>
        </div>
      </div>
    
  );
}

export default AddRecipe;
