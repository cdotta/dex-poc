import React, { useState, useEffect } from 'react';
import { Select } from '@chakra-ui/react';
import { useWeb3, getContracts } from '../lib/web3-utils';

export default function Home() {
  const { web3, loading: web3Loading } = useWeb3();
  const [accounts, setAccounts] = useState([]);
  const [contracts, setContracts] = useState();

  useEffect(() => {
    if (!web3Loading) {
      const init = async () => {
        const contractsTemp = await getContracts(web3);
        const accountsTemp = await web3.eth.getAccounts();
        setContracts(contractsTemp);
        setAccounts(accountsTemp);
      };
      init();
    }
  }, [web3, web3Loading]);

  const isReady = () =>
    !web3Loading && typeof contracts !== 'undefined' && accounts.length > 0;

  return (
    <div>
      {!isReady() && <div>loading</div>}
      <div>Header</div>
      <Select placeholder="Select option">
        <option value="option1">Option 1</option>
        <option value="option2">Option 2</option>
        <option value="option3">Option 3</option>
      </Select>
      <div>Footer</div>
    </div>
  );
}
