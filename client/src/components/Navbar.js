import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from './AuthProvider';
import { FaTimes, FaBars } from 'react-icons/fa';
import logo from './image/logo.png';

function Navbar() {
  const { isAuthenticated, logout, user, message } = useContext(AuthContext);
  const navigate = useNavigate();
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const [menuOpen, setMenuOpen] = useState(false);

  const handleToggle = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <nav className='bg-white border-gray-200 font-sans py-2 border-b-2 border-gray-100'>
      <div className='container mx-auto flex justify-between items-center'>
        <Link to='/' className='text-2xl font-bold'>
          <img src={logo} alt='logo' className='w-20 h-20' />
        </Link>
        <div className='hidden md:flex space-x-4'>
          <Link to='/' className='text-lg font-bold hover:text-orange-500'>
            Search Recipe
          </Link>
          {isAuthenticated ? (
            <>
              <Link
                to='/favorite'
                className='text-lg font-bold hover:text-orange-500'
              >
                Favorite
              </Link>
              <Link
                to='/supplies'
                className='text-lg font-bold hover:text-orange-500'
              >
                Supplies
              </Link>
              <Link
                to='/shopList'
                className='text-lg font-bold hover:text-orange-500'
              >
                ShopList
              </Link>
              <Link
                to='/profile'
                className='text-lg font-bold hover:text-orange-500'
              >
                {user.username}'s Profile 
              </Link>
              <button
                onClick={handleLogout}
                className='text-lg font-bold hover:text-orange-500'
              >
                Log Out
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => navigate('/login')}
                className='text-lg font-bold hover:text-orange-500'
              >
                Login
              </button>
              <Link
                to='/register'
                className='text-lg font-bold hover:text-orange-500'
              >
                Register
              </Link>
            </>
          )}
        </div>
        <div className='md:hidden'>
          <button onClick={handleToggle} className='focus:outline-none'>
            {menuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>
      </div>
      {menuOpen && (
        <div className='md:hidden'>
          <ul className='grid justify-items-center space-y-4 py-4'>
            <li>
              <Link
                to='/'
                className='hover:text-orange-500'
                onClick={handleToggle}
              >
                Search Recipe
              </Link>
            </li>
            {isAuthenticated ? (
              <>
                <li>
                  <Link
                    to='/favorite'
                    className='hover:text-orange-500'
                    onClick={handleToggle}
                  >
                    Favorite
                  </Link>
                </li>
                <li>
                  <Link
                    to='/supplies'
                    className='hover:text-orange-500'
                    onClick={handleToggle}
                  >
                    Supplies
                  </Link>
                </li>
                <li>
                  <Link
                    to='/ShopList'
                    className='hover:text-orange-500'
                    onClick={handleToggle}
                  >
                    Shop List
                  </Link>
                </li>
                <li>
                  <Link
                    to='/profile'
                    className='hover:text-orange-500'
                    onClick={handleToggle}
                  >
                    {user.username}'s Profile
                  </Link>
                </li>
                <li>
                  <button
                    onClick={() => {
                      handleLogout();
                      handleToggle();
                    }}
                    className='hover:text-orange-500'
                  >
                    Log Out
                  </button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link
                    to='/register'
                    className='hover:text-orange-500'
                    onClick={handleToggle}
                  >
                    Sign Up
                  </Link>
                </li>
                <li>
                  <Link
                    to='/login'
                    className='hover:text-orange-500'
                    onClick={handleToggle}
                  >
                    Log In
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      )}
      
      {message && (
        <div className='bg-red-200 text-red-800 py-2 px-4 my-2'>
          {message}
        </div>
      )}
    </nav>
  );
}

export default Navbar;
