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
  Typography,
  Button,
  IconButton,
  Avatar,
  Chip,
  Tabs,
  Tab,
  TextField,
  Card,
  CardContent,
  Menu,
  MenuItem,
  Tooltip
} from '@mui/material';
import { EditIcon, EllipsisVerticalIcon as MoreVertIcon, SearchIcon, GiftIcon, WalletIcon, BellIcon, ShieldIcon, MapPinIcon, Copy } from 'lucide-react';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
};
const transactions = [
  { id: '#5434', date: '2024-03-16', type: 'Deposit', status: 'Completed', amount: 73.98, asset: 'SOL' },
  { id: '#6745', date: '2024-03-03', type: 'Withdrawal', status: 'Completed', amount: -100.39, asset: 'ETH' },
  { id: '#6087', date: '2024-02-15', type: 'Transfer', status: 'Pending', amount: -809.26, asset: 'BTC' },
  { id: '#7825', date: '2024-02-05', type: 'Deposit', status: 'Pending', amount: 617.64, asset: 'SOL' },
  { id: '#5604', date: '2024-01-18', type: 'Transfer', status: 'Completed', amount: -384.41, asset: 'ETH' },
  { id: '#5390', date: '2024-01-14', type: 'Withdrawal', status: 'Processing', amount: -162.85, asset: 'BTC' }
];
const CustomerDetails = () => {
  const [tabValue, setTabValue] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(6);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredTransactions, setFilteredTransactions] = useState(transactions);

  const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const term = event.target.value.toLowerCase();
    setSearchTerm(term);
    const filtered = transactions.filter(
      (transaction) =>
        transaction.id.toLowerCase().includes(term) ||
        transaction.type.toLowerCase().includes(term) ||
        transaction.status.toLowerCase().includes(term) ||
        transaction.amount.toString().includes(term) ||
        transaction.asset.toLowerCase().includes(term)
    );
    setFilteredTransactions(filtered);
  };

  const customerData = {
    id: 'CUS0001',
    name: 'Thanh Truong',
    email: 'thanh@gmail.com',
    phone: '0987474156',
    status: 'Active',
    country: 'Viet Nam',
    balance: 7480,
    loyaltyTier: 'Platinum member',
    pointsToNextTier: 3000,
    totalTransactions: 663,
    totalSpent: 2404.19,
    avatar: '/api/placeholder/150/150',
    subWallet: '26Mt8e5sYdpMs3X7RpTpSKCfAwss71GR3wnKmUmyvaWk'
  };



  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h5" sx={{ mb: 1 }}>
            Customer ID #{customerData.id}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Created January 01, 2025, 5:48
          </Typography>
        </Box>
        <Button variant="outlined" color="error">
          Disable Customer
        </Button>
      </Box>

      {/* Navigation Tabs */}
      <Tabs
        value={tabValue}
        onChange={(_, newValue) => setTabValue(newValue)}
        sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}
      >
        <Tab icon={<WalletIcon className="w-4 h-4 mr-2" />} label="Overview" iconPosition="start" />
        <Tab icon={<ShieldIcon className="w-4 h-4 mr-2" />} label="Security" iconPosition="start" />
        <Tab icon={<MapPinIcon className="w-4 h-4 mr-2" />} label="Address & Billing" iconPosition="start" />
        <Tab icon={<BellIcon className="w-4 h-4 mr-2" />} label="Notifications" iconPosition="start" />
      </Tabs>

      <TabPanel value={tabValue} index={0}>
        <Box sx={{ display: 'grid', gridTemplateColumns: '350px 1fr', gap: 3 }}>
          {/* Left Column - Customer Info */}
          <Box>
            <Paper sx={{ p: 3, mb: 3 }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
                <Avatar
                  src={customerData.avatar}
                  sx={{ width: 120, height: 120, mb: 2 }}
                />
                <Typography variant="h6">{customerData.name}</Typography>
                <Typography color="text.secondary">
                  Customer ID #{customerData.id}
                </Typography>
              </Box>

              <Box sx={{ mt: 3 }}>
                <Typography variant="subtitle2" gutterBottom>Details</Typography>
                <Box sx={{ display: 'grid', gap: 2 }}>
                  <Box>
                    <Typography variant="caption" color="text.secondary">Username:</Typography>
                    <Typography>{customerData.name}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary">Billing Email:</Typography>
                    <Typography>{customerData.email}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary">Status:</Typography>
                    <Chip
                      label={customerData.status}
                      color="success"
                      size="small"
                      sx={{ ml: 1 }}
                    />
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary">Contact:</Typography>
                    <Typography>{customerData.phone}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary">Country:</Typography>
                    <Typography>{customerData.country}</Typography>
                  </Box>

                  <Box>
                    <Typography variant="caption" color="text.secondary">Sub wallet:</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                      <Typography 
                        sx={{ 
                          wordBreak: 'break-all', 
                          mr: 1,
                          flex: 1
                        }}
                      >
                        {customerData.subWallet}
                      </Typography>
                      <Tooltip title="Copy to clipboard">
                        <IconButton
                          onClick={() => {
                            navigator.clipboard.writeText(customerData.subWallet);
                          }}
                          size="small"
                        >
                          <Copy fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Box>
                </Box>
                {/* <Button 
                  variant="contained"
                  fullWidth
                  sx={{ mt: 3 }}
                  startIcon={<EditIcon />}
                >
                  Edit Details
                </Button> */}
              </Box>
            </Paper>
          </Box>

          {/* Right Column - Stats & Transactions */}
          <Box>
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 3, mb: 3 }}>
              {/* Account Balance Card */}
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <WalletIcon className="w-5 h-5 mr-2" />
                    <Typography variant="h6">Account Balance</Typography>
                  </Box>
                  <Typography variant="h4" color="primary.main" sx={{ mb: 1 }}>
                    ${customerData.balance}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Account balance for next transaction
                  </Typography>
                </CardContent>
              </Card>

              {/* Loyalty Program Card */}
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <GiftIcon className="w-5 h-5 mr-2" />
                    <Typography variant="h6">Loyalty Program</Typography>
                  </Box>
                  <Chip
                    label={customerData.loyaltyTier}
                    color="success"
                    sx={{ mb: 1 }}
                  />
                  <Typography variant="body2" color="text.secondary">
                    {customerData.pointsToNextTier} points to next tier
                  </Typography>
                </CardContent>
              </Card>
            </Box>

            {/* Transactions Table */}
            <Paper>
              <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6">Transactions</Typography>
                <TextField
                  size="small"
                  placeholder="Search Transaction"
                  value={searchTerm}
                  onChange={handleSearch}
                  InputProps={{
                    startAdornment: <SearchIcon className="w-4 h-4 mr-2" />,
                  }}
                />
              </Box>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Transaction ID</TableCell>
                      <TableCell>Date</TableCell>
                      <TableCell>Type</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Asset</TableCell>
                      <TableCell align="right">Amount</TableCell>
                      <TableCell align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredTransactions
                      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      .map((transaction) => (
                        <TableRow key={transaction.id}>
                          <TableCell>{transaction.id}</TableCell>
                          <TableCell>{new Date(transaction.date).toLocaleDateString()}</TableCell>
                          <TableCell>{transaction.type}</TableCell>
                          <TableCell>
                            <Chip
                              label={transaction.status}
                              color={
                                transaction.status === 'Completed' ? 'success' :
                                  transaction.status === 'Pending' ? 'warning' :
                                    'info'
                              }
                              size="small"
                            />
                          </TableCell>
                          <TableCell>{transaction.asset}</TableCell>
                          <TableCell align="right" sx={{
                            color: transaction.amount > 0 ? 'success.main' : 'error.main'
                          }}>
                            {Math.abs(transaction.amount).toFixed(2)}
                          </TableCell>
                          <TableCell align="right">
                            <IconButton
                              size="small"
                              onClick={handleMenuClick}
                            >
                              <MoreVertIcon />
                            </IconButton>
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
            </Paper>
          </Box>
        </Box>
      </TabPanel>

      {/* Action Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleMenuClose}>View Details</MenuItem>
        <MenuItem onClick={handleMenuClose}>Download Receipt</MenuItem>
        <MenuItem onClick={handleMenuClose} sx={{ color: 'error.main' }}>Cancel Transaction</MenuItem>
      </Menu>
    </Box>
  );
};

export default CustomerDetails;

