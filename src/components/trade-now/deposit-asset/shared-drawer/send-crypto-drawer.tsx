// ** MUI Imports
import Drawer from '@mui/material/Drawer'
import Button from '@mui/material/Button'
import { styled } from '@mui/material/styles'
import TextField from '@mui/material/TextField'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Box, { BoxProps } from '@mui/material/Box'
import FormControl from '@mui/material/FormControl'
import { Autocomplete } from '@mui/material'
import { useCallback, useMemo, useState } from 'react'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Custom Components Imports
import CustomChip from 'src/@core/components/mui/chip'
import { clusterApiUrl, Connection, LAMPORTS_PER_SOL, PublicKey, SystemProgram, TokenAccountsFilter, Transaction, TransactionInstruction } from '@solana/web3.js';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base'
import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { UnsafeBurnerWalletAdapter } from '@solana/wallet-adapter-wallets'
import { useWalletModal } from '@solana/wallet-adapter-react-ui'
import { createTransferInstruction, TOKEN_PROGRAM_ID } from '@solana/spl-token'

interface Props {
  open: boolean
  toggle: () => void
  tokenData: any[]
  walletPubkey: string
}

const Header = styled(Box)<BoxProps>(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(6),
  justifyContent: 'space-between',
  paddingBottom: theme.spacing(2.25)
}))
const assetsType: string[] = ['Solana', 'Ethereum', 'bitcoin', 'SFC-VND', 'LPSFC']
const CryptoDepotPubkey = new PublicKey("9d5jmHCZT3hqDmjtLsdYnJoktdnF77pxDbEWkGmMi9gG");
const memoProgramm = new PublicKey('MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr');
const tokenNameMap: { [key: string]: string } = {
  '4TndGJA5DeL6xZgdPLK3VETy6MVVuZgUWEdPk4KUMNCQ': 'SFC-VND',
  '8aHXuC6HjPNQYiBxNhqHD2CN5RxvcqRu5hvKhWHF6He': 'LPSFC',
  '': 'Solana',
};
const SendCryptoDrawer = ({ open, toggle,tokenData, walletPubkey   }: Props) => {
 // const [receiverPublicKey, setReceiverPublicKey] = useState('9d5jmHCZT3hqDmjtLsdYnJoktdnF77pxDbEWkGmMi9gG');
 const [portfolio, SetPortfolio] = useState(""); // Memo input
 const [amount, setAmount] = useState(""); // Amount input
 const [assetType, setAssetType] = useState<string>(""); // Asset input
 const network = WalletAdapterNetwork.Devnet;
 const endpoint = useMemo(() => clusterApiUrl(network), [network]);
 const connectionStage = useConnection();
 const wallets = useMemo(() => [new UnsafeBurnerWalletAdapter()], []);
 const wallet = useWallet();
 const { setVisible } = useWalletModal();
 const { publicKey, connected } = useWallet();
 ///depositTransaction
 const depositTransaction = useCallback(async () => {
  if (!wallet.connected) {
    console.error('Wallet not connected');
    return;
  }
  else {
    console.log()
  }

  try {
    if (publicKey) {
      const amountAset = parseFloat(amount);
      const realamount = amountAset * LAMPORTS_PER_SOL;
      if (assetType != "") {
        const mintPubkey = new PublicKey(assetType);
        const tokenFilt: TokenAccountsFilter = {
          mint: mintPubkey,
          programId: new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"),
        };
        const tokenAccDeposit = await connectionStage.connection.getTokenAccountsByOwner(publicKey, tokenFilt);
        const tokenAccCryptoDepot = await connectionStage.connection.getTokenAccountsByOwner(CryptoDepotPubkey, tokenFilt);

        // Create a transfer instruction for SPL tokens
        const transferInstruction = createTransferInstruction(
          tokenAccDeposit.value[0].pubkey, // Sender's token account
          tokenAccCryptoDepot.value[0].pubkey, // Receiver's token account
          publicKey, // Owner of the sender's account
          realamount, // Amount of tokens to transfer (in smallest unit, not lamports)
          [], // Multisig signers (if any)
          TOKEN_PROGRAM_ID // SPL Token program ID
        );

        // Add the memo instruction if needed
        const memoText = portfolio;
        const memoInstru = new TransactionInstruction({
          keys: [],
          programId: memoProgramm,
          data: Buffer.from(memoText, 'utf-8'),
        });

        // Create a transaction and add both instructions
        const depoTran = new Transaction().add(transferInstruction).add(memoInstru);
        const txHash = await wallet.sendTransaction(depoTran, connectionStage.connection);

        // Confirm the transaction
        const { blockhash, lastValidBlockHeight } = await connectionStage.connection.getLatestBlockhash();
        await connectionStage.connection.confirmTransaction(
          {
            blockhash,
            lastValidBlockHeight,
            signature: txHash,
          },
          "confirmed"
        );

        console.log("Transaction successful, signature:", txHash);
      } else {
        const depoInstru = SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: CryptoDepotPubkey,
          lamports: realamount
        });

        const memoText = portfolio;
        const memoInstru = new TransactionInstruction({
          keys: [],
          programId: memoProgramm,
          data: Buffer.from(memoText, 'utf-8')
        });

        const depoTran = new Transaction().add(depoInstru).add(memoInstru);
        const txHash = await wallet.sendTransaction(depoTran, connectionStage.connection);
        const { blockhash, lastValidBlockHeight } = await connectionStage.connection.getLatestBlockhash();
        await connectionStage.connection.confirmTransaction(
          {
            blockhash,
            lastValidBlockHeight,
            signature: txHash,
          },
          "confirmed"
        );
        console.log("Transaction successful, signature:", txHash);
      }
    } else {
      console.error('Wallet public key not found');
    }
  } catch (error) {
    console.error('Transaction failed', error);
  }
}, [wallet, publicKey, amount, assetType, connectionStage.connection, portfolio]);

  // Reverse map to get the token address from the asset type
  const reverseTokenMap = Object.keys(tokenNameMap).reduce((obj, key) => {
    obj[tokenNameMap[key]] = key;
    return obj;
  }, {} as { [key: string]: string });

  //handle Converse Mint Address To Token
  const handleConverseMintAddressToToken = (event: any, value: string | null) => {
    if (value) {
      setAssetType(reverseTokenMap[value]); // Set the token address instead of the asset name
    }
  };
  // handle max button
  const maxAmountOfAsset = useCallback(async () => {
    if (!wallet.connected) {
      console.error('Wallet not connected');
      return;
    }
    if (publicKey) {
      if (assetType != "") {
        const mintPubkey = new PublicKey(assetType);
        const tokenFilt: TokenAccountsFilter = {
          mint: mintPubkey,
          programId: new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"),
        };
        const tokenAccDeposit = await connectionStage.connection.getTokenAccountsByOwner(publicKey, tokenFilt);
        const depoBala = await connectionStage.connection.getTokenAccountBalance(tokenAccDeposit.value[0].pubkey);
        if (depoBala.value.uiAmountString) {
          setAmount(depoBala.value.uiAmountString);
        } else {
          setAmount("0");
        }
      } else {
        const depoBala = await connectionStage.connection.getBalance(publicKey);
        setAmount(String(depoBala / LAMPORTS_PER_SOL));
      }

    } else {
      console.error('Wallet public key not found');
    }
  }, [connectionStage.connection, assetType, publicKey, wallet.connected]);
