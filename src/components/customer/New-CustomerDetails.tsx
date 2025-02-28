"use client";

import React, { useState } from "react";
import {
    Box,
    Typography,
    Button,
    TextField,
    Grid,
    Card,
    CardMedia,
    CardContent,
    Paper,
    Chip,
    Divider,
    Stack,
    Avatar,
    IconButton,
    Tooltip,
} from "@mui/material";
import {
    Save as SaveIcon,
    CheckCircle as ApproveIcon,
    Cancel as RejectIcon,
    Assignment as AssignmentIcon,
    ContentCopy as CopyIcon,
    VisibilityOutlined as ViewIcon,
    Cancel,
} from "@mui/icons-material";
import { useRouter } from "next/router";

// Customer interface
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

// New mock data
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
    const [imageView, setImageView] = useState<string | null>(null);

    // Handle Approve button
    const handleApprove = () => {
        setCustomer((prev) => ({
            ...prev,
            kycStatus: "Approved",
        }));
    };

    // Handle Reject button
    const handleReject = () => {
        setCustomer((prev) => ({
            ...prev,
            kycStatus: "Rejected",
        }));
    };

    // Handle Save button
    const handleSave = () => {
        alert("Customer information has been saved!");
    };

    // Function to determine status color
    const getStatusColor = (status: string) => {
        switch (status) {
            case "Pending":
                return "#FF9800";
            case "Approved":
                return "#4CAF50";
            case "Rejected":
                return "#F44336";
            default:
                return "#9E9E9E";
        }
    };

    const getStatusChip = (status: string) => {
        const statusInfo = {
            Pending: { color: "warning", icon: <AssignmentIcon fontSize="small" /> },
            Approved: { color: "success", icon: <ApproveIcon fontSize="small" /> },
            Rejected: { color: "error", icon: <RejectIcon fontSize="small" /> },
        };

        const info = statusInfo[status as keyof typeof statusInfo] || {
            color: "default",
            icon: null,
        };

        return (
            <Chip
                label={status}
                color={info.color as any}
                icon={info.icon}
                sx={{ fontWeight: "bold", ml: 1 }}
            />
        );
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        alert("Copied to clipboard!");
    };

    const openImageView = (url: string) => {
        setImageView(url);
    };

    const closeImageView = () => {
        setImageView(null);
    };

    return (
        <Box sx={{ width: "100%", height: "100%", padding: "0 16px" }}>
            {/* Header */}
            <Paper elevation={3} sx={{ p: 3, mb: 4, borderRadius: 2 }}>
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mb: 2,
                    }}
                >
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Avatar sx={{ bgcolor: "#1976d2", width: 56, height: 56, mr: 2 }}>
                            {customer.fullName.charAt(0)}
                        </Avatar>
                        <Box>
                            <Typography variant="h5" fontWeight="bold">
                                {customer.fullName}
                            </Typography>
                            <Typography
                                variant="body1"
                                color="text.secondary"
                                sx={{ fontWeight: "bold", fontSize: "1.2rem" }}
                            >
                                ID: {customer.id}
                            </Typography>
                        </Box>
                    </Box>
                    <Box>
                        <Typography
                            variant="subtitle1"
                            sx={{ display: "flex", alignItems: "center" }}
                        >
                            KYC Status: {getStatusChip(customer.kycStatus)}
                        </Typography>
                    </Box>
                </Box>
                {customer.kycStatus === "Pending" && (
                    <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
                        <Button
                            variant="contained"
                            color="success"
                            startIcon={<ApproveIcon />}
                            onClick={handleApprove}
                            sx={{ mr: 1, borderRadius: 2 }}
                        >
                            Approve
                        </Button>
                        <Button
                            variant="contained"
                            color="error"
                            startIcon={<RejectIcon />}
                            onClick={handleReject}
                            sx={{ borderRadius: 2 }}
                        >
                            Reject
                        </Button>
                    </Box>
                )}
            </Paper>

            <Grid container spacing={3}>
                {/* Personal Information */}
                <Grid item xs={12} md={6}>
                    <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
                        <Typography
                            variant="h6"
                            fontWeight="bold"
                            sx={{ mb: 3, display: "flex", alignItems: "center" }}
                        >
                            Personal Information
                            <Divider sx={{ flex: 1, ml: 2 }} />
                        </Typography>

                        <Stack spacing={3}>
                            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                                <TextField
                                    label="Last Name"
                                    value={customer.lastName}
                                    InputProps={{ readOnly: true }}
                                    size="small"
                                    sx={{ width: "48%" }}
                                />
                                <TextField
                                    label="First Name"
                                    value={customer.firstName}
                                    InputProps={{ readOnly: true }}
                                    size="small"
                                    sx={{ width: "48%" }}
                                />
                            </Box>

                            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                                <TextField
                                    label="Gender"
                                    value={customer.gender}
                                    InputProps={{ readOnly: true }}
                                    size="small"
                                    sx={{ width: "48%" }}
                                />
                                <TextField
                                    label="Date of Birth"
                                    value={customer.dateOfBirth.split("T")[0]} // Display only date part
                                    InputProps={{ readOnly: true }}
                                    size="small"
                                    sx={{ width: "48%" }}
                                />
                            </Box>

                            <Box
                                sx={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                }}
                            >
                                <TextField
                                    label="Phone Number"
                                    value={customer.phone}
                                    InputProps={{
                                        readOnly: true,
                                        endAdornment: (
                                            <Tooltip title="Copy">
                                                <IconButton
                                                    edge="end"
                                                    size="small"
                                                    onClick={() => copyToClipboard(customer.phone)}
                                                >
                                                    <CopyIcon fontSize="small" />
                                                </IconButton>
                                            </Tooltip>
                                        ),
                                    }}
                                    size="small"
                                    sx={{ width: "48%" }}
                                />
                                <TextField
                                    label="Email"
                                    value={customer.email}
                                    InputProps={{
                                        readOnly: true,
                                        endAdornment: (
                                            <Tooltip title="Copy">
                                                <IconButton
                                                    edge="end"
                                                    size="small"
                                                    onClick={() => copyToClipboard(customer.email)}
                                                >
                                                    <CopyIcon fontSize="small" />
                                                </IconButton>
                                            </Tooltip>
                                        ),
                                    }}
                                    size="small"
                                    sx={{ width: "48%" }}
                                />
                            </Box>

                            <Divider textAlign="left">Address Information</Divider>

                            <TextField
                                label="Address"
                                value={customer.address}
                                InputProps={{ readOnly: true }}
                                size="small"
                                fullWidth
                            />

                            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                                <TextField
                                    label="Province/City"
                                    value={customer.province}
                                    InputProps={{ readOnly: true }}
                                    size="small"
                                    sx={{ width: "32%" }}
                                />
                                <TextField
                                    label="District"
                                    value={customer.district}
                                    InputProps={{ readOnly: true }}
                                    size="small"
                                    sx={{ width: "32%" }}
                                />
                                <TextField
                                    label="Ward"
                                    value={customer.ward}
                                    InputProps={{ readOnly: true }}
                                    size="small"
                                    sx={{ width: "32%" }}
                                />
                            </Box>

                            <TextField
                                label="Country"
                                value={customer.nation}
                                InputProps={{ readOnly: true }}
                                size="small"
                                sx={{ width: "48%" }}
                            />
                        </Stack>
                    </Paper>
                </Grid>

                {/* Verification Documents (KYC) */}
                <Grid item xs={12} md={6}>
                    <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
                        <Typography
                            variant="h6"
                            fontWeight="bold"
                            sx={{ mb: 3, display: "flex", alignItems: "center" }}
                        >
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
                                            <IconButton
                                                edge="end"
                                                size="small"
                                                onClick={() => copyToClipboard(customer.idNumber)}
                                            >
                                                <CopyIcon fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                    ),
                                }}
                                size="small"
                            />
                        </Box>

                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                                <Card sx={{ borderRadius: 2 }}>
                                    <CardContent sx={{ p: 1, pb: 1 }}>
                                        <Typography variant="subtitle2" align="center">
                                            Front of ID
                                        </Typography>
                                    </CardContent>
                                    <Box sx={{ position: "relative" }}>
                                        <CardMedia
                                            component="img"
                                            image={customer.idCardFrontImgUrl}
                                            alt="Front of ID"
                                            sx={{ height: 180, objectFit: "cover" }}
                                        />
                                        <IconButton
                                            sx={{
                                                position: "absolute",
                                                top: "5px",
                                                right: "5px",
                                                bgcolor: "rgba(255, 255, 255, 0.8)",
                                                "&:hover": { bgcolor: "rgba(255, 255, 255, 0.9)" },
                                            }}
                                            size="small"
                                            onClick={() => openImageView(customer.idCardFrontImgUrl)}
                                        >
                                            <ViewIcon fontSize="small" />
                                        </IconButton>
                                    </Box>
                                </Card>
                            </Grid>
                            <Grid item xs={6}>
                                <Card sx={{ borderRadius: 2 }}>
                                    <CardContent sx={{ p: 1, pb: 1 }}>
                                        <Typography variant="subtitle2" align="center">
                                            Back of ID
                                        </Typography>
                                    </CardContent>
                                    <Box sx={{ position: "relative" }}>
                                        <CardMedia
                                            component="img"
                                            image={customer.idCardBackImgUrl}
                                            alt="Back of ID"
                                            sx={{ height: 180, objectFit: "cover" }}
                                        />
                                        <IconButton
                                            sx={{
                                                position: "absolute",
                                                top: "5px",
                                                right: "5px",
                                                bgcolor: "rgba(255, 255, 255, 0.8)",
                                                "&:hover": { bgcolor: "rgba(255, 255, 255, 0.9)" },
                                            }}
                                            size="small"
                                            onClick={() => openImageView(customer.idCardBackImgUrl)}
                                        >
                                            <ViewIcon fontSize="small" />
                                        </IconButton>
                                    </Box>
                                </Card>
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
            <Box display='flex' justifyContent='flex-end' gap={2} sx={{mt: 4}}>
                <Button variant='outlined' color='secondary' onClick={() => router.push('/customer-management')}>
                    Back
                </Button>
                <Button
                    variant="contained"
                    startIcon={<SaveIcon />}
                    onClick={handleSave}
                    sx={{ borderRadius: 2 }}
                >
                    Save Information
                </Button>
            </Box>

            {/* Image Viewer Modal */}
            {imageView && (
                <Box
                    sx={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        bgcolor: "rgba(0, 0, 0, 0.8)",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        zIndex: 9999,
                    }}
                    onClick={closeImageView}
                >
                    <Box
                        sx={{
                            maxWidth: "80%",
                            maxHeight: "80%",
                            position: "relative",
                        }}
                    >
                        <img
                            src={imageView}
                            alt="View enlarged image"
                            style={{
                                maxWidth: "100%",
                                maxHeight: "100%",
                                objectFit: "contain",
                            }}
                        />
                        <IconButton
                            sx={{
                                position: "absolute",
                                top: "-40px",
                                right: 0,
                                color: "white",
                            }}
                            onClick={closeImageView}
                        >
                            <Cancel />
                        </IconButton>
                    </Box>
                </Box>
            )}
        </Box>
    );
};

export default CustomerDetails;