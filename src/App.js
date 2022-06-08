import { useColorMode } from '@chakra-ui/react';
import classNames from 'classnames/bind';
import { AnimatePresence } from 'framer-motion';
import React, { Fragment } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { ROUTES } from '~/app/routes';
import { PrivateRoute } from '~/components';
import { getLayout } from '~/utils';
import styles from './App.module.scss';
const cx = classNames.bind(styles);

function App() {
  const location = useLocation();
  const { colorMode } = useColorMode();

  const renderRoutes = (routes) => {
    return routes.map(({ path, component, layout, isPublic = false, role }, idx) => {
      const Page = component;
      const Layout = getLayout(layout);

      const Comp = isPublic ? Fragment : PrivateRoute;

      const passProps = !isPublic && { role };

      return (
        <Route
          key={`route-${idx}`}
          path={path}
          element={
            <Comp {...passProps}>
              <ToastContainer
                theme={colorMode}
                position="top-right"
                autoClose={1000}
                hideProgressBar
                newestOnTop
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                className={cx('toast')}
              />
              <Layout>
                <Page />
              </Layout>
            </Comp>
          }
        />
      );
    });
  };

  return (
    <AnimatePresence exitBeforeEnter>
      <Routes location={location} key={location.pathname}>
        {renderRoutes(ROUTES)}
      </Routes>
    </AnimatePresence>
  );
}

export default App;
