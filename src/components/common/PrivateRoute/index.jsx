import React from 'react';
import { axios } from '~/apis';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../../authSlice';
import { useNavigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {

  // handle authentication here
  const navigate = useNavigate();
  const dispatch = useDispatch();
  var refreshToken = localStorage.getItem('refreshToken');

  var res =  axios.post('/getProfile', refreshToken);
  console.log({ res });
  
  if(res.User === null){
    navigate('/login');
  } else {
    dispatch(loginSuccess( {...res.User} ));
    return <div>{children}</div>;
  }

};

export default PrivateRoute;
