import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Box
} from '@mui/material';

interface Customer {
  id: string;
  status_id: string;
  ranking_id: string;
  kyc_status: boolean;
}

interface EditCustomerDialogProps {
  open: boolean;
  onClose: () => void;
  customer: Customer | null;
  onSave: (updatedCustomer: Customer) => void;
}

const statusOptions = [
  { id: 'S001', label: 'Active' },
  { id: 'S002', label: 'Inactive' },
  { id: 'S003', label: 'Suspended' }
];

const rankingOptions = [
  { id: 'R001', label: 'Bronze' },
  { id: 'R002', label: 'Silver' },
  { id: 'R003', label: 'Gold' },
  { id: 'R004', label: 'Platinum' }
];

const EditCustomerDialog: React.FC<EditCustomerDialogProps> = ({
  open,
  onClose,
  customer,
  onSave
}) => {
  const [editedCustomer, setEditedCustomer] = useState<Customer | null>(null);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (customer) {
      setEditedCustomer(customer);
      // Giả sử notes được lưu trữ ở đâu đó, ví dụ trong một trường riêng biệt
      setNotes('');
    }
  }, [customer]);

  const handleChange = (field: keyof Customer, value: any) => {
    if (editedCustomer) {
      setEditedCustomer({ ...editedCustomer, [field]: value });
    }
  };

  const handleSave = () => {
    if (editedCustomer) {
      onSave(editedCustomer);
      // Xử lý lưu notes ở đây
    }
  };

  if (!editedCustomer) return null;

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Chỉnh sửa thông tin khách hàng</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: 300, mt: 2 }}>
          <FormControl fullWidth>
            <InputLabel>Trạng thái tài khoản</InputLabel>
            <Select
              value={editedCustomer.status_id}
              onChange={(e) => handleChange('status_id', e.target.value)}
              label="Trạng thái tài khoản"
            >
              {statusOptions.map((option) => (
                <MenuItem key={option.id} value={option.id}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <InputLabel>Hạng thành viên</InputLabel>
            <Select
              value={editedCustomer.ranking_id}
              onChange={(e) => handleChange('ranking_id', e.target.value)}
              label="Hạng thành viên"
            >
              {rankingOptions.map((option) => (
                <MenuItem key={option.id} value={option.id}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <InputLabel>Trạng thái KYC</InputLabel>
            <Select
              value={editedCustomer.kyc_status ? 'verified' : 'unverified'}
              onChange={(e) => handleChange('kyc_status', e.target.value === 'verified')}
              label="Trạng thái KYC"
            >
              <MenuItem value="verified">Đã xác minh</MenuItem>
              <MenuItem value="unverified">Chưa xác minh</MenuItem>
            </Select>
          </FormControl>
          <TextField
            label="Ghi chú"
            multiline
            rows={4}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Hủy</Button>
        <Button onClick={handleSave} variant="contained" color="primary">
          Lưu thay đổi
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditCustomerDialog;

