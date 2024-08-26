import React from 'react';
import SaveRecipe from './recipecomponent/SaveRecipe';

const GetSaveRecipe = ({ user }) => {
  return (
    <div>
      <SaveRecipe user={user} />
    </div>
  );
};

export default GetSaveRecipe;
