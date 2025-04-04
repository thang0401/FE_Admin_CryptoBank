"use client"

import React, { useState, useCallback, useEffect } from "react"
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  InputAdornment,
  Chip,
  Button,
} from "@mui/material"
import { DatePicker } from "@mui/x-date-pickers/DatePicker"
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns"
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider"
import SearchIcon from "@mui/icons-material/Search"
import VisibilityIcon from "@mui/icons-material/Visibility"
import ClearIcon from "@mui/icons-material/Clear"
import { styled } from "@mui/material/styles"
import { useRouter } from "next/router"
import { format } from "date-fns"

const StyledCard = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
}))

interface SavingsAccount {
  id: string
  user_id: string
  user_firstname: string
  user_lastname: string
  heirStatus: boolean
  balance: number
  amount_month: number
  type: string
  startDate: string
  endDate: string
}

interface Filters {
  userId: string
  term: string
  dateFrom: Date | null
  dateTo: Date | null
  ownerName: string
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

const formatDate = (dateString: string) => {
  return format(new Date(dateString), "dd/MM/yyyy")
}

const SavingsManagement: React.FC = () => {
  const router = useRouter()
  const [filters, setFilters] = useState<Filters>({
    userId: "",
    term: "",
    dateFrom: null,
    dateTo: null,
    ownerName: "",
  })
  const [filteredAccounts, setFilteredAccounts] = useState<SavingsAccount[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchSavingsAccounts = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch("https://api.be-crypto-depot.name.vn/saving/get-saving-list", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error("Failed to fetch savings accounts")
      }

      const data: SavingsAccount[] = await response.json()
      setFilteredAccounts(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = (field: keyof Filters, value: any) => {
    setFilters((prev) => ({ ...prev, [field]: value }))
  }

  const handleAccountSelect = (id: string) => {
    router.push(`/savings-management/${id}`)
  }

  const handleClearFilters = () => {
    setFilters({
      userId: "",
      term: "",
      dateFrom: null,
      dateTo: null,
      ownerName: "",
    })
  }

  const applyFilters = useCallback(() => {
    let filtered = [...filteredAccounts]

    if (filters.userId) {
      filtered = filtered.filter((account) =>
        account.user_id.toLowerCase().includes(filters.userId.toLowerCase())
      )
    }
    if (filters.term) {
      filtered = filtered.filter((account) =>
        account.type.toLowerCase().includes(filters.term.toLowerCase())
      )
    }
    if (filters.dateFrom) {
      filtered = filtered.filter((account) => new Date(account.startDate) >= filters.dateFrom!)
    }
    if (filters.dateTo) {
      filtered = filtered.filter((account) => new Date(account.startDate) <= filters.dateTo!)
    }
    if (filters.ownerName) {
      filtered = filtered.filter((account) =>
        `${account.user_firstname} ${account.user_lastname}`
          .toLowerCase()
          .includes(filters.ownerName.toLowerCase())
      )
    }

    setFilteredAccounts(filtered)
  }, [filters, filteredAccounts])

  // Fetch data on component mount
  useEffect(() => {
    fetchSavingsAccounts()
  }, [])

  // Apply filters when they change
  useEffect(() => {
    applyFilters()
  }, [filters])
  return (
    <Box sx={{ p: 3 }}>
      <StyledCard>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Search Filters
          </Typography>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={2}>
              <TextField
                fullWidth
                label="User ID"
                value={filters.userId}
                onChange={(e) => handleFilterChange("userId", e.target.value)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                fullWidth
                label="Owner Name"
                value={filters.ownerName}
                onChange={(e) => handleFilterChange("ownerName", e.target.value)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} sm={2}>
              <TextField
                fullWidth
                label="Term"
                value={filters.term}
                onChange={(e) => handleFilterChange("term", e.target.value)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} sm={2}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="From Date"
                  value={filters.dateFrom}
                  onChange={(date) => handleFilterChange("dateFrom", date)}
                  slotProps={{
                    textField: { fullWidth: true },
                  }}
                  format="dd/MM/yyyy"
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12} sm={2}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="To Date"
                  value={filters.dateTo}
                  onChange={(date) => handleFilterChange("dateTo", date)}
                  slotProps={{
                    textField: { fullWidth: true },
                  }}
                  format="dd/MM/yyyy"
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12} sm={1}>
              <Button
                variant="outlined"
                color="secondary"
                startIcon={<ClearIcon />}
                onClick={handleClearFilters}
                fullWidth
                sx={{ height: "100%" }}
              >
                Clear
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </StyledCard>

      <StyledCard>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Savings Accounts
          </Typography>
          {loading && <Typography>Loading...</Typography>}
          {error && <Typography color="error">{error}</Typography>}
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Account ID</TableCell>
                  <TableCell>User ID</TableCell>
                  <TableCell>Owner</TableCell>
                  <TableCell>Heir Status</TableCell>
                  <TableCell>Balance</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Start Date</TableCell>
                  <TableCell>End Date</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredAccounts.map((account) => (
                  <TableRow key={account.id}>
                  <TableCell>{"ACC" + account.id.split("-")[0]}</TableCell> {/* Cột ID */}
                  <TableCell>{account.user_id}</TableCell>
                  <TableCell>{`${account.user_firstname} ${account.user_lastname}`}</TableCell>
                  <TableCell>
                    <StatusChip status={account.heirStatus ? "has_heir" : "no_heir"} />
                  </TableCell>
                  <TableCell sx={{paddingLeft: 10}}>{account.balance}</TableCell>
                  <TableCell>{account.amount_month + " " + account.type}</TableCell> {/* Cột Type */}
                  <TableCell>{formatDate(account.startDate)}</TableCell>
                  <TableCell>{formatDate(account.endDate)}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleAccountSelect(account.id)}>
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
    </Box>
  )
}

export default SavingsManagement
