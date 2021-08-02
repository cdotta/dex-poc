/* globals window */

import React, { useState, useEffect, useContext } from 'react';
import Web3 from 'web3';
import detectEthereumProvider from '@metamask/detect-provider';
import Dex from '../contracts/Dex.json';
import ERC20 from '../contracts/ERC20.json';

export const Web3Context = React.createContext({
  web3: null,
  loading: false,
});

const getWeb3 = async () => {
  const provider = await detectEthereumProvider();

  if (!provider) {
    throw new Error('Install Metamask');
  }

  await provider.request({ method: 'eth_requestAccounts' });

  return new Web3(window.ethereum);
};

export const useWeb3 = () => {
  const [loading, setLoading] = useState(true);
  const [web3, setWeb3] = useState();
  useEffect(() => {
    // getWeb3 needs to run inside a useEffect because it references the window object (Next.js)
    getWeb3().then((web3Instance) => {
      setWeb3(web3Instance);
      setLoading(false);
    });
  }, []);
  return { loading, web3 };
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

export const useAccounts = () => {
  const { web3, loading: web3Loading } = useContext(Web3Context);
  const [accounts, setAccounts] = useState({});

  useEffect(() => {
    if (!web3Loading) {
      const helper = async () => {
        const accountsTemp = await web3.eth.getAccounts();
        setAccounts(accountsTemp);
      };
      helper();
    }
  }, [web3Loading, web3]);

  return { accounts };
};

export const useContracts = () => {
  const { web3, loading: web3Loading } = useContext(Web3Context);
  const [contracts, setContracts] = useState(null);

  useEffect(() => {
    if (!web3Loading) {
      const helper = async () => {
        const contractsTemp = await getContracts(web3);
        setContracts(contractsTemp);
      };
      helper();
    }
  }, [web3Loading, web3]);

  return { contracts };
};

export const useTokens = () => {
  const { web3 } = useContext(Web3Context);
  const { contracts } = useContracts();
  const [tokens, setTokens] = useState([]);

  useEffect(() => {
    if (contracts) {
      const helper = async () => {
        const tokensTemp = await contracts.dex.methods.getTokens().call();
        const enrichedTokens = tokensTemp.map((token) => ({
          ...token,
          ticker: web3.utils.hexToUtf8(token.ticker),
        }));
        setTokens(enrichedTokens);
      };
      helper();
    }
  }, [contracts, web3]);

  return { tokens };
};
