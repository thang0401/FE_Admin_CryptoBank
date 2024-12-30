// ** Next Import
import Link from 'next/link'

// ** MUI Imports
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import CardContent from '@mui/material/CardContent'
import { UnsafeBurnerWalletAdapter } from '@solana/wallet-adapter-wallets'
import {
  WalletModalProvider,
  WalletDisconnectButton,
  WalletMultiButton,
  useWalletModal
} from '@solana/wallet-adapter-react-ui'
// ** Icon Imports
import Icon from 'src/@core/components/icon'
import '@solana/wallet-adapter-react-ui/styles.css'
import { Grid } from '@mui/material'
import { css } from '@emotion/react'
import { PublicKey, TokenAccountsFilter } from '@solana/web3.js'
import { useCallback, useEffect, useState } from 'react'
import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { TOKEN_PROGRAM_ID } from '@solana/spl-token'
import { log } from 'console'
interface Props {
  toggleAddPaymentDrawer: () => void
  toggleSendInvoiceDrawer: () => void
  setWalletPubkey: (pubkey: string) => void
  setTokenData: (tokenData: any) => void
}

const DepositActions = ({ toggleSendInvoiceDrawer, toggleAddPaymentDrawer,setTokenData, setWalletPubkey }: Props) => {
  const CryptoDepotPubkey = new PublicKey('9d5jmHCZT3hqDmjtLsdYnJoktdnF77pxDbEWkGmMi9gG')
  const memoProgramm = new PublicKey('MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr')
  // Token Metadata Program ID (Metaplex) trên Solana
  const TOKEN_METADATA_PROGRAM_ID = new PublicKey('metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s')
  const wallet = useWallet()
  const { setVisible } = useWalletModal()
  const { publicKey, connected } = useWallet()
  const connectionStage = useConnection()
  const [publickeyToBase58, setPublickeyToBase58] = useState('')
  //const [tokenData, setTokenData] = useState<{ mintAddressString: string }[]>([])
  //const [tokenData, setTokenData] = useState<{ mintAddressString: string }[]>([]);

  const fetchAllAssetOfWallet = useCallback(async () => {
    if (!publicKey) {
      throw new Error('Wallet not connected')
    }

    const tokenFilt: TokenAccountsFilter = {
      programId: TOKEN_PROGRAM_ID // SPL Token Program ID
    }

    // Lấy tất cả token accounts thuộc về ví
    const tokenAcc = await connectionStage.connection.getParsedTokenAccountsByOwner(publicKey, tokenFilt)
    const walletpubkey =publicKey.toBase58()
    console.log('walletpubkey',walletpubkey)
    // setPublickeyToBase58(walletpubkey)
    setWalletPubkey(walletpubkey)
    // const temp = setPublickeyToBase58
    // console.log('temp', temp)


    // Duyệt qua danh sách và lấy balance và metadata của từng token account
    const tokenNameAndSymbol = await Promise.all(
      tokenAcc.value.map(async accountInfo => {
        const publicKeyToken = accountInfo.pubkey
        console.log('publicKeyToken', publicKeyToken.toBase58())
        // Lấy mint address của token
        const mintAddress = new PublicKey(accountInfo.account.data.parsed.info.mint)
        const mintAddressString = mintAddress.toBase58()
        console.log('Mint address:', mintAddressString)
        return {
          // tokenName,
          // tokenSymbol,
          mintAddressString
        }
      })
    )
    setTokenData(tokenNameAndSymbol)
    console.log('Danh sách token và metadata: ', tokenNameAndSymbol)
    console.log('Danh sách token và metadata by usetate', setTokenData)
  }, [connectionStage.connection, publicKey, setTokenData,setWalletPubkey])

  useEffect(() => {
    if (connected) {
      fetchAllAssetOfWallet()
    } else {
      setVisible(true)
    }
  }, [connectionStage.connection, fetchAllAssetOfWallet, setVisible, connected, publicKey])
  return (
    <Card>
      <CardContent>
        <div style={{ width: '100%', marginBottom: '16px' }}>
          <WalletMultiButton style={{ width: '100%', height: '42px' }} />
        </div>

        <div style={{ width: '100% !important', marginBottom: '16px' }}>
          <WalletDisconnectButton style={{ width: '100%', height: '42px' }} />
        </div>

        <Button
          fullWidth
          sx={{ mb: 4 }}
          variant='contained'
          onClick={toggleSendInvoiceDrawer}
          startIcon={<Icon icon='bx:paper-plane' />}
        >
          Nhấn để nạp
        </Button>
        <Button fullWidth sx={{ mb: 4 }} variant='outlined' color='secondary'>
          Tải xuống PDF
        </Button>
        <Button
          fullWidth
          sx={{ mb: 4 }}
          // target='_blank'
          // component={Link}
          color='secondary'
          variant='outlined'
          // href={`#`}
        >
          In hoá đơn
        </Button>
        {/* <Button
          fullWidth
          sx={{ mb: 4 }}
          component={Link}
          color='secondary'
          variant='outlined'
          href={`/apps/invoice/edit/${id}`}
        >
          Edit Invoice
        </Button> */}
        {/* <Button fullWidth variant='contained' onClick={toggleAddPaymentDrawer} startIcon={<Icon icon='bx:dollar' />}>
          Add Payment
        </Button> */}
      </CardContent>
    </Card>
  )
}

export default DepositActions
