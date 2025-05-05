import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  Tab,
  Card,
  CardContent,
  Grid,
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Chip,
  Tooltip,
  CircularProgress,
  Divider,
  InputAdornment,
  SelectChangeEvent,
  useTheme,
} from '@mui/material';

import {
  ArrowUpward,
  ArrowDownward,
  AccountBalance,
  Speed,
  Refresh,
  History,
  Wallet,
  Warning,
  Search,
  Add,
  Remove,
  ShowChart,
  SwapHoriz,
  Settings,
  NotificationsActive,
} from '@mui/icons-material';

// Define types for our data
interface AssetData {
  id: number;
  name: string;
  balance: number;
  address: string;
  transactions: number;
  status: string;
}

interface TransactionData {
  id: number;
  type: string;
  asset: string;
  amount: number;
  user: string;
  timestamp: string;
  status: string;
  txHash: string;
}

interface AlertData {
  id: number;
  message: string;
  severity: 'warning' | 'info' | 'error' | 'success';
  time: string;
}

// Mock data
const mockAssets: AssetData[] = [
  { id: 1, name: 'USDC', balance: 2500000.00, address: '0x1234...5678', transactions: 1250, status: 'active' },
  { id: 2, name: 'VND', balance: 58000000000.00, address: '0x8765...4321', transactions: 950, status: 'active' },
  { id: 3, name: 'ETH', balance: 45.28, address: '0x9876...3456', transactions: 425, status: 'active' },
];

const mockTransactions: TransactionData[] = [
  { id: 1, type: 'deposit', asset: 'USDC', amount: 250000.00, user: 'user123', timestamp: '2025-03-29T09:15:00Z', status: 'completed', txHash: '0xabc...123' },
  { id: 2, type: 'withdrawal', asset: 'USDC', amount: 50000.00, user: 'user456', timestamp: '2025-03-29T08:20:00Z', status: 'pending', txHash: '0xdef...456' },
  { id: 3, type: 'gas_fee', asset: 'ETH', amount: 0.05, user: 'system', timestamp: '2025-03-29T07:45:00Z', status: 'completed', txHash: '0xghi...789' },
  { id: 4, type: 'deposit', asset: 'VND', amount: 5000000000.00, user: 'user789', timestamp: '2025-03-28T15:30:00Z', status: 'completed', txHash: '0xjkl...012' },
  { id: 5, type: 'withdrawal', asset: 'VND', amount: 2000000000.00, user: 'user234', timestamp: '2025-03-28T14:10:00Z', status: 'failed', txHash: '0xmno...345' },
];

