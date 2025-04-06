"use client"

import type React from "react"
import { useState } from "react"
import {
  Box,
  Typography,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TextField,
  InputAdornment,
  Card,
  CardContent,
  Grid,
  Chip,
  Button,
  useTheme,
} from "@mui/material"
import { Search, FileDownload, FilterList } from "@mui/icons-material"
import { AdminLogData } from "src/types/asset-management/type"


interface AdminActivityLogProps {
  adminLogs: AdminLogData[]
}

const AdminActivityLog: React.FC<AdminActivityLogProps> = ({ adminLogs }) => {
  const theme = useTheme()
  const [searchTerm, setSearchTerm] = useState("")

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value)
  }

  const filteredLogs = adminLogs.filter((log) => {
    if (!searchTerm) return true
    const searchLower = searchTerm.toLowerCase()
    return (
      log.admin.toLowerCase().includes(searchLower) ||
      log.action.toLowerCase().includes(searchLower) ||
      log.details.toLowerCase().includes(searchLower) ||
      log.ip.includes(searchTerm)
    )
  })

  // Group logs by date for summary
  const logsByDate = filteredLogs.reduce(
    (acc, log) => {
      const date = new Date(log.timestamp).toLocaleDateString()
      if (!acc[date]) {
        acc[date] = []
      }
      acc[date].push(log)
      return acc
    },
    {} as Record<string, AdminLogData[]>,
  )

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
        <Typography variant="h6">Admin Activity Log</Typography>
        <Box sx={{ display: "flex", gap: 2 }}>
          <TextField
            placeholder="Search logs"
            size="small"
            value={searchTerm}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
            sx={{ width: 250 }}
          />
          <Button variant="outlined" startIcon={<FilterList />}>
            Filters
          </Button>
          <Button variant="contained" startIcon={<FileDownload />}>
            Export
          </Button>
        </Box>
      </Box>

      {/* Activity Summary */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Total Activities
              </Typography>
              <Typography variant="h3">{adminLogs.length}</Typography>
              <Typography variant="body2" color="text.secondary">
                All time
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Today's Activities
              </Typography>
              <Typography variant="h3">{logsByDate[new Date().toLocaleDateString()]?.length || 0}</Typography>
              <Typography variant="body2" color="text.secondary">
                {new Date().toLocaleDateString()}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Active Admins
              </Typography>
              <Typography variant="h3">{new Set(adminLogs.map((log) => log.admin)).size}</Typography>
              <Typography variant="body2" color="text.secondary">
                Unique admin accounts
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Activity Log Table */}
      <TableContainer>
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow>
              <TableCell>
                <strong>Admin</strong>
              </TableCell>
              <TableCell>
                <strong>Action</strong>
              </TableCell>
              <TableCell>
                <strong>Details</strong>
              </TableCell>
              <TableCell>
                <strong>Date & Time</strong>
              </TableCell>
              <TableCell>
                <strong>IP Address</strong>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredLogs.map((log) => (
              <TableRow
                key={log.id}
                sx={{
                  "&:last-child td, &:last-child th": { border: 0 },
                  backgroundColor: log.action.includes("balance")
                    ? theme.palette.mode === "dark"
                      ? "rgba(255, 152, 0, 0.1)"
                      : "rgba(255, 152, 0, 0.05)"
                    : "inherit",
                }}
              >
                <TableCell>{log.admin}</TableCell>
                <TableCell>
                  <Chip
                    label={log.action}
                    size="small"
                    color={
                      log.action.includes("Approved")
                        ? "success"
                        : log.action.includes("balance")
                          ? "warning"
                          : log.action.includes("security")
                            ? "info"
                            : "default"
                    }
                  />
                </TableCell>
                <TableCell>{log.details}</TableCell>
                <TableCell>{new Date(log.timestamp).toLocaleString()}</TableCell>
                <TableCell>{log.ip}</TableCell>
              </TableRow>
            ))}
            {filteredLogs.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  <Typography variant="body2" sx={{ py: 2 }}>
                    No activity logs found
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  )
}

export default AdminActivityLog

