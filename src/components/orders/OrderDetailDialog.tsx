"use client"

import type React from "react"
import { useState, useEffect } from "react"
import axios from "axios"
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Box,
  Grid,
  Divider,
  Chip,
  Button,
  CircularProgress,
  TextField,
} from "@mui/material"

import CheckCircleIcon from "@mui/icons-material/CheckCircle"
import CancelIcon from "@mui/icons-material/Cancel"
import { Order } from "src/types/orders-management/order"
import StatusChip from "./StatusChip"
import { USDCIcon, VNDCurrencyIcon } from "./CurrencyIcons"
import { StyledButton } from "./StyledComponents"

interface OrderDetailDialogProps {
  open: boolean
  selectedOrder: Order | null
  onClose: () => void
  onApprove: (orderId: string) => void
  onReject: (orderId: string) => void
}

interface BankAccount {
  id: number
  bankName: string
  accountNumber: string
  accountHolderName: string
  createdAt: string
  describe: string
  updatedAt: string
}

const formatDate = (dateString: string): string => {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }
  return new Date(dateString).toLocaleDateString("en-US", options)
}

const OrderDetailDialog: React.FC<OrderDetailDialogProps> = ({ open, selectedOrder, onClose, onApprove, onReject }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [bankAccount, setBankAccount] = useState<BankAccount | null>(null)
  const [bankAccountLoading, setBankAccountLoading] = useState<boolean>(false)
  const [bankAccountError, setBankAccountError] = useState<string | null>(null)
  const [confirmDialogOpen, setConfirmDialogOpen] = useState<boolean>(false)
  const [transactionCode, setTransactionCode] = useState<string>("")
  const [transactionCodeError, setTransactionCodeError] = useState<string | null>(null)

  useEffect(() => {
    const fetchBankAccount = async () => {
      if (!selectedOrder || !selectedOrder.userId) {
        console.log("Skipping bank account fetch:", { selectedOrder, userId: selectedOrder?.userId, status: selectedOrder?.status })
        return
      }

      try {
        setBankAccountLoading(true)
        setBankAccountError(null)
        const response = await axios.get(`https://be-crypto-depot.name.vn/api/BankAccount/${selectedOrder.userId}`)
        console.log("Bank account response:", response.data)

        if (Array.isArray(response.data) && response.data.length > 0) {
          setBankAccount(response.data[0])
        } else {
          setBankAccount(response.data)
        }
      } catch (err) {
        console.error("Error fetching bank account:", err)
        setBankAccountError("Failed to fetch bank account details.")
      } finally {
        setBankAccountLoading(false)
      }
    }

    if (open && selectedOrder?.type === "sell") {
      fetchBankAccount()
    }

    return () => {
      setBankAccount(null)
      setBankAccountError(null)
      setBankAccountLoading(false)
    }
  }, [open, selectedOrder])

  console.log("Rendering with bankAccount:", bankAccount)
  if (!selectedOrder) return null

  const handleOpenConfirmDialog = () => {
    setTransactionCode("")
    setTransactionCodeError(null)
    setConfirmDialogOpen(true)
  }

  const handleCloseConfirmDialog = () => {
    setConfirmDialogOpen(false)
  }

  const handleApprove = async () => {
    try {
      setIsLoading(true)
      setError(null)

      // Get modifiedBy from localStorage userData
      const userData = JSON.parse(localStorage.getItem("userData") || "{}")
      const modifiedBy = userData.id || ""

      // API call with modifiedBy and maGiaoDichBanking
      const response = await axios.post("https://be-crypto-depot.name.vn/api/payment/transactions/update-status", {
        transactionId: selectedOrder.id,
        newStatus: "cvvvehbme6nnaun2s4ag",
        modifiedBy: modifiedBy,
        maGiaoDichBanking: transactionCode
      })

      console.log("Approval response:", response.data)
      onApprove(selectedOrder.id)
      setConfirmDialogOpen(false)
    } catch (err) {
      console.error("Error approving transaction:", err)
      setError("Failed to approve the transaction. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleConfirm = () => {
    if (!transactionCode.trim()) {
      setTransactionCodeError("Transaction code is required")
      return
    }
    handleApprove()
  }

  const handleReject = async () => {
    try {
      setIsLoading(true)
      setError(null)

      const response = await axios.post("https://be-crypto-depot.name.vn/api/payment/transactions/update-status", {
        transactionId: selectedOrder.id,
        newStatus: "cvvvevrme6nnaun2s4cg"
      })

      console.log("Rejection response:", response.data)
      onReject(selectedOrder.id)
    } catch (err) {
      console.error("Error rejecting transaction:", err)
      setError("Failed to reject the transaction. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">Order Details #{selectedOrder.id}</Typography>
            <Chip
              label={selectedOrder.type === "buy" ? "Buy Order" : "Sell Order"}
              color={selectedOrder.type === "buy" ? "primary" : "error"}
              size="small"
            />
          </Box>
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="body2" color="text.secondary">
                  Status
                </Typography>
                <StatusChip status={selectedOrder.status} />
              </Box>
              <Divider />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography variant="body2" color="text.secondary">
                User
              </Typography>
              <Typography variant="body1" fontWeight="medium">
                {selectedOrder.user}
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography variant="body2" color="text.secondary">
                Email
              </Typography>
              <Typography variant="body1">{selectedOrder.email}</Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography variant="body2" color="text.secondary">
                Amount
              </Typography>
              <Box display="flex" alignItems="center">
                <USDCIcon />
                <Typography variant="body1" fontWeight="medium">
                  {selectedOrder.amount}
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography variant="body2" color="text.secondary">
                Total
              </Typography>
              <Box display="flex" alignItems="center">
                <VNDCurrencyIcon />
                <Typography variant="body1" fontWeight="medium">
                  {selectedOrder.total}
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography variant="body2" color="text.secondary">
                Created At
              </Typography>
              <Typography variant="body1">{formatDate(selectedOrder.createdAt)}</Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography variant="body2" color="text.secondary">
                Updated At
              </Typography>
              <Typography variant="body1">{formatDate(selectedOrder.updatedAt)}</Typography>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="body2" color="text.secondary">
                Payment Method
              </Typography>
              {selectedOrder.type === "sell" && (
                <Typography variant="body1">Bank Transfer</Typography>)}
              {selectedOrder.type === "buy" && (
                <Typography variant="body1">VietQR Bank</Typography>)}
            </Grid>

            {selectedOrder.type === "buy" && selectedOrder.bankAccount && (
              <Grid item xs={12}>
                <Typography variant="body2" color="text.secondary">
                  Bank Account
                </Typography>
                <Typography variant="body1">{selectedOrder.bankAccount}</Typography>
              </Grid>
            )}

            {selectedOrder.type === "sell" && selectedOrder.walletAddress && (
              <Grid item xs={12}>
                <Typography variant="body2" color="text.secondary">
                  Wallet Address
                </Typography>
                <Typography variant="body1">{selectedOrder.walletAddress}</Typography>
              </Grid>
            )}

            {selectedOrder.type === "sell" && (
              <>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">
                    Bank Name
                  </Typography>
                  {bankAccountLoading ? (
                    <CircularProgress size={20} />
                  ) : bankAccountError ? (
                    <Typography variant="body1" color="error">
                      {bankAccountError}
                    </Typography>
                  ) : (
                    <Typography variant="body1">{bankAccount?.bankName || "N/A"}</Typography>
                  )}
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">
                    Account Number
                  </Typography>
                  {bankAccountLoading ? (
                    <CircularProgress size={20} />
                  ) : bankAccountError ? (
                    <Typography variant="body1" color="error">
                      {bankAccountError}
                    </Typography>
                  ) : (
                    <Typography variant="body1">{bankAccount?.accountNumber || "N/A"}</Typography>
                  )}
                </Grid>
              </>
            )}

            {error && (
              <Grid item xs={12}>
                <Typography color="error" variant="body2">
                  {error}
                </Typography>
              </Grid>
            )}
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 2, justifyContent: "space-between" }}>
          {selectedOrder.status === "pending" ? (
            <>
              <StyledButton
                onClick={handleReject}
                color="error"
                variant="outlined"
                startIcon={isLoading ? <CircularProgress size={20} /> : <CancelIcon />}
                disabled={isLoading}
              >
                {isLoading ? "Processing..." : "Reject Order"}
              </StyledButton>
              <StyledButton
                onClick={handleOpenConfirmDialog}
                color="success"
                variant="contained"
                startIcon={isLoading ? <CircularProgress size={20} /> : <CheckCircleIcon />}
                disabled={isLoading}
              >
                {isLoading ? "Processing..." : "Confirm Order"}
              </StyledButton>
            </>
          ) : (
            <Button onClick={onClose} color="primary">
              Close
            </Button>
          )}
        </DialogActions>
      </Dialog>

      <Dialog open={confirmDialogOpen} onClose={handleCloseConfirmDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Nhập mã giao dịch banking</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" mb={5}>
            • Vui lòng nhập mã giao dịch banking vào đây.<br />
            <br/>
            • Bạn sẽ chịu trách nhiệm nếu có lịch sử giao dịch chuyển tiền nhưng không có mã giao dịch được ghi nhận lại hoặc sai số tiền với yêu cầu bán của khách hàng.
          </Typography>
          <TextField
            fullWidth
            label="Mã giao dịch banking"
            value={transactionCode}
            onChange={(e) => {
              setTransactionCode(e.target.value)
              setTransactionCodeError(null)
            }}
            error={!!transactionCodeError}
            helperText={transactionCodeError}
            variant="outlined"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfirmDialog}>Cancel</Button>
          <StyledButton
            onClick={handleConfirm}
            color="success"
            variant="contained"
            startIcon={isLoading ? <CircularProgress size={20} /> : <CheckCircleIcon />}
            disabled={isLoading}
          >
            {isLoading ? "Processing..." : "Approve"}
          </StyledButton>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default OrderDetailDialog