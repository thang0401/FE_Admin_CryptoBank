import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Grid,
  Chip
} from '@mui/material';
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

interface TransactionDetailsDialogProps {
  open: boolean;
  onClose: () => void;
  transaction: Transaction | null;
}

const TransactionDetailsDialog: React.FC<TransactionDetailsDialogProps> = ({
  open,
  onClose,
  transaction
}) => {
  if (!transaction) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Transaction Details</DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2">Transaction ID</Typography>
            <Typography>{transaction.id}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2">User</Typography>
            <Typography>{transaction.userName} ({transaction.userId})</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2">Type</Typography>
            <Typography>{transaction.type} ({transaction.subType})</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2">Amount</Typography>
            <Typography>{transaction.amount} {transaction.currency}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2">Status</Typography>
            <Chip label={transaction.status} color={
              transaction.status === 'COMPLETED' ? 'success' :
              transaction.status === 'PENDING' ? 'warning' :
              transaction.status === 'FAILED' ? 'error' :
              'default'
            } />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2">Request Time</Typography>
            <Typography>{new Date(transaction.requestTime).toLocaleString()}</Typography>
          </Grid>
          {transaction.completionTime && (
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2">Completion Time</Typography>
              <Typography>{new Date(transaction.completionTime).toLocaleString()}</Typography>
            </Grid>
          )}
          {transaction.fromAddress && (
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2">From Address</Typography>
              <Typography>{transaction.fromAddress}</Typography>
            </Grid>
          )}
          {transaction.toAddress && (
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2">To Address</Typography>
              <Typography>{transaction.toAddress}</Typography>
            </Grid>
          )}
          {transaction.txHash && (
            <Grid item xs={12}>
              <Typography variant="subtitle2">Transaction Hash</Typography>
              <Typography>{transaction.txHash}</Typography>
            </Grid>
          )}
          {transaction.note && (
            <Grid item xs={12}>
              <Typography variant="subtitle2">Note</Typography>
              <Typography>{transaction.note}</Typography>
            </Grid>
          )}
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default TransactionDetailsDialog;

