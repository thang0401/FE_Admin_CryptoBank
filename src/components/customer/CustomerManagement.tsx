import React, { useState, useEffect } from 'react';
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
    MenuItem,
    Chip,
    Tooltip,
    FormControl,
    InputLabel,
    Select
} from '@mui/material';
import {
    Delete as DeleteIcon,
    Search as SearchIcon,
    Refresh as RefreshIcon,
    Download as DownloadIcon
} from '@mui/icons-material';
import VisibilityIcon from "@mui/icons-material/Visibility";
import * as XLSX from 'xlsx';
import { useRouter } from "next/router";

interface Customer {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    phone_num: string;
    id_number: string;
    ranking_id: string;
    status_id: string;
    created_date: string;
    is_activated: boolean;
    kyc_status: string;
    type_siging_in: string;
    modified_by: string;
    modified_date: string;
}

const rankingOptions = [
    { id: 'R001', label: 'Bronze' },
    { id: 'R002', label: 'Silver' },
    { id: 'R003', label: 'Gold' },
    { id: 'R004', label: 'Platinum' }
];

const statusOptions = [
    { id: 'S001', label: 'Active' },
    { id: 'S002', label: 'Inactive' },
    { id: 'S003', label: 'Suspended' }
];

const CustomerManagement = () => {
    const router = useRouter();
    const [page, setPage] = useState<number>(0);
    const [rowsPerPage, setRowsPerPage] = useState<number>(10);
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    
    const [filters, setFilters] = useState<{
        user_id: string;
        ranking_id: string;
        phone: string;
        name: string;
        id_card: string;
    }>({
        user_id: '',
        ranking_id: '',
        phone: '',
        name: '',
        id_card: ''
    });

    useEffect(() => {
        const fetchCustomers = async () => {
            try {
                setLoading(true);
                const response = await fetch("http://14.225.206.68:8000/api/users", {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    }
                });
                
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                
                const data: { message: string; object: any[] } = await response.json();
                const formattedCustomers: Customer[] = data.object.map((customer: any) => ({
                    id: customer.id || `USR${Math.random().toString(36).substr(2, 9)}`,
                    // id: customer.id || ``,
                    first_name: customer.firstName || '',
                    last_name: customer.lastName || '',
                    email: customer.email || '',
                    phone_num: customer.phoneNumber || '',
                    id_number: customer.walletAddress || '',
                    ranking_id: 'R001',
                    status_id: customer.hasAcceptedTerms ? 'S001' : 'S002',
                    created_date: customer.dateOfBirth || new Date().toISOString(),
                    is_activated: customer.kycStatus || false,
                    kyc_status: customer.kycStatus ? 'verified' : 'pending',
                    type_siging_in: 'email',
                    modified_by: 'system',
                    modified_date: customer.lastLoginAt || new Date().toISOString()
                }));
                
                setCustomers(formattedCustomers);
            } catch (error) {
                console.error('Error fetching customers:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchCustomers();
    }, []);

    const handleChangePage = (event: unknown, newPage: number) => {
         setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleFilterChange = (field: string, value: string) => {
        setFilters(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const resetFilters = () => {
        setFilters({
            user_id: '',
            ranking_id: '',
            phone: '',
            name: '',
            id_card: ''
        });
    };

    const handleEditClick = (customer: Customer) => {
        // Logic cho edit nếu cần
    };

    const exportToExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(customers);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Customers");
        XLSX.writeFile(workbook, "customers.xlsx");
    };

    const filteredCustomers: Customer[] = customers.filter((customer: Customer) => {
        const matchUserId = customer.id.toLowerCase().includes(filters.user_id.toLowerCase());
        const matchRanking = !filters.ranking_id || customer.ranking_id === filters.ranking_id;
        const matchPhone = customer.phone_num.includes(filters.phone);
        const matchName = (customer.first_name + ' ' + customer.last_name)
            .toLowerCase()
            .includes(filters.name.toLowerCase());
        const matchIdCard = customer.id_number.includes(filters.id_card);

        return matchUserId && matchRanking && matchPhone && matchName && matchIdCard;
    });

    const handleAccountSelect = (id: string) => {
        router.push(`/customer-management/${id}`);
    };

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" component="h1" sx={{ mb: 3 }}>
                Customer Management
            </Typography>
            
            {loading ? (
                <Typography>Loading customers...</Typography>
            ) : (
                <>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
                        <Button
                            variant="contained"
                            color="primary"
                            startIcon={<DownloadIcon />}
                            onClick={exportToExcel}
                        >
                            Export
                        </Button>
                    </Box>

                    <Paper sx={{ p: 2, mb: 3 }}>
                        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                            <TextField
                                label="User ID"
                                size="small"
                                value={filters.user_id}
                                onChange={(e) => handleFilterChange('user_id', e.target.value)}
                            />
                            <TextField
                                label="Name"
                                size="small"
                                value={filters.name}
                                onChange={(e) => handleFilterChange('name', e.target.value)}
                            />
                            <TextField
                                label="Phone"
                                size="small"
                                value={filters.phone}
                                onChange={(e) => handleFilterChange('phone', e.target.value)}
                            />
                            {/* <TextField
                                label="ID Card"
                                size="small"
                                value={filters.id_card}
                                onChange={(e) => handleFilterChange('id_card', e.target.value)}
                            /> */}
                            <FormControl size="small" sx={{ minWidth: 120 }}>
                                <InputLabel>Ranking</InputLabel>
                                <Select
                                    value={filters.ranking_id}
                                    label="Ranking"
                                    onChange={(e) => handleFilterChange('ranking_id', e.target.value as string)}
                                >
                                    <MenuItem value="">All</MenuItem>
                                    {rankingOptions.map(rank => (
                                        <MenuItem key={rank.id} value={rank.id}>{rank.label}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            <Button
                                variant="outlined"
                                startIcon={<RefreshIcon />}
                                onClick={resetFilters}
                            >
                                Reset Filters
                            </Button>
                        </Box>
                    </Paper>

                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>ID</TableCell>
                                    <TableCell>Name</TableCell>
                                    <TableCell>Email</TableCell>
                                    <TableCell>Phone</TableCell>
                                    <TableCell>ID Number</TableCell>
                                    <TableCell>Status</TableCell>
                                    <TableCell>Created Date</TableCell>
                                    <TableCell>KYC Status</TableCell>
                                    <TableCell>Sign-in Type</TableCell>
                                    <TableCell align="center">Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {filteredCustomers
                                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    .map((customer: Customer) => (
                                        <TableRow key={customer.id}>
                                            <TableCell>{customer.id}</TableCell>
                                            <TableCell>{`${customer.first_name} ${customer.last_name}`}</TableCell>
                                            <TableCell>{customer.email}</TableCell>
                                            <TableCell>{customer.phone_num}</TableCell>
                                            <TableCell>{customer.id_number}</TableCell>
                                            <TableCell>
                                                <Chip
                                                    label={customer.is_activated ? 'Active' : 'Inactive'}
                                                    color={customer.is_activated ? 'success' : 'default'}
                                                    size="small"
                                                />
                                            </TableCell>
                                            <TableCell>{new Date(customer.created_date).toLocaleDateString()}</TableCell>
                                            <TableCell>
                                                <Chip
                                                    label={customer.kyc_status}
                                                    color={customer.kyc_status === 'verified' ? 'success' : 'warning'}
                                                    size="small"
                                                />
                                            </TableCell>
                                            <TableCell>{customer.type_siging_in}</TableCell>
                                            <TableCell align="center">
                                                <Tooltip title="View">
                                                    <IconButton onClick={() => handleAccountSelect(customer.id)}>
                                                        <VisibilityIcon />
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
                            count={filteredCustomers.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                        />
                    </TableContainer>
                </>
            )}
        </Box>
    );
};

export default CustomerManagement;