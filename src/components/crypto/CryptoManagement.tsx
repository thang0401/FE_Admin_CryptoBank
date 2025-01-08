import React, { useState } from 'react';
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Switch,
  FormControlLabel,
  Snackbar,
  Alert,
  Tooltip,
  Chip
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Refresh as RefreshIcon,
  Search as SearchIcon
} from '@mui/icons-material';

// Types definition
interface TotalWallet {
  id: string;
  name: string;
  description: string;
  unit: string;
  quantity: number;
  totalQuantity: number;
  isActivated: boolean;
  createdDate: string;
  createdBy: string;
  modifiedDate: string;
  modifiedBy: string;
  assetImage: string;
  deleteYn: boolean;
}

const CryptoManagement = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedCrypto, setSelectedCrypto] = useState<TotalWallet | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Form state
  const [formData, setFormData] = useState<Partial<TotalWallet>>({
    name: '',
    description: '',
    unit: '',
    quantity: 0,
    isActivated: true,
  });

  // Mock data - replace with actual API call
  const [cryptos, setCryptos] = useState<TotalWallet[]>([
    {
      id: '1',
      name: 'Bitcoin',
      description: 'Digital gold',
      unit: 'BTC',
      quantity: 2.5,
      totalQuantity: 2.5,
      isActivated: true,
      createdDate: '2024-01-01',
      createdBy: 'admin',
      modifiedDate: '2024-01-01',
      modifiedBy: 'admin',
      assetImage: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1.png',
      deleteYn: false
    },
    {
      id: '2',
      name: 'Etherum',
      description: 'Digital gold',
      unit: 'ETH',
      quantity: 2.5,
      totalQuantity: 2.5,
      isActivated: true,
      createdDate: '2024-01-01',
      createdBy: 'admin',
      modifiedDate: '2024-01-01',
      modifiedBy: 'admin',
      assetImage: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png',
      deleteYn: false
    },
    // Add more mock data...
  ]);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleOpenDialog = (crypto?: TotalWallet) => {
    if (crypto) {
      setSelectedCrypto(crypto);
      setFormData(crypto);
    } else {
      setSelectedCrypto(null);
      setFormData({
        name: '',
        description: '',
        unit: '',
        quantity: 0,
        isActivated: true,
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedCrypto(null);
  };

  const handleSubmit = () => {
    if (selectedCrypto) {
      setCryptos(cryptos.map(crypto => 
        crypto.id === selectedCrypto.id ? {...crypto, ...formData} : crypto
      ));
    } else {
      const newCrypto: TotalWallet = {
        id: (cryptos.length + 1).toString(),
        name: formData.name || '', // Cung cấp giá trị mặc định
        description: formData.description || '', // Cung cấp giá trị mặc định
        unit: formData.unit || '', // Cung cấp giá trị mặc định
        quantity: formData.quantity || 0,
        totalQuantity: formData.quantity || 0,
        isActivated: formData.isActivated ?? true,
        createdDate: new Date().toISOString(),
        modifiedDate: new Date().toISOString(),
        createdBy: 'admin',
        modifiedBy: 'admin',
        assetImage: 'default.png',
        deleteYn: false,
      };
      setCryptos([...cryptos, newCrypto]);
    }
    setSnackbar({
      open: true, 
      message: selectedCrypto ? 'Updated successfully' : 'Added successfully',
      severity: 'success'
    });
    handleCloseDialog();
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Crypto Wallet Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Add New Crypto
        </Button>
      </Box>

      {/* Search and Filters */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <TextField
            label="Search Crypto"
            variant="outlined"
            size="small"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: <SearchIcon sx={{ mr: 1 }} />,
            }}
          />
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
          >
            Refresh
          </Button>
        </Box>
      </Paper>

      {/* Data Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Asset</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Unit</TableCell>
              <TableCell align="right">Quantity</TableCell>
              <TableCell align="right">Total Quantity</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Last Modified</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {cryptos
              .filter(crypto =>
                crypto.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                crypto.unit.toLowerCase().includes(searchTerm.toLowerCase())
              )
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((crypto) => (
                <TableRow key={crypto.id}>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <img
                        src={crypto.assetImage}
                        alt={crypto.name}
                        style={{ width: 32, height: 32, borderRadius: '50%' }}
                      />
                    </Box>
                  </TableCell>
                  <TableCell>{crypto.name}</TableCell>
                  <TableCell>{crypto.unit}</TableCell>
                  <TableCell align="right">{crypto.quantity}</TableCell>
                  <TableCell align="right">{crypto.totalQuantity}</TableCell>
                  <TableCell>
                    <Chip
                      label={crypto.isActivated ? 'Active' : 'Inactive'}
                      color={crypto.isActivated ? 'success' : 'default'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{new Date(crypto.modifiedDate).toLocaleDateString()}</TableCell>
                  <TableCell align="center">
                    <Tooltip title="Edit">
                      <IconButton onClick={() => handleOpenDialog(crypto)}>
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton color="error">
                        {/* <DeleteIcon /> */}
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={cryptos.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>

      {/* Add/Edit Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {selectedCrypto ? 'Edit Crypto' : 'Add New Crypto'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
            <TextField
              label="Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              fullWidth
            />
            <TextField
              label="Description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              fullWidth
              multiline
              rows={2}
            />
            <TextField
              label="Unit"
              value={formData.unit}
              onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
              fullWidth
            />
            <TextField
              label="Quantity"
              type="number"
              value={formData.quantity}
              onChange={(e) => setFormData({ ...formData, quantity: parseFloat(e.target.value) })}
              fullWidth
            />
            <FormControlLabel
              control={
                <Switch
                  checked={formData.isActivated}
                  onChange={(e) => setFormData({ ...formData, isActivated: e.target.checked })}
                />
              }
              label="Active"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {selectedCrypto ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity as any}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default CryptoManagement;