"use client"

import type React from "react"

import { useEffect, useState } from "react"
import {
  Box,
  Typography,
  Container,
  Card,
  Grid,
  Divider,
  CircularProgress,
  Button,
  useTheme,
  TextField,
  Avatar,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  IconButton,
  Stack,
  Alert,
  Snackbar,
  Tabs,
  Tab,
  InputAdornment,
  type SelectChangeEvent,
} from "@mui/material"
import { useRouter } from "next/router" // Page Router
import { ArrowLeft, Edit, Save, Plus, X, Camera, Trash2 } from "lucide-react"

// Updated interface to match the new requirements
interface Role {
  id: string
  name: string
  description?: string
}

interface User {
  id: string
  username: string
  email: string
  fullName: string
  phoneNumber: string
  gender: "male" | "female" | "other"
  dateOfBirth: string
  kycStatus: "verified" | "pending" | "rejected" | "not_submitted"
  status: StatusType
  roles: Role[]
  avatar: string
  // Additional fields from AddEmployeeDialog
  employment_type?: string
  hire_date?: string
  termination_date?: string | null
  salary?: number
  bonus?: number
  marital_status?: string
  billing?: string
  bank_account?: string
  bank_name?: string
  insurance_number?: string
  tax_code?: string
  emergency_contact_name?: string
  emergency_contact_phone?: string
}

type StatusType = "active" | "inactive" | "suspended" | "deleted"

const statusOptions = [
  { value: "active", label: "Active", color: "#4caf50" },
  { value: "inactive", label: "Inactive", color: "#9e9e9e" },
  { value: "suspended", label: "Suspended", color: "#ff9800" },
  { value: "deleted", label: "Deleted", color: "#f44336" },
]

const kycStatusOptions = [
  { value: "verified", label: "Verified", color: "#4caf50" },
  { value: "pending", label: "Pending", color: "#ff9800" },
  { value: "rejected", label: "Rejected", color: "#f44336" },
  { value: "not_submitted", label: "Not Submitted", color: "#9e9e9e" },
]

