"use client"

import type React from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox,
  Box,
  Avatar,
  Typography,
  Chip,
  IconButton,
  Tooltip,
  useTheme,
} from "@mui/material"
import { Eye, Trash2, MoreVertical, Edit } from "lucide-react"

interface Employee {
  id: string
  avatar: string
  name: string
  username: string
  role: string
  billing: string
  status: string
  employment_type: string
  hire_date: string
}

interface RoleConfig {
  name: string
  icon: React.ReactNode
  color: string
}

interface EmployeeTableProps {
  employees: Employee[]
  page: number
  rowsPerPage: number
  selectedEmployees: string[]
  handleSelectEmployee: (id: string, isViewDetails?: boolean) => void;
  handleSelectAll: (event: React.ChangeEvent<HTMLInputElement>) => void
  handleDeleteEmployee: (id: string) => void
  getRoleConfig: (roleName: string) => RoleConfig
}

const EmployeeTable: React.FC<EmployeeTableProps> = ({
  employees,
  page,
  rowsPerPage,
  selectedEmployees,
  handleSelectEmployee,
  handleSelectAll,
  handleDeleteEmployee,
  getRoleConfig,
}) => {
  const theme = useTheme()

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "success"
      case "Terminated":
        return "error"
      case "Suspended":
        return "warning"
      default:
        return "default"
    }
  }

  const getEmploymentTypeColor = (type: string) => {
    switch (type) {
      case "Full-time":
        return theme.palette.primary.main
      case "Part-time":
        return theme.palette.secondary.main
      case "Contract":
        return theme.palette.info.main
      default:
        return theme.palette.text.secondary
    }
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return ""
    const date = new Date(dateString)
    return date.toLocaleDateString("vi-VN")
  }
  
  const displayedEmployees = employees.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)

  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell padding="checkbox">
              <Checkbox
                indeterminate={selectedEmployees.length > 0 && selectedEmployees.length < employees.length}
                checked={employees.length > 0 && selectedEmployees.length === employees.length}
                onChange={handleSelectAll}
              />
            </TableCell>
            <TableCell>Employee</TableCell>
            <TableCell>Role</TableCell>
            <TableCell>Employment Type</TableCell>
            <TableCell>Hire Date</TableCell>
            <TableCell>Status</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {displayedEmployees.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} align="center" sx={{ py: 3 }}>
                <Typography variant="body1" color="text.secondary">
                  No employees found
                </Typography>
              </TableCell>
            </TableRow>
          ) : (
            displayedEmployees.map((employee) => (
              <TableRow
                key={employee.id}
                selected={selectedEmployees.includes(employee.id)}
                sx={{
                  "&:hover": {
                    backgroundColor: theme.palette.action.hover,
                  },
                  transition: "background-color 0.2s",
                }}
              >
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selectedEmployees.includes(employee.id)}
                    onChange={() => handleSelectEmployee(employee.id)}
                  />
                </TableCell>
                <TableCell>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    {employee.avatar ? (
                      <Avatar src={employee.avatar} />
                    ) : (
                      <Avatar sx={{ bgcolor: theme.palette.primary.main }}>{employee.name.charAt(0)}</Avatar>
                    )}
                    <Box>
                      <Typography variant="subtitle2" fontWeight="medium">
                        {employee.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {employee.username}
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Box sx={{ color: getRoleConfig(employee.role).color }}>{getRoleConfig(employee.role).icon}</Box>
                    <Typography variant="body2">{employee.role}</Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Chip
                    label={employee.employment_type}
                    size="small"
                    sx={{
                      backgroundColor: `${getEmploymentTypeColor(employee.employment_type)}20`,
                      color: getEmploymentTypeColor(employee.employment_type),
                      fontWeight: "medium",
                    }}
                  />
                </TableCell>
                <TableCell>{formatDate(employee.hire_date)}</TableCell>
                <TableCell>
                  <Chip
                    label={employee.status}
                    color={getStatusColor(employee.status) as any}
                    size="small"
                    sx={{ fontWeight: "medium" }}
                  />
                </TableCell>
                <TableCell align="right">
                  <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                    <Tooltip title="View Details">
                      <IconButton 
                        size="small"
                        sx={{ color: theme.palette.primary.main }}
                        onClick={() => handleSelectEmployee(employee.id, true)}
                      >
                        <Eye size={18} />
                      </IconButton>
                    </Tooltip>
                    {/* <Tooltip title="Edit">
                      <IconButton size="small" sx={{ color: theme.palette.info.main }}>
                        <Edit size={18} />
                      </IconButton>
                    </Tooltip> */}
                    <Tooltip title="Delete">
                      <IconButton
                        size="small"
                        sx={{ color: theme.palette.error.main }}
                        onClick={() => handleDeleteEmployee(employee.id)}
                      >
                        <Trash2 size={18} />
                      </IconButton>
                    </Tooltip>
                    {/* <Tooltip title="More Options">
                      <IconButton size="small">
                        <MoreVertical size={18} />
                      </IconButton>
                    </Tooltip> */}
                  </Box>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default EmployeeTable