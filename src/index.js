import { ChakraProvider, ColorModeScript } from '@chakra-ui/react';
import { theme } from 'app/theme';
import React, { Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import { I18nextProvider } from 'react-i18next';
import { Provider } from 'react-redux';
import { unstable_HistoryRouter as HistoryRouter } from 'react-router-dom';
import { PersistGate } from 'redux-persist/integration/react';
import '../node_modules/normalize.css/normalize.css';
import '../node_modules/react-toastify/dist/ReactToastify.css';
import '../node_modules/primereact/resources/themes/lara-light-indigo/theme.css'; //theme
import '../node_modules/primereact/resources/primereact.min.css'; //core css
import '../node_modules/primeicons/primeicons.css'; //icons
import '../node_modules/react-image-lightbox/style.css';

import App from './App';
import { history } from './app/constants';
import i18n from './app/i18next';
import { persistor, store } from './app/store';
import { Loading, ScrollToTop, Toast } from './components';

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  // <React.StrictMode>
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <I18nextProvider i18n={i18n}>
        <ChakraProvider resetCSS theme={theme}>
          <HistoryRouter history={history}>
            <Suspense fallback={<Loading />}>
              <ColorModeScript initialColorMode={theme.config.initialColorMode} />
              <Toast />
              <ScrollToTop />
              <App />
            </Suspense>
          </HistoryRouter>
        </ChakraProvider>
      </I18nextProvider>
    </PersistGate>
  </Provider>
  // </React.StrictMode>
);
