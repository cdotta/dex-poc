import React from 'react';
import { Select } from '@chakra-ui/react';

export default function TokenSelect({ tokens, selectedToken, onTokenSelect }) {
  return (
    <Select
      placeholder="Select token"
      onChange={(e) =>
        onTokenSelect(
          tokens.find((token) => e.target.value === token.tokenAddress),
        )
      }
      value={selectedToken?.tokenAddress}
    >
      {tokens.map((token) => (
        <option key={token.tokenAddress} value={token.tokenAddress}>
          {token.ticker}
        </option>
      ))}
    </Select>
  );
}
