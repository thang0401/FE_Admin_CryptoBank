import { useMemo, useState } from 'react'
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Avatar,
  Chip,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TablePagination,
  Checkbox
} from '@mui/material'
import { Users, UserPlus, UserCheck, Clock, FileText, Plus, Eye, Trash2, MoreVertical, Search, HelpCircle, Shield, ClipboardList, Users2, Calculator, Scale, LineChart, Wallet, Lock, Plug, Building2, Code2, Share2, Megaphone } from 'lucide-react'
import { RoleConfig, User } from 'src/types/user-management/userManagementTypes'




const ROLES: RoleConfig[] = [
  { name: "Guest", icon: <HelpCircle size={20} />, color: "#9e9e9e" },
  { name: "Admin", icon: <Shield size={20} />, color: "#f44336" },
  { name: "Support", icon: <Megaphone size={20} />, color: "#2196f3" },
  { name: "Auditor", icon: <ClipboardList size={20} />, color: "#ff9800" },
  { name: "Customer", icon: <Users2 size={20} />, color: "#4caf50" },
  { name: "Accountant", icon: <Calculator size={20} />, color: "#9c27b0" },
  { name: "Compliance Officer", icon: <Scale size={20} />, color: "#795548" },
  { name: "Trader", icon: <LineChart size={20} />, color: "#00bcd4" },
  { name: "Financial Manager", icon: <Wallet size={20} />, color: "#3f51b5" },
  { name: "Security Specialist", icon: <Lock size={20} />, color: "#607d8b" },
  { name: "API Manager", icon: <Plug size={20} />, color: "#673ab7" },
  { name: "Exchange Manager", icon: <Building2 size={20} />, color: "#009688" },
  { name: "Developer", icon: <Code2 size={20} />, color: "#8bc34a" },
  { name: "Affiliate Manager", icon: <Share2 size={20} />, color: "#ff5722" },
  { name: "Marketing Manager", icon: <Megaphone size={20} />, color: "#e91e63" }
]

const getRoleConfig = (roleName: string): RoleConfig => {
  return ROLES.find(role => role.name === roleName) || ROLES[0]
}

const BILLING_OPTIONS = ["Auto Debit", "Cash", "Bank Transfer", "Credit Card"]

