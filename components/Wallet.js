import React, { useState } from 'react';
import {
  Stack,
  Stat,
  StatLabel,
  StatNumber,
  Button,
  ButtonGroup,
  Divider,
  NumberInput,
  NumberInputField,
} from '@chakra-ui/react';

export default function Wallet({ token, balance, onDeposit, onWithdraw }) {
  const [amount, setAmount] = useState(0);

  return (
    <Stack>
      <Stat>
        <StatLabel>Dex Balance</StatLabel>
        <StatNumber>
          {balance.dexBalance} {token?.ticker}
        </StatNumber>
      </Stat>

      <Stat>
        <StatLabel>Wallet Balance</StatLabel>
        <StatNumber>
          {balance.walletBalance} {token?.ticker}
        </StatNumber>
      </Stat>
      <Divider color="black" />
      <NumberInput value={amount} onChange={(value) => setAmount(value)}>
        <NumberInputField />
      </NumberInput>
      <ButtonGroup>
        <Button
          disabled={amount <= 0}
          colorScheme="purple"
          onClick={() => {
            onDeposit(amount);
            setAmount(0);
          }}
        >
          Deposit
        </Button>
        <Button
          disabled={amount <= 0}
          colorScheme="purple"
          onClick={() => {
            onWithdraw(amount);
            setAmount(0);
          }}
        >
          Withdraw
        </Button>
      </ButtonGroup>
    </Stack>
  );
}
