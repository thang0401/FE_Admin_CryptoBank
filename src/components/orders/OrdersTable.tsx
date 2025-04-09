"use client"

import type React from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TablePagination,
  Chip,
  IconButton,
  Box,
  Typography,
  CircularProgress,
  TableSortLabel,
} from "@mui/material"
import VisibilityIcon from "@mui/icons-material/Visibility"
import type { Order } from "src/types/orders-management/order"
import StatusChip from "./StatusChip"
import { CryptoIcon, StyledTableContainer } from "./StyledComponents"
import { useEffect, useState } from "react"

interface OrdersTableProps {
  loading: boolean
  filteredOrders: Order[]
  page: number
  rowsPerPage: number
  handleChangePage: (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => void
  handleChangeRowsPerPage: (event: React.ChangeEvent<HTMLInputElement>) => void
  handleViewOrder: (order: Order) => void
  // New prop to hide type column
  hideTypeColumn?: boolean
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

const USDCIcon = () => (
  <CryptoIcon>
    <img src="https://static.vecteezy.com/system/resources/previews/044/626/814/non_2x/usdc-logo-on-transparent-background-free-vector.jpg" alt="USDC" width={43} height={43} />
  </CryptoIcon>
)

const VNDCurrencyIcon = () => <CryptoIcon style={{ backgroundColor: "red", color: "white" }}>V</CryptoIcon>

const OrdersTable: React.FC<OrdersTableProps> = ({
  loading,
  filteredOrders,
  page,
  rowsPerPage,
  handleChangePage,
  handleChangeRowsPerPage,
  handleViewOrder,
  hideTypeColumn = false,
}) => {
  const [sortConfig, setSortConfig] = useState<{
    column: "date" | "amount" | "total" | null
    direction: "asc" | "desc"
  }>({ column: null, direction: "asc" })

  const [sortedOrders, setSortedOrders] = useState<Order[]>(filteredOrders)

  const handleSort = (column: "date" | "amount" | "total") => {
    const isActive = sortConfig.column === column
    const newDirection = isActive && sortConfig.direction === "asc" ? "desc" : "asc"
    setSortConfig({ column, direction: newDirection })

    const sorted = [...filteredOrders].sort((a, b) => {
      if (column === "date") {
        const dateA = new Date(a.createdAt).getTime()
        const dateB = new Date(b.createdAt).getTime()
        return newDirection === "asc" ? dateA - dateB : dateB - dateA
      }
      if (column === "amount") {
        const amountA = Number.parseFloat(a.amount)
        const amountB = Number.parseFloat(b.amount)
        return newDirection === "asc" ? amountA - amountB : amountB - amountA
      }
      if (column === "total") {
        const totalA = Number.parseFloat(a.total)
        const totalB = Number.parseFloat(b.total)
        return newDirection === "asc" ? totalA - totalB : totalB - totalA
      }
      return 0
    })
    setSortedOrders(sorted)
  }

  useEffect(() => {
    setSortedOrders(filteredOrders)
  }, [filteredOrders])

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" py={4}>
        <CircularProgress />
      </Box>
    )
  }

  return (
    <>
      <StyledTableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              {!hideTypeColumn && <TableCell>Type</TableCell>}
              <TableCell>User</TableCell>
              <TableCell>
                <TableSortLabel
                  active={sortConfig.column === "amount"}
                  direction={sortConfig.column === "amount" ? sortConfig.direction : "asc"}
                  onClick={() => handleSort("amount")}
                >
                  Amount
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={sortConfig.column === "total"}
                  direction={sortConfig.column === "total" ? sortConfig.direction : "asc"}
                  onClick={() => handleSort("total")}
                >
                  Total
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={sortConfig.column === "date"}
                  direction={sortConfig.column === "date" ? sortConfig.direction : "asc"}
                  onClick={() => handleSort("date")}
                >
                  Date
                </TableSortLabel>
              </TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedOrders.length > 0 ? (
              sortedOrders.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((order) => (
                <TableRow key={order.id} hover>
                  <TableCell>#{order.id}</TableCell>
                  {!hideTypeColumn && (
                    <TableCell>
                      <Chip
                        label={order.type === "buy" ? "Buy" : "Sell"}
                        size="small"
                        color={order.type === "buy" ? "primary" : "error"}
                        sx={{ fontWeight: "medium" }}
                      />
                    </TableCell>
                  )}
                  <TableCell>
                    <Box>
                      <Typography variant="body2" fontWeight="medium">
                        {order.user}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {order.email}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box display="flex" alignItems="center">
                      <USDCIcon />
                      {order.amount}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box display="flex" alignItems="center">
                      <VNDCurrencyIcon />
                      {order.total}
                    </Box>
                  </TableCell>
                  <TableCell>{formatDate(order.createdAt)}</TableCell>
                  <TableCell>
                    <StatusChip status={order.status} />
                  </TableCell>
                  <TableCell align="right">
                    <IconButton size="small" onClick={() => handleViewOrder(order)} color="primary">
                      <VisibilityIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={hideTypeColumn ? 7 : 8} align="center" sx={{ py: 3 }}>
                  <Typography variant="body1" color="text.secondary">
                    No orders found matching your criteria
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </StyledTableContainer>

      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={sortedOrders.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </>
  )
}

export default OrdersTable
