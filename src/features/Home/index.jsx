import React, { useEffect } from 'react';
import { axios } from '~/apis';
import { API_ROUTES } from '~/app/constants';

const HomePage = () => {
  useEffect(() => {
    (async () => {
      const res = await axios.get(API_ROUTES['get-dentists']);
      console.log({ res });
    })();
  }, []);

  return <div className="">HomePage</div>;
};

export default HomePage;
