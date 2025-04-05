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
  SelectChangeEvent,
} from "@mui/material"
import { useRouter } from "next/router" // Page Router
import { ArrowLeft, Edit, Save, Plus, X, Camera, Trash2 } from "lucide-react"
import { color } from "@mui/system"

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
  status: StatusType;
  roles: Role[]
  avatar: string
}

type StatusType = "active" | "inactive" | "suspended" | "deleted";

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
    e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }> | SelectChangeEvent<string>
  ) => {
    const { name, value } = e.target;
    if (!name || !user) return;
  
    setUser({
      ...user,
      [name]: value as StatusType, // Ép kiểu về StatusType
    });
  };

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
          {/* Left column - Avatar and basic info */}
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

          {/* Right column - Detailed information */}
          <Grid item xs={12} md={8}>
            <Card sx={{ p: 3, boxShadow: theme.shadows[5], borderRadius: 2 }}>
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
                    InputProps={{ readOnly: true}}
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
                    InputProps={{ readOnly: true}}
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
                    InputProps={{ readOnly: true}}
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
                      readOnly: true,
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
                      onChange={(e) => handleChange}
                      label="Gender"
                      inputProps={{ readOnly: true }}
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
                    onChange={handleChange} // Gắn trực tiếp handleChange
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

              {/* <Box sx={{ mt: 4, display: "flex", justifyContent: "flex-end" }}>
                {editMode && (
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => setOpenUpdateDialog(true)}
                    startIcon={<Save size={18} />}
                    disabled={saving}
                  >
                    {saving ? <CircularProgress size={24} /> : "Save Changes"}
                  </Button>
                )}
              </Box> */}
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