// Tab Panel component
interface TabPanelProps {
  children?: React.ReactNode
  index: number
  value: number
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`user-tabpanel-${index}`}
      aria-labelledby={`user-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  )
}

function a11yProps(index: number) {
  return {
    id: `user-tab-${index}`,
    "aria-controls": `user-tabpanel-${index}`,
  }
}

const EmployeeDetails = () => {
  const theme = useTheme()
  const router = useRouter()
  const { id } = router.query // Get id from query params

  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [editMode, setEditMode] = useState(false)
  const [availableRoles, setAvailableRoles] = useState<Role[]>([])
  const [tabValue, setTabValue] = useState(0)

  // Dialog states
  const [openRoleDialog, setOpenRoleDialog] = useState(false)
  const [openRemoveRoleDialog, setOpenRemoveRoleDialog] = useState(false)
  const [openUpdateDialog, setOpenUpdateDialog] = useState(false)
  const [selectedRole, setSelectedRole] = useState<Role | null>(null)
  const [roleToAdd, setRoleToAdd] = useState<string>("")

  // Snackbar state
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error" | "info" | "warning",
  })

  // Handle tab change
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue)
  }

  // Fetch user information based on id
  useEffect(() => {
    const fetchUser = async () => {
      if (!id) return

      setLoading(true)
      setError(null)

      try {
        // In a real application, you would fetch from your API
        // const response = await fetch(`/api/users/${id}`);
        // if (!response.ok) throw new Error("Failed to fetch user details");
        // const data = await response.json();
        // setUser(data);

        // Mock data for demonstration
        await new Promise((resolve) => setTimeout(resolve, 1000))

        const mockUser: User = {
          id: id as string,
          username: "johndoe",
          email: "john.doe@example.com",
          fullName: "John Doe",
          phoneNumber: "+1 (555) 123-4567",
          gender: "male",
          dateOfBirth: "1990-05-15",
          kycStatus: "verified",
          status: "active",
          roles: [
            { id: "1", name: "User", description: "Regular user access" },
            { id: "2", name: "Editor", description: "Can edit content" },
          ],
          avatar: "https://randomuser.me/api/portraits/men/32.jpg",
          // Additional mock data for employment details
          employment_type: "Full-time",
          hire_date: "2022-03-15",
          termination_date: null,
          salary: 5000000,
          bonus: 500000,
          marital_status: "Single",
          billing: "Bank Transfer",
          bank_account: "9876543210",
          bank_name: "VietcomBank",
          insurance_number: "INS123456789",
          tax_code: "TAX987654321",
          emergency_contact_name: "Jane Doe",
          emergency_contact_phone: "+1 (555) 987-6543",
        }

        setUser(mockUser)

        // Mock available roles
        setAvailableRoles([
          { id: "1", name: "User", description: "Regular user access" },
          { id: "2", name: "Editor", description: "Can edit content" },
          { id: "3", name: "Admin", description: "Full administrative access" },
          { id: "4", name: "Moderator", description: "Content moderation" },
          { id: "5", name: "Analyst", description: "Data analysis access" },
        ])
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message || "An error occurred while fetching user details")
        } else {
          setError("An unknown error occurred")
        }
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [id])

  // Handle field changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }> | SelectChangeEvent<string>,
  ) => {
    const { name, value } = e.target
    if (!name || !user) return

    setUser({
      ...user,
      [name]: value,
    })
  }

  // Handle number field changes
  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    if (!name || !user) return

    setUser({
      ...user,
      [name]: value === "" ? 0 : Number(value),
    })
  }

  // Handle save changes
  const handleSave = async () => {
    if (!user) return

    setSaving(true)
    try {
      // In a real application, you would send to your API
      // const response = await fetch(`/api/users/${id}`, {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(user)
      // });
      // if (!response.ok) throw new Error("Failed to update user");

      // Mock API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setSnackbar({
        open: true,
        message: "User information updated successfully",
        severity: "success",
      })
      setEditMode(false)
    } catch (err) {
      if (err instanceof Error) {
        setSnackbar({
          open: true,
          message: err.message || "Failed to update user",
          severity: "error",
        })
      }
    } finally {
      setSaving(false)
      setOpenUpdateDialog(false)
    }
  }

  // Handle role addition
  const handleAddRole = async () => {
    if (!user || !roleToAdd) return

    const roleToAddObj = availableRoles.find((role) => role.id === roleToAdd)
    if (!roleToAddObj) return

    // Check if role already exists
    if (user.roles.some((role) => role.id === roleToAddObj.id)) {
      setSnackbar({
        open: true,
        message: "User already has this role",
        severity: "warning",
      })
      setOpenRoleDialog(false)
      return
    }

    setSaving(true)
    try {
      // In a real application, you would send to your API
      // const response = await fetch(`/api/users/${id}/roles`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ roleId: roleToAdd })
      // });
      // if (!response.ok) throw new Error("Failed to add role");

      // Mock API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setUser({
        ...user,
        roles: [...user.roles, roleToAddObj],
      })

      setSnackbar({
        open: true,
        message: `Role "${roleToAddObj.name}" added successfully`,
        severity: "success",
      })
    } catch (err) {
      if (err instanceof Error) {
        setSnackbar({
          open: true,
          message: err.message || "Failed to add role",
          severity: "error",
        })
      }
    } finally {
      setSaving(false)
      setOpenRoleDialog(false)
      setRoleToAdd("")
    }
  }

  // Handle role removal
  const handleRemoveRole = async () => {
    if (!user || !selectedRole) return

    setSaving(true)
    try {
      // In a real application, you would send to your API
      // const response = await fetch(`/api/users/${id}/roles/${selectedRole.id}`, {
      //   method: 'DELETE'
      // });
      // if (!response.ok) throw new Error("Failed to remove role");

      // Mock API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setUser({
        ...user,
        roles: user.roles.filter((role) => role.id !== selectedRole.id),
      })

      setSnackbar({
        open: true,
        message: `Role "${selectedRole.name}" removed successfully`,
        severity: "success",
      })
    } catch (err) {
      if (err instanceof Error) {
        setSnackbar({
          open: true,
          message: err.message || "Failed to remove role",
          severity: "error",
        })
      }
    } finally {
      setSaving(false)
      setOpenRemoveRoleDialog(false)
      setSelectedRole(null)
    }
  }

  // Get KYC status color
  const getKycStatusColor = (status: string) => {
    const statusObj = kycStatusOptions.find((option) => option.value === status)
    return statusObj ? statusObj.color : "#9e9e9e"
  }

  if (loading) {
    return (
      <Container maxWidth="xl">
        <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
          <CircularProgress />
        </Box>
      </Container>
    )
  }

  if (error || !user) {
    return (
      <Container maxWidth="xl">
        <Box sx={{ py: 4 }}>
          <Typography variant="h4" color="error">
            {error || "User not found"}
          </Typography>
          <Button
            variant="outlined"
            startIcon={<ArrowLeft size={18} />}
            onClick={() => router.push("/employee-management")}
            sx={{ mt: 2 }}
          >
            Back to Employee List
          </Button>
        </Box>
      </Container>
    )
  }

  // Filter out roles that the user already has
  const availableRolesToAdd = availableRoles.filter((role) => !user.roles.some((userRole) => userRole.id === role.id))

  return (
    <Container maxWidth="xl">
      <Box sx={{ py: 4 }}>
        <Box sx={{ mb: 4, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Button
              variant="outlined"
              startIcon={<ArrowLeft size={18} />}
              onClick={() => router.push("/employee-management")}
            >
              Back
            </Button>
            <Typography variant="h4" fontWeight="bold">
              User Profile
            </Typography>
          </Box>

          <Box>
            {editMode ? (
              <Stack direction="row" spacing={2}>
                <Button
                  variant="outlined"
                  color="inherit"
                  onClick={() => setEditMode(false)}
                  startIcon={<X size={18} />}
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => setOpenUpdateDialog(true)}
                  startIcon={<Save size={18} />}
                  disabled={saving}
                >
                  {saving ? <CircularProgress size={24} /> : "Save Changes"}
                </Button>
              </Stack>
            ) : (
              <Button
                variant="contained"
                color="primary"
                onClick={() => setEditMode(true)}
                startIcon={<Edit size={18} />}
              >
                Edit Profile
              </Button>
            )}
          </Box>
        </Box>

        <Grid container spacing={3}>
          {/* Left column - Avatar and basic info - UNCHANGED */}
          <Grid item xs={12} md={4}>
            <Card sx={{ p: 3, height: "100%", boxShadow: theme.shadows[5], borderRadius: 2 }}>
              <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", mb: 3 }}>
                <Box sx={{ position: "relative", mb: 2 }}>
                  <Avatar
                    src={user.avatar}
                    alt={user.fullName}
                    sx={{
                      width: 150,
                      height: 150,
                      border: `4px solid ${theme.palette.background.paper}`,
                      boxShadow: theme.shadows[3],
                    }}
                  />
                  {editMode && (
                    <IconButton
                      sx={{
                        position: "absolute",
                        bottom: 0,
                        right: 0,
                        backgroundColor: theme.palette.primary.main,
                        color: "white",
                        "&:hover": {
                          backgroundColor: theme.palette.primary.dark,
                        },
                      }}
                    >
                      <Camera size={18} />
                    </IconButton>
                  )}
                </Box>

                <Typography variant="h5" fontWeight="bold" gutterBottom>
                  {user.fullName}
                </Typography>

                <Typography variant="body1" color="text.secondary" gutterBottom>
                  @{user.username}
                </Typography>

                <Box sx={{ mt: 1, display: "flex", alignItems: "center", gap: 1 }}>
                  <Chip
                    label={user.status.toUpperCase()}
                    color={user.status === "active" ? "success" : user.status === "suspended" ? "warning" : "error"}
                    size="small"
                  />
                  <Chip
                    label={`KYC: ${user.kycStatus.replace("_", " ").toUpperCase()}`}
                    sx={{
                      backgroundColor: `${getKycStatusColor(user.kycStatus)}20`,
                      color: getKycStatusColor(user.kycStatus),
                    }}
                    size="small"
                  />
                </Box>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                User Roles
              </Typography>

              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 2 }}>
                {user.roles.map((role) => (
                  <Chip
                    key={role.id}
                    label={role.name}
                    color="primary"
                    variant="outlined"
                    onDelete={
                      editMode
                        ? () => {
                            setSelectedRole(role)
                            setOpenRemoveRoleDialog(true)
                          }
                        : undefined
                    }
                    sx={{ m: 0.5 }}
                  />
                ))}

                {editMode && (
                  <Chip
                    icon={<Plus size={16} />}
                    label="Add Role"
                    variant="outlined"
                    onClick={() => setOpenRoleDialog(true)}
                    sx={{
                      m: 0.5,
                      borderStyle: "dashed",
                      cursor: "pointer",
                      "&:hover": {
                        backgroundColor: (alpha) => theme.palette.primary.main + "10",
                      },
                    }}
                  />
                )}
              </Box>

              <Divider sx={{ my: 2 }} />

              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                Account Information
              </Typography>

              <Box sx={{ "& > div": { mb: 2 } }}>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    User ID
                  </Typography>
                  <Typography variant="body1">{user.id}</Typography>
                </Box>

                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Email
                  </Typography>
                  <Typography variant="body1">{user.email}</Typography>
                </Box>

                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Phone Number
                  </Typography>
                  <Typography variant="body1">{user.phoneNumber}</Typography>
                </Box>
              </Box>
            </Card>
          </Grid>

          {/* Right column - Tabbed interface */}
          <Grid item xs={12} md={8}>
            <Card sx={{ p: 3, boxShadow: theme.shadows[5], borderRadius: 2 }}>
              <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                <Tabs value={tabValue} onChange={handleTabChange} aria-label="user information tabs">
                  <Tab label="Personal Information" {...a11yProps(0)} />
                  <Tab label="Employment Details" {...a11yProps(1)} />
                </Tabs>
              </Box>

              {/* Tab 1: Personal Information and Account Status */}
              <TabPanel value={tabValue} index={0}>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Personal Information
                </Typography>

                <Grid container spacing={3} sx={{ mb: 4 }}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Full Name"
                      name="fullName"
                      value={user.fullName}
                      onChange={handleChange}
                      InputProps={{ readOnly: !editMode }}
                      variant={editMode ? "outlined" : "filled"}
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Username"
                      name="username"
                      value={user.username}
                      InputProps={{ readOnly: true }}
                      variant="filled"
                      helperText="Username cannot be changed"
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Email Address"
                      name="email"
                      type="email"
                      value={user.email}
                      onChange={handleChange}
                      InputProps={{ readOnly: !editMode }}
                      variant={editMode ? "outlined" : "filled"}
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Phone Number"
                      name="phoneNumber"
                      value={user.phoneNumber}
                      onChange={handleChange}
                      InputProps={{ readOnly: !editMode }}
                      variant={editMode ? "outlined" : "filled"}
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Date of Birth"
                      name="dateOfBirth"
                      type="date"
                      value={user.dateOfBirth}
                      onChange={handleChange}
                      InputProps={{
                        readOnly: !editMode,
                        inputProps: { max: new Date().toISOString().split("T")[0] },
                      }}
                      InputLabelProps={{ shrink: true }}
                      variant={editMode ? "outlined" : "filled"}
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth variant={editMode ? "outlined" : "filled"}>
                      <InputLabel id="gender-label">Gender</InputLabel>
                      <Select
                        labelId="gender-label"
                        name="gender"
                        value={user.gender}
                        onChange={handleChange}
                        label="Gender"
                        inputProps={{ readOnly: !editMode }}
                      >
                        <MenuItem value="male">Male</MenuItem>
                        <MenuItem value="female">Female</MenuItem>
                        <MenuItem value="other">Other</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>

                <Divider sx={{ my: 3 }} />

                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Account Status
                </Typography>

                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth variant={editMode ? "outlined" : "filled"}>
                      <InputLabel id="status-label">Account Status</InputLabel>
                      <Select
                        labelId="status-label"
                        name="status"
                        value={user.status}
                        onChange={handleChange}
                        label="Account Status"
                        inputProps={{ readOnly: !editMode }}
                        renderValue={(selected) => (
                          <Box sx={{ display: "flex", alignItems: "center" }}>
                            <Box
                              sx={{
                                width: 12,
                                height: 12,
                                borderRadius: "50%",
                                backgroundColor: statusOptions.find((opt) => opt.value === selected)?.color,
                                mr: 1,
                              }}
                            />
                            {statusOptions.find((opt) => opt.value === selected)?.label}
                          </Box>
                        )}
                      >
                        {statusOptions.map((option) => (
                          <MenuItem key={option.value} value={option.value}>
                            <Box sx={{ display: "flex", alignItems: "center" }}>
                              <Box
                                sx={{
                                  width: 12,
                                  height: 12,
                                  borderRadius: "50%",
                                  backgroundColor: option.color,
                                  mr: 1,
                                }}
                              />
                              {option.label}
                            </Box>
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth variant="filled">
                      <InputLabel id="kyc-status-label">KYC Status</InputLabel>
                      <Select
                        labelId="kyc-status-label"
                        name="kycStatus"
                        value={user.kycStatus}
                        label="KYC Status"
                        inputProps={{ readOnly: true }}
                      >
                        {kycStatusOptions.map((option) => (
                          <MenuItem key={option.value} value={option.value}>
                            {option.label}
                          </MenuItem>
                        ))}
                      </Select>
                      <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
                        KYC status can only be changed through the verification process
                      </Typography>
                    </FormControl>
                  </Grid>
                </Grid>
              </TabPanel>

              {/* Tab 2: Employment Details */}
              <TabPanel value={tabValue} index={1}>
                {/* Job Information */}
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Job Information
                </Typography>
                <Grid container spacing={3} sx={{ mb: 4 }}>
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth variant={editMode ? "outlined" : "filled"}>
                      <InputLabel>Employment Type</InputLabel>
                      <Select
                        name="employment_type"
                        value={user.employment_type || ""}
                        label="Employment Type"
                        onChange={handleChange}
                        inputProps={{ readOnly: !editMode }}
                      >
                        <MenuItem value="Full-time">Full-time</MenuItem>
                        <MenuItem value="Part-time">Part-time</MenuItem>
                        <MenuItem value="Contract">Contract</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth variant={editMode ? "outlined" : "filled"}>
                      <InputLabel>Status</InputLabel>
                      <Select
                        name="status"
                        value={user.status}
                        label="Status"
                        onChange={handleChange}
                        inputProps={{ readOnly: !editMode }}
                      >
                        <MenuItem value="active">Active</MenuItem>
                        <MenuItem value="inactive">Inactive</MenuItem>
                        <MenuItem value="suspended">Suspended</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Hire Date"
                      name="hire_date"
                      type="date"
                      value={user.hire_date || ""}
                      onChange={handleChange}
                      InputLabelProps={{ shrink: true }}
                      InputProps={{ readOnly: !editMode }}
                      variant={editMode ? "outlined" : "filled"}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Termination Date"
                      name="termination_date"
                      type="date"
                      value={user.termination_date || ""}
                      onChange={handleChange}
                      InputLabelProps={{ shrink: true }}
                      InputProps={{ readOnly: !editMode }}
                      variant={editMode ? "outlined" : "filled"}
                    />
                  </Grid>
                </Grid>

                <Divider sx={{ my: 3 }} />

                {/* Financial Information */}
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Financial Information
                </Typography>
                <Grid container spacing={3} sx={{ mb: 4 }}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Base Salary"
                      name="salary"
                      type="number"
                      value={user.salary || 0}
                      onChange={handleNumberChange}
                      InputProps={{
                        readOnly: !editMode,
                        startAdornment: <InputAdornment position="start">VND</InputAdornment>,
                      }}
                      variant={editMode ? "outlined" : "filled"}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Bonus"
                      name="bonus"
                      type="number"
                      value={user.bonus || 0}
                      onChange={handleNumberChange}
                      InputProps={{
                        readOnly: !editMode,
                        startAdornment: <InputAdornment position="start">VND</InputAdornment>,
                      }}
                      variant={editMode ? "outlined" : "filled"}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth variant={editMode ? "outlined" : "filled"}>
                      <InputLabel>Payment Method</InputLabel>
                      <Select
                        name="billing"
                        value={user.billing || ""}
                        label="Payment Method"
                        onChange={handleChange}
                        inputProps={{ readOnly: !editMode }}
                      >
                        <MenuItem value="Auto Debit">Auto Debit</MenuItem>
                        <MenuItem value="Cash">Cash</MenuItem>
                        <MenuItem value="Bank Transfer">Bank Transfer</MenuItem>
                        <MenuItem value="Credit Card">Credit Card</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth variant={editMode ? "outlined" : "filled"}>
                      <InputLabel>Marital Status</InputLabel>
                      <Select
                        name="marital_status"
                        value={user.marital_status || ""}
                        label="Marital Status"
                        onChange={handleChange}
                        inputProps={{ readOnly: !editMode }}
                      >
                        <MenuItem value="Single">Single</MenuItem>
                        <MenuItem value="Married">Married</MenuItem>
                        <MenuItem value="Divorced">Divorced</MenuItem>
                        <MenuItem value="Widowed">Widowed</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>

                <Divider sx={{ my: 3 }} />

                {/* Bank & Legal Information */}
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Bank & Legal Information
                </Typography>
                <Grid container spacing={3} sx={{ mb: 4 }}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Bank Account Number"
                      name="bank_account"
                      value={user.bank_account || ""}
                      onChange={handleChange}
                      InputProps={{ readOnly: !editMode }}
                      variant={editMode ? "outlined" : "filled"}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Bank Name"
                      name="bank_name"
                      value={user.bank_name || ""}
                      onChange={handleChange}
                      InputProps={{ readOnly: !editMode }}
                      variant={editMode ? "outlined" : "filled"}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Insurance Number"
                      name="insurance_number"
                      value={user.insurance_number || ""}
                      onChange={handleChange}
                      InputProps={{ readOnly: !editMode }}
                      variant={editMode ? "outlined" : "filled"}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Tax Code"
                      name="tax_code"
                      value={user.tax_code || ""}
                      onChange={handleChange}
                      InputProps={{ readOnly: !editMode }}
                      variant={editMode ? "outlined" : "filled"}
                    />
                  </Grid>
                </Grid>

                <Divider sx={{ my: 3 }} />

                {/* Emergency Contact Information */}
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Emergency Contact Information
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Contact Name"
                      name="emergency_contact_name"
                      value={user.emergency_contact_name || ""}
                      onChange={handleChange}
                      InputProps={{ readOnly: !editMode }}
                      variant={editMode ? "outlined" : "filled"}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Phone Number"
                      name="emergency_contact_phone"
                      value={user.emergency_contact_phone || ""}
                      onChange={handleChange}
                      InputProps={{ readOnly: !editMode }}
                      variant={editMode ? "outlined" : "filled"}
                    />
                  </Grid>
                </Grid>
              </TabPanel>
            </Card>
          </Grid>
        </Grid>
      </Box>

      {/* Add Role Dialog */}
      <Dialog open={openRoleDialog} onClose={() => setOpenRoleDialog(false)}>
        <DialogTitle>Add Role</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            Select a role to add to this user. This will grant the user additional permissions.
          </DialogContentText>
          <FormControl fullWidth>
            <InputLabel id="add-role-label">Role</InputLabel>
            <Select
              labelId="add-role-label"
              value={roleToAdd}
              onChange={(e) => setRoleToAdd(e.target.value as string)}
              label="Role"
              disabled={saving}
            >
              {availableRolesToAdd.map((role) => (
                <MenuItem key={role.id} value={role.id}>
                  {role.name} {role.description && `- ${role.description}`}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenRoleDialog(false)} disabled={saving}>
            Cancel
          </Button>
          <Button
            onClick={handleAddRole}
            variant="contained"
            disabled={!roleToAdd || saving}
            startIcon={saving ? <CircularProgress size={16} /> : null}
          >
            Add Role
          </Button>
        </DialogActions>
      </Dialog>

      {/* Remove Role Dialog */}
      <Dialog open={openRemoveRoleDialog} onClose={() => setOpenRemoveRoleDialog(false)}>
        <DialogTitle>Remove Role</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to remove the role "{selectedRole?.name}" from this user? This will revoke associated
            permissions.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenRemoveRoleDialog(false)} disabled={saving}>
            Cancel
          </Button>
          <Button
            onClick={handleRemoveRole}
            variant="contained"
            color="error"
            disabled={saving}
            startIcon={saving ? <CircularProgress size={16} /> : <Trash2 size={16} />}
          >
            Remove Role
          </Button>
        </DialogActions>
      </Dialog>

      {/* Update Confirmation Dialog */}
      <Dialog open={openUpdateDialog} onClose={() => setOpenUpdateDialog(false)}>
        <DialogTitle>Confirm Changes</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to save these changes to the user profile? This action will update the user's
            information in the system.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenUpdateDialog(false)} disabled={saving}>
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            variant="contained"
            color="primary"
            disabled={saving}
            startIcon={saving ? <CircularProgress size={16} /> : <Save size={16} />}
          >
            Confirm & Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  )
}

export default EmployeeDetails
