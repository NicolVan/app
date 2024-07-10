import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './app/store';
import { AuthProvider, AuthContext } from './components/AuthProvider';
import Navbar from './components/Navbar';
import Login from './components/Login';
import Register from './components/Register';
import Home from './components/Home';
import AddRecipe from './components/AddRecipe';
import GetSaveRecipe from './components/GetSaveRecipe';
import AddSupplies from './components/suplicecomponent/AddSupplies';
import GetSupplies from './components/suplicecomponent/GetSupplies';



const MainContent = () => {
  const { loading } = useContext(AuthContext);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Routes>
      <Route path='/' element={<GetSaveRecipe />} />
      <Route path='/addsupplies' element={<AddSupplies />} />
      <Route path='/supplies' element={<GetSupplies />} />
      <Route path='/profile' element={<Home />} />
      <Route path='/add-recipe' element={<AddRecipe />} />
      <Route path='/register' element={<Register />} />
      <Route path='/login' element={<Login />} />
    </Routes>
  );
};

function App() {
  return (
    <Provider store={store}>
      <AuthProvider>
        <Router>
          <Navbar />
          <MainContent />
        </Router>
      </AuthProvider>
    </Provider>
  );
}

export default App;

