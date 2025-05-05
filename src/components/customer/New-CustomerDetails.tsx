"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
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
  kycStatus: boolean;
  status: string | null;
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
  const [confirmAction, setConfirmAction] = useState<"Verified" | "Reject" | "UserStatus" | null>(null);

  // Danh sách trạng thái người dùng
  const userStatuses = [
    { id: "cvvvhgjme6nnaun2s4pg", name: "Active" },
    { id: "cvvvhjbme6nnaun2s4q0", name: "Blocked" },
    { id: "cvvvhlbme6nnaun2s4qg", name: "Inactive" },
    { id: "cvvvhqbme6nnaun2s4rg", name: "Suspended" },
  ];

  // Fetch customer data from API
  useEffect(() => {
    const fetchCustomerData = async () => {
      if (!id) return;

      try {
        setLoading(true);
        const response = await axios.get(`https://be-crypto-depot.name.vn/api/users/${id}`);

        const userData = response.data;
        
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
          kycStatus: userData.kycStatus ?? false,
          status: userData.status || null,
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

  // Get KYC status display
  const getKYCStatusLabel = () => {
    if (customer?.kycStatus) return "Approved"; // Hiển thị Approved khi kycStatus: true
    if (!customer?.kycStatus && customer?.status === "Rejected") return "Rejected";
    if (customer?.status && userStatuses.some((s) => s.name === customer.status)) return customer.status;
    return "Pending";
  };
  const getCurrentStatusLabel = () => {
    if (customer?.status && userStatuses.some((s) => s.name === customer.status)) {
      return customer.status;
    }
    return "Pending";
  };

  // Get KYC status color
  const getStatusColor = () => {
    if (customer?.kycStatus) return "success"; // Approved
    if (!customer?.kycStatus && customer?.status === "Rejected") return "error";
    switch (customer?.status) {
      case "Active":
        return "success";
      case "Blocked":
      case "Suspended":
        return "error";
      case "Inactive":
        return "default";
      default:
        return "warning"; // Pending hoặc null
    }
  };

  // Handle KYC Verified button
  const handleKycVerified = () => {
    setConfirmAction("Verified");
    setOpenConfirmDialog(true);
  };

  // Handle KYC Reject button
  const handleKycReject = () => {
    setConfirmAction("Reject");
    setOpenConfirmDialog(true);
  };

  // Handle User Status change
  const handleUserStatusChange = (event: any) => {
    if (!customer) return;

    const selectedStatus = event.target.value;
    setCustomer((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        status: selectedStatus,
        // FIX: Don't change kycStatus when changing user status
        // kycStatus: selectedStatus === "Active" ? true : false,
      };
    });
    setConfirmAction("UserStatus");
    setOpenConfirmDialog(true);
  };

  // Handle Retry KYC
  const handleRetryKYC = async () => {
    if (!customer) return;

    try {
      setLoading(true);
      const response = await axios.put(`https://be-crypto-depot.name.vn/api/users/${id}`, {
        kycStatus: false,
        statusId: "cvvvho3me6nnaun2s4r0", // Pending
      });

      console.log("KYC Retry response:", response.data);
      setCustomer((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          kycStatus: false,
          status: null,
        };
      });
      setSaveResult("success");
      setOpenResultDialog(true);
    } catch (err) {
      console.error("Error retrying KYC:", err);
      setSaveResult("fail");
      setOpenResultDialog(true);
    } finally {
      setLoading(false);
    }
  };

  // Handle confirm save (PUT request)
  const handleConfirmSave = async () => {
    if (!customer) return;

    try {
      let payload;
      if (confirmAction === "Verified") {
        payload = {
          kycStatus: true,
          statusId: "cvvvhgjme6nnaun2s4pg", // Active
        };
        setCustomer((prev) => {
          if (!prev) return null;
          return {
            ...prev,
            kycStatus: true,
            status: "Active", // Mặc định Active sau khi duyệt
          };
        });
      } else if (confirmAction === "Reject") {
        payload = {
          kycStatus: false,
          statusId: "cvvvhgjme6nnaun2s4rf", // Rejected
        };
        setCustomer((prev) => {
          if (!prev) return null;
          return {
            ...prev,
            kycStatus: false,
            status: "Rejected",
          };
        });
      } else if (confirmAction === "UserStatus") {
        // FIX: Don't change kycStatus when just changing user status
        // Instead, maintain the current KYC status
        payload = {
          kycStatus: customer.kycStatus, // Keep existing KYC status
          statusId:
            userStatuses.find((s) => s.name === customer.status)?.id || "cvvvho3me6nnaun2s4r0",
        };
      } else {
        return;
      }

      const response = await axios.put(`https://be-crypto-depot.name.vn/api/users/${id}`, payload);

      console.log("Update response:", response.data);
      setSaveResult("success");
    } catch (err) {
      console.error("Error updating status:", err);
      setSaveResult("fail");
    } finally {
      setOpenConfirmDialog(false);
      setOpenResultDialog(true);
      setConfirmAction(null);
    }
  };

  // Handle close confirm dialog
  const handleCloseConfirmDialog = () => {
    setOpenConfirmDialog(false);
    setConfirmAction(null);
  };

  // Handle close result dialog
  const handleCloseResultDialog = () => {
    setOpenResultDialog(false);
    setSaveResult(null);
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

  const isKycPending = !customer.kycStatus && customer.status === null;
  const isKycApproved = customer.kycStatus;
  const isKycRejected = !customer.kycStatus && customer.status === "Rejected";

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
          <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
            {isKycPending && (
              <>
                <Button
                  variant="contained"
                  color="success"
                  onClick={handleKycVerified}
                  sx={{ borderRadius: 2 }}
                >
                  Verified
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  onClick={handleKycReject}
                  sx={{ borderRadius: 2 }}
                >
                  Reject
                </Button>
              </>
            )}
            {isKycApproved && (
              <FormControl sx={{ minWidth: 150 }}>
                <InputLabel>User Status</InputLabel>
                <Select
                  value={customer.status || "Active"}
                  label="User Status"
                  onChange={handleUserStatusChange}
                >
                  {userStatuses.map((status) => (
                    <MenuItem key={status.id} value={status.name}>
                      {status.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          </Box>
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
              {/* <TextField
                label="Country"
                value={customer.nation}
                InputProps={{ readOnly: true }}
                size="small"
                sx={{ width: "48%" }}
              /> */}
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
                {/* <Typography>Current Status:</Typography>
                <Chip
                  label={getCurrentStatusLabel()}
                  color={getStatusColor()}
                  sx={{ fontWeight: "bold", ml: 1 }}
                /> */}

                {/* FIX: Add a separate indicator for KYC status */}
                <Box sx={{ ml: 3, display: "flex", alignItems: "center" }}>
                  <Typography>KYC Status:</Typography>
                  <Chip
                    label={customer.kycStatus ? "Approved" : "Not Approved"}
                    color={customer.kycStatus ? "success" : "error"}
                    sx={{ fontWeight: "bold", ml: 1 }}
                  />
                </Box>
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
        {/* {isKycRejected && (
          <Button
            variant="contained"
            color="primary"
            onClick={handleRetryKYC}
            sx={{ borderRadius: 2 }}
          >
            Retry KYC
          </Button>
        )} */}
      </Box>

      {/* Confirm Dialog */}
      <Dialog
        open={openConfirmDialog}
        onClose={handleCloseConfirmDialog}
      >
        <DialogTitle>Confirm Action</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {confirmAction === "UserStatus" 
              ? `Are you sure you want to change the user status to ${customer.status}? This will not change the KYC verification status.`
              : `Are you sure you want to ${confirmAction === "Verified" ? "approve" : "reject"} the KYC for ${customer.fullName} (ID: ${customer.id})?`
            }
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
              ? confirmAction === "UserStatus" 
                ? "User status has been updated successfully."
                : "KYC status has been updated successfully."
              : "Failed to update status. Please try again."}
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