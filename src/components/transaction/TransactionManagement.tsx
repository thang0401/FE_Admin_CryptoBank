import React, { useState } from 'react';
import { Grid } from '@mui/material';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Button,
  IconButton,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tooltip,
  Alert,
  Snackbar
} from '@mui/material';
import { SearchIcon, RefreshCwIcon as RefreshIcon, EyeIcon, VoteIcon as ApproveIcon, DeleteIcon as RejectIcon, BadgeAlertIcon as AlertIcon, CopyIcon } from 'lucide-react';
import TransactionDetailsDialog from './TransactionDetailsDialog';
import RejectTransactionDialog from './RejectTransactionDialog';


interface Transaction {
  id: string;
  userId: string;
  userName: string;
  type: 'DEPOSIT' | 'WITHDRAW' | 'TRANSFER';
  subType: 'ON_CHAIN' | 'OFF_CHAIN' | 'INTERNAL';
  amount: number;
  currency: string;
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'REJECTED';
  fromAddress?: string;
  toAddress?: string;
  txHash?: string;
  requestTime: string;
  completionTime?: string;
  note?: string;
  approvedBy?: string;
  rejectedBy?: string;
  rejectionReason?: string;
}

const mockTransactions: Transaction[] = [
  {
    id: 'TX001',
    userId: 'USER001',
    userName: 'John Doe',
    type: 'DEPOSIT',
    subType: 'ON_CHAIN',
    amount: 1.5,
    currency: 'SOL',
    status: 'PENDING',
    fromAddress: '8xyw...k9jL',
    toAddress: 'system_wallet',
    txHash: '4jk...m7n',
    requestTime: '2024-03-16T10:30:00Z',
    note: 'Deposit from external wallet'
  },
  {
    id: 'TX002',
    userId: 'USER002',
    userName: 'Jane Smith',
    type: 'WITHDRAW',
    subType: 'ON_CHAIN',
    amount: 0.5,
    currency: 'SOL',
    status: 'COMPLETED',
    fromAddress: 'system_wallet',
    toAddress: '3nhL...p8mK',
    txHash: '7ht...n4p',
    requestTime: '2024-03-15T15:45:00Z',
    completionTime: '2024-03-15T15:47:00Z',
    approvedBy: 'ADMIN001'
  },
  {
    id: 'TX003',
    userId: 'USER003',
    userName: 'Alice Johnson',
    type: 'TRANSFER',
    subType: 'INTERNAL',
    amount: 0.75,
    currency: 'SOL',
    status: 'COMPLETED',
    fromAddress: 'USER003',
    toAddress: 'USER004',
    requestTime: '2024-03-16T09:15:00Z',
    completionTime: '2024-03-16T09:15:05Z',
    note: 'Internal transfer'
  }
];

