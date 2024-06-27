import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from './AuthProvider';
import { FaTimes, FaBars } from 'react-icons/fa';
import logo from './image/logo .png'; 

function Navbar() {
    const { isAuthenticated, logout } = useContext(AuthContext);
    const handleLogout = () => {
        logout();
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
                    <Link to='/'>Search Recipe</Link>
                    {isAuthenticated ? (
                        <>
                            <Link to='/profile'>Profile</Link>
                            <Link to='/store'>Store</Link>
                            <button onClick={handleLogout}>Log Out</button>
                        </>
                    ) : (
                        <>
                            <Link to='/register'>Register</Link>
                            <Link to='/login'>Login</Link>
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
                            <Link to='/' className='hover:text-gray-300' onClick={handleToggle}>Search Recipe</Link>
                        </li>
                        {isAuthenticated ? (
                            <>
                                <li>
                                    <Link to='/profile' className='hover:text-gray-300' onClick={handleToggle}>Profile</Link>
                                </li>
                                <li>
                                    <Link to='/shop-list' className='hover:text-gray-300' onClick={handleToggle}>Shop List</Link>
                                </li>
                                <li>
                                    <Link to='/supplies' className='hover:text-gray-300' onClick={handleToggle}>Supplies</Link>
                                </li>
                                <li>
                                    <button onClick={() => { handleLogout(); handleToggle(); }} className='hover:text-gray-300'>Log Out</button>
                                </li>
                            </>
                        ) : (
                            <>
                                <li>
                                    <Link to='/register' className='hover:text-gray-300' onClick={handleToggle}>Sign Up</Link>
                                </li>
                                <li>
                                    <Link to='/login' className='hover:text-gray-300' onClick={handleToggle}>Log In</Link>
                                </li>
                            </>
                        )}
                    </ul>
                </div>
            )}
        </nav>
    );
}

export default Navbar;
