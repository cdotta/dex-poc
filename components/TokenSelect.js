import React from 'react';
import { Select } from '@chakra-ui/react';

export default function TokenSelect({ tokens, selectedToken, onTokenSelect }) {
  return (
    <Select
      placeholder="Select token"
      onChange={(e) => onTokenSelect(e.target.value)}
      value={selectedToken}
    >
      {tokens.map((token) => (
        <option key={token.tokenAddress} value={token.tokenAddress}>
          {token.ticker}
        </option>
      ))}
    </Select>
  );
}
