"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useTheme } from "@mui/material"
import StatsCards from "./StatsCards"
import FilterControls from "./FilterControls"
import OrdersTable from "./OrdersTable"
import OrderDetailDialog from "./OrderDetailDialog"
import type { Order, Stats } from "src/types/orders-management/order"
import { StyledCard } from "./StyledComponents"

interface OrdersManagementPageProps {
  orderType?: "buy" | "sell"
}

// Mock data for orders
const generateMockOrders = (): Order[] => {
  const statuses: Array<"pending" | "approved" | "rejected"> = ["pending", "approved", "rejected"]
  const types: Array<"buy" | "sell"> = ["buy", "sell"]
  const users = [
    { id: 1, name: "Nguyen Van A", email: "nguyenvana@example.com" },
    { id: 2, name: "Tran Thi B", email: "tranthib@example.com" },
    { id: 3, name: "Le Van C", email: "levanc@example.com" },
    { id: 4, name: "Pham Thi D", email: "phamthid@example.com" },
    { id: 5, name: "Hoang Van E", email: "hoangvane@example.com" },
  ]

  return Array.from({ length: 50 }, (_, i) => {
    const type = types[Math.floor(Math.random() * types.length)]
    const amount = type === "buy" ? (Math.random() * 1000 + 100).toFixed(2) : (Math.random() * 50 + 5).toFixed(2)
    const rate = 26003.73
    const total =
      type === "buy" ? (Number.parseFloat(amount) * rate).toFixed(2) : (Number.parseFloat(amount) / rate).toFixed(2)

    const user = users[Math.floor(Math.random() * users.length)]
    const createdDate = new Date()
    createdDate.setDate(createdDate.getDate() - Math.floor(Math.random() * 30))

    return {
      id: i + 1,
      type,
      status: statuses[Math.floor(Math.random() * statuses.length)],
      amount: type === "buy" ? `${amount} USDC` : `${amount} USDC`,
      total: type === "buy" ? `${Number(total).toLocaleString()} VND` : `${Number(total).toLocaleString()} VND`,
      user: user.name,
      userId: user.id,
      email: user.email,
      createdAt: createdDate.toISOString(),
      updatedAt: createdDate.toISOString(),
      paymentMethod: "Bank Transfer",
      bankAccount: type === "buy" ? "1234567890" : null,
      walletAddress: type === "sell" ? "0x1234...5678" : null,
    }
  })
}

