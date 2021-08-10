/* globals window */

import Web3 from 'web3';
import detectEthereumProvider from '@metamask/detect-provider';
import Dex from '../contracts/Dex.json';
import ERC20 from '../contracts/ERC20.json';

export const getWeb3 = async () => {
  const provider = await detectEthereumProvider();

  if (!provider) {
    throw new Error('Install Metamask');
  }

  await provider.request({ method: 'eth_requestAccounts' });

  return new Web3(window.ethereum);
};

export const getContracts = async (web3) => {
  const networkId = await web3.eth.net.getId();
  const deployedNetwork = Dex.networks[networkId];
  const dex = new web3.eth.Contract(
    Dex.abi,
    deployedNetwork && deployedNetwork.address,
  );
  const tokens = await dex.methods.getTokens().call();
  const tokenContracts = tokens.reduce(
    (acc, token) => ({
      ...acc,
      [web3.utils.hexToUtf8(token.ticker)]: new web3.eth.Contract(
        ERC20.abi,
        token.tokenAddress,
      ),
    }),
    {},
  );
  return { dex, ...tokenContracts };
};
