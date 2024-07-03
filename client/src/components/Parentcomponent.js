import React from 'react';
import GetRecipe from './GetRecipe';

const Parentcomponent = ({ user }) => {
  return (
    <div>
      <GetRecipe user={user} />
    </div>
  );
};

export default Parentcomponent;
