/* eslint-disable react/jsx-props-no-spreading */
import { ChakraProvider } from '@chakra-ui/react';
import React from 'react';
import { useWeb3, Web3Context } from '../lib/web3-utils';
import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
  const web3ContextValue = useWeb3();

  return (
    <ChakraProvider>
      <Web3Context.Provider value={web3ContextValue}>
        <Component {...pageProps} />
      </Web3Context.Provider>
    </ChakraProvider>
  );
}

export default MyApp;
