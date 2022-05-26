import React from 'react';
import { useSelector } from 'react-redux';
import { selectLoggedUser } from '../Auth/authSlice';

const HomePage = () => {
  const { payload: userInfo } = useSelector(selectLoggedUser) || {};
  console.log({ userInfo });
  return <div className="">HomePage</div>;
};

export default HomePage;
