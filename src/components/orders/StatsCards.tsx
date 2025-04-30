import type React from "react"
import { Grid, Box, Typography } from "@mui/material"
import SwapHorizIcon from "@mui/icons-material/SwapHoriz"
import PendingActionsIcon from "@mui/icons-material/PendingActions"
import AttachMoneyIcon from "@mui/icons-material/AttachMoney"
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet"
import type { Stats } from "src/types/orders-management/order"
import { StyledCard } from "./StyledComponents"

interface StatsCardsProps {
  stats: Stats
  orderType: "buy" | "sell"
}

const StatsCards: React.FC<StatsCardsProps> = ({ stats, orderType }) => {
  // Xác định tiền tố cho tiêu đề dựa trên orderType
  const typePrefix = orderType === "buy" ? "Buy" : "Sell"

  // Kiểm tra volume để hiển thị giá trị phù hợp
  const volumeValue = orderType === "buy" ? stats.totalBuyVolume : stats.totalSellVolume

  return (
    <Grid container spacing={3} mb={4}>
      <Grid item xs={12} sm={6} md={3}>
        <StyledCard>
          <Box display="flex" alignItems="center">
            <Box
              sx={{
                bgcolor: "rgba(25, 118, 210, 0.1)",
                p: 1.5,
                borderRadius: "12px",
                color: "primary.main",
                mr: 2,
              }}
            >
              <SwapHorizIcon />
            </Box>
            <Box>
              <Typography variant="body2" color="text.secondary">
                Total {typePrefix} Orders
              </Typography>
              <Typography variant="h5" fontWeight="bold">
                {stats.totalOrders}
              </Typography>
            </Box>
          </Box>
        </StyledCard>
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <StyledCard>
          <Box display="flex" alignItems="center">
            <Box
              sx={{
                bgcolor: "rgba(255, 152, 0, 0.1)",
                p: 1.5,
                borderRadius: "12px",
                color: "warning.main",
                mr: 2,
              }}
            >
              <PendingActionsIcon />
            </Box>
            <Box>
              <Typography variant="body2" color="text.secondary">
                Pending {typePrefix} Orders
              </Typography>
              <Typography variant="h5" fontWeight="bold">
                {stats.pendingOrders}
              </Typography>
            </Box>
          </Box>
        </StyledCard>
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <StyledCard>
          <Box display="flex" alignItems="center">
            <Box
              sx={{
                bgcolor: "rgba(46, 125, 50, 0.1)",
                p: 1.5,
                borderRadius: "12px",
                color: "success.main",
                mr: 2,
              }}
            >
              <AttachMoneyIcon />
            </Box>
            <Box>
              <Typography variant="body2" color="text.secondary">
                Volume (USDC)
              </Typography>
              <Typography variant="h5" fontWeight="bold">
                {volumeValue || "0.00"}
              </Typography>
            </Box>
          </Box>
        </StyledCard>
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <StyledCard>
          <Box display="flex" alignItems="center">
            <Box
              sx={{
                bgcolor: "rgba(46, 125, 50, 0.1)",
                p: 1.5,
                borderRadius: "12px",
                color: "success.main",
                mr: 2,
              }}
            >
              <AccountBalanceWalletIcon />
            </Box>
            <Box>
              <Typography variant="body2" color="text.secondary">
                Approved {typePrefix} Orders
              </Typography>
              <Typography variant="h5" fontWeight="bold">
                {stats.approvedOrders}
              </Typography>
            </Box>
          </Box>
        </StyledCard>
      </Grid>
    </Grid>
  )
}

export default StatsCards