const OrdersManagementPage: React.FC<OrdersManagementPageProps> = ({ orderType }) => {
  const theme = useTheme()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [page, setPage] = useState<number>(0)
  const [rowsPerPage, setRowsPerPage] = useState<number>(10)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [openDialog, setOpenDialog] = useState<boolean>(false)
  const [filterStatus, setFilterStatus] = useState<"all" | "pending" | "approved" | "rejected">("pending")
  const [filterType, setFilterType] = useState<"all" | "buy" | "sell">("all")
  const [searchTerm, setSearchTerm] = useState<string>("")
  const [tabValue, setTabValue] = useState<number>(0)
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

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const mockOrders = generateMockOrders()

      // Lọc đơn hàng theo orderType nếu được chỉ định
      const filteredOrders = orderType ? mockOrders.filter((order) => order.type === orderType) : mockOrders

      setOrders(filteredOrders)

      // Calculate stats
      const pendingOrders = filteredOrders.filter((order) => order.status === "pending").length
      const approvedOrders = filteredOrders.filter((order) => order.status === "approved").length
      const rejectedOrders = filteredOrders.filter((order) => order.status === "rejected").length

      const buyOrders = filteredOrders.filter((order) => order.type === "buy")
      const sellOrders = filteredOrders.filter((order) => order.type === "sell")

      const totalBuyVolume = buyOrders.reduce((sum, order) => {
        return sum + Number.parseFloat(order.amount.split(" ")[0])
      }, 0)

      const totalSellVolume = sellOrders.reduce((sum, order) => {
        return sum + Number.parseFloat(order.amount.split(" ")[0])
      }, 0)

      setStats({
        totalOrders: filteredOrders.length,
        pendingOrders,
        approvedOrders,
        rejectedOrders,
        totalBuyVolume: totalBuyVolume.toFixed(2),
        totalSellVolume: totalSellVolume.toFixed(2),
      })

      setLoading(false)
    }, 1000)
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

  const handleApproveOrder = (orderId: number) => {
    setOrders(orders.map((order) => (order.id === orderId ? { ...order, status: "approved" } : order)))
    setOpenDialog(false)

    setStats({
      ...stats,
      pendingOrders: stats.pendingOrders - 1,
      approvedOrders: stats.approvedOrders + 1,
    })
  }

  const handleRejectOrder = (orderId: number) => {
    setOrders(orders.map((order) => (order.id === orderId ? { ...order, status: "rejected" } : order)))
    setOpenDialog(false)

    setStats({
      ...stats,
      pendingOrders: stats.pendingOrders - 1,
      rejectedOrders: stats.rejectedOrders + 1,
    })
  }

  const handleRefresh = () => {
    setLoading(true)
    setTimeout(() => {
      const mockOrders = generateMockOrders()

      // Lọc đơn hàng theo orderType nếu được chỉ định
      const filteredOrders = orderType ? mockOrders.filter((order) => order.type === orderType) : mockOrders

      setOrders(filteredOrders)
      setLoading(false)
    }, 1000)
  }

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue)
    setPage(0)

    // Điều chỉnh filterStatus dựa trên tab
    switch (newValue) {
      case 0: // Pending
        setFilterStatus("pending")
        break
      case 1: // History - chỉ hiển thị approved và rejected
        setFilterStatus("all")
        break
    }
  }

  const handleStatusFilterChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setFilterStatus(event.target.value as "all" | "pending" | "approved" | "rejected")
    setPage(0)
  }

  const handleTypeFilterChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setFilterType(event.target.value as "all" | "buy" | "sell")
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

  // Filter orders based on current filters
  const filteredOrders = orders.filter((order) => {
    // Lọc theo tab
    if (tabValue === 0) {
      // Tab Pending Orders: chỉ hiển thị đơn hàng pending
      if (order.status !== "pending") {
        return false
      }
    } else if (tabValue === 1) {
      // Tab History Orders: chỉ hiển thị đơn hàng approved hoặc rejected
      if (order.status === "pending") {
        return false
      }
    }

    // Lọc theo trạng thái (chỉ áp dụng trong tab History)
    if (tabValue === 1 && filterStatus !== "all" && order.status !== filterStatus) {
      return false
    }

    // Lọc theo loại (chỉ áp dụng khi không có orderType được chỉ định)
    if (!orderType && filterType !== "all" && order.type !== filterType) {
      return false
    }

    // Lọc theo khoảng thời gian
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

    // Lọc theo từ khóa tìm kiếm
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

  return (
    <>
      {/* Stats Cards */}
      <StatsCards stats={stats} orderType={orderType} />

      <StyledCard>
        {/* Tabs and Search */}
        <FilterControls
          tabValue={tabValue}
          searchTerm={searchTerm}
          filterStatus={filterStatus}
          filterType={filterType}
          startDate={startDate}
          endDate={endDate}
          showHistoryFilters={tabValue === 1} // Chỉ hiển thị filters trong tab History
          handleTabChange={handleTabChange}
          handleSearchChange={(e) => setSearchTerm(e.target.value)}
          handleStatusFilterChange={handleStatusFilterChange}
          handleTypeFilterChange={handleTypeFilterChange}
          handleStartDateChange={handleStartDateChange}
          handleEndDateChange={handleEndDateChange}
          handleRefresh={handleRefresh}
          // Ẩn bộ lọc loại đơn hàng nếu đã chỉ định orderType
          hideTypeFilter={!!orderType}
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
