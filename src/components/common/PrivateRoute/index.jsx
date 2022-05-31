import React from 'react';

const PrivateRoute = ({ children }) => {
  console.log(123);

  // handle authentication here
  return <div>{children}</div>;
};

export default PrivateRoute;
