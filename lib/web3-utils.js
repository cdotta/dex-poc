/* globals window */

import Web3 from 'web3';
import detectEthereumProvider from '@metamask/detect-provider';

export const getWeb32 = async () => {
  const provider = await detectEthereumProvider();

  if (!provider) {
    throw new Error('Install Metamask');
  }

  await provider.request({ method: 'eth_requestAccounts' });

  return new Web3(window.ethereum);
};
