"use client"

import type React from "react"
import { useState, useCallback, useEffect } from "react"
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  TextField,
  Button,
  Paper,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  LinearProgress,
  DialogContentText,
} from "@mui/material"
import { DatePicker } from "@mui/x-date-pickers/DatePicker"
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns"
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider"
import SearchIcon from "@mui/icons-material/Search"
import UploadIcon from "@mui/icons-material/Upload"
import VisibilityIcon from "@mui/icons-material/Visibility"
import { styled } from "@mui/material/styles"

// Styled Card component
const StyledCard = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
}))

// TypeScript interfaces
interface SavingsAccount {
  id: string
  status: "active" | "pending" | "completed"
  heirStatus: "no_heir" | "has_heir" | "in_process"
  owner: {
    id: string
    name: string
    email: string
    phone: string
  }
  term: string
  startDate: string
  endDate: string
  balance: string
  supportStaff: string
  contractUrl: string
  googleDriveUrl: string
}

interface Filters {
  userName: string
  userId: string
  dateFrom: Date | null
  dateTo: Date | null
}

const SavingsManagement: React.FC = () => {
  // States
  const [filters, setFilters] = useState<Filters>({
    userName: "",
    userId: "",
    dateFrom: null,
    dateTo: null,
  })
  const [selectedAccount, setSelectedAccount] = useState<SavingsAccount | null>(null)
  const [editedAccount, setEditedAccount] = useState<SavingsAccount | null>(null)
  const [uploadProgress, setUploadProgress] = useState<number>(0)
  const [isUploadDialogOpen, setUploadDialogOpen] = useState(false)
  const [isConfirmDialogOpen, setConfirmDialogOpen] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)
  // Add new state
  const [filteredAccounts, setFilteredAccounts] = useState<SavingsAccount[]>([])
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)

  const handleFilterChange = (field: keyof Filters, value: any) => {
    setFilters((prev) => ({ ...prev, [field]: value }))
  }

  const handleAccountSelect = (account: SavingsAccount) => {
    if (selectedAccount?.id === account.id) {
      setSelectedAccount(null)
      setEditedAccount(null)
      setHasChanges(false)
    } else {
      setSelectedAccount(account)
      setEditedAccount(account)
      setHasChanges(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    if (editedAccount) {
      const updatedAccount = { ...editedAccount }
      if (field.startsWith("owner.")) {
        const ownerField = field.split(".")[1]
        updatedAccount.owner = {
          ...updatedAccount.owner,
          [ownerField]: value,
        }
      } else {
        ;(updatedAccount as any)[field] = value
      }
      setEditedAccount(updatedAccount)
      setHasChanges(true)
    }
  }

  const handleSubmit = () => {
    if (hasChanges) {
      setConfirmDialogOpen(true)
    }
  }

  const handleConfirmSubmit = () => {
    // Here you would typically make an API call to save the changes
    console.log("Saving changes:", editedAccount)
    setSelectedAccount(editedAccount)
    setConfirmDialogOpen(false)
    setHasChanges(false)
  }

  // Update handleFileUpload
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setUploadedFile(file)
    setUploadProgress(0)

    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          return 100
        }
        return prev + 10
      })
    }, 500)
  }

  // Add function to handle upload completion
  const handleUploadComplete = () => {
    if (uploadedFile && editedAccount) {
      const fileUrl = URL.createObjectURL(uploadedFile)
      handleInputChange("contractUrl", fileUrl)
      setUploadDialogOpen(false)
      setUploadProgress(0)
    }
  }

  // Status chip component
  const StatusChip = ({ status }: { status: string }) => {
    const getStatusColor = () => {
      switch (status) {
        case "no_heir":
          return { bg: "#fff3e0", color: "#f57c00" }
        case "has_heir":
          return { bg: "#e8f5e9", color: "#43a047" }
        case "in_process":
          return { bg: "#e3f2fd", color: "#1976d2" }
        default:
          return { bg: "#f5f5f5", color: "#757575" }
      }
    }

    const { bg, color } = getStatusColor()
    return <Chip label={status.replace("_", " ").toUpperCase()} style={{ backgroundColor: bg, color: color }} />
  }

  // Add filter function
  const applyFilters = useCallback(() => {
    // Move mockAccounts inside the callback
    const mockAccounts: SavingsAccount[] = [
      {
        id: "SAV123",
        status: "active",
        heirStatus: "no_heir",
        owner: {
          id: "USR456",
          name: "Nguyen Van A",
          email: "john@example.com",
          phone: "+1234567890",
        },
        term: "12 months",
        startDate: "2024-02-24",
        endDate: "2025-02-24",
        balance: "50 USDC",
        supportStaff: "Staff01",
        contractUrl: "",
        googleDriveUrl: "",
      },
      {
        id: "SAV124",
        status: "pending",
        heirStatus: "has_heir",
        owner: {
          id: "USR457",
          name: "Nguyen Van B",
          email: "jane@example.com",
          phone: "+1234567891",
        },
        term: "6 months",
        startDate: "2024-02-25",
        endDate: "2024-08-25",
        balance: "3 USDC",
        supportStaff: "Staff02",
        contractUrl: "",
        googleDriveUrl: "",
      },
    ]

    let filtered: SavingsAccount[] = mockAccounts

    if (filters.userName) {
      filtered = filtered.filter((account) => account.owner.name.toLowerCase().includes(filters.userName.toLowerCase()))
    }

    if (filters.userId) {
      filtered = filtered.filter((account) => account.owner.id.toLowerCase().includes(filters.userId.toLowerCase()))
    }

    if (filters.dateFrom) {
      filtered = filtered.filter((account) => new Date(account.startDate) >= filters.dateFrom!)
    }

    if (filters.dateTo) {
      filtered = filtered.filter((account) => new Date(account.startDate) <= filters.dateTo!)
    }

    setFilteredAccounts(filtered)
  }, [filters]);

  // Add useEffect to apply filters
  useEffect(() => {
    applyFilters()
  }, [applyFilters])

  return (
    <Box sx={{ p: 3 }}>
      {/* Search Filters */}
      <StyledCard>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Search Filters
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="User Name"
                value={filters.userName}
                onChange={(e) => handleFilterChange("userName", e.target.value)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="User ID"
                value={filters.userId}
                onChange={(e) => handleFilterChange("userId", e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <DatePicker
                      label="From Date"
                      value={filters.dateFrom}
                      onChange={(date) => handleFilterChange("dateFrom", date)}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <DatePicker
                      label="To Date"
                      value={filters.dateTo}
                      onChange={(date) => handleFilterChange("dateTo", date)}
                    />
                  </Grid>
                </Grid>
              </LocalizationProvider>
            </Grid>
          </Grid>
        </CardContent>
      </StyledCard>

      {/* Accounts Table */}
      <StyledCard>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Savings Accounts
          </Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Account ID</TableCell>
                  <TableCell>Owner</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Balance</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredAccounts.map((account) => (
                  <TableRow key={account.id}>
                    <TableCell>{account.id}</TableCell>
                    <TableCell>{account.owner.name}</TableCell>
                    <TableCell>
                      <StatusChip status={account.heirStatus} />
                    </TableCell>
                    <TableCell>{account.balance}</TableCell>
                    <TableCell>
                      <IconButton
                        onClick={() => handleAccountSelect(account)}
                        color={selectedAccount?.id === account.id ? "secondary" : "primary"}
                      >
                        <VisibilityIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </StyledCard>

      {/* Account Details */}
      {selectedAccount && editedAccount && (
        <StyledCard>
          <CardContent>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Account Details
                </Typography>
              </Grid>

              {/* Status */}
              <Grid item xs={12} sm={6}>
                <Paper sx={{ p: 2 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    Status
                  </Typography>
                  <StatusChip status={editedAccount.heirStatus} />
                </Paper>
              </Grid>

              {/* Balance */}
              <Grid item xs={12} sm={6}>
                <Paper sx={{ p: 2 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    Current Balance
                  </Typography>
                  <Typography variant="h5">{editedAccount.balance}</Typography>
                </Paper>
              </Grid>

              {/* Account Info */}
              <Grid item xs={12}>
                <Paper sx={{ p: 2 }}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Account ID"
                        value={editedAccount.id}
                        InputProps={{ readOnly: true }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Term"
                        value={editedAccount.term}
                        onChange={(e) => handleInputChange("term", e.target.value)}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Start Date"
                        value={editedAccount.startDate}
                        onChange={(e) => handleInputChange("startDate", e.target.value)}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="End Date"
                        value={editedAccount.endDate}
                        onChange={(e) => handleInputChange("endDate", e.target.value)}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Support Staff"
                        value={editedAccount.supportStaff}
                        onChange={(e) => handleInputChange("supportStaff", e.target.value)}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Google Drive URL"
                        value={editedAccount.googleDriveUrl}
                        onChange={(e) => handleInputChange("googleDriveUrl", e.target.value)}
                        placeholder="No URL provided"
                      />
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>

              {/* Owner Info */}
              <Grid item xs={12}>
                <Paper sx={{ p: 2 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    Owner Information
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Name"
                        value={editedAccount.owner.name}
                        InputProps={{ readOnly: true }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField fullWidth label="ID" value={editedAccount.owner.id} InputProps={{ readOnly: true }} />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Email"
                        value={editedAccount.owner.email}
                        InputProps={{ readOnly: true }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Phone"
                        value={editedAccount.owner.phone}
                        InputProps={{ readOnly: true }}
                      />
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>

              {/* Contract Upload */}
              <Grid item xs={12}>
                <Paper sx={{ p: 2 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    Contract Document
                  </Typography>
                  <Box sx={{ mb: 2 }}>
                    <Button variant="contained" startIcon={<UploadIcon />} onClick={() => setUploadDialogOpen(true)}>
                      Upload Contract
                    </Button>
                  </Box>
                  {editedAccount.contractUrl && (
                    <Alert severity="success">
                      Contract uploaded successfully.
                      <Button color="inherit" size="small" href={editedAccount.contractUrl} target="_blank">
                        View on Google Drive
                      </Button>
                    </Alert>
                  )}
                </Paper>
              </Grid>

              {/* Submit Button */}
              <Grid item xs={12}>
                <Box display="flex" justifyContent="flex-end" gap={2}>
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={() => {
                      setSelectedAccount(null)
                      setEditedAccount(null)
                      setHasChanges(false)
                    }}
                  >
                    Cancel
                  </Button>
                  <Button variant="contained" color="primary" onClick={handleSubmit} disabled={!hasChanges}>
                    Submit Changes
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </StyledCard>
      )}

      {/* Confirmation Dialog */}
      <Dialog open={isConfirmDialogOpen} onClose={() => setConfirmDialogOpen(false)}>
        <DialogTitle>Confirm Changes</DialogTitle>
        <DialogContent>
          <DialogContentText>Are you sure you want to save the changes to this savings account?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleConfirmSubmit} variant="contained" color="primary">
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>

      {/* Upload Dialog */}
      <Dialog open={isUploadDialogOpen} onClose={() => setUploadDialogOpen(false)}>
        <DialogTitle>Upload Contract</DialogTitle>
        <DialogContent>
          <Box sx={{ my: 2 }}>
            <input
              type="file"
              accept="image/*,.pdf"
              onChange={handleFileUpload}
              style={{ display: "none" }}
              id="contract-file-input"
            />
            <label htmlFor="contract-file-input">
              <Button variant="outlined" component="span" startIcon={<UploadIcon />}>
                Choose File
              </Button>
            </label>
          </Box>
          {uploadProgress > 0 && (
            <Box sx={{ width: "100%", mt: 2 }}>
              <LinearProgress variant="determinate" value={uploadProgress} />
              <Typography variant="body2" color="text.secondary" align="center">
                {uploadProgress}%
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setUploadDialogOpen(false)}>Cancel</Button>
          <Button color="primary" onClick={handleUploadComplete} disabled={uploadProgress > 0 && uploadProgress < 100}>
            Upload
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default SavingsManagement