// const [amount, setAmount] = useState('');
  console.log('passed token data:', tokenData)
  console.log('walletPubkey passed: ',walletPubkey )
  return (
    <Drawer
      open={open}
      anchor='right'
      variant='temporary'
      // onClose={toggle}
      sx={{ '& .MuiDrawer-paper': { width: [300, 400] } }}
      ModalProps={{ keepMounted: true }}
    >
      <Header>
        <Typography variant='h6' sx={{ fontSize: '1.125rem !important' }}>
          Thông tin nạp
        </Typography>
        <IconButton onClick={toggle} sx={{ color: 'text.primary' }}>
          <Icon icon='bx:x' fontSize={20} />
        </IconButton>
      </Header>
      <Box sx={{ p: 6, pt: 8 }}>
        <FormControl fullWidth sx={{ mb: 6 }}>
          <TextField type='text'  label='Từ public key' variant='outlined' value={walletPubkey } InputProps={{
    readOnly: true,
  }} />
        </FormControl>
        <FormControl fullWidth sx={{ mb: 6 }}>
          <TextField type='text' label='Đến mã Danh mục' variant='outlined' value={portfolio} onChange={(e)=> SetPortfolio(e.target.value)}/>
        </FormControl>
        <FormControl fullWidth sx={{ mb: 6 }}>
          <Autocomplete
            options={assetsType}
            onChange={handleConverseMintAddressToToken}
            renderInput={params => <TextField {...params}  label='Loại tài sản được hổ trợ' value={assetType} onChange={(e)=> setAssetType(e.target.value)} />}
          />
        </FormControl>
        <FormControl fullWidth sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', mb: 6 }}>
          <TextField type='number' label='Số lượng' variant='outlined' value={amount} onChange={(e)=> setAmount(e.target.value)}/>
          <Button onClick={maxAmountOfAsset}> Tối đa</Button>
        </FormControl>
        <Box sx={{ mb: 6 }}>
        </Box>
        <div>
          <Button size='large' onClick={depositTransaction} variant='contained'  sx={{ mr: 4 }}>
            Nạp
          </Button>
          <Button size='large' variant='outlined' color='secondary' onClick={toggle}>
            Huỷ
          </Button>
        </div>
      </Box>
    </Drawer>
  )
}

export default SendCryptoDrawer
