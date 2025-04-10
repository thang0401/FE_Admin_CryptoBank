import { Grid } from '@mui/material'
import React from 'react'
import TransactionType from './transaction-flow/TransactionType'
import SuccessfulAndFailRate from './transaction-flow/SuccessfulAndFailRate'
import SellUSDCrate from './transaction-flow/BuySellUSDCrate'
import TransactionTrendFollowingTime from './transaction-flow/TransactionTrendFollowingTime'
import TransactionBetweenAccounts from './transaction-flow/TransactionBetweenAccounts'
import AmountOfTransaction from './transaction-flow/ProfitFromTransactionFee'
import ProfitFromTransactionFee from './transaction-flow/AmountOfTransaction'
import SavingAndInterestRate from './transaction-flow/SavingAndInterestRate'

export default function TransactionFlow() {
  return (
    <Grid container gap={3}>
      <TransactionType />
      <SuccessfulAndFailRate />
      <TransactionTrendFollowingTime />
      <SellUSDCrate />
      <TransactionBetweenAccounts/>
      <AmountOfTransaction/>
      <ProfitFromTransactionFee/>
      <SavingAndInterestRate/>
    </Grid>
  )
}
