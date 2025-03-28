"use client";

import React, { useState } from "react";
import {
    Box,
    Typography,
    Button,
    TextField,
    Grid,
    Paper,
    Divider,
    Stack,
    Avatar,
    IconButton,
    Tooltip,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Chip,
} from "@mui/material";
import {
    Save as SaveIcon,
    Assignment as AssignmentIcon,
    ContentCopy as CopyIcon,
} from "@mui/icons-material";
import { useRouter } from "next/router";

// Customer interface (unchanged)
interface Customer {
    id: string;
    fullName: string;
    firstName: string;
    lastName: string;
    email: string;
    address: string;
    dateOfBirth: string;
    gender: string;
    phone: string;
    idCardFrontImgUrl: string;
    idCardBackImgUrl: string;
    ward: string;
    district: string;
    province: string;
    nation: string;
    idNumber: string;
    kycStatus: string;
}

// Mock data (unchanged)
const newMockCustomer: Customer = {
    id: "USER001",
    fullName: "Nguyen Van Thuan",
    firstName: "Thuan",
    lastName: "Nguyen Van",
    email: "thuanv@gmail.com",
    address: "123 Dinh Bo Linh",
    dateOfBirth: "2003-01-01T00:00:00.000Z",
    gender: "Male",
    phone: "0123456789",
    idCardFrontImgUrl: "https://thanhphohaiphong.gov.vn/wp-content/uploads/2021/03/photo-1615969046175-161596904618017747411431.jpeg",
    idCardBackImgUrl: "https://thanhphohaiphong.gov.vn/wp-content/uploads/2021/03/photo-1615969046175-161596904618017747411431.jpeg",
    ward: "Phuong 1",
    district: "District 1",
    province: "Ho Chi Minh city",
    nation: "Viet Nam",
    idNumber: "123456789",
    kycStatus: "Pending",
};

