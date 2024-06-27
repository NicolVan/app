import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './app/store';
import {AuthProvider} from './components/AuthProvider';
import Navbar from './components/Navbar';
import Login from './components/Login';
import Register from './components/Register';
import Recipes from './components/Recipes';
import Home from './components/Home'; 
import Favorite from './components/Favorite';

function App() {
    return (
        <Provider store={store}>
            <AuthProvider>
                <Router>
                    <Navbar />
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/profile" element={<Recipes />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/login" element={<Login />} />
                        <Route path='/favorite' element={<Favorite/>}/>
                    </Routes>
                </Router>
            </AuthProvider>
        </Provider>
    );
}

export default App;
