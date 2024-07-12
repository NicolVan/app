import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from './AuthProvider';

const Home = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);
  
  const handleLogout = () => {
      logout();
      navigate('/login')
  };
  const navigateToAddRecipe = () => {
    navigate('/add-recipe');
  };
 
  const navigateAddSupplies =() => {
    navigate('/addsupplies');
  }

 const navigateToFavorite = () => {
  navigate('/favorite');
 }
 const navigateToSupplies=()=> {
  navigate('/supplies');
 }

  return (
    <div>
      <div className='h-screen bg-orange-100 py-6 flex justify-center sm:py-12'>
          <div className='relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20 h-[500px] w-[800px]'>
              <div className='rounded-lg px-8 py-6 mx-auto my-8 max-w-3xl grid text-center'>
        <h2 className='text-2xl font-bold mb-4'>Welcome  {user.username}!</h2>
      </div>
      <div className='grid grid-cols-1'>
        <button 
          className='ml-10 text-xl border-gray-200 w-full text-left underline decoration-solid hover:text-orange-500'
          onClick={navigateToAddRecipe}>Add Recipe
        </button>
        <button
          className='ml-10 text-xl border-gray-200 w-full text-left underline decoration-solid hover:text-orange-500'
          onClick={navigateToFavorite}>Favorite
        </button>
        <button
          className='ml-10 text-xl border-gray-200 w-full text-left underline decoration-solid hover:text-orange-500'
          onClick={navigateAddSupplies}>Add Supplies
        </button>
        <button
          className='ml-10 text-xl border-gray-200 w-full text-left underline decoration-solid hover:text-orange-500'
          onClick={navigateToSupplies}>Supplies
        </button>
        <br/>
        <button onClick={handleLogout} className='text-lg font-bold hover:text-orange-500'>Log Out</button>
      </div>
    </div>
    </div>
    </div>
  );
};

export default Home;
