"use client"

import type React from "react"
import { useState, useEffect } from "react"
import axios from "axios"
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Chip,
  Button,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Tabs,
  Tab,
  Divider,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  useTheme,
} from "@mui/material"
import { styled } from "@mui/material/styles"
import Head from "next/head"
import CheckCircleIcon from "@mui/icons-material/CheckCircle"
import CancelIcon from "@mui/icons-material/Cancel"
import VisibilityIcon from "@mui/icons-material/Visibility"
import RefreshIcon from "@mui/icons-material/Refresh"
import SearchIcon from "@mui/icons-material/Search"
import AttachMoneyIcon from "@mui/icons-material/AttachMoney"
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet"
import PendingActionsIcon from "@mui/icons-material/PendingActions"
import SwapHorizIcon from "@mui/icons-material/SwapHoriz"
import FilterListIcon from "@mui/icons-material/FilterList"
import StatsCards from "./StatsCards"
import FilterControls from "./FilterControls"
import OrdersTable from "./OrdersTable"
import OrderDetailDialog from "./OrderDetailDialog"
import { Order, Stats } from "src/types/orders-management/order"
import { StyledCard } from "./StyledComponents"

const CryptoIcon = styled("div")(({ theme }) => ({
  width: "24px",
  height: "24px",
  borderRadius: "50%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  marginRight: "8px",
}))

interface OrdersManagementProps {
  orderType?: "buy" | "sell"
}

interface APITransaction {
  transactionId: string
  userId: string
  debitWalletId: string
  vndAmount: number
  usdcAmount: number
  exchangeRate: number
  transactionType: "DEPOSIT" | "WITHDRAW"
  status: string
}

