"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/router"
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  LinearProgress,
  DialogContentText,
} from "@mui/material"
import { styled } from "@mui/material/styles"
import UploadIcon from "@mui/icons-material/Upload"
import { format } from "date-fns" 

const StyledCard = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
}))

interface SavingsAccount {
  id: string
  status: "active" | "pending" | "completed"
  heirStatus: "no_heir" | "has_heir" | "in_process"
  owner: { id: string; name: string; email: string; phone: string }
  term: string
  startDate: string
  endDate: string
  balance: string
  supportStaff: string
  contractUrl: string
  googleDriveUrl: string
}


const formatDate = (dateString: string) => {
  return format(new Date(dateString), "dd/MM/yyyy")
}

const AccountDetails: React.FC = () => {
  const router = useRouter()
  const { id } = router.query

  const [editedAccount, setEditedAccount] = useState<SavingsAccount | null>(null)
  const [uploadProgress, setUploadProgress] = useState<number>(0)
  const [isUploadDialogOpen, setUploadDialogOpen] = useState(false)
  const [isConfirmDialogOpen, setConfirmDialogOpen] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)

  useEffect(() => {
    if (!id) return

    const mockAccounts: SavingsAccount[] = [
      {
        id: "SAV001",
        status: "active",
        heirStatus: "no_heir",
        owner: { id: "USRER001", name: "Nguyen Van Thuan", email: "thuannv.it@gmail.com", phone: "+8434567890" },
        term: "12 months",
        startDate: "2024-02-24",
        endDate: "2025-02-24",
        balance: "50 USDC",
        supportStaff: "Staff01",
        contractUrl: "",
        googleDriveUrl: "",
      },
      {
        id: "SAV002",
        status: "pending",
        heirStatus: "has_heir",
        owner: { id: "USRER002", name: "Tran Huu Luan", email: "luantr@gmail.com", phone: "+8434567891" },
        term: "6 months",
        startDate: "2024-02-25",
        endDate: "2024-08-25",
        balance: "3 USDC",
        supportStaff: "Staff02",
        contractUrl: "",
        googleDriveUrl: "",
      },
    ]
    const account = mockAccounts.find((acc) => acc.id === id)
    setEditedAccount(account || null)
  }, [id])

  const handleInputChange = (field: string, value: string) => {
    if (editedAccount) {
      const updatedAccount = { ...editedAccount }
      if (field.startsWith("owner.")) {
        const ownerField = field.split(".")[1]
        updatedAccount.owner = { ...updatedAccount.owner, [ownerField]: value }
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
    console.log("Saving changes:", editedAccount)
    setConfirmDialogOpen(false)
    setHasChanges(false)
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setUploadedFile(file)
    setUploadProgress(0)

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

  const handleUploadComplete = () => {
    if (uploadedFile && editedAccount) {
      const fileUrl = URL.createObjectURL(uploadedFile)
      handleInputChange("contractUrl", fileUrl)
      setUploadDialogOpen(false)
      setUploadProgress(0)
    }
  }

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
    return <Chip label={status.replace("_", " ").toUpperCase()} style={{ backgroundColor: bg, color }} />
  }

  if (!editedAccount) {
    return <Typography>Account not found</Typography>
  }

  return (
    <Box sx={{ p: 3 }}>
      <StyledCard>
        <CardContent>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Account Details - {editedAccount.id}
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Status
                </Typography>
                <StatusChip status={editedAccount.heirStatus} />
              </Paper>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Current Balance
                </Typography>
                <Typography variant="h5">{editedAccount.balance}</Typography>
              </Paper>
            </Grid>

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
                      value={formatDate(editedAccount.startDate)}
                      onChange={(e) => handleInputChange("startDate", e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="End Date"
                      value={formatDate(editedAccount.endDate)} // 
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
                    <TextField
                      fullWidth
                      label="ID"
                      value={editedAccount.owner.id}
                      InputProps={{ readOnly: true }}
                    />
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
                      View Contract
                    </Button>
                  </Alert>
                )}
              </Paper>
            </Grid>

            <Grid item xs={12}>
              <Box display="flex" justifyContent="flex-end" gap={2}>
                <Button variant="outlined" color="secondary" onClick={() => router.push("/savings-management")}>
                  Back
                </Button>
                <Button variant="contained" color="primary" onClick={handleSubmit} disabled={!hasChanges}>
                  Submit Changes
                </Button>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </StyledCard>

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

export default AccountDetails