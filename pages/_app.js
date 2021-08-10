/* eslint-disable react/jsx-props-no-spreading */
import { ChakraProvider } from '@chakra-ui/react';
import React from 'react';
import { useAppContextValue, AppContext } from '../lib/web3-hooks';
import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
  const appContextValue = useAppContextValue();

  return (
    <ChakraProvider>
      <AppContext.Provider value={appContextValue}>
        <Component {...pageProps} />
      </AppContext.Provider>
    </ChakraProvider>
  );
}

export default MyApp;
