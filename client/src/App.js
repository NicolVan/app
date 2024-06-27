import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './app/store';
import PrivateRoute from './components/PrivateRoute';
import Login from './components/Login';
import Register from './components/Register';
import Recipes from './components/Recipes';
import Favorites from './components/Favorites';

function App() {
  return (
    <Provider store={store}>
      <Router>
          <Login/>
          <Register/>
          <PrivateRoute path="/recipes" component={Recipes} />
          <PrivateRoute path="/favorites" component={Favorites} />
      </Router>
    </Provider>
  );
}

export default App;
