import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField
} from '@mui/material';

interface RejectTransactionDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void;
}

const RejectTransactionDialog: React.FC<RejectTransactionDialogProps> = ({
  open,
  onClose,
  onConfirm
}) => {
  const [reason, setReason] = useState('');

  const handleConfirm = () => {
    onConfirm(reason);
    setReason('');
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Reject Transaction</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          id="reason"
          label="Rejection Reason"
          type="text"
          fullWidth
          multiline
          rows={4}
          value={reason}
          onChange={(e) => setReason(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleConfirm} color="error">
          Reject
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default RejectTransactionDialog;

