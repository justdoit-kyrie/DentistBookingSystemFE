/* eslint-disable no-unused-vars */
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { axios } from '~/apis';
import { AUTH_KEY, ROLE } from '~/app/constants';
import { loginSuccess } from '~/features/Auth/authSlice';
import { getLocalStorage, removeLocalStorage } from '~/utils';

const PrivateRoute = ({ role, children }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    (async () => {
      try {
        var { refreshToken } = getLocalStorage(AUTH_KEY) || {};

        if (!refreshToken) return navigate('/login');

        var res = await axios.post('/getProfile', { refreshToken });

        if (!res.user) {
          removeLocalStorage(AUTH_KEY);
          return navigate('/login');
        }

        console.log({ role: res.role.toLowerCase(), test: ROLE[role] });

        if (res.role.toLowerCase() !== ROLE[role]) {
          toast.error('You do not have permission to access this page');
          return navigate('/login');
        }

        dispatch(loginSuccess({ ...res.user, role: res.role }));
      } catch (error) {
        removeLocalStorage(AUTH_KEY);
        toast.error(error.message);
      }
    })();
  }, [navigate, dispatch]);

  return children;
};

export default PrivateRoute;