const OrdersManagementPage: React.FC<OrdersManagementProps> = ({ orderType }) => {
  const theme = useTheme()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [page, setPage] = useState<number>(0)
  const [rowsPerPage, setRowsPerPage] = useState<number>(10)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [openDialog, setOpenDialog] = useState<boolean>(false)
  const [filterStatus, setFilterStatus] = useState<"all" | "pending" | "approved" | "rejected">("all")
  const [searchTerm, setSearchTerm] = useState<string>("")
  const [tabValue, setTabValue] = useState<number>(orderType === "buy" ? 1 : 0)
  const [startDate, setStartDate] = useState<Date | null>(null)
  const [endDate, setEndDate] = useState<Date | null>(null)

  // Stats
  const [stats, setStats] = useState<Stats>({
    totalOrders: 0,
    pendingOrders: 0,
    approvedOrders: 0,
    rejectedOrders: 0,
    totalBuyVolume: "0",
    totalSellVolume: "0",
  })

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const response = await axios.get<APITransaction[]>(
        "https://be-crypto-depot.name.vn/api/payment/transactions/all"
      )
      
      console.log("API Response:", response.data)

      const mappedOrders: Order[] = response.data
        .filter((transaction) => 
          !orderType || 
          (orderType === "buy" && transaction.transactionType === "DEPOSIT") ||
          (orderType === "sell" && transaction.transactionType === "WITHDRAW")
        )
        .map((transaction) => {
          const type = transaction.transactionType === "DEPOSIT" ? "buy" : "sell"
          let status: "pending" | "approved" | "rejected"
          
          // For buy orders, only "approved" or "rejected" (mapped from "success" or "failed")
          if (type === "buy") {
            status = transaction.status.toLowerCase() === "success" || transaction.status.toLowerCase() === "sucesss" 
              ? "approved" 
              : "rejected"
          } else {
            // For sell orders, keep the existing logic
            status = transaction.status.toLowerCase() === "success" || transaction.status.toLowerCase() === "sucesss" 
              ? "approved" 
              : transaction.status.toLowerCase() === "failed" 
              ? "rejected" 
              : "pending"
          }

          return {
            id: transaction.transactionId,
            type,
            status,
            amount: `${transaction.usdcAmount.toFixed(2)} USDC`,
            total: `${transaction.vndAmount.toLocaleString()} VND`,
            user: `User ${transaction.userId.slice(0, 8)}`,
            userId: transaction.userId,
            email: `user${transaction.userId.slice(0, 8)}@example.com`,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            paymentMethod: type === "buy" ? "Bank Transfer" : "Crypto Wallet",
            bankAccount: type === "buy" ? "N/A" : null,
            walletAddress: type === "sell" ? transaction.debitWalletId : null,
          }
        })

      console.log("Mapped Orders:", mappedOrders)

      setOrders(mappedOrders)

      // Calculate stats
      const pendingOrders = mappedOrders.filter((order) => order.status === "pending").length
      const approvedOrders = mappedOrders.filter((order) => order.status === "approved").length
      const rejectedOrders = mappedOrders.filter((order) => order.status === "rejected").length

      const buyOrders = mappedOrders.filter((order) => order.type === "buy")
      const sellOrders = mappedOrders.filter((order) => order.type === "sell")

      const totalBuyVolume = buyOrders.reduce((sum, order) => {
        return sum + Number.parseFloat(order.amount.split(" ")[0])
      }, 0)

      const totalSellVolume = sellOrders.reduce((sum, order) => {
        return sum + Number.parseFloat(order.amount.split(" ")[0])
      }, 0)

      setStats({
        totalOrders: mappedOrders.length,
        pendingOrders,
        approvedOrders,
        rejectedOrders,
        totalBuyVolume: totalBuyVolume.toFixed(2),
        totalSellVolume: totalSellVolume.toFixed(2),
      })
    } catch (error) {
      console.error("Error fetching orders:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOrders()
  }, [orderType])

  const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(Number.parseInt(event.target.value, 10))
    setPage(0)
  }

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order)
    setOpenDialog(true)
  }

  const handleCloseDialog = () => {
    setOpenDialog(false)
  }

  const handleApproveOrder = (orderId: string) => {
    setOrders(orders.map((order) => (order.id === orderId ? { ...order, status: "approved" } : order)))
    setOpenDialog(false)

    setStats({
      ...stats,
      pendingOrders: stats.pendingOrders - 1,
      approvedOrders: stats.approvedOrders + 1,
    })
  }

  const handleRejectOrder = (orderId: string) => {
    setOrders(orders.map((order) => (order.id === orderId ? { ...order, status: "rejected" } : order)))
    setOpenDialog(false)

    setStats({
      ...stats,
      pendingOrders: stats.pendingOrders - 1,
      rejectedOrders: stats.rejectedOrders + 1,
    })
  }

  const handleRefresh = () => {
    fetchOrders()
  }

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue)
    setPage(0)

    switch (newValue) {
      case 0: // Pending
        setFilterStatus("pending")
        break
      case 1: // History
        setFilterStatus("all")
        break
    }
  }

  const handleStatusFilterChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setFilterStatus(event.target.value as "all" | "pending" | "approved" | "rejected")
    setPage(0)
  }

  const handleStartDateChange = (date: Date | null) => {
    setStartDate(date)
    setPage(0)
  }

  const handleEndDateChange = (date: Date | null) => {
    setEndDate(date)
    setPage(0)
  }

  // Restore full filtering with adjusted logic for buy orders
  const filteredOrders = orders.filter((order) => {
    // For buy orders, only allow approved or rejected (no pending)
    if (orderType === "buy" && order.status === "pending") {
      return false
    }

    // Filter by status for Pending tab (only applies to sell-orders)
    if (orderType !== "buy" && tabValue === 0 && order.status !== "pending") {
      return false
    }

    // Filter by status for History tab (or buy-orders which is always history)
    if ((orderType !== "buy" && tabValue === 1) || orderType === "buy") {
      // Exclude pending orders in History tab for sell-orders
      if (orderType !== "buy" && tabValue === 1 && order.status === "pending") {
        return false
      }
      if (filterStatus !== "all" && order.status !== filterStatus) {
        return false
      }
    }

    // Filter by date range
    if (startDate || endDate) {
      const orderDate = new Date(order.createdAt)
      if (startDate && orderDate < startDate) {
        return false
      }
      if (endDate) {
        const endOfDay = new Date(endDate)
        endOfDay.setHours(23, 59, 59, 999)
        if (orderDate > endOfDay) {
          return false
        }
      }
    }

    // Search term
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase()
      return (
        order.user.toLowerCase().includes(searchLower) ||
        order.email.toLowerCase().includes(searchLower) ||
        order.id.toString().includes(searchLower)
      )
    }

    return true
  })

  console.log("Filtered Orders:", filteredOrders)

  return (
    <>
      <Head>
        <title>Admin - Order Management</title>
      </Head>

      <Box sx={{ minHeight: "100vh", py: 4 }}>
        <Container maxWidth="xl">
          <Box mb={4}>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              {orderType === "buy" ? "Buy Orders" : orderType === "sell" ? "Sell Orders" : "Order Management"}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Manage and process customer {orderType ? `${orderType} orders` : "buy/sell orders"}
            </Typography>
          </Box>

          {/* Stats Cards */}
          <StatsCards stats={stats} />

          <StyledCard>
            {/* Tabs and Search */}
            <FilterControls
              tabValue={tabValue}
              searchTerm={searchTerm}
              filterStatus={filterStatus}
              startDate={startDate}
              endDate={endDate}
              showHistoryFilters={true}
              handleTabChange={handleTabChange}
              handleSearchChange={(e) => setSearchTerm(e.target.value)}
              handleStatusFilterChange={handleStatusFilterChange}
              handleStartDateChange={handleStartDateChange}
              handleEndDateChange={handleEndDateChange}
              handleRefresh={handleRefresh}
              orderType={orderType}
            />

            {/* Orders Table */}
            <OrdersTable
              loading={loading}
              filteredOrders={filteredOrders}
              page={page}
              rowsPerPage={rowsPerPage}
              handleChangePage={handleChangePage}
              handleChangeRowsPerPage={handleChangeRowsPerPage}
              handleViewOrder={handleViewOrder}
            />
          </StyledCard>
        </Container>
      </Box>

      {/* Order Detail Dialog */}
      <OrderDetailDialog
        open={openDialog}
        selectedOrder={selectedOrder}
        onClose={handleCloseDialog}
        onApprove={handleApproveOrder}
        onReject={handleRejectOrder}
      />
    </>
  )
}

export default OrdersManagementPage