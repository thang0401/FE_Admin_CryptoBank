"use client"

import React, { useState } from "react"
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardHeader,
  Grid,
  Switch,
  FormControlLabel,
  TextField,
  Button,
  Divider,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  InputAdornment,
} from "@mui/material"
import { Security, Add, Delete, Edit, Save, LockPerson, Shield, Gavel } from "@mui/icons-material"
import type { ApprovalThreshold } from "src/types/asset-management/type"

const SecuritySettings: React.FC = () => {
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true)
  const [passwordConfirmationRequired, setPasswordConfirmationRequired] = useState(true)
  const [approvalThresholds, setApprovalThresholds] = useState<ApprovalThreshold[]>([
    { amount: 100000, requiredApprovals: 2 },
    { amount: 500000, requiredApprovals: 3 },
  ])
  const [trustedAddresses, setTrustedAddresses] = useState<string[]>(["0x1234...5678", "0x8765...4321"])
  const [dailyTransactionLimit, setDailyTransactionLimit] = useState(10)

  const [openThresholdDialog, setOpenThresholdDialog] = useState(false)
  const [openAddressDialog, setOpenAddressDialog] = useState(false)
  const [newThresholdAmount, setNewThresholdAmount] = useState("")
  const [newThresholdApprovals, setNewThresholdApprovals] = useState("")
  const [newAddress, setNewAddress] = useState("")
  const [editingThresholdIndex, setEditingThresholdIndex] = useState<number | null>(null)

  const handleTwoFactorChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTwoFactorEnabled(event.target.checked)
  }

  const handlePasswordConfirmationChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordConfirmationRequired(event.target.checked)
  }

  const handleDailyLimitChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDailyTransactionLimit(Number(event.target.value))
  }

  const handleOpenThresholdDialog = (index?: number) => {
    if (index !== undefined) {
      setEditingThresholdIndex(index)
      setNewThresholdAmount(approvalThresholds[index].amount.toString())
      setNewThresholdApprovals(approvalThresholds[index].requiredApprovals.toString())
    } else {
      setEditingThresholdIndex(null)
      setNewThresholdAmount("")
      setNewThresholdApprovals("")
    }
    setOpenThresholdDialog(true)
  }

  const handleCloseThresholdDialog = () => {
    setOpenThresholdDialog(false)
  }

  const handleSaveThreshold = () => {
    const newThreshold: ApprovalThreshold = {
      amount: Number(newThresholdAmount),
      requiredApprovals: Number(newThresholdApprovals),
    }

    if (editingThresholdIndex !== null) {
      // Edit existing threshold
      const updatedThresholds = [...approvalThresholds]
      updatedThresholds[editingThresholdIndex] = newThreshold
      setApprovalThresholds(updatedThresholds)
    } else {
      // Add new threshold
      setApprovalThresholds([...approvalThresholds, newThreshold])
    }

    handleCloseThresholdDialog()
  }

  const handleDeleteThreshold = (index: number) => {
    const updatedThresholds = approvalThresholds.filter((_, i) => i !== index)
    setApprovalThresholds(updatedThresholds)
  }

  const handleOpenAddressDialog = () => {
    setNewAddress("")
    setOpenAddressDialog(true)
  }

  const handleCloseAddressDialog = () => {
    setOpenAddressDialog(false)
  }

  const handleSaveAddress = () => {
    setTrustedAddresses([...trustedAddresses, newAddress])
    handleCloseAddressDialog()
  }

  const handleDeleteAddress = (index: number) => {
    const updatedAddresses = trustedAddresses.filter((_, i) => i !== index)
    setTrustedAddresses(updatedAddresses)
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Security Settings
      </Typography>

      <Grid container spacing={3}>
        {/* Authentication Settings */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader title="Authentication" avatar={<LockPerson color="primary" />} />
            <CardContent>
              <FormControlLabel
                control={<Switch checked={twoFactorEnabled} onChange={handleTwoFactorChange} color="primary" />}
                label="Require 2FA for all transactions"
              />
              <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 1, mb: 2 }}>
                Adds an extra layer of security by requiring a one-time password for all transactions.
              </Typography>

              <FormControlLabel
                control={
                  <Switch
                    checked={passwordConfirmationRequired}
                    onChange={handlePasswordConfirmationChange}
                    color="primary"
                  />
                }
                label="Require password confirmation for transfers and balance adjustments"
              />
              <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 1 }}>
                Administrators must enter their password when making transfers or adjusting balances.
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Risk Management */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader title="Risk Management" avatar={<Shield color="primary" />} />
            <CardContent>
              <Typography variant="subtitle2" gutterBottom>
                Daily Transaction Limit
              </Typography>
              <TextField
                type="number"
                value={dailyTransactionLimit}
                onChange={handleDailyLimitChange}
                fullWidth
                margin="normal"
                helperText="Maximum number of transactions allowed per day"
              />

              <Alert severity="info" sx={{ mt: 2 }}>
                Abnormal transaction detection is enabled. The system will flag transactions that deviate from normal
                patterns.
              </Alert>
            </CardContent>
          </Card>
        </Grid>

        {/* Approval Thresholds */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader
              title="Multi-level Approval Thresholds"
              avatar={<Gavel color="primary" />}
              action={
                <Button startIcon={<Add />} onClick={() => handleOpenThresholdDialog()} size="small">
                  Add
                </Button>
              }
            />
            <CardContent>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Transactions exceeding these thresholds will require multiple admin approvals.
              </Typography>

              <List>
                {approvalThresholds.map((threshold, index) => (
                  <React.Fragment key={index}>
                    {index > 0 && <Divider />}
                    <ListItem
                      secondaryAction={
                        <Box>
                          <Tooltip title="Edit">
                            <IconButton edge="end" onClick={() => handleOpenThresholdDialog(index)}>
                              <Edit />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete">
                            <IconButton edge="end" onClick={() => handleDeleteThreshold(index)}>
                              <Delete />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      }
                    >
                      <ListItemText
                        primary={`$${threshold.amount.toLocaleString()}`}
                        secondary={`Requires ${threshold.requiredApprovals} admin approvals`}
                      />
                    </ListItem>
                  </React.Fragment>
                ))}
                {approvalThresholds.length === 0 && (
                  <ListItem>
                    <ListItemText primary="No thresholds configured" />
                  </ListItem>
                )}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Trusted Addresses */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader
              title="Trusted Addresses"
              avatar={<Security color="primary" />}
              action={
                <Button startIcon={<Add />} onClick={handleOpenAddressDialog} size="small">
                  Add
                </Button>
              }
            />
            <CardContent>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Whitelist of frequently used addresses that bypass additional security checks.
              </Typography>

              <List>
                {trustedAddresses.map((address, index) => (
                  <React.Fragment key={index}>
                    {index > 0 && <Divider />}
                    <ListItem
                      secondaryAction={
                        <Tooltip title="Delete">
                          <IconButton edge="end" onClick={() => handleDeleteAddress(index)}>
                            <Delete />
                          </IconButton>
                        </Tooltip>
                      }
                    >
                      <ListItemText primary={address} secondary="Trusted address" />
                    </ListItem>
                  </React.Fragment>
                ))}
                {trustedAddresses.length === 0 && (
                  <ListItem>
                    <ListItemText primary="No trusted addresses configured" />
                  </ListItem>
                )}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Save Button */}
        <Grid item xs={12}>
          <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
            <Button variant="contained" color="primary" startIcon={<Save />}>
              Save Security Settings
            </Button>
          </Box>
        </Grid>
      </Grid>

      {/* Threshold Dialog */}
      <Dialog open={openThresholdDialog} onClose={handleCloseThresholdDialog}>
        <DialogTitle>
          {editingThresholdIndex !== null ? "Edit Approval Threshold" : "Add Approval Threshold"}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                label="Amount Threshold"
                fullWidth
                type="number"
                value={newThresholdAmount}
                onChange={(e) => setNewThresholdAmount(e.target.value)}
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Required Approvals"
                fullWidth
                type="number"
                value={newThresholdApprovals}
                onChange={(e) => setNewThresholdApprovals(e.target.value)}
                inputProps={{ min: 1, max: 10 }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseThresholdDialog}>Cancel</Button>
          <Button
            onClick={handleSaveThreshold}
            variant="contained"
            disabled={!newThresholdAmount || !newThresholdApprovals}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Address Dialog */}
      <Dialog open={openAddressDialog} onClose={handleCloseAddressDialog}>
        <DialogTitle>Add Trusted Address</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                label="Blockchain Address"
                fullWidth
                value={newAddress}
                onChange={(e) => setNewAddress(e.target.value)}
                placeholder="0x..."
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAddressDialog}>Cancel</Button>
          <Button onClick={handleSaveAddress} variant="contained" disabled={!newAddress}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default SecuritySettings

