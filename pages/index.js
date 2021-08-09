import React, { useContext, useState } from 'react';
import { useAccounts, useTokens, Web3Context } from '../lib/web3-utils';
import TokenSelect from '../components/TokenSelect';

export default function Home() {
  const [selectedToken, setSelectedToken] = useState();
  const { loading: web3Loading } = useContext(Web3Context);
  const { accounts } = useAccounts();
  const { tokens } = useTokens();

  const isReady = () => !web3Loading && accounts.length > 0;

  return (
    <div>
      {!isReady() && <div>loading</div>}
      <div>Header</div>
      <TokenSelect
        tokens={tokens}
        selectedToken={selectedToken}
        onTokenSelect={(token) => setSelectedToken(token)}
      />
      <div>Footer</div>
    </div>
  );
}