const AssetManagementPage: React.FC = () => {
  const theme = useTheme()
  const [tabValue, setTabValue] = useState<number>(0);
  const [assets, setAssets] = useState<AssetData[]>(mockAssets);
  const [transactions, setTransactions] = useState<TransactionData[]>(mockTransactions);
  const [openTransferDialog, setOpenTransferDialog] = useState<boolean>(false);
  const [openAdjustDialog, setOpenAdjustDialog] = useState<boolean>(false);
  const [selectedAsset, setSelectedAsset] = useState<AssetData | null>(null);
  const [transferAmount, setTransferAmount] = useState<string>('');
  const [transferAddress, setTransferAddress] = useState<string>('');
  const [adjustAmount, setAdjustAmount] = useState<string>('');
  const [adjustType, setAdjustType] = useState<string>('add');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [alerts, setAlerts] = useState<AlertData[]>([
    { id: 1, message: 'ETH balance low for gas fees', severity: 'warning', time: '10 minutes ago' },
    { id: 2, message: 'USDC large withdrawal pending approval', severity: 'info', time: '45 minutes ago' },
  ]);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number): void => {
    setTabValue(newValue);
  };

  const handleTransferOpen = (asset: AssetData): void => {
    setSelectedAsset(asset);
    setOpenTransferDialog(true);
  };

  const handleTransferClose = (): void => {
    setOpenTransferDialog(false);
    setSelectedAsset(null);
    setTransferAmount('');
    setTransferAddress('');
  };

  const handleAdjustOpen = (asset: AssetData): void => {
    setSelectedAsset(asset);
    setOpenAdjustDialog(true);
  };

  const handleAdjustClose = (): void => {
    setOpenAdjustDialog(false);
    setSelectedAsset(null);
    setAdjustAmount('');
    setAdjustType('add');
  };

  const handleAdjustTypeChange = (event: SelectChangeEvent): void => {
    setAdjustType(event.target.value);
  };

  const handleTransfer = (): void => {
    if (!selectedAsset) return;

    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      // Add transaction
      const newTransaction: TransactionData = {
        id: transactions.length + 1,
        type: 'withdrawal',
        asset: selectedAsset.name,
        amount: parseFloat(transferAmount),
        user: 'super_admin',
        timestamp: new Date().toISOString(),
        status: 'pending',
        txHash: `0x${Math.random().toString(36).substring(2, 10)}...${Math.random().toString(36).substring(2, 6)}`,
      };

      setTransactions([newTransaction, ...transactions]);

      // Update asset balance (in a real app this would happen after confirmation)
      setAssets(assets.map(asset =>
        asset.id === selectedAsset.id
          ? { ...asset, balance: asset.balance - parseFloat(transferAmount) }
          : asset
      ));

      setIsLoading(false);
      handleTransferClose();
    }, 1500);
  };

  const handleAdjust = (): void => {
    if (!selectedAsset) return;

    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      const adjustedAmount = adjustType === 'add'
        ? parseFloat(adjustAmount)
        : -parseFloat(adjustAmount);

      // Add transaction
      const newTransaction: TransactionData = {
        id: transactions.length + 1,
        type: adjustType === 'add' ? 'adjustment_add' : 'adjustment_remove',
        asset: selectedAsset.name,
        amount: Math.abs(parseFloat(adjustAmount)),
        user: 'super_admin',
        timestamp: new Date().toISOString(),
        status: 'completed',
        txHash: `0x${Math.random().toString(36).substring(2, 10)}...${Math.random().toString(36).substring(2, 6)}`,
      };

      setTransactions([newTransaction, ...transactions]);

      // Update asset balance
      setAssets(assets.map(asset =>
        asset.id === selectedAsset.id
          ? { ...asset, balance: asset.balance + adjustedAmount }
          : asset
      ));

      setIsLoading(false);
      handleAdjustClose();
    }, 1500);
  };

  const formatCurrency = (value: number, currency: string): string => {
    if (currency === 'USDC') {
      return `$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    } else if (currency === 'VND') {
      return `₫${value.toLocaleString('vi-VN')}`;
    } else if (currency === 'ETH') {
      return `${value.toLocaleString('en-US', { minimumFractionDigits: 6, maximumFractionDigits: 6 })} ETH`;
    }
    return value.toString();
  };

  const getStatusColor = (status: string): "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning" => {
    switch (status) {
      case 'completed': return 'success';
      case 'pending': return 'warning';
      case 'failed': return 'error';
      case 'active': return 'success';
      default: return 'default';
    }
  };

  const cardBackgroundColors = {
    USDC: theme.palette.mode === 'dark' ? '#1e2a3a' : '#e8f5e9',  // Xanh than nhạt
    VND: theme.palette.mode === 'dark' ? '#4a3b52' : '#f5f5f5',   // Xám đen tinh tế
    ETH: theme.palette.mode === 'dark' ? '#2d3142' : '#e3f2fd',   // Xám xanh thanh lịch
  };

  const chipBackgroundColors = {
    deposit: theme.palette.mode === 'dark' ? '#0d3b2c' : '#e8f5e9',   // Xanh lục đậm
    withdrawal: theme.palette.mode === 'dark' ? '#542233' : '#fbe9e7', // Đỏ mận
    gas: theme.palette.mode === 'dark' ? '#0f3057' : '#e3f2fd',        // Xanh dương đêm
    adjustment: theme.palette.mode === 'dark' ? '#493657' : '#f3e5f5', // Tím hoàng hôn
  };
  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Typography variant="h4" gutterBottom component="div" sx={{ fontWeight: 'bold' }}>
        Asset Management
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" gutterBottom>
        Admin Dashboard
      </Typography>

      <Grid container spacing={3} sx={{ mt: 1 }}>
        {/* Quick Stats Cards */}
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%', backgroundColor: cardBackgroundColors.USDC, boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 'medium' }}>
                Total USDC
              </Typography>
              <Typography variant="h4" sx={{ my: 1, fontWeight: 'bold' }}>
                {formatCurrency(assets.find(a => a.name === 'USDC')?.balance || 0, 'USDC')}
              </Typography>
              <Typography variant="body2">
                Last updated: Today, 9:45 AM
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%', backgroundColor: cardBackgroundColors.VND, boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 'medium' }}>
                Total VND
              </Typography>
              <Typography variant="h4" sx={{ my: 1, fontWeight: 'bold' }}>
                {formatCurrency(assets.find(a => a.name === 'VND')?.balance || 0, 'VND')}
              </Typography>
              <Typography variant="body2">
                Last updated: Today, 9:45 AM
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%', backgroundColor: cardBackgroundColors.ETH, boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 'medium' }}>
                ETH (Gas Reserve)
              </Typography>
              <Typography variant="h4" sx={{ my: 1, fontWeight: 'bold' }}>
                {formatCurrency(assets.find(a => a.name === 'ETH')?.balance || 0, 'ETH')}
              </Typography>
              <Typography variant="body2">
                Last updated: Today, 9:45 AM
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Main content tabs */}
      <Paper sx={{ width: '100%', mt: 3, boxShadow: 3 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          textColor="primary"
          indicatorColor="primary"
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab label="Assets Overview" icon={<AccountBalance />} iconPosition="start" />
          <Tab label="Transactions" icon={<History />} iconPosition="start" />
        </Tabs>

        {/* Assets Tab */}
        {tabValue === 0 && (
          <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="h6">Assets Overview</Typography>
              <Box>
                <Button
                  variant="outlined"
                  startIcon={<Refresh />}
                  sx={{ mr: 1 }}
                >
                  Refresh
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<Speed />}
                >
                  Gas Settings
                </Button>
              </Box>
            </Box>

            <TableContainer>
              <Table sx={{ minWidth: 650 }}>
                <TableHead>
                  <TableRow>
                    <TableCell><strong>Asset</strong></TableCell>
                    <TableCell align="right"><strong>Balance</strong></TableCell>
                    <TableCell sx={{paddingLeft: 40}}><strong>Address</strong></TableCell>
                    <TableCell align="left"><strong>Transactions</strong></TableCell>
                    <TableCell><strong>Status</strong></TableCell>
                    <TableCell align="center"><strong>Actions</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {assets.map((asset) => (
                    <TableRow
                      key={asset.id}
                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                      <TableCell component="th" scope="row">
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Wallet sx={{ mr: 1, color:
                            asset.name === 'USDC' ? '#2e7d32' :
                            asset.name === 'VND' ? '#757575' : '#1976d2'
                          }} />
                          <Typography variant="body1">{asset.name}</Typography>
                        </Box>
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                          {formatCurrency(asset.balance, asset.name)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', paddingLeft: 30}}>
                        {asset.name === 'VND' ? 'N/A' : (
                            <>
                              {asset.address}
                              <Tooltip title="Copy address">
                                <IconButton size="small">
                                  <ContentCopy />
                                </IconButton>
                              </Tooltip>
                            </>
                          )}
                        </Box>
                      </TableCell>
                      <TableCell sx={{paddingLeft: 12}}>{asset.transactions}</TableCell>
                      <TableCell>
                        <Chip
                          label={asset.status}
                          size="small"
                          color={getStatusColor(asset.status)}
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Box>
                           <Tooltip title="View details">
                            <IconButton>
                              <Search />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        )}

        {/* Transactions Tab */}
        {tabValue === 1 && (
          <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="h6">Recent Transactions</Typography>
              <TextField
                placeholder="Search transactions"
                size="small"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  ),
                }}
                sx={{ width: 250 }}
              />
            </Box>

            {/* //Transactions tab */}
            <TableContainer>
              <Table sx={{ minWidth: 650 }}>
                <TableHead>
                  <TableRow>
                    <TableCell><strong>Type</strong></TableCell>
                    <TableCell><strong>Asset</strong></TableCell>
                    <TableCell align="right"><strong>Amount</strong></TableCell>
                    <TableCell><strong>User</strong></TableCell>
                    <TableCell><strong>Date & Time</strong></TableCell>
                    <TableCell><strong>Status</strong></TableCell>
                    <TableCell><strong>Transaction Hash</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {transactions.map((transaction) => (
                    <TableRow
                      key={transaction.id}
                      sx={{
                        '&:last-child td, &:last-child th': { border: 0 },
                      }}
                    >
                     <TableCell>
                        <Chip
                          icon={transaction.type.includes('withdrawal') ? <ArrowUpward /> : <ArrowDownward />}
                          label={transaction.type.replace('_', ' ')}
                          size="small"
                          sx={{
                            backgroundColor: theme.palette.mode === 'dark' ? (
                              transaction.type.includes('deposit') ? chipBackgroundColors.deposit :
                              transaction.type.includes('withdrawal') ? chipBackgroundColors.withdrawal :
                              transaction.type.includes('gas') ? chipBackgroundColors.gas : chipBackgroundColors.adjustment
                            ) : (
                              transaction.type.includes('deposit') ? chipBackgroundColors.deposit :
                              transaction.type.includes('withdrawal') ? chipBackgroundColors.withdrawal :
                              transaction.type.includes('gas') ? chipBackgroundColors.gas : chipBackgroundColors.adjustment
                            ),
                            textTransform: 'capitalize'
                          }}
                        />
                      </TableCell>
                      <TableCell>{transaction.asset}</TableCell>
                      <TableCell align="right">
                        <Typography
                          variant="body2"
                          sx={{
                            color: transaction.type.includes('withdrawal') ||
                                  transaction.type.includes('gas') ||
                                  transaction.type.includes('remove') ?
                                  '#d32f2f' : '#2e7d32'
                          }}
                        >
                          {transaction.type.includes('withdrawal') ||
                           transaction.type.includes('gas') ||
                           transaction.type.includes('remove') ? '-' : '+'}{formatCurrency(transaction.amount, transaction.asset)}
                        </Typography>
                      </TableCell>
                      <TableCell>{transaction.user}</TableCell>
                      <TableCell>
                        {new Date(transaction.timestamp).toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={transaction.status}
                          size="small"
                          color={getStatusColor(transaction.status)}
                        />
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Typography variant="body2" sx={{ fontSize: '0.875rem' }}>
                            {transaction.txHash}
                          </Typography>
                          <Tooltip title="View on explorer">
                            <IconButton size="small">
                              <OpenInNew />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        )}
      </Paper>

      {/* Transfer Dialog */}
      <Dialog open={openTransferDialog} onClose={handleTransferClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          Transfer {selectedAsset?.name}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              {/* Custom notification box instead of Alert */}
              <Box sx={{
                p: 2,
                mb: 2,
                borderRadius: 1,
                backgroundColor: '#e3f2fd',
                border: '1px solid #2196f3',
                display: 'flex',
                alignItems: 'center'
              }}>
                <Typography variant="body2">
                  You are transferring {selectedAsset?.name} from the bank's main wallet.
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Destination Address"
                fullWidth
                value={transferAddress}
                onChange={(e) => setTransferAddress(e.target.value)}
                placeholder="0x..."
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Amount"
                fullWidth
                value={transferAmount}
                onChange={(e) => setTransferAmount(e.target.value)}
                type="number"
                InputProps={{
                  endAdornment: <InputAdornment position="end">{selectedAsset?.name}</InputAdornment>,
                }}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body2" color="text.secondary">
                Available balance: {selectedAsset ? formatCurrency(selectedAsset.balance, selectedAsset.name) : ''}
              </Typography>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleTransferClose} color="inherit">Cancel</Button>
          <Button
            onClick={handleTransfer}
            color="primary"
            variant="contained"
            disabled={!transferAmount || !transferAddress || isLoading}
            startIcon={isLoading ? <CircularProgress size={20} /> : <ArrowUpward />}
          >
            {isLoading ? 'Processing...' : 'Transfer'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Adjust Balance Dialog */}
      <Dialog open={openAdjustDialog} onClose={handleAdjustClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          Adjust {selectedAsset?.name} Balance
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              {/* Custom warning box instead of Alert */}
              <Box sx={{
                p: 2,
                mb: 2,
                borderRadius: 1,
                backgroundColor: '#fff8e1',
                border: '1px solid #ffc107',
                display: 'flex',
                alignItems: 'center'
              }}>
                <Warning sx={{ color: '#ffc107', mr: 1 }} />
                <Typography variant="body2">
                  This will manually adjust the system balance. Use with caution.
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Adjustment Type</InputLabel>
                <Select
                  value={adjustType}
                  onChange={handleAdjustTypeChange}
                  label="Adjustment Type"
                >
                  <MenuItem value="add">Add (Increase Balance)</MenuItem>
                  <MenuItem value="remove">Remove (Decrease Balance)</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Amount"
                fullWidth
                value={adjustAmount}
                onChange={(e) => setAdjustAmount(e.target.value)}
                type="number"
                InputProps={{
                  endAdornment: <InputAdornment position="end">{selectedAsset?.name}</InputAdornment>,
                }}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Reason for Adjustment"
                fullWidth
                multiline
                rows={2}
                variant="outlined"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleAdjustClose} color="inherit">Cancel</Button>
          <Button
            onClick={handleAdjust}
            color="secondary"
            variant="contained"
            disabled={!adjustAmount || isLoading}
            startIcon={isLoading ? <CircularProgress size={20} /> : adjustType === 'add' ? <Add /> : <Remove />}
          >
            {isLoading ? 'Processing...' : adjustType === 'add' ? 'Add Funds' : 'Remove Funds'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

// Custom icon components to fix type issues
const ContentCopy: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24">
    <path d="M0 0h24v24H0z" fill="none"/>
    <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
  </svg>
);

const OpenInNew: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24">
    <path d="M0 0h24v24H0z" fill="none"/>
    <path d="M19 19H5V5h7V3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z"/>
  </svg>
);

export default AssetManagementPage
