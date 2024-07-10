import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from './AuthProvider';

const Home = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const navigateToAddRecipe = () => {
    navigate('/add-recipe');
  };
 
  const navigateAddSupplies =() => {
    navigate('/addsupplies');
  }
  if (!user) {
    return <div>Please Login</div>;
  }

  return (
    <div>
      <div className='w-full h-16'>
        <h2 className='text-2xl ml-5 mt-10'>Welcome  {user.username}!</h2>
      </div>
      <div className='grid grid-cols-1 divide-y divide-solid divide-gray-400 hover:divide-blue-400'>
        <button 
          className='ml-10 text-xl border-gray-200 w-full text-left'
          onClick={navigateToAddRecipe}>Add Recipe</button>
        <button
          className='ml-10 text-xl border-gray-200 w-full text-left'
          onClick={navigateAddSupplies}>Add Supplies
        </button>
      </div>
    </div>
  );
};

export default Home;
