"use client";

import type React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Grid,
  Typography,
  Divider,
  InputAdornment,
  IconButton,
  useTheme,
  CircularProgress,
} from "@mui/material";
import { X } from "lucide-react";
import { SelectChangeEvent } from "@mui/material";
import { NewEmployee, Employee, RoleConfig } from "src/types/employee-management/type";

interface AddEmployeeDialogProps {
  open: boolean;
  onClose: () => void;
  newEmployee: NewEmployee;
  setNewEmployee: React.Dispatch<React.SetStateAction<NewEmployee>>;
  handleAddEmployee: () => void;
  roles: RoleConfig[];
  employmentTypes: {
    id: string;
    name: string;
  }[];
  maritalStatus: {
    id: string;
    name: string;
  }[];
  employeeStatus: {
    id: string;
    name: string;
  }[];
  billingOptions: string[];
  loading: boolean; // Thêm prop để hiển thị trạng thái loading
}

const AddEmployeeDialog: React.FC<AddEmployeeDialogProps> = ({
  open,
  onClose,
  newEmployee,
  setNewEmployee,
  handleAddEmployee,
  roles,
  employmentTypes,
  maritalStatus,
  employeeStatus,
  billingOptions,
  loading,
}) => {
  const theme = useTheme();

  const handleTextFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name) {
      setNewEmployee((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSelectChange = (e: SelectChangeEvent) => {
    const { name, value } = e.target;
    if (name) {
      setNewEmployee((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name) {
      setNewEmployee((prev) => ({
        ...prev,
        [name]: value === "" ? 0 : Number(value),
      }));
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="md"
      PaperProps={{
        sx: {
          borderRadius: 2,
          boxShadow: theme.shadows[10],
        },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          pb: 1,
        }}
      >
        <Typography variant="h6" fontWeight="bold">
          Add New Employee
        </Typography>
        <IconButton onClick={onClose} size="small" disabled={loading}>
          <X size={18} />
        </IconButton>
      </DialogTitle>

      <Divider />

      <DialogContent>
        <Box sx={{ py: 1 }}>
          <Grid container spacing={3}>
            {/* Basic Information */}
            <Grid item xs={12}>
              <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 2 }}>
                Basic Information
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="First Name"
                    name="firstName"
                    value={newEmployee.firstName}
                    onChange={handleTextFieldChange}
                    required
                    disabled={loading}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Last Name"
                    name="lastName"
                    value={newEmployee.lastName}
                    onChange={handleTextFieldChange}
                    required
                    disabled={loading}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Email"
                    name="email"
                    value={newEmployee.email}
                    onChange={handleTextFieldChange}
                    required
                    disabled={loading}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Username"
                    name="username"
                    value={newEmployee.username}
                    onChange={handleTextFieldChange}
                    required
                    disabled={loading}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Password"
                    name="password"
                    type="password"
                    value={newEmployee.password}
                    onChange={handleTextFieldChange}
                    required
                    disabled={loading}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>Role</InputLabel>
                    <Select
                      name="role"
                      value={newEmployee.role}
                      label="Role"
                      onChange={handleSelectChange}
                      required
                      disabled={loading}
                    >
                      {roles.map((role) => (
                        <MenuItem key={role.id} value={role.id}>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <Box sx={{ color: role.color }}>{role.icon}</Box>
                            {role.name}
                          </Box>
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </Grid>

            {/* Job Information */}
            <Grid item xs={12}>
              <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 2, mt: 1 }}>
                Job Information
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>Employment Type</InputLabel>
                    <Select
                      name="employment_type"
                      value={newEmployee.employment_type || "Full-time"}
                      label="Employment Type"
                      onChange={handleSelectChange}
                      required
                      disabled={loading}
                    >
                      {employmentTypes.map((type) => (
                        <MenuItem key={type.id} value={type.id}>
                          {type.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>Status</InputLabel>
                    <Select
                      name="status"
                      value={newEmployee.status || "Active"}
                      label="Status"
                      onChange={handleSelectChange}
                      required
                      disabled={loading}
                    >
                      {employeeStatus.map((status) => (
                        <MenuItem key={status.id} value={status.id}>
                          {status.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Hire Date"
                    name="hire_date"
                    type="date"
                    value={newEmployee.hire_date}
                    onChange={handleTextFieldChange}
                    InputLabelProps={{ shrink: true }}
                    required
                    disabled={loading}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Termination Date"
                    name="termination_date"
                    type="date"
                    value={newEmployee.termination_date || ""}
                    onChange={handleTextFieldChange}
                    InputLabelProps={{ shrink: true }}
                    disabled={loading}
                  />
                </Grid>
              </Grid>
            </Grid>

            {/* Financial Information */}
            <Grid item xs={12}>
              <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 2, mt: 1 }}>
                Financial Information
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Base Salary"
                    name="salary"
                    type="number"
                    value={newEmployee.salary}
                    onChange={handleNumberChange}
                    InputProps={{
                      startAdornment: <InputAdornment position="start">VND</InputAdornment>,
                    }}
                    required
                    disabled={loading}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Bonus"
                    name="bonus"
                    type="number"
                    value={newEmployee.bonus}
                    onChange={handleNumberChange}
                    InputProps={{
                      startAdornment: <InputAdornment position="start">VND</InputAdornment>,
                    }}
                    disabled={loading}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>Payment Method</InputLabel>
                    <Select
                      name="billing"
                      value={newEmployee.billing}
                      label="Payment Method"
                      onChange={handleSelectChange}
                      required
                      disabled={loading}
                    >
                      {billingOptions.map((option) => (
                        <MenuItem key={option} value={option}>
                          {option}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>Marital Status</InputLabel>
                    <Select
                      name="marital_status"
                      value={newEmployee.marital_status || "cvvvgfbme6nnaun2s4lg"}
                      label="Marital Status"
                      onChange={handleSelectChange}
                      required
                      disabled={loading}
                    >
                      {maritalStatus.map((status) => (
                        <MenuItem key={status.id} value={status.id}>
                          {status.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </Grid>

            {/* Bank & Legal Information */}
            <Grid item xs={12}>
              <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 2, mt: 1 }}>
                Bank & Legal Information
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Bank Account Number"
                    name="bank_account"
                    value={newEmployee.bank_account}
                    onChange={handleTextFieldChange}
                    disabled={loading}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Bank Name"
                    name="bank_name"
                    value={newEmployee.bank_name}
                    onChange={handleTextFieldChange}
                    disabled={loading}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Insurance Number"
                    name="insurance_number"
                    value={newEmployee.insurance_number}
                    onChange={handleTextFieldChange}
                    disabled={loading}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Tax Code"
                    name="tax_code"
                    value={newEmployee.tax_code}
                    onChange={handleTextFieldChange}
                    disabled={loading}
                  />
                </Grid>
              </Grid>
            </Grid>

            {/* Emergency Contact Information */}
            <Grid item xs={12}>
              <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 2, mt: 1 }}>
                Emergency Contact Information
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Contact Name"
                    name="emergency_contact_name"
                    value={newEmployee.emergency_contact_name}
                    onChange={handleTextFieldChange}
                    disabled={loading}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Phone Number"
                    name="emergency_contact_phone"
                    value={newEmployee.emergency_contact_phone}
                    onChange={handleTextFieldChange}
                    disabled={loading}
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Box>
      </DialogContent>

      <Divider />

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose} variant="outlined" color="inherit" disabled={loading}>
          Cancel
        </Button>
        <Button
          onClick={handleAddEmployee}
          variant="contained"
          disabled={!newEmployee.firstName || !newEmployee.lastName || !newEmployee.username || !newEmployee.role || loading}
          startIcon={loading ? <CircularProgress size={18} /> : null}
        >
          Add Employee
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddEmployeeDialog;