"use client";

import React, { useState, useEffect } from 'react';
import axios from 'axios';
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
    kyc_status: boolean;
    status: string | null;
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
    { id: 'cvvvhgjme6nnaun2s4pg', label: 'Active' },
    { id: 'cvvvhjbme6nnaun2s4q0', label: 'Blocked' },
    { id: 'cvvvhlbme6nnaun2s4qg', label: 'Inactive' },
    { id: 'cvvvhqbme6nnaun2s4rg', label: 'Suspended' }
];

const kycStatusOptions = [
    { value: '', label: 'All' },
    { value: 'Approved', label: 'Approved' },
    { value: 'Pending', label: 'Pending' }
    // { value: 'Rejected', label: 'Rejected' }
];

const CustomerManagement = () => {
    const router = useRouter();
    const [page, setPage] = useState<number>(0);
    const [rowsPerPage, setRowsPerPage] = useState<number>(10);
    const [totalRows, setTotalRows] = useState<number>(0);
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    const [filters, setFilters] = useState<{
        email: string;
        phone: string;
        name: string;
        status: string;
        kycStatus: string;
    }>({
        email: '',
        phone: '',
        name: '',
        status: '',
        kycStatus: ''
    });

    useEffect(() => {
        const fetchCustomers = async () => {
            try {
                setLoading(true);
                const params = {
                    page: page + 1,
                    size: rowsPerPage,
                    ...(filters.email && { email: filters.email }),
                    ...(filters.phone && { phone: filters.phone }),
                    ...(filters.name && { name: filters.name }),
                    ...(filters.status && { status: filters.status })
                };

                const response = await axios.get('https://be-crypto-depot.name.vn/api/users', {
                    params
                });

                const data: { content: any[]; page: any } = response.data;
                const formattedCustomers: Customer[] = data.content.map((customer: any) => ({
                    id: customer.id || `USR${Math.random().toString(36).substr(2, 9)}`,
                    first_name: customer.firstName || '',
                    last_name: customer.lastName || '',
                    email: customer.email || '',
                    phone_num: customer.phoneNumber || '',
                    id_number: customer.walletAddress || '',
                    ranking_id: 'R001', // Hardcode vì API không trả về
                    status_id: customer.status ? statusOptions.find(s => s.label === customer.status)?.id || '' : '',
                    created_date: customer.createdAt || new Date().toISOString(),
                    kyc_status: customer.kycStatus ?? false,
                    status: customer.status || null,
                    type_siging_in: 'email',
                    modified_by: 'system',
                    modified_date: customer.lastLoginAt || new Date().toISOString()
                }));

                setCustomers(formattedCustomers);
                setTotalRows(data.page.totalElements);
            } catch (error) {
                console.error('Error fetching customers:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchCustomers();
    }, [page, rowsPerPage, filters.email, filters.phone, filters.name, filters.status]);

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
        setPage(0); // Reset về trang đầu khi thay đổi filter
    };

    const resetFilters = () => {
        setFilters({
            email: '',
            phone: '',
            name: '',
            status: '',
            kycStatus: ''
        });
        setPage(0);
    };

    const exportToExcel = () => {
        const exportData = filteredCustomers.map(customer => ({
            ID: customer.id,
            Name: `${customer.first_name} ${customer.last_name}`,
            Email: customer.email,
            Phone: customer.phone_num,
            Wallet: customer.id_number,
            Status: getStatusLabel(customer),
            'KYC Status': getKYCStatusLabel(customer),
            'Created Date': new Date(customer.created_date).toLocaleDateString(),
            'Sign-in Type': customer.type_siging_in
        }));
        const worksheet = XLSX.utils.json_to_sheet(exportData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Customers");
        XLSX.writeFile(workbook, "customers.xlsx");
    };

    const getKYCStatusLabel = (customer: Customer) => {
        if (customer.kyc_status) return "Approved";
        if (!customer.kyc_status && customer.status === "Rejected") return "Rejected";
        return "Pending";
    };

    const getStatusLabel = (customer: Customer) => {
        if (!customer.kyc_status) return "N/A";
        return customer.status || "Active";
    };

    const getKYCStatusColor = (customer: Customer) => {
        if (customer.kyc_status) return "success";
        if (!customer.kyc_status && customer.status === "Rejected") return "error";
        return "warning";
    };

    const getStatusColor = (customer: Customer) => {
        if (!customer.kyc_status) return "default";
        switch (customer.status) {
            case "Active":
                return "success";
            case "Blocked":
            case "Suspended":
                return "error";
            case "Inactive":
                return "default";
            default:
                return "success"; // Mặc định Active
        }
    };

    const filteredCustomers: Customer[] = customers.filter((customer: Customer) => {
        const matchEmail = customer.email.toLowerCase().includes(filters.email.toLowerCase());
        const matchPhone = customer.phone_num.includes(filters.phone);
        const matchName = (customer.first_name + ' ' + customer.last_name)
            .toLowerCase()
            .includes(filters.name.toLowerCase());
        const matchKycStatus = !filters.kycStatus ||
            (filters.kycStatus === "Approved" && customer.kyc_status) ||
            (filters.kycStatus === "Pending" && !customer.kyc_status);
            // (filters.kycStatus === "Rejected" && !customer.kyc_status && customer.status === "Rejected");
    
        return matchEmail && matchPhone && matchName && matchKycStatus;
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
                                label="Email"
                                size="small"
                                value={filters.email}
                                onChange={(e) => handleFilterChange('email', e.target.value)}
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
                            <FormControl size="small" sx={{ minWidth: 120 }}>
                                <InputLabel>Status</InputLabel>
                                <Select
                                    value={filters.status}
                                    label="Status"
                                    onChange={(e) => handleFilterChange('status', e.target.value as string)}
                                >
                                    <MenuItem value="">All</MenuItem>
                                    {statusOptions.map(status => (
                                        <MenuItem key={status.id} value={status.id}>{status.label}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            <FormControl size="small" sx={{ minWidth: 120 }}>
                                <InputLabel>KYC Status</InputLabel>
                                <Select
                                    value={filters.kycStatus}
                                    label="KYC Status"
                                    onChange={(e) => handleFilterChange('kycStatus', e.target.value as string)}
                                >
                                    {kycStatusOptions.map(option => (
                                        <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
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
                                    <TableCell>No.</TableCell>
                                    <TableCell>Name</TableCell>
                                    <TableCell>Email</TableCell>
                                    <TableCell>Phone</TableCell>
                                    <TableCell>Wallet</TableCell>
                                    <TableCell>Status</TableCell>
                                    <TableCell>Created Date</TableCell>
                                    <TableCell>KYC Status</TableCell>
                                    <TableCell>Sign-in Type</TableCell>
                                    <TableCell align="center">Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {filteredCustomers
                                    .map((customer: Customer, index) => (
                                        <TableRow key={customer.id}>
                                            <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                                            <TableCell>{`${customer.first_name} ${customer.last_name}`}</TableCell>
                                            <TableCell>{customer.email}</TableCell>
                                            <TableCell>{customer.phone_num}</TableCell>
                                            <TableCell>{customer.id_number}</TableCell>
                                            <TableCell>
                                                <Chip
                                                    label={getStatusLabel(customer)}
                                                    color={getStatusColor(customer)}
                                                    size="small"
                                                />
                                            </TableCell>
                                            <TableCell>{new Date(customer.created_date).toLocaleDateString()}</TableCell>
                                            <TableCell>
                                                <Chip
                                                    label={getKYCStatusLabel(customer)}
                                                    color={getKYCStatusColor(customer)}
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
                            rowsPerPageOptions={[5, 10, 20]}
                            component="div"
                            count={totalRows}
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
