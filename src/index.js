import { ChakraProvider } from '@chakra-ui/react';
import { theme } from 'app/theme';
import React, { Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import { I18nextProvider } from 'react-i18next';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import { PersistGate } from 'redux-persist/integration/react';
import '../node_modules/normalize.css/normalize.css';
import App from './App';
import i18n from './app/i18next';
import { persistor, store } from './app/store';
import { Loading } from './components';

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <I18nextProvider i18n={i18n}>
          <ChakraProvider theme={theme}>
            <Router>
              <Suspense fallback={<Loading />}>
                <App />
              </Suspense>
            </Router>
          </ChakraProvider>
        </I18nextProvider>
      </PersistGate>
    </Provider>
  </React.StrictMode>
);
