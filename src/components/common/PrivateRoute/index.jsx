import React from 'react';

const PrivateRoute = ({ children }) => {
  // handle authentication here
  return <div>{children}</div>;
};

export default PrivateRoute;