const CustomerDetails: React.FC = () => {
    const router = useRouter();
    const [customer, setCustomer] = useState(newMockCustomer);

    // Handle KYC Status change
    const handleKycStatusChange = (event: any) => {
        setCustomer((prev) => ({
            ...prev,
            kycStatus: event.target.value,
        }));
    };

    // Handle Save button
    const handleSave = () => {
        alert("Customer information has been saved!");
    };

    // Status color function
    const getStatusColor = (status: string) => {
        switch (status) {
            case "Active":
                return "#4CAF50"; // Green
            case "Pending":
                return "#FF9800"; // Orange
            case "Inactive":
                return "#9E9E9E"; // Grey
            default:
                return "#9E9E9E";
        }
    };

    const getStatusChip = (status: string) => {
        const statusInfo = {
            Active: { color: "success", label: "Active" },
            Pending: { color: "warning", label: "Pending" },
            Inactive: { color: "default", label: "Inactive" },
        };

        const info = statusInfo[status as keyof typeof statusInfo] || {
            color: "default",
            label: status,
        };

        return (
            <Chip
                label={info.label}
                color={info.color as any}
                sx={{ fontWeight: "bold", ml: 1 }}
            />
        );
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        alert("Copied to clipboard!");
    };

    return (
        <Box sx={{ width: "100%", height: "100%", padding: "0 16px" }}>
            {/* Header */}
            <Paper elevation={3} sx={{ p: 3, mb: 4, borderRadius: 2 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Avatar sx={{ bgcolor: "#1976d2", width: 56, height: 56, mr: 2 }}>
                            {customer.fullName.charAt(0)}
                        </Avatar>
                        <Box>
                            <Typography variant="h5" fontWeight="bold">
                                {customer.fullName}
                            </Typography>
                            <Typography variant="body1" color="text.secondary" sx={{ fontWeight: "bold", fontSize: "1.2rem" }}>
                                ID: {customer.id}
                            </Typography>
                        </Box>
                    </Box>
                    <Box>
                        <FormControl sx={{ minWidth: 150 }}>
                            <InputLabel>KYC Status</InputLabel>
                            <Select
                                value={customer.kycStatus}
                                label="KYC Status"
                                onChange={handleKycStatusChange}
                            >
                                <MenuItem value="Active">Active</MenuItem>
                                <MenuItem value="Pending">Pending</MenuItem>
                                <MenuItem value="Inactive">Inactive</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>
                </Box>
            </Paper>

            <Grid container spacing={3}>
                {/* Personal Information (unchanged) */}
                <Grid item xs={12} md={6}>
                    <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
                        <Typography variant="h6" fontWeight="bold" sx={{ mb: 3, display: "flex", alignItems: "center" }}>
                            Personal Information
                            <Divider sx={{ flex: 1, ml: 2 }} />
                        </Typography>
                        <Stack spacing={3}>
                            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                                <TextField label="First Name" value={customer.lastName} InputProps={{ readOnly: true }} size="small" sx={{ width: "30%" }} />
                                <TextField label="Middle Name" value={customer.firstName} InputProps={{ readOnly: true }} size="small" sx={{ width: "30%" }} />
                                <TextField label="Last Name" value={customer.firstName} InputProps={{ readOnly: true }} size="small" sx={{ width: "30%" }} />
                            </Box>
                            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                                <TextField label="Gender" value={customer.gender} InputProps={{ readOnly: true }} size="small" sx={{ width: "48%" }} />
                                <TextField label="Date of Birth" value={customer.dateOfBirth.split("T")[0]} InputProps={{ readOnly: true }} size="small" sx={{ width: "48%" }} />
                            </Box>
                            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <TextField label="Phone Number" value={customer.phone} InputProps={{ readOnly: true, endAdornment: (
                                    <Tooltip title="Copy"><IconButton edge="end" size="small" onClick={() => copyToClipboard(customer.phone)}><CopyIcon fontSize="small" /></IconButton></Tooltip>
                                )}} size="small" sx={{ width: "48%" }} />
                                <TextField label="Email" value={customer.email} InputProps={{ readOnly: true, endAdornment: (
                                    <Tooltip title="Copy"><IconButton edge="end" size="small" onClick={() => copyToClipboard(customer.email)}><CopyIcon fontSize="small" /></IconButton></Tooltip>
                                )}} size="small" sx={{ width: "48%" }} />
                            </Box>
                            <Divider textAlign="left">Address Information</Divider>
                            <TextField label="Address" value={customer.address} InputProps={{ readOnly: true }} size="small" fullWidth />
                            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                                <TextField label="Province/City" value={customer.province} InputProps={{ readOnly: true }} size="small" sx={{ width: "32%" }} />
                                <TextField label="District" value={customer.district} InputProps={{ readOnly: true }} size="small" sx={{ width: "32%" }} />
                                <TextField label="Ward" value={customer.ward} InputProps={{ readOnly: true }} size="small" sx={{ width: "32%" }} />
                            </Box>
                            <TextField label="Country" value={customer.nation} InputProps={{ readOnly: true }} size="small" sx={{ width: "48%" }} />
                        </Stack>
                    </Paper>
                </Grid>

                {/* Verification Documents (KYC) */}
                <Grid item xs={12} md={6}>
                    <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
                        <Typography variant="h6" fontWeight="bold" sx={{ mb: 3, display: "flex", alignItems: "center" }}>
                            Verification Documents (KYC)
                            <Divider sx={{ flex: 1, ml: 2 }} />
                        </Typography>

                        <Box sx={{ mb: 3 }}>
                            <Typography variant="subtitle2" gutterBottom>
                                ID Number
                            </Typography>
                            <TextField
                                fullWidth
                                value={customer.idNumber}
                                InputProps={{
                                    readOnly: true,
                                    endAdornment: (
                                        <Tooltip title="Copy">
                                            <IconButton edge="end" size="small" onClick={() => copyToClipboard(customer.idNumber)}>
                                                <CopyIcon fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                    ),
                                }}
                                size="small"
                            />
                        </Box>

                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    label="Front ID URL"
                                    value={customer.idCardFrontImgUrl}
                                    fullWidth
                                    InputProps={{
                                        readOnly: true,
                                        endAdornment: (
                                            <Tooltip title="Copy">
                                                <IconButton edge="end" size="small" onClick={() => copyToClipboard(customer.idCardFrontImgUrl)}>
                                                    <CopyIcon fontSize="small" />
                                                </IconButton>
                                            </Tooltip>
                                        ),
                                    }}
                                    size="small"
                                    
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    label="Back ID URL"
                                    value={customer.idCardBackImgUrl}
                                    fullWidth
                                    InputProps={{
                                        readOnly: true,
                                        endAdornment: (
                                            <Tooltip title="Copy">
                                                <IconButton edge="end" size="small" onClick={() => copyToClipboard(customer.idCardBackImgUrl)}>
                                                    <CopyIcon fontSize="small" />
                                                </IconButton>
                                            </Tooltip>
                                        ),
                                    }}
                                    size="small"
                                    
                                />
                            </Grid>
                        </Grid>

                        <Box sx={{ mt: 3 }}>
                            <Divider textAlign="left">Verification Status</Divider>
                            <Box sx={{ mt: 2, display: "flex", alignItems: "center" }}>
                                <Typography>Current Status:</Typography>
                                {getStatusChip(customer.kycStatus)}
                            </Box>
                        </Box>
                    </Paper>
                </Grid>
            </Grid>

            {/* Footer */}
            <Box display="flex" justifyContent="flex-end" gap={2} sx={{ mt: 4 }}>
                <Button variant="outlined" color="secondary" onClick={() => router.push('/customer-management')}>
                    Back
                </Button>
                <Button variant="contained" startIcon={<SaveIcon />} onClick={handleSave} sx={{ borderRadius: 2 }}>
                    Save Changes
                </Button>
            </Box>
        </Box>
    );
};

export default CustomerDetails;