const TransactionManagement = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [filters, setFilters] = useState({
    type: '',
    subType: '',
    status: '',
    search: '',
    startDate: '',
    endDate: ''
  });

  const handleViewDetails = (tx: Transaction) => {
    setSelectedTx(tx);
    setDetailsOpen(true);
  };

  const handleApproveTransaction = async (tx: Transaction) => {
    try {
      // API call would go here
      setSnackbar({
        open: true,
        message: `Transaction ${tx.id} approved successfully`,
        severity: 'success'
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Failed to approve transaction',
        severity: 'error'
      });
    }
  };

  const handleRejectTransaction = async (tx: Transaction) => {
    setSelectedTx(tx);
    setRejectDialogOpen(true);
  };

  const confirmReject = async (reason: string) => {
    if (!selectedTx) return;
    
    try {
      // API call would go here
      setSnackbar({
        open: true,
        message: `Transaction ${selectedTx.id} rejected`,
        severity: 'success'
      });
      setRejectDialogOpen(false);
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Failed to reject transaction',
        severity: 'error'
      });
    }
  };

  const handleCopyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setSnackbar({
      open: true,
      message: 'Copied to clipboard',
      severity: 'success'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED': return 'success';
      case 'PENDING': return 'warning';
      case 'PROCESSING': return 'info';
      case 'FAILED': return 'error';
      case 'REJECTED': return 'error';
      default: return 'default';
    }
  };

  const filteredTransactions = mockTransactions.filter(tx => {
    return (
      (!filters.type || tx.type === filters.type) &&
      (!filters.subType || tx.subType === filters.subType) &&
      (!filters.status || tx.status === filters.status) &&
      (!filters.search || 
        tx.id.toLowerCase().includes(filters.search.toLowerCase()) ||
        tx.userId.toLowerCase().includes(filters.search.toLowerCase()) ||
        tx.userName.toLowerCase().includes(filters.search.toLowerCase()) ||
        (tx.txHash && tx.txHash.toLowerCase().includes(filters.search.toLowerCase())))
    );
  });

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Transaction Management
      </Typography>

      {/* Filters */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <TextField
            label="Search"
            size="small"
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            placeholder="TX ID, User ID, Name, Hash"
            InputProps={{
              startAdornment: <SearchIcon className="w-4 h-4 mr-2" />
            }}
          />
          
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Type</InputLabel>
            <Select
              value={filters.type}
              label="Type"
              onChange={(e) => setFilters({ ...filters, type: e.target.value })}
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="DEPOSIT">Deposit</MenuItem>
              <MenuItem value="WITHDRAW">Withdraw</MenuItem>
              <MenuItem value="TRANSFER">Transfer</MenuItem>
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Sub Type</InputLabel>
            <Select
              value={filters.subType}
              label="Sub Type"
              onChange={(e) => setFilters({ ...filters, subType: e.target.value })}
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="ON_CHAIN">On-chain</MenuItem>
              <MenuItem value="OFF_CHAIN">Off-chain</MenuItem>
              <MenuItem value="INTERNAL">Internal</MenuItem>
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={filters.status}
              label="Status"
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="PENDING">Pending</MenuItem>
              <MenuItem value="PROCESSING">Processing</MenuItem>
              <MenuItem value="COMPLETED">Completed</MenuItem>
              <MenuItem value="FAILED">Failed</MenuItem>
              <MenuItem value="REJECTED">Rejected</MenuItem>
            </Select>
          </FormControl>

          <TextField
            label="Start Date"
            type="date"
            size="small"
            value={filters.startDate}
            onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
            InputLabelProps={{ shrink: true }}
          />

          <TextField
            label="End Date"
            type="date"
            size="small"
            value={filters.endDate}
            onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
            InputLabelProps={{ shrink: true }}
          />

          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={() => setFilters({
              type: '',
              subType: '',
              status: '',
              search: '',
              startDate: '',
              endDate: ''
            })}
          >
            Reset
          </Button>
        </Box>
      </Paper>

      {/* Summary Cards */}
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 2, mb: 3 }}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="subtitle2" color="text.secondary">Pending Transactions</Typography>
          <Typography variant="h4">
            {mockTransactions.filter(tx => tx.status === 'PENDING').length}
          </Typography>
        </Paper>
        <Paper sx={{ p: 2 }}>
          <Typography variant="subtitle2" color="text.secondary">Today's Volume</Typography>
          <Typography variant="h4">45.8 SOL</Typography>
        </Paper>
        <Paper sx={{ p: 2 }}>
          <Typography variant="subtitle2" color="text.secondary">Success Rate</Typography>
          <Typography variant="h4">98.5%</Typography>
        </Paper>
        <Paper sx={{ p: 2 }}>
          <Typography variant="subtitle2" color="text.secondary">Failed Transactions</Typography>
          <Typography variant="h4" color="error.main">
            {mockTransactions.filter(tx => tx.status === 'FAILED').length}
          </Typography>
        </Paper>
      </Box>

      {/* Transactions Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>TX ID</TableCell>
              <TableCell>User</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Request Time</TableCell>
              <TableCell>Completion Time</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredTransactions
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((tx) => (
                <TableRow key={tx.id}>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      {tx.id}
                      {tx.txHash && (
                        <Tooltip title="Copy Hash">
                          <IconButton 
                            size="small" 
                            color="primary"
                            onClick={() => handleCopyToClipboard(tx.txHash!)}
                          >
                            <CopyIcon className="w-4 h-4" />
                          </IconButton>
                        </Tooltip>
                      )}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box>
                      <Typography variant="body2">{tx.userName}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {tx.userId}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box>
                      <Typography variant="body2">{tx.type}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {tx.subType}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography color={tx.type === 'DEPOSIT' ? 'success.main' : 'error.main'}>
                      {tx.type === 'DEPOSIT' ? '+' : '-'}{tx.amount} {tx.currency}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={tx.status}
                      color={getStatusColor(tx.status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    {new Date(tx.requestTime).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    {tx.completionTime ? new Date(tx.completionTime).toLocaleString() : '-'}
                  </TableCell>
                  <TableCell align="center">
                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                      <Tooltip title="View Details">
                        <IconButton size="small" onClick={() => handleViewDetails(tx)}>
                          <EyeIcon className="w-4 h-4" />
                        </IconButton>
                      </Tooltip>
                      {tx.status === 'PENDING' && (
                        <>
                          <Tooltip title="Approve">
                            <IconButton 
                              size="small" 
                              color="success"
                              onClick={() => handleApproveTransaction(tx)}
                            >
                              <ApproveIcon className="w-4 h-4" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Reject">
                            <IconButton 
                              size="small" 
                              color="error"
                              onClick={() => handleRejectTransaction(tx)}
                            >
                              <RejectIcon className="w-4 h-4" />
                            </IconButton>
                          </Tooltip>
                        </>
                      )}
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
        <TablePagination
          component="div"
          count={filteredTransactions.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(_, newPage) => setPage(newPage)}
          onRowsPerPageChange={(event) => {
            setRowsPerPage(parseInt(event.target.value, 10));
            setPage(0);
          }}
        />
      </TableContainer>

      {/* Transaction Details Dialog */}
      <TransactionDetailsDialog
        open={detailsOpen}
        onClose={() => setDetailsOpen(false)}
        transaction={selectedTx}
      />

      {/* Reject Transaction Dialog */}
      <RejectTransactionDialog
        open={rejectDialogOpen}
        onClose={() => setRejectDialogOpen(false)}
        onConfirm={confirmReject}
      />

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert 
          onClose={() => setSnackbar({ ...snackbar, open: false })} 
          severity={snackbar.severity as 'success' | 'error'}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default TransactionManagement;

