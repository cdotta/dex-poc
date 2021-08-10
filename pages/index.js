import React, { useState, useCallback } from 'react';
import { Box } from '@chakra-ui/react';
import {
  useTokens,
  useTokenBalance,
  useAccounts,
  useAppContextValue,
} from '../lib/web3-hooks';
import TokenSelect from '../components/TokenSelect';
import Wallet from '../components/Wallet';

export default function Home() {
  const [selectedToken, setSelectedToken] = useState();
  const { contracts } = useAppContextValue();
  const { accounts } = useAccounts();
  const { tokens } = useTokens();
  const { tokenBalance, setToken, fetchTokenBalances } = useTokenBalance();

  const handleTokenSelect = useCallback(
    (token) => {
      setSelectedToken(token);
      setToken(token);
    },
    [setToken],
  );

  const handleDeposit = useCallback(
    async (amount) => {
      try {
        await contracts[selectedToken.ticker].methods
          .approve(contracts.dex.options.address, amount)
          .send({ from: accounts[0] });
        await contracts.dex.methods
          .deposit(amount, selectedToken.hexTicker)
          .send({ from: accounts[0] });
        await fetchTokenBalances();
      } catch (error) {
        console.log(error);
      }
    },
    [contracts, selectedToken, accounts, fetchTokenBalances],
  );

  const handleWithdraw = useCallback(
    async (amount) => {
      try {
        await contracts.dex.methods
          .withdraw(amount, selectedToken.hexTicker)
          .send({ from: accounts[0] });
        await fetchTokenBalances();
      } catch (error) {
        console.log(error);
      }
    },
    [contracts, selectedToken, accounts, fetchTokenBalances],
  );

  return (
    <Box p="5">
      {!contracts && <div>loading</div>}
      <Box maxW="500">
        <TokenSelect
          tokens={tokens}
          selectedToken={selectedToken}
          onTokenSelect={(token) => handleTokenSelect(token)}
        />
        {selectedToken && (
          <Wallet
            token={selectedToken}
            balance={tokenBalance}
            onDeposit={(depositAmount) => handleDeposit(depositAmount)}
            onWithdraw={(withdraw) => handleWithdraw(withdraw)}
          />
        )}
      </Box>
    </Box>
  );
}
