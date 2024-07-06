import React, { useContext } from 'react';
import GetSaveRecipe from './GetSaveRecipe'; 
import { AuthContext } from '../components/AuthProvider'; 

const Component = () => {
  const { user } = useContext(AuthContext);

  return (
    <div>
      <GetSaveRecipe user={user} />
    </div>
  );
};

export default Component;
