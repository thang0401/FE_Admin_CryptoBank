// ** React Imports
import { useState, useEffect, useMemo } from 'react'

// ** Next Import

// ** MUI Imports
import Grid from '@mui/material/Grid'
import Alert from '@mui/material/Alert'

// ** Third Party Components
import axios from 'axios'

// ** Types
import { SingleInvoiceType, InvoiceLayoutProps } from 'src/types/apps/invoiceTypes'

// ** Demo Components Imports
import DepositAddCard from './depositAddCard'
import DepositActions from './depositAction'
// import AddPaymentDrawer from 'src/views/apps/invoice/shared-drawer/AddPaymentDrawer'
import SendCryptoDrawer from '../shared-drawer/send-crypto-drawer'
import {
  ConnectionProvider,
  WalletProvider,
  useConnection,
  useWallet
} from "@solana/wallet-adapter-react";
import dynamic from 'next/dynamic';
import { WalletAdapterNetwork, WalletNotConnectedError } from "@solana/wallet-adapter-base";
import { UnsafeBurnerWalletAdapter } from "@solana/wallet-adapter-wallets";
import {
  WalletModalProvider,
  WalletDisconnectButton,
  WalletMultiButton,
  useWalletModal
} from "@solana/wallet-adapter-react-ui";
import {
  clusterApiUrl,
  Transaction,
  SystemProgram,
  PublicKey,
  LAMPORTS_PER_SOL,
  TransactionInstruction,
  TokenAccountsFilter
} from "@solana/web3.js";
import { getMint, getTokenMetadata, TOKEN_PROGRAM_ID, createTransferInstruction} from "@solana/spl-token";



const DepositAdd = () =>
  {

    const [error, setError] = useState<boolean>(false)
    const [data, setData] = useState<null | SingleInvoiceType>(null)
    const [addPaymentOpen, setAddPaymentOpen] = useState<boolean>(false)
    const [sendInvoiceOpen, setSendInvoiceOpen] = useState<boolean>(false)
    const [tokenData, setTokenData] = useState<any[]>([])
    const [walletPubkey, setWalletPubkey] = useState<string>('')
    // useEffect(
    //   () => {
    //     axios
    //       .get(
    //         '/apps/invoice/single-invoice'

    //       )
    //       .then(res => {
    //         setData(res.data)
    //         setError(false)
    //       })
    //       .catch(() => {
    //         setData(null)
    //         setError(true)
    //       })
    //   }

    // )

    const toggleSendInvoiceDrawer = () => setSendInvoiceOpen(!sendInvoiceOpen)
    const toggleAddPaymentDrawer = () => setAddPaymentOpen(!addPaymentOpen)

    // if (data) {
    return (
      <>

        <Grid container spacing={6}>
          <Grid item xl={9} md={8} xs={12}>
            <DepositAddCard />
          </Grid>
          <Grid item xl={3} md={4} xs={12}>
            <DepositActions
              toggleAddPaymentDrawer={toggleAddPaymentDrawer}
              toggleSendInvoiceDrawer={toggleSendInvoiceDrawer}
              setWalletPubkey={setWalletPubkey}
              setTokenData={setTokenData}
            />
          </Grid>
        </Grid>
        <SendCryptoDrawer open={sendInvoiceOpen} toggle={toggleSendInvoiceDrawer}  tokenData={tokenData} walletPubkey={walletPubkey} />
        {/* <AddPaymentDrawer open={addPaymentOpen} toggle={toggleAddPaymentDrawer} /> */}
      </>
    )
    // }
    //  else if (error) {
    //   return (
    //     <Grid container spacing={6}>
    //       <Grid item xs={12}>
    //         <Alert severity='error'>
    //           {/* Invoice with the id: {id} does not exist. Please check the list of invoices:{' '} */}
    //           <Link href='/apps/invoice/list'>Invoice List</Link>
    //         </Alert>
    //       </Grid>
    //     </Grid>
    //   )
    // } else {
    //   return null
    // }

  }
  const App = () => {

    const network = WalletAdapterNetwork.Devnet;
    const endpoint = useMemo(() => clusterApiUrl(network), [network]);
    const wallets = useMemo(() => [new UnsafeBurnerWalletAdapter()], []);

    return (
      <ConnectionProvider endpoint={endpoint}>
        <WalletProvider wallets={wallets} autoConnect>
          <WalletModalProvider>
            <DepositAdd />
          </WalletModalProvider>
        </WalletProvider>
      </ConnectionProvider>
    );
  };
  export default App;

