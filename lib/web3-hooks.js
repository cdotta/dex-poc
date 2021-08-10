import React, { useState, useEffect, useContext, useCallback } from 'react';
import { getWeb3, getContracts } from './web3-utils';

export const AppContext = React.createContext({
  web3: null,
  contracts: null,
  loading: false,
  ready: false,
});

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

export const useAppContextValue = () => {
  const { web3, loading: web3Loading } = useWeb3();
  const [contracts, setContracts] = useState(null);
  const [contractsLoading, setContractsLoading] = useState(false);

  useEffect(() => {
    if (!web3Loading) {
      setContractsLoading(true);
      const helper = async () => {
        const contractsTemp = await getContracts(web3);
        setContracts(contractsTemp);
        setContractsLoading(false);
      };
      helper();
    }
  }, [web3Loading, web3]);

  return {
    web3,
    contracts,
    loading: web3Loading || contractsLoading,
    ready: !!(web3 && contracts),
  };
};

export const useAccounts = () => {
  const { web3, loading } = useContext(AppContext);
  const [accounts, setAccounts] = useState({});

  useEffect(() => {
    if (!loading) {
      const helper = async () => {
        const accountsTemp = await web3.eth.getAccounts();
        setAccounts(accountsTemp);
      };
      helper();
    }
  }, [loading, web3]);

  return { accounts };
};

export const useTokens = () => {
  const { web3, contracts } = useContext(AppContext);
  const [tokens, setTokens] = useState([]);

  useEffect(() => {
    if (contracts) {
      const helper = async () => {
        const tokensTemp = await contracts.dex.methods.getTokens().call();
        const enrichedTokens = tokensTemp.map((token) => ({
          ...token,
          hexTicker: token.ticker,
          ticker: web3.utils.hexToUtf8(token.ticker),
        }));
        setTokens(enrichedTokens);
      };
      helper();
    }
  }, [contracts, web3]);

  return { tokens };
};

export const useTokenBalance = () => {
  const [token, setToken] = useState(null);
  const [tokenBalance, setTokenBalance] = useState({
    dexBalance: 0,
    walletBalance: 0,
  });
  const { web3, contracts } = useContext(AppContext);
  const { accounts } = useAccounts();

  const fetchTokenBalances = useCallback(async () => {
    const dexBalance = await contracts.dex.methods
      .traderBalances(accounts[0], web3.utils.fromAscii(token.ticker))
      .call();
    const walletBalance = await contracts[token.ticker].methods
      .balanceOf(accounts[0])
      .call();
    setTokenBalance({ dexBalance, walletBalance });
  }, [contracts, web3, accounts, token, setTokenBalance]);

  useEffect(() => {
    if (contracts && token) {
      fetchTokenBalances();
    }
  }, [contracts, token, fetchTokenBalances]);
  return { tokenBalance, setToken, fetchTokenBalances };
};
