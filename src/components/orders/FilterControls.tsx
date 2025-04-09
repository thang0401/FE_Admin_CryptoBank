"use client"

import type React from "react"
import {
  Box,
  Tabs,
  Tab,
  TextField,
  IconButton,
  Typography,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
} from "@mui/material"
import { DatePicker } from "@mui/x-date-pickers/DatePicker"
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider"
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns"
import SearchIcon from "@mui/icons-material/Search"
import RefreshIcon from "@mui/icons-material/Refresh"
import FilterListIcon from "@mui/icons-material/FilterList"

interface FilterControlsProps {
  tabValue: number
  searchTerm: string
  filterStatus: "all" | "pending" | "approved" | "rejected"
  filterType: "all" | "buy" | "sell"
  startDate: Date | null
  endDate: Date | null
  showHistoryFilters: boolean
  handleTabChange: (event: React.SyntheticEvent, newValue: number) => void
  handleSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  handleStatusFilterChange: (event: React.ChangeEvent<{ value: unknown }>) => void
  handleTypeFilterChange: (event: React.ChangeEvent<{ value: unknown }>) => void
  handleStartDateChange: (date: Date | null) => void
  handleEndDateChange: (date: Date | null) => void
  handleRefresh: () => void
  hideTypeFilter?: boolean
}

const FilterControls: React.FC<FilterControlsProps> = ({
  tabValue,
  searchTerm,
  filterStatus,
  filterType,
  startDate,
  endDate,
  showHistoryFilters,
  handleTabChange,
  handleSearchChange,
  handleStatusFilterChange,
  handleTypeFilterChange,
  handleStartDateChange,
  handleEndDateChange,
  handleRefresh,
  hideTypeFilter = false,
}) => {
  return (
    <>
      <Box
        display="flex"
        flexDirection={{ xs: "column", md: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "flex-start", md: "center" }}
        mb={3}
        gap={2}
      >
        <Tabs value={tabValue} onChange={handleTabChange} indicatorColor="primary" textColor="primary">
          <Tab label="Pending Orders" />
          <Tab label="History Orders" />
        </Tabs>

        <Box display="flex" gap={2}>
          <TextField
            placeholder="Search by user or ID"
            size="small"
            value={searchTerm}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: <SearchIcon fontSize="small" sx={{ mr: 1, color: "text.secondary" }} />,
            }}
            sx={{ minWidth: 220 }}
          />

          <IconButton onClick={handleRefresh} color="primary">
            <RefreshIcon />
          </IconButton>
        </Box>
      </Box>

      {showHistoryFilters && (
        <Box mb={3}>
          <Typography variant="subtitle2" color="text.secondary" mb={1} display="flex" alignItems="center" gap={1}>
            <FilterListIcon fontSize="small" />
            Filters
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={hideTypeFilter ? 4 : 3}>
              <FormControl fullWidth size="small">
                <InputLabel id="status-filter-label">Status</InputLabel>
                <Select
                  labelId="status-filter-label"
                  value={filterStatus}
                  label="Status"
                  onChange={handleStatusFilterChange as any}
                >
                  <MenuItem value="all">All Statuses</MenuItem>
                  <MenuItem value="approved">Approved</MenuItem>
                  <MenuItem value="rejected">Rejected</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            {!hideTypeFilter && (
              <Grid item xs={12} sm={6} md={3}>
                <FormControl fullWidth size="small">
                  <InputLabel id="type-filter-label">Type</InputLabel>
                  <Select
                    labelId="type-filter-label"
                    value={filterType}
                    label="Type"
                    onChange={handleTypeFilterChange as any}
                  >
                    <MenuItem value="all">All Types</MenuItem>
                    <MenuItem value="buy">Buy</MenuItem>
                    <MenuItem value="sell">Sell</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            )}
            <Grid item xs={12} sm={6} md={hideTypeFilter ? 4 : 3}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Start Date"
                  value={startDate}
                  onChange={handleStartDateChange}
                  format="dd/MM/yyyy"
                  slotProps={{ textField: { size: "small", fullWidth: true } }}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12} sm={6} md={hideTypeFilter ? 4 : 3}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="End Date"
                  value={endDate}
                  onChange={handleEndDateChange}
                  format="dd/MM/yyyy"
                  slotProps={{ textField: { size: "small", fullWidth: true } }}
                  minDate={startDate || undefined}
                />
              </LocalizationProvider>
            </Grid>
          </Grid>
        </Box>
      )}

      <Divider sx={{ mb: 3 }} />
    </>
  )
}

export default FilterControls
