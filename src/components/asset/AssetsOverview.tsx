"use client"

import type React from "react"
import { useState } from "react"
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  Chip,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
  CircularProgress,
  Tabs,
  Tab,
  Alert,
  useTheme,
  type SelectChangeEvent,
} from "@mui/material"
import {
  Refresh,
  Speed,
  Wallet,
  Search,
  ArrowUpward,
  Add,
  Remove,
  Warning,
  ContentCopy,
  Settings,
  Notifications,
} from "@mui/icons-material"
import type { AssetData, TransactionData, AlertData } from "src/types/asset-management/type"
import TwoFactorVerification from "./TwoFactorVerification"

interface AssetsOverviewProps {
  assets: AssetData[]
  setAssets: React.Dispatch<React.SetStateAction<AssetData[]>>
  transactions: TransactionData[]
  setTransactions: React.Dispatch<React.SetStateAction<TransactionData[]>>
  alerts: AlertData[]
}

const AssetsOverview: React.FC<AssetsOverviewProps> = ({
  assets,
  setAssets,
  transactions,
  setTransactions,
  alerts,
}) => {
  const theme = useTheme()
  const [assetTypeTab, setAssetTypeTab] = useState<number>(0)
  const [openTransferDialog, setOpenTransferDialog] = useState<boolean>(false)
  const [openAdjustDialog, setOpenAdjustDialog] = useState<boolean>(false)
  const [selectedAsset, setSelectedAsset] = useState<AssetData | null>(null)
  const [transferAmount, setTransferAmount] = useState<string>("")
  const [transferAddress, setTransferAddress] = useState<string>("")
  const [transferBankAccount, setTransferBankAccount] = useState<string>("")
  const [transferBankName, setTransferBankName] = useState<string>("")
  const [adjustAmount, setAdjustAmount] = useState<string>("")
  const [adjustType, setAdjustType] = useState<string>("add")
  const [adjustReason, setAdjustReason] = useState<string>("")
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [password, setPassword] = useState<string>("")
  const [showTwoFactorDialog, setShowTwoFactorDialog] = useState<boolean>(false)
  const [pendingAction, setPendingAction] = useState<"transfer" | "adjust" | null>(null)
  const [showAlerts, setShowAlerts] = useState<boolean>(false)

  const handleAssetTypeTabChange = (_event: React.SyntheticEvent, newValue: number): void => {
    setAssetTypeTab(newValue)
  }

  const handleTransferOpen = (asset: AssetData): void => {
    setSelectedAsset(asset)
    setOpenTransferDialog(true)
  }

  const handleTransferClose = (): void => {
    setOpenTransferDialog(false)
    setSelectedAsset(null)
    setTransferAmount("")
    setTransferAddress("")
    setTransferBankAccount("")
    setTransferBankName("")
    setPassword("")
  }

  const handleAdjustOpen = (asset: AssetData): void => {
    setSelectedAsset(asset)
    setOpenAdjustDialog(true)
  }

  const handleAdjustClose = (): void => {
    setOpenAdjustDialog(false)
    setSelectedAsset(null)
    setAdjustAmount("")
    setAdjustType("add")
    setAdjustReason("")
    setPassword("")
  }

  const handleAdjustTypeChange = (event: SelectChangeEvent): void => {
    setAdjustType(event.target.value)
  }

  const initiateTransfer = (): void => {
    setPendingAction("transfer")
    setShowTwoFactorDialog(true)
  }

  const initiateAdjust = (): void => {
    setPendingAction("adjust")
    setShowTwoFactorDialog(true)
  }

  const handleTransfer = (): void => {
    if (!selectedAsset) return

    setIsLoading(true)
    // Simulate API call
    setTimeout(() => {
      // Add transaction
      const newTransaction: TransactionData = {
        id: transactions.length + 1,
        type: "withdrawal",
        asset: selectedAsset.name,
        assetType: selectedAsset.type,
        amount: Number.parseFloat(transferAmount),
        user: "super_admin",
        timestamp: new Date().toISOString(),
        status: "pending",
        txHash:
          selectedAsset.type === "crypto"
            ? `0x${Math.random().toString(36).substring(2, 10)}...${Math.random().toString(36).substring(2, 6)}`
            : undefined,
        reference:
          selectedAsset.type === "fiat"
            ? `REF-${Math.random().toString(36).substring(2, 10).toUpperCase()}`
            : undefined,
        approvals: [
          {
            admin: "super_admin",
            timestamp: new Date().toISOString(),
            status: "approved",
          },
        ],
      }

      setTransactions([newTransaction, ...transactions])

      // Update asset balance (in a real app this would happen after confirmation)
      setAssets(
        assets.map((asset) =>
          asset.id === selectedAsset.id
            ? { ...asset, balance: asset.balance - Number.parseFloat(transferAmount) }
            : asset,
        ),
      )

      setIsLoading(false)
      handleTransferClose()
      setShowTwoFactorDialog(false)
    }, 1500)
  }

  const handleAdjust = (): void => {
    if (!selectedAsset) return

    setIsLoading(true)
    // Simulate API call
    setTimeout(() => {
      const adjustedAmount = adjustType === "add" ? Number.parseFloat(adjustAmount) : -Number.parseFloat(adjustAmount)

      // Add transaction
      const newTransaction: TransactionData = {
        id: transactions.length + 1,
        type: adjustType === "add" ? "adjustment_add" : "adjustment_remove",
        asset: selectedAsset.name,
        assetType: selectedAsset.type,
        amount: Math.abs(Number.parseFloat(adjustAmount)),
        user: "super_admin",
        timestamp: new Date().toISOString(),
        status: "completed",
        txHash:
          selectedAsset.type === "crypto"
            ? `0x${Math.random().toString(36).substring(2, 10)}...${Math.random().toString(36).substring(2, 6)}`
            : undefined,
        reference:
          selectedAsset.type === "fiat"
            ? `ADJ-${Math.random().toString(36).substring(2, 10).toUpperCase()}`
            : undefined,
        approvals: [
          {
            admin: "super_admin",
            timestamp: new Date().toISOString(),
            status: "approved",
          },
        ],
      }

      setTransactions([newTransaction, ...transactions])

      // Update asset balance
      setAssets(
        assets.map((asset) =>
          asset.id === selectedAsset.id ? { ...asset, balance: asset.balance + adjustedAmount } : asset,
        ),
      )

      setIsLoading(false)
      handleAdjustClose()
      setShowTwoFactorDialog(false)
    }, 1500)
  }

  const handleTwoFactorSuccess = () => {
    if (pendingAction === "transfer") {
      handleTransfer()
    } else if (pendingAction === "adjust") {
      handleAdjust()
    }
  }

  const handleTwoFactorCancel = () => {
    setShowTwoFactorDialog(false)
    setPendingAction(null)
  }

  const formatCurrency = (value: number, currency: string): string => {
    if (currency === "USDC") {
      return `$${value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
    } else if (currency === "VND") {
      return `₫${value.toLocaleString("vi-VN")}`
    } else if (currency === "ETH") {
      return `${value.toLocaleString("en-US", { minimumFractionDigits: 6, maximumFractionDigits: 6 })} ETH`
    } else if (currency === "LINK") {
      return `${value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} LINK`
    }
    return value.toString()
  }

  const getStatusColor = (
    status: string,
  ): "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning" => {
    switch (status) {
      case "completed":
        return "success"
      case "pending":
        return "warning"
      case "failed":
        return "error"
      case "active":
        return "success"
      default:
        return "default"
    }
  }

  const cardBackgroundColors = {
    USDC: theme.palette.mode === "dark" ? "#1e2a3a" : "#e8f5e9",
    VND: theme.palette.mode === "dark" ? "#4a3b52" : "#f5f5f5",
    ETH: theme.palette.mode === "dark" ? "#2d3142" : "#e3f2fd",
    LINK: theme.palette.mode === "dark" ? "#375280" : "#e8eaf6",
  }

  const filteredAssets =
    assetTypeTab === 0
      ? assets
      : assetTypeTab === 1
        ? assets.filter((asset) => asset.type === "fiat")
        : assets.filter((asset) => asset.type === "crypto")

  return (
    <>
      {/* Asset Summary Cards */}
      <Box sx={{ p: 3 }}>
        <Grid container spacing={3} sx={{ mt: 1 }}>
          {/* Quick Stats Cards */}
          <Grid item xs={12} md={4}>
            <Card sx={{ height: "100%", backgroundColor: cardBackgroundColors.USDC, boxShadow: 3 }}>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: "medium" }}>
                  Total USDC
                </Typography>
                <Typography variant="h4" sx={{ my: 1, fontWeight: "bold" }}>
                  {formatCurrency(assets.find((a) => a.name === "USDC")?.balance || 0, "USDC")}
                </Typography>
                <Typography variant="body2">Last updated: Today, 9:45 AM</Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card sx={{ height: "100%", backgroundColor: cardBackgroundColors.VND, boxShadow: 3 }}>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: "medium" }}>
                  Total VND
                </Typography>
                <Typography variant="h4" sx={{ my: 1, fontWeight: "bold" }}>
                  {formatCurrency(assets.find((a) => a.name === "VND")?.balance || 0, "VND")}
                </Typography>
                <Typography variant="body2">Last updated: Today, 9:45 AM</Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card sx={{ height: "100%", backgroundColor: cardBackgroundColors.ETH, boxShadow: 3 }}>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: "medium" }}>
                  ETH (Gas Reserve)
                </Typography>
                <Typography variant="h4" sx={{ my: 1, fontWeight: "bold" }}>
                  {formatCurrency(assets.find((a) => a.name === "ETH")?.balance || 0, "ETH")}
                </Typography>
                <Typography variant="body2">Last updated: Today, 9:45 AM</Typography>
              </CardContent>
            </Card>
          </Grid>
          {/* <Grid item xs={12} md={3}>
            <Card sx={{ height: "100%", backgroundColor: cardBackgroundColors.LINK, boxShadow: 3 }}>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: "medium" }}>
                  LINK (Smart Contract Gas)
                </Typography>
                <Typography variant="h4" sx={{ my: 1, fontWeight: "bold" }}>
                  {formatCurrency(assets.find((a) => a.name === "LINK")?.balance || 0, "LINK")}
                </Typography>
                <Typography variant="body2">Last updated: Today, 9:45 AM</Typography>
              </CardContent>
            </Card>
          </Grid> */}
        </Grid>

        {/* Alerts Section */}
        {alerts.length > 0 && showAlerts && (
          <Box sx={{ mt: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Alerts
            </Typography>
            <Grid container spacing={2}>
              {alerts.map((alert) => (
                <Grid item xs={12} key={alert.id}>
                  <Alert
                    severity={alert.severity}
                    sx={{ "& .MuiAlert-message": { display: "flex", justifyContent: "space-between", width: "100%" } }}
                  >
                    <Box sx={{ display: "flex", justifyContent: "space-between", width: "100%", alignItems: "center" }}>
                      <Typography variant="body2">{alert.message}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {alert.time}
                      </Typography>
                    </Box>
                  </Alert>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}

        {/* Assets Overview Section */}
        <Box sx={{ mt: 3 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
            <Typography variant="h6">Assets Overview</Typography>
            <Box>
              <Tooltip title={`${alerts.length} alerts`}>
                <IconButton onClick={() => setShowAlerts(!showAlerts)} sx={{ mr: 1, position: "relative" }}>
                  <Notifications />
                  {alerts.length > 0 && (
                    <Box
                      sx={{
                        position: "absolute",
                        top: 8,
                        right: 8,
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        bgcolor: "error.main",
                      }}
                    />
                  )}
                </IconButton>
              </Tooltip>
              <Button variant="outlined" startIcon={<Refresh />} sx={{ mr: 1 }}>
                Refresh
              </Button>
              <Button variant="contained" color="primary" startIcon={<Speed />}>
                Gas Settings
              </Button>
            </Box>
          </Box>

          {/* Asset Type Tabs */}
          <Tabs
            value={assetTypeTab}
            onChange={handleAssetTypeTabChange}
            textColor="primary"
            indicatorColor="primary"
            sx={{ mb: 2 }}
          >
            <Tab label="All Assets" />
            <Tab label="Fiat Currency" />
            <Tab label="Cryptocurrency" />
          </Tabs>

          <TableContainer>
            <Table sx={{ minWidth: 650 }}>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <strong>Asset</strong>
                  </TableCell>
                  <TableCell align="right">
                    <strong>Balance</strong>
                  </TableCell>
                  <TableCell>
                    <strong>{assetTypeTab !== 1 ? "Address / Account" : "Bank Account"}</strong>
                  </TableCell>
                  <TableCell align="right">
                    <strong>Daily Limit</strong>
                  </TableCell>
                  <TableCell align="left">
                    <strong>Transactions</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Status</strong>
                  </TableCell>
                  <TableCell align="center">
                    <strong>Actions</strong>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredAssets.map((asset) => (
                  <TableRow key={asset.id} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                    <TableCell component="th" scope="row">
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Wallet
                          sx={{
                            mr: 1,
                            color:
                              asset.name === "USDC"
                                ? "#2e7d32"
                                : asset.name === "VND"
                                  ? "#757575"
                                  : asset.name === "Link"
                                    ? "#375280"
                                    : "#1976d2",
                          }}
                        />
                        <Box>
                          <Typography variant="body1">{asset.name}</Typography>
                          <Typography variant="caption" color="text.secondary">
                            {asset.type === "crypto" ? "Cryptocurrency" : "Fiat Currency"}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="body1" sx={{ fontWeight: "medium" }}>
                        {formatCurrency(asset.balance, asset.name)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      {asset.type === "crypto" ? (
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          {asset.address}
                          <Tooltip title="Copy address">
                            <IconButton size="small">
                              <ContentCopy />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      ) : (
                        <Box>
                          <Typography variant="body2">{asset.bankName}</Typography>
                          <Typography variant="body2">{asset.bankAccount}</Typography>
                        </Box>
                      )}
                    </TableCell>
                    <TableCell align="right">{formatCurrency(asset.dailyLimit, asset.name)}</TableCell>
                    <TableCell>{asset.transactions}</TableCell>
                    <TableCell>
                      <Chip label={asset.status} size="small" color={getStatusColor(asset.status)} />
                    </TableCell>
                    <TableCell align="center">
                      <Box>
                        <Tooltip title="Transfer">
                          <IconButton onClick={() => handleTransferOpen(asset)}>
                            <ArrowUpward />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Adjust Balance">
                          <IconButton onClick={() => handleAdjustOpen(asset)}>
                            <Settings />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="View details">
                          <IconButton>
                            <Search />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Box>

      {/* Transfer Dialog */}
      <Dialog open={openTransferDialog} onClose={handleTransferClose} maxWidth="sm" fullWidth>
        <DialogTitle>Transfer {selectedAsset?.name}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <Alert severity="info" sx={{ mb: 2 }}>
                You are transferring {selectedAsset?.name} from the bank's main wallet.
              </Alert>
            </Grid>

            {selectedAsset?.type === "crypto" ? (
              <Grid item xs={12}>
                <TextField
                  label="Destination Address"
                  fullWidth
                  value={transferAddress}
                  onChange={(e) => setTransferAddress(e.target.value)}
                  placeholder="0x..."
                  variant="outlined"
                />
              </Grid>
            ) : (
              <>
                <Grid item xs={12}>
                  <TextField
                    label="Bank Name"
                    fullWidth
                    value={transferBankName}
                    onChange={(e) => setTransferBankName(e.target.value)}
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Account Number"
                    fullWidth
                    value={transferBankAccount}
                    onChange={(e) => setTransferBankAccount(e.target.value)}
                    variant="outlined"
                  />
                </Grid>
              </>
            )}

            <Grid item xs={12}>
              <TextField
                label="Amount"
                fullWidth
                value={transferAmount}
                onChange={(e) => setTransferAmount(e.target.value)}
                type="number"
                InputProps={{
                  endAdornment: <InputAdornment position="end">{selectedAsset?.name}</InputAdornment>,
                }}
                variant="outlined"
              />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="body2" color="text.secondary">
                Available balance: {selectedAsset ? formatCurrency(selectedAsset.balance, selectedAsset.name) : ""}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Daily limit: {selectedAsset ? formatCurrency(selectedAsset.dailyLimit, selectedAsset.name) : ""}
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Password"
                type="password"
                fullWidth
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                variant="outlined"
                required
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleTransferClose} color="inherit">
            Cancel
          </Button>
          <Button
            onClick={initiateTransfer}
            color="primary"
            variant="contained"
            disabled={
              !transferAmount ||
              (selectedAsset?.type === "crypto" ? !transferAddress : !transferBankAccount) ||
              !password ||
              isLoading
            }
            startIcon={isLoading ? <CircularProgress size={20} /> : <ArrowUpward />}
          >
            {isLoading ? "Processing..." : "Transfer"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Adjust Balance Dialog */}
      <Dialog open={openAdjustDialog} onClose={handleAdjustClose} maxWidth="sm" fullWidth>
        <DialogTitle>Adjust {selectedAsset?.name} Balance</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <Alert severity="warning" icon={<Warning />}>
                This will manually adjust the system balance. Use with caution.
              </Alert>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Adjustment Type</InputLabel>
                <Select value={adjustType} onChange={handleAdjustTypeChange} label="Adjustment Type">
                  <MenuItem value="add">Add (Increase Balance)</MenuItem>
                  <MenuItem value="remove">Remove (Decrease Balance)</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Amount"
                fullWidth
                value={adjustAmount}
                onChange={(e) => setAdjustAmount(e.target.value)}
                type="number"
                InputProps={{
                  endAdornment: <InputAdornment position="end">{selectedAsset?.name}</InputAdornment>,
                }}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Reason for Adjustment"
                fullWidth
                multiline
                rows={2}
                variant="outlined"
                value={adjustReason}
                onChange={(e) => setAdjustReason(e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Password"
                type="password"
                fullWidth
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                variant="outlined"
                required
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleAdjustClose} color="inherit">
            Cancel
          </Button>
          <Button
            onClick={initiateAdjust}
            color="secondary"
            variant="contained"
            disabled={!adjustAmount || !adjustReason || !password || isLoading}
            startIcon={isLoading ? <CircularProgress size={20} /> : adjustType === "add" ? <Add /> : <Remove />}
          >
            {isLoading ? "Processing..." : adjustType === "add" ? "Add Funds" : "Remove Funds"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* 2FA Verification Dialog */}
      <TwoFactorVerification
        open={showTwoFactorDialog}
        onSuccess={handleTwoFactorSuccess}
        onCancel={handleTwoFactorCancel}
      />
    </>
  )
}

export default AssetsOverview

