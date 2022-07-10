import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { axios } from '~/apis';
import { AUTH_KEY, ROLE } from '~/app/constants';
import { init, loginFailed, loginSuccess, selectLoading, selectLoggedUser } from '~/features/Auth/authSlice';
import { getLocalStorage, removeLocalStorage } from '~/utils';
import { Loading } from '..';

const PrivateRoute = ({ role, children }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const loading = useSelector(selectLoading);
  const userInfo = useSelector(selectLoggedUser);

  useEffect(() => {
    (async () => {
      try {
        if (!userInfo) {
          dispatch(init());
          var { refreshToken } = getLocalStorage(AUTH_KEY) || {};

          if (!refreshToken) return navigate('/login');

          var res = await axios.post('/getProfile', { refreshToken });

          if (!res.profileDTO) {
            removeLocalStorage(AUTH_KEY);
            toast.error('You have to login first');
            return navigate('/login');
          }

          if (res.role.toLowerCase() !== ROLE[role]) {
            removeLocalStorage(AUTH_KEY);
            toast.error('You do not have permission to access this page');
            return navigate('/login');
          }

          dispatch(loginSuccess({ ...res.profileDTO, role: res.role }));
        }
      } catch (error) {
        removeLocalStorage(AUTH_KEY);
        toast.error(error.message);
      } finally {
        if (!userInfo) {
          dispatch(loginFailed());
        }
      }
    })();
  }, []);

  return loading ? <Loading /> : children;
};

export default PrivateRoute;
