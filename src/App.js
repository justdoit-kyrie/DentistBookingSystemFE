import { PrivateRoute } from 'components';
import React, { Fragment } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { getLayout } from 'utils';
import { ROUTES } from '~/app/routes';

function App() {
  const location = useLocation();

  const renderRoutes = (routes) => {
    return routes.map(({ path, component, layout, isPublic = false }, idx) => {
      const Page = component;
      const Layout = getLayout(layout);
      const Comp = isPublic ? Fragment : PrivateRoute;

      return (
        <Route
          key={`route-${idx}`}
          path={path}
          element={
            <Comp>
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
    <Routes key="location" location={location}>
      {renderRoutes(ROUTES)}
    </Routes>
  );
}

export default App;
