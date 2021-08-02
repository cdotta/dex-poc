import React, { useContext } from 'react';
import { Select } from '@chakra-ui/react';
import { useAccounts, useTokens, Web3Context } from '../lib/web3-utils';

export default function Home() {
  const { loading: web3Loading } = useContext(Web3Context);
  const { accounts } = useAccounts();
  const { tokens } = useTokens();

  const isReady = () => !web3Loading && accounts.length > 0;

  return (
    <div>
      {!isReady() && <div>loading</div>}
      <div>Header</div>
      <Select placeholder="Select token">
        {tokens.map((token) => (
          <option key={token.tokenAddress} value={token.tokenAddress}>
            {token.ticker}
          </option>
        ))}
      </Select>
      <div>Footer</div>
    </div>
  );
}
