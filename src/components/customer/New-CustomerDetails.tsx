"use client";

import React, { useState, useEffect } from "react";
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
    CircularProgress,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
} from "@mui/material";
import {
    Save as SaveIcon,
    Assignment as AssignmentIcon,
    ContentCopy as CopyIcon,
} from "@mui/icons-material";
import { useRouter } from "next/router";

// Customer interface
interface Customer {
    id: string;
    username: string;
    email: string;
    fullName: string;
    avatarUrl: string;
    firstName: string;
    middleName: string;
    lastName: string;
    phoneNumber: string;
    gender: string;
    dateOfBirth: string;
    homeAddress: string;
    ward: string;
    district: string;
    province: string;
    nation: string;
    walletAddress: string;
    kycStatus: string;
    hasAcceptedTerms: boolean;
    lastLoginAt: string;
    idCardFrontImgUrl: string | null;
    idCardBackImgUrl: string | null;
    idCardNumber: string | null;
}

const CustomerDetails: React.FC = () => {
    const router = useRouter();
    const { id } = router.query;
    const [customer, setCustomer] = useState<Customer | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
    const [saveResult, setSaveResult] = useState<"success" | "fail" | null>(null);
    const [openResultDialog, setOpenResultDialog] = useState(false);

    // Fetch customer data from API
    useEffect(() => {
        const fetchCustomerData = async () => {
            if (!id) return;

            try {
                setLoading(true);
                const response = await fetch(`https://be-crypto-depot.name.vn/api/users/${id}`);

                if (!response.ok) {
                    throw new Error(`Error fetching customer data: ${response.status}`);
                }

                const userData = await response.json();
                console.log("API response:", userData);

                const mappedCustomer: Customer = {
                    id: userData.id || id as string,
                    username: userData.username || "",
                    email: userData.email || "",
                    fullName: userData.fullName || `${userData.firstName || ''} ${userData.middleName || ''} ${userData.lastName || ''}`.trim() || "",
                    avatarUrl: userData.avatar || "",
                    firstName: userData.firstName || "",
                    middleName: userData.middleName || "",
                    lastName: userData.lastName || "",
                    phoneNumber: userData.phoneNumber || "",
                    gender: userData.gender || "",
                    dateOfBirth: userData.dateOfBirth || "",
                    homeAddress: userData.homeAddress || "",
                    ward: userData.ward || "",
                    district: userData.district || "",
                    province: userData.province || "",
                    nation: userData.nation || "",
                    walletAddress: userData.walletAddress || "",
                    // Map kycStatus: true -> "Active", false -> "Pending", null -> "Inactive"
                    kycStatus: userData.kycStatus === true ? "Active" : userData.kycStatus === false ? "Pending" : "Inactive",
                    hasAcceptedTerms: userData.hasAcceptedTerms || false,
                    lastLoginAt: userData.lastLoginAt || "",
                    idCardFrontImgUrl: userData.idCardFrontImgUrl || null,
                    idCardBackImgUrl: userData.idCardBackImgUrl || null,
                    idCardNumber: userData.idCardNumber || null,
                };

                console.log("Mapped customer:", mappedCustomer);
                setCustomer(mappedCustomer);
            } catch (err) {
                setError(err instanceof Error ? err.message : "An unknown error occurred");
                console.error("Error fetching customer data:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchCustomerData();
    }, [id]);

    // Handle KYC Status change
    const handleKycStatusChange = (event: any) => {
        if (!customer) return;

        setCustomer((prev) => {
            if (!prev) return null;
            return {
                ...prev,
                kycStatus: event.target.value,
            };
        });
    };

    // Handle Save button (open confirm dialog)
    const handleSaveClick = () => {
        setOpenConfirmDialog(true);
    };

    // Handle confirm save (PUT request)
    const handleConfirmSave = async () => {
        if (!customer) return;

        try {
            // Map kycStatus to API values: Active -> true, Inactive -> null, Pending -> false
            const kycStatusForApi =
                customer.kycStatus === "Active" ? true :
                customer.kycStatus === "Inactive" ? null : false;

            const response = await fetch(`https://be-crypto-depot.name.vn/api/users/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    kycStatus: kycStatusForApi,
                }),
            });

            if (!response.ok) {
                throw new Error(`Error updating KYC status: ${response.status}`);
            }

            setSaveResult("success");
        } catch (err) {
            console.error("Error updating KYC status:", err);
            setSaveResult("fail");
        } finally {
            setOpenConfirmDialog(false);
            setOpenResultDialog(true);
        }
    };

    // Handle close confirm dialog
    const handleCloseConfirmDialog = () => {
        setOpenConfirmDialog(false);
    };

    // Handle close result dialog
    const handleCloseResultDialog = () => {
        setOpenResultDialog(false);
        setSaveResult(null);
    };

    // Status color function
    const getStatusColor = (status: string) => {
        switch (status) {
            case "Active":
                return "#4CAF50";
            case "Pending":
                return "#FF9800";
            case "Inactive":
                return "#9E9E9E";
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

    if (loading) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "80vh" }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error || !customer) {
        return (
            <Box sx={{ p: 3, textAlign: "center" }}>
                <Typography variant="h6" color="error">
                    {error || "Customer data not available"}
                </Typography>
                <Button
                    variant="contained"
                    onClick={() => router.push("/customer-management")}
                    sx={{ mt: 2 }}
                >
                    Back to Customer List
                </Button>
            </Box>
        );
    }

    return (
        <Box sx={{ width: "100%", height: "100%", padding: "0 16px" }}>
            {/* Header */}
            <Paper elevation={3} sx={{ p: 3, mb: 4, borderRadius: 2 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Avatar 
                            sx={{ bgcolor: "#1976d2", width: 56, height: 56, mr: 2 }} 
                            src={customer.avatarUrl || undefined}
                        >
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
                    {/* Conditionally render FormControl based on kycStatus */}
                    {customer.kycStatus !== "Active" && (
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
                    )}
                </Box>
            </Paper>

            <Grid container spacing={3}>
                {/* Personal Information */}
                <Grid item xs={12} md={6}>
                    <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
                        <Typography variant="h6" fontWeight="bold" sx={{ mb: 3, display: "flex", alignItems: "center" }}>
                            Personal Information
                            <Divider sx={{ flex: 1, ml: 2 }} />
                        </Typography>
                        <Stack spacing={3}>
                            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                                <TextField label="First Name" value={customer.firstName} InputProps={{ readOnly: true }} size="small" sx={{ width: "30%" }} />
                                <TextField label="Middle Name" value={customer.middleName} InputProps={{ readOnly: true }} size="small" sx={{ width: "30%" }} />
                                <TextField label="Last Name" value={customer.lastName} InputProps={{ readOnly: true }} size="small" sx={{ width: "30%" }} />
                            </Box>
                            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                                <TextField label="Gender" value={customer.gender} InputProps={{ readOnly: true }} size="small" sx={{ width: "48%" }} />
                                <TextField
                                    label="Date of Birth"
                                    value={customer.dateOfBirth ? customer.dateOfBirth.split("T")[0] : ""}
                                    InputProps={{ readOnly: true }}
                                    size="small"
                                    sx={{ width: "48%" }}
                                />
                            </Box>
                            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <TextField
                                    label="Phone Number"
                                    value={customer.phoneNumber}
                                    InputProps={{
                                        readOnly: true,
                                        endAdornment: (
                                            <Tooltip title="Copy">
                                                <IconButton
                                                    edge="end"
                                                    size="small"
                                                    onClick={() => copyToClipboard(customer.phoneNumber)}
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
                                value={customer.homeAddress}
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
                                value={customer.idCardNumber || "Not provided"}
                                InputProps={{
                                    readOnly: true,
                                    endAdornment: customer.idCardNumber && (
                                        <Tooltip title="Copy">
                                            <IconButton
                                                edge="end"
                                                size="small"
                                                onClick={() => copyToClipboard(customer.idCardNumber || "")}
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
                            <Grid item xs={12}>
                                <TextField
                                    label="Front ID URL"
                                    value={customer.idCardFrontImgUrl || "Not provided"}
                                    fullWidth
                                    InputProps={{
                                        readOnly: true,
                                        endAdornment: customer.idCardFrontImgUrl && (
                                            <Tooltip title="Copy">
                                                <IconButton
                                                    edge="end"
                                                    size="small"
                                                    onClick={() => copyToClipboard(customer.idCardFrontImgUrl || "")}
                                                >
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
                                    value={customer.idCardBackImgUrl || "Not provided"}
                                    fullWidth
                                    InputProps={{
                                        readOnly: true,
                                        endAdornment: customer.idCardBackImgUrl && (
                                            <Tooltip title="Copy">
                                                <IconButton
                                                    edge="end"
                                                    size="small"
                                                    onClick={() => copyToClipboard(customer.idCardBackImgUrl || "")}
                                                >
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
                <Button
                    variant="outlined"
                    color="secondary"
                    onClick={() => router.push("/customer-management")}
                >
                    Back
                </Button>
                <Button
                    variant="contained"
                    startIcon={<SaveIcon />}
                    onClick={handleSaveClick}
                    sx={{ borderRadius: 2 }}
                >
                    Save Changes
                </Button>
            </Box>

            {/* Confirm Dialog */}
            <Dialog
                open={openConfirmDialog}
                onClose={handleCloseConfirmDialog}
            >
                <DialogTitle>Confirm Save</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to save changes to the KYC status for {customer.fullName} (ID: {customer.id})?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseConfirmDialog} color="secondary">
                        Cancel
                    </Button>
                    <Button onClick={handleConfirmSave} color="primary" autoFocus>
                        Confirm
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Result Dialog */}
            <Dialog
                open={openResultDialog}
                onClose={handleCloseResultDialog}
            >
                <DialogTitle>{saveResult === "success" ? "Success" : "Failed"}</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        {saveResult === "success"
                            ? "KYC status has been updated successfully."
                            : "Failed to update KYC status. Please try again."}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseResultDialog} color="primary">
                        OK
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default CustomerDetails;