const UserManagement = () => {
  const [users, setUsers] = useState<User[]>([
    {
      id: "gs",
      avatar: "",
      name: "Galen Slixby",
      username: "gslixby0",
      password: "",
      role: "Editor",
      billing: "Auto Debit",
      status: "Inactive"
    }
  ])
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [selectedRole, setSelectedRole] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('')
  const [openDialog, setOpenDialog] = useState(false)
  const [newUser, setNewUser] = useState<{
    name: string
    username: string
    password: string
    role: string
    billing: string
    status: "Active" | "Inactive" | "Pending"
  }>({
    name: '',
    username: '',
    password: '',
    role: '',
    billing: '',
    status: 'Pending'
  })
  // Change page
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }
  // Add user
  const handleAddUser = () => {
    const user: User = {
      id: Math.random().toString(36).substr(2, 9),
      avatar: '',
      ...newUser
    }
    setUsers([...users, user])
    setOpenDialog(false)
    setNewUser({
      name: '',
      username: '',
      password: '',
      role: '',
      billing: '',
      status: 'Pending'
    })
  }
  // Select user
  const handleSelectUser = (id: string) => {
    setSelectedUsers((prev) =>
      prev.includes(id) ? prev.filter((userId) => userId !== id) : [...prev, id]
    );
  };

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const allUserIds = users.map((user) => user.id);
      setSelectedUsers(allUserIds);
    } else {
      setSelectedUsers([]);
    }
  };

  // Filters
  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const matchesSearch = searchQuery.toLowerCase() === '' ||
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.username.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesRole = selectedRole === '' ||
        user.role.toLowerCase() === selectedRole.toLowerCase()

      const matchesStatus = selectedStatus === '' ||
        user.status.toLowerCase() === selectedStatus.toLowerCase()

      return matchesSearch && matchesRole && matchesStatus
    })
  }, [users, searchQuery, selectedRole, selectedStatus])


  return (
    <Box sx={{ p: 4 }}>
      <Grid container spacing={3}>
        {/* Stats Cards */}
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box>
                  <Typography color="text.secondary" variant="body2">Session</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'baseline', mt: 1, mb: 0.5 }}>
                    <Typography variant="h4" component="span">21,459</Typography>
                    <Typography color="success.main" variant="body2" sx={{ ml: 1 }}>(+29%)</Typography>
                  </Box>
                  <Typography color="text.secondary" variant="body2">Total User</Typography>
                </Box>
                <Box sx={{ p: 1, bgcolor: 'primary.lighter', borderRadius: '50%' }}>
                  <Users size={20} color="#2196f3" />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box>
                  <Typography color="text.secondary" variant="body2">Paid Users</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'baseline', mt: 1, mb: 0.5 }}>
                    <Typography variant="h4" component="span">4,567</Typography>
                    <Typography color="success.main" variant="body2" sx={{ ml: 1 }}>(+18%)</Typography>
                  </Box>
                  <Typography color="text.secondary" variant="body2">Last week analytics</Typography>
                </Box>
                <Box sx={{ p: 1, bgcolor: '#ffebee', borderRadius: '50%' }}>
                  <UserPlus size={20} color="#f44336" />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>


        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box>
                  <Typography color="text.secondary" variant="body2">Active Users</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'baseline', mt: 1, mb: 0.5 }}>
                    <Typography variant="h4" component="span">19,860</Typography>
                    <Typography color="error.main" variant="body2" sx={{ ml: 1 }}>(-14%)</Typography>
                  </Box>
                  <Typography color="text.secondary" variant="body2">Last week analytics</Typography>
                </Box>
                <Box sx={{ p: 1, bgcolor: '#e8f5e9', borderRadius: '50%' }}>
                  <UserCheck size={20} color="#4caf50" />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box>
                  <Typography color="text.secondary" variant="body2">Pending Users</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'baseline', mt: 1, mb: 0.5 }}>
                    <Typography variant="h4" component="span">237</Typography>
                    <Typography color="success.main" variant="body2" sx={{ ml: 1 }}>(+42%)</Typography>
                  </Box>
                  <Typography color="text.secondary" variant="body2">Last week analytics</Typography>
                </Box>
                <Box sx={{ p: 1, bgcolor: '#fff8e1', borderRadius: '50%' }}>
                  <Clock size={20} color="#ffc107" />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        {/* Similar cards for Active and Pending Users... */}

        {/* Filters */}
        <Grid item xs={12}>
          <Typography variant="h6" sx={{ mb: 2 }}>Filters</Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Select Role</InputLabel>
                <Select
                  value={selectedRole}
                  label="Select Role"
                  onChange={(e) => {
                    setSelectedRole(e.target.value)
                    setPage(0) // Reset page when filter changes
                  }}
                >
                  <MenuItem value="">All Roles</MenuItem>
                  {ROLES.map(role => (
                    <MenuItem key={role.name} value={role.name}>{role.name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Select Status</InputLabel>
                <Select
                  value={selectedStatus}
                  label="Select Status"
                  onChange={(e) => {
                    setSelectedStatus(e.target.value)
                    setPage(0) // Reset page when filter changes
                  }}
                >
                  <MenuItem value="">All Status</MenuItem>
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="inactive">Inactive</MenuItem>
                  <MenuItem value="pending">Pending</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Grid>

        {/* Table Controls */}
        {/* Search and Controls */}
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <TextField
              placeholder="Search User"
              size="small"
              sx={{ width: 240 }}
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                setPage(0) // Reset page when search changes
              }}
              InputProps={{
                startAdornment: <Search size={20} />,
              }}
            />
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button variant="outlined" startIcon={<FileText />}>
                Export
              </Button>
              <Button
                variant="contained"
                startIcon={<Plus />}
                onClick={() => setOpenDialog(true)}
              >
                Add New User
              </Button>
            </Box>
          </Box>
        </Grid>

        {/* Users Table */}
        <Grid item xs={12}>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    indeterminate={
                      selectedUsers.length > 0 && 
                      selectedUsers.length < filteredUsers.length
                    }
                    checked={
                      filteredUsers.length > 0 && 
                      selectedUsers.length === filteredUsers.length
                    }
                    onChange={handleSelectAll}
                  />
                </TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Username</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Billing</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Action</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {filteredUsers
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((user) => (
                  <TableRow
                    key={user.id}
                    selected={selectedUsers.includes(user.id)}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={selectedUsers.includes(user.id)}
                        onChange={() => handleSelectUser(user.id)}
                      />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        {user.avatar ? (
                          <Avatar src={user.avatar} />
                        ) : (
                          <Avatar>{user.name.charAt(0)}</Avatar>
                        )}
                        <Typography variant="subtitle2">{user.name}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell>{user.username}</TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box sx={{ color: getRoleConfig(user.role).color }}>
                          {getRoleConfig(user.role).icon}
                        </Box>
                        {user.role}
                      </Box>
                    </TableCell>
                    <TableCell>{user.billing}</TableCell>
                    <TableCell>
                      <Chip
                        label={user.status}
                        color={
                          user.status === "Active"
                            ? "success"
                            : user.status === "Pending"
                              ? "warning"
                              : "default"
                        }
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="right">
                      <IconButton size="small">
                        <Eye size={20} />
                      </IconButton>
                      <IconButton 
                        size="small" 
                        // onClick={() => handleDeleteUser(user.id)}
                      >
                        <Trash2 size={20} />
                      </IconButton>
                      <IconButton size="small">
                        <MoreVertical size={20} />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredUsers.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </TableContainer>
      </Grid>
      </Grid>

      {/* Add User Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Add New User</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2, pb: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              fullWidth
              label="Name"
              value={newUser.name}
              onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
            />
            <TextField
              fullWidth
              label="Username"
              value={newUser.username}
              onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
            />
            <TextField
              fullWidth
              label="Password"
              value={newUser.password}
              onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
            />
            <FormControl fullWidth>
              <InputLabel>Role</InputLabel>
              <Select
                value={newUser.role}
                label="Role"
                onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
              >
                {ROLES.map((role) => (
                  <MenuItem key={role.name} value={role.name}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {role.icon}
                      {role.name}
                    </Box>
                  </MenuItem>
                ))}
              </Select>

            </FormControl>
            <FormControl fullWidth>
              <InputLabel>Billing</InputLabel>
              <Select
                value={newUser.billing}
                label="Billing"
                onChange={(e) => setNewUser({ ...newUser, billing: e.target.value })}
              >
                {BILLING_OPTIONS.map(option => (
                  <MenuItem key={option} value={option}>{option}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={newUser.status}
                label="Status"
                onChange={(e) => setNewUser({ ...newUser, status: e.target.value as "Active" | "Inactive" | "Pending" })}
              >
                <MenuItem value="Active">Active</MenuItem>
                <MenuItem value="Inactive">Inactive</MenuItem>
                <MenuItem value="Pending">Pending</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleAddUser} variant="contained">Add User</Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default UserManagement