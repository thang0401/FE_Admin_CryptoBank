import React, { useState, useCallback, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  InputAdornment,
  Chip,
  Button,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import SearchIcon from '@mui/icons-material/Search';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ClearIcon from '@mui/icons-material/Clear';
import { styled } from '@mui/material/styles';
import { useRouter } from 'next/router';
import { format } from 'date-fns';
import axios from 'axios';

// Styled Card
const StyledCard = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
}));

// Interface cho dữ liệu từ BE
interface SavingsAccount {
  id: string;
  user_id: string;
  user_firstname: string;
  user_lastname: string;
  heirStatus: boolean;
  balance: number;
  amount_month: number;
  type: string;
  startDate: string;
  endDate: string;
}

interface Filters {
  userId: string;
  term: string;
  dateFrom: Date | null;
  dateTo: Date | null;
  ownerName: string;
}

// StatusChip component
const StatusChip = ({ status }: { status: boolean }) => {
  const label = status ? 'Has Heir' : 'No Heir';
  const bgColor = status ? '#e8f5e9' : '#fff3e0';
  const textColor = status ? '#43a047' : '#f57c00';
  return <Chip label={label} style={{ backgroundColor: bgColor, color: textColor }} />;
};

// Format ngày
const formatDate = (dateString: string) => {
  return format(new Date(dateString), 'dd/MM/yyyy');
};
//Rut ngan AccountID
const shortenAccountId = (id: string) =>{
  const firstPart = id.split('-')[0]; //Lay phan dau truoc dau -
  return `USR-${firstPart}`;
}
const SavingsManagement: React.FC = () => {
  const router = useRouter();
  const [filters, setFilters] = useState<Filters>({
    userId: '',
    term: '',
    dateFrom: null,
    dateTo: null,
    ownerName: '',
  });
  const [originalAccounts, setOriginalAccounts] = useState<SavingsAccount[]>([]); // Lưu dữ liệu gốc
  const [filteredAccounts, setFilteredAccounts] = useState<SavingsAccount[]>([]);
  const [loading, setLoading] = useState(false);

  const api = axios.create({
    baseURL: 'http://localhost:8080/saving',
  });

  const fetchSavingsAccounts = async () => {
    try {
      setLoading(true);
      const response = await api.get('/get-saving-list');
      console.log('Data from BE:', response.data);
      setOriginalAccounts(response.data); // Lưu dữ liệu gốc
      setFilteredAccounts(response.data); // Ban đầu hiển thị tất cả
    } catch (error) {
      console.error('Error fetching savings accounts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (field: keyof Filters, value: any) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const handleAccountSelect = (id: string) => {
    router.push(`/savings-management/${id}`);
  };

  const handleClearFilters = () => {
    setFilters({
      userId: '',
      term: '',
      dateFrom: null,
      dateTo: null,
      ownerName: '',
    });
    setFilteredAccounts(originalAccounts); // Khôi phục dữ liệu gốc khi clear
  };

  const applyFilters = useCallback(() => {
    let filtered = [...originalAccounts]; // Lấy từ dữ liệu gốc

    if (filters.userId) {
      filtered = filtered.filter((account) =>
        account.user_id.toLowerCase().includes(filters.userId.toLowerCase())
      );
    }
    if (filters.term) {
      filtered = filtered.filter((account) =>
        `${account.amount_month} ${account.type}`
          .toLowerCase()
          .includes(filters.term.toLowerCase())
      );
    }
    if (filters.dateFrom) {
      filtered = filtered.filter((account) => new Date(account.startDate) >= filters.dateFrom!);
    }
    if (filters.dateTo) {
      filtered = filtered.filter((account) => new Date(account.startDate) <= filters.dateTo!);
    }
    if (filters.ownerName) {
      filtered = filtered.filter((account) =>
        `${account.user_firstname} ${account.user_lastname}`
          .toLowerCase()
          .includes(filters.ownerName.toLowerCase())
      );
    }

    setFilteredAccounts(filtered);
  }, [filters, originalAccounts]);

  useEffect(() => {
    fetchSavingsAccounts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filters, applyFilters]);

  return (
    <Box sx={{ p: 3 }}>
      <StyledCard>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Search Filters
          </Typography>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={2}>
              <TextField
                fullWidth
                label="User ID"
                value={filters.userId}
                onChange={(e) => handleFilterChange('userId', e.target.value)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                fullWidth
                label="Owner Name"
                value={filters.ownerName}
                onChange={(e) => handleFilterChange('ownerName', e.target.value)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} sm={2}>
              <TextField
                fullWidth
                label="Term"
                value={filters.term}
                onChange={(e) => handleFilterChange('term', e.target.value)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} sm={2}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="From Date"
                  value={filters.dateFrom}
                  onChange={(date) => handleFilterChange('dateFrom', date)}
                  slotProps={{
                    textField: { fullWidth: true },
                  }}
                  format="dd/MM/yyyy"
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12} sm={2}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="To Date"
                  value={filters.dateTo}
                  onChange={(date) => handleFilterChange('dateTo', date)}
                  slotProps={{
                    textField: { fullWidth: true },
                  }}
                  format="dd/MM/yyyy"
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12} sm={1}>
              <Button
                variant="outlined"
                color="secondary"
                startIcon={<ClearIcon />}
                onClick={handleClearFilters}
                fullWidth
                sx={{ height: '100%' }}
              >
                Clear
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </StyledCard>

      <StyledCard>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Savings Accounts
          </Typography>
          {loading ? (
            <Typography>Loading...</Typography>
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Account ID</TableCell>
                    <TableCell>User ID</TableCell>
                    <TableCell sx={{paddingLeft: 8}} >Owner</TableCell>
                    <TableCell>Heir Status</TableCell>
                    <TableCell>Balance</TableCell>
                    <TableCell>Term</TableCell>
                    <TableCell>Start Date</TableCell>
                    <TableCell>End Date</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredAccounts.length > 0 ? (
                    filteredAccounts.map((account) => (
                      <TableRow key={account.id}>
                        <TableCell>{shortenAccountId(account.id)}</TableCell>
                        <TableCell sx={{paddingLeft: 8}}>{account.user_id}</TableCell>
                        <TableCell>{`${account.user_firstname} ${account.user_lastname}`}</TableCell>
                        <TableCell>
                          <StatusChip status={account.heirStatus} />
                        </TableCell>
                        <TableCell>{account.balance.toFixed(2)} USDC</TableCell>
                        <TableCell>{`${account.amount_month} ${account.type}`}</TableCell>
                        <TableCell>{formatDate(account.startDate)}</TableCell>
                        <TableCell>{formatDate(account.endDate)}</TableCell>
                        <TableCell sx={{paddingLeft: 5}}>
                          <IconButton onClick={() => handleAccountSelect(account.id)}>
                            <VisibilityIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={9}>No data available</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </StyledCard>
    </Box>
  );
};

export default SavingsManagement;