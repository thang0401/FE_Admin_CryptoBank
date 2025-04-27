"use client"

import type React from "react"
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
  if (!selectedOrder) return null

  return (
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
            <Typography variant="body1">{selectedOrder.paymentMethod}</Typography>
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
        </Grid>
      </DialogContent>
      <DialogActions sx={{ p: 2, justifyContent: "space-between" }}>
        {selectedOrder.status === "pending" ? (
          <>
            <StyledButton
              onClick={() => onReject(selectedOrder.id)}
              color="error"
              variant="outlined"
              startIcon={<CancelIcon />}
            >
              Reject Order
            </StyledButton>
            <StyledButton
              onClick={() => onApprove(selectedOrder.id)}
              color="success"
              variant="contained"
              startIcon={<CheckCircleIcon />}
            >
              Approve Order
            </StyledButton>
          </>
        ) : (
          <Button onClick={onClose} color="primary">
            Close
          </Button>
        )}
      </DialogActions>
    </Dialog>
  )
}

export default OrderDetailDialog

