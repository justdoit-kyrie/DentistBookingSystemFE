import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import '../node_modules/normalize.css/normalize.css';
import App from './App';
import { BrowserRouter as Router } from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react';
import { theme } from 'app/theme';
import { PersistGate } from 'redux-persist/integration/react';
import { persistor, store } from './app/store';

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ChakraProvider theme={theme}>
          <Router>
            <App />
          </Router>
        </ChakraProvider>
      </PersistGate>

    </Provider>
  </React.StrictMode>
);


