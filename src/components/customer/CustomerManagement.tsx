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
    TextField,
    MenuItem,
    Chip,
    Tooltip,
    FormControl,
    InputLabel,
    Select
} from '@mui/material';
import {
    Edit as EditIcon,
    Delete as DeleteIcon,
    Search as SearchIcon,
    Refresh as RefreshIcon,
    Download as DownloadIcon
} from '@mui/icons-material';
import EditCustomerDialog from './EditCustomerDialog';
import * as XLSX from 'xlsx';

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
    kyc_status: boolean;
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
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    // Filter states
    const [filters, setFilters] = useState({
        user_id: '',
        ranking_id: '',
        phone: '',
        name: '',
        id_card: ''
    });

    // Mock data
    const [customers] = useState<Customer[]>([
        {
            id: 'USR001',
            first_name: 'John',
            last_name: 'Doe',
            email: 'john.doe@example.com',
            phone_num: '+1234567890',
            id_number: 'ID123456',
            ranking_id: 'R001',
            status_id: 'S001',
            created_date: '2024-01-01T00:00:00',
            is_activated: true,
            kyc_status: true,
            type_siging_in: 'email',
            modified_by: 'admin',
            modified_date: '2024-01-01T00:00:00'
        },
        // Add more mock data as needed
    ]);

    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

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
        setSelectedCustomer(customer);
        setEditDialogOpen(true);
    };
    // const handleRowClick = (customerId: string) => {
    //     navigate(`/customers/${customerId}`);
    // };

    const exportToExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(customers);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Customers");
        XLSX.writeFile(workbook, "customers.xlsx");
    };

    const filteredCustomers = customers.filter(customer => {
        const matchUserId = customer.id.toLowerCase().includes(filters.user_id.toLowerCase());
        const matchRanking = !filters.ranking_id || customer.ranking_id === filters.ranking_id;
        const matchPhone = customer.phone_num.includes(filters.phone);
        const matchName = (customer.first_name + ' ' + customer.last_name)
            .toLowerCase()
            .includes(filters.name.toLowerCase());
        const matchIdCard = customer.id_number.includes(filters.id_card);

        return matchUserId && matchRanking && matchPhone && matchName && matchIdCard;
    });

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" component="h1" sx={{ mb: 3 }}>
                Customer Management
            </Typography>

            {/* Filters */}
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
                    <TextField
                        label="ID Card"
                        size="small"
                        value={filters.id_card}
                        onChange={(e) => handleFilterChange('id_card', e.target.value)}
                    />
                    <FormControl size="small" sx={{ minWidth: 120 }}>
                        <InputLabel>Ranking</InputLabel>
                        <Select
                            value={filters.ranking_id}
                            label="Ranking"
                            onChange={(e) => handleFilterChange('ranking_id', e.target.value)}
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

            {/* Data Table */}
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Phone</TableCell>
                            <TableCell>ID Number</TableCell>
                            <TableCell>Ranking</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Created Date</TableCell>
                            <TableCell>KYC Status</TableCell>
                            <TableCell>Sign-in Type</TableCell>
                            <TableCell>Last Modified</TableCell>
                            <TableCell>Modified By</TableCell>
                            <TableCell align="center">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredCustomers
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((customer) => (
                                <TableRow key={customer.id}
                                // onClick={() => handleRowClick(customer.id)}
                                // sx={{ cursor: 'pointer' }}
                                >
                                    <TableCell>{customer.id}</TableCell>
                                    <TableCell>{`${customer.first_name} ${customer.last_name}`}</TableCell>
                                    <TableCell>{customer.email}</TableCell>
                                    <TableCell>{customer.phone_num}</TableCell>
                                    <TableCell>{customer.id_number}</TableCell>
                                    <TableCell>
                                        {rankingOptions.find(r => r.id === customer.ranking_id)?.label}
                                    </TableCell>
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
                                            label={customer.kyc_status ? 'Verified' : 'Unverified'}
                                            color={customer.kyc_status ? 'success' : 'warning'}
                                            size="small"
                                        />
                                    </TableCell>
                                    <TableCell>{customer.type_siging_in}</TableCell>
                                    <TableCell>{new Date(customer.modified_date).toLocaleDateString()}</TableCell>
                                    <TableCell>{customer.modified_by}</TableCell>
                                    <TableCell align="center">
                                        <Tooltip title="Edit">
                                            <IconButton onClick={() => handleEditClick(customer)}>
                                                <EditIcon />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Delete">
                                            <IconButton color="error">
                                                <DeleteIcon />
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
            <EditCustomerDialog
                open={editDialogOpen}
                onClose={() => setEditDialogOpen(false)}
                customer={selectedCustomer}
                onSave={(updatedCustomer) => {
                    // Xử lý cập nhật customer ở đây
                    console.log('Updated customer:', updatedCustomer);
                    setEditDialogOpen(false);
                }}
            />
        </Box>
    );
};

export default CustomerManagement;

