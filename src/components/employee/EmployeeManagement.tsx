"use client";

import type React from "react";
import { useMemo, useState, useEffect } from "react";
import {
  Box,
  Card,
  Typography,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  TablePagination,
  Divider,
  useTheme,
  alpha,
  Stack,
  Container,
  InputAdornment,
  CircularProgress,
} from "@mui/material";
import {
  Users,
  UserPlus,
  UserCheck,
  Clock,
  Plus,
  Trash2,
  Search,
  HelpCircle,
  Shield,
  ClipboardList,
  Users2,
  Calculator,
  Scale,
  LineChart,
  Wallet,
  Lock,
  Plug,
  Building2,
  Code2,
  Share2,
  Megaphone,
  Download,
  RefreshCcw,
} from "lucide-react";
import AddEmployeeDialog from "./AddEmployeeDialog";
import EmployeeTable from "./EmployeeTable";
import StatCard from "./StatCard";
import { Employee, RoleConfig } from "src/types/employee-management/type";
import { useRouter } from "next/router";

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
  { name: "Marketing Manager", icon: <Megaphone size={20} />, color: "#e91e63" },
];

const EMPLOYMENT_TYPES = ["Full-time", "Part-time", "Contract"];
const MARITAL_STATUS = ["Single", "Married", "Divorced", "Widowed"];
const EMPLOYEE_STATUS = ["Active", "Terminated", "Suspended"];
const BILLING_OPTIONS = ["Auto Debit", "Cash", "Bank Transfer", "Credit Card"];

const getRoleConfig = (roleName: string): RoleConfig => {
  return ROLES.find((role) => role.name === roleName) || ROLES[0];
};

const EmployeeManagement = () => {
  const theme = useTheme();
  const router = useRouter();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedRole, setSelectedRole] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [newEmployee, setNewEmployee] = useState<Employee>({
    id: "",
    avatar: "",
    name: "",
    username: "",
    password: "",
    role: "",
    billing: "",
    status: "Active",
    employment_type: "Full-time",
    marital_status: "Single",
    hire_date: new Date().toISOString().split("T")[0],
    termination_date: null,
    salary: 0,
    bonus: 0,
    bank_account: "",
    bank_name: "",
    insurance_number: "",
    tax_code: "",
    emergency_contact_name: "",
    emergency_contact_phone: "",
  });

  // Fetch danh sách nhân viên khi component mount
  useEffect(() => {
    const fetchEmployees = async () => {
      setLoading(true);
      setError(null);

      try {
        // const response = await fetch("/api/employees", {
        //   method: "GET",
        //   headers: {
        //     "Content-Type": "application/json",
        //   },
        // });

        // if (!response.ok) {
        //   throw new Error("Failed to fetch employees");
        // }

        // const data = await response.json();
        // setEmployees(data); // Giả sử server trả về mảng nhân viên
             
              
                const mockData: Employee[] = [
                  {
                  id: "1",
                  avatar: "1",
                  name: "Galen Slixby",
                  username: "gslixby0",
                  password: "",
                  role: "Editor",
                  billing: "Auto Debit",
                  status: "Active",
                  employment_type: "Full-time",
                  marital_status: "Single",
                  hire_date: "2023-01-15",
                  termination_date: null,
                  salary: 5000000,
                  bonus: 500000,
                  bank_account: "123456789",
                  bank_name: "VietcomBank",
                  insurance_number: "INS123456",
                  tax_code: "TAX123456",
                  emergency_contact_name: "Emergency Contact",
                  emergency_contact_phone: "0987654321",
                }
                ]
        
                setEmployees(mockData);
      } catch (err) {
        // Ép kiểu err thành Error hoặc kiểm tra kiểu
        if (err instanceof Error) {
          setError(err.message || "An error occurred while fetching employees");
        } else {
          setError("An unknown error occurred while fetching employees");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(Number.parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleAddEmployee = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/employees", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newEmployee),
      });

      if (!response.ok) {
        throw new Error("Failed to add employee");
      }

      const addedEmployee = await response.json();
      setEmployees([...employees, addedEmployee]);
      setOpenDialog(false);
      setNewEmployee({
        id: "",
        avatar: "",
        name: "",
        username: "",
        password: "",
        role: "",
        billing: "",
        status: "Active",
        employment_type: "Full-time",
        marital_status: "Single",
        hire_date: new Date().toISOString().split("T")[0],
        termination_date: null,
        salary: 0,
        bonus: 0,
        bank_account: "",
        bank_name: "",
        insurance_number: "",
        tax_code: "",
        emergency_contact_name: "",
        emergency_contact_phone: "",
      });
    } catch (err) {
      // Ép kiểu err thành Error hoặc kiểm tra kiểu
      if (err instanceof Error) {
        setError(err.message || "An error occurred while adding the employee");
      } else {
        setError("An unknown error occurred while adding the employee");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSelectEmployee = (id: string, isViewDetails? : boolean) => {
    if(isViewDetails){
      router.push(`/employee-management/${id}`);
    }else{
    setSelectedEmployees((prev) =>
      prev.includes(id) ? prev.filter((employeeId) => employeeId !== id) : [...prev, id]
    );
    }
  };

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const allEmployeeIds = filteredEmployees.map((employee) => employee.id);
      setSelectedEmployees(allEmployeeIds);
    } else {
      setSelectedEmployees([]);
    }
  };

  const handleDeleteSelected = () => {
    setEmployees(employees.filter((employee) => !selectedEmployees.includes(employee.id)));
    setSelectedEmployees([]);
  };

  const handleDeleteEmployee = (id: string) => {
    setEmployees(employees.filter((employee) => employee.id !== id));
    setSelectedEmployees(selectedEmployees.filter((employeeId) => employeeId !== id));
  };

  const filteredEmployees = useMemo(() => {
    return employees.filter((employee) => {
      const matchesSearch =
        searchQuery.toLowerCase() === "" ||
        employee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        employee.username.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesRole = selectedRole === "" || employee.role.toLowerCase() === selectedRole.toLowerCase();

      const matchesStatus = selectedStatus === "" || employee.status.toLowerCase() === selectedStatus.toLowerCase();

      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [employees, searchQuery, selectedRole, selectedStatus]);

  const stats = [
    {
      title: "Total Employees",
      value: employees.length,
      change: "+29%",
      subtitle: "Total number of employees",
      icon: <Users size={20} />,
      color: theme.palette.primary.main,
      bgColor: alpha(theme.palette.primary.main, 0.1),
    },
    {
      title: "Full-time Employees",
      value: employees.filter((e) => e.employment_type === "Full-time").length,
      change: "+18%",
      subtitle: "Last week's statistics",
      icon: <UserPlus size={20} />,
      color: theme.palette.error.main,
      bgColor: alpha(theme.palette.error.main, 0.1),
    },
    {
      title: "Active Employees",
      value: employees.filter((e) => e.status === "Active").length,
      change: "-14%",
      subtitle: "Last week's statistics",
      icon: <UserCheck size={20} />,
      color: theme.palette.success.main,
      bgColor: alpha(theme.palette.success.main, 0.1),
    },
    {
      title: "New Employees",
      value: employees.filter((e) => {
        const hireDate = new Date(e.hire_date);
        const oneMonthAgo = new Date();
        oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
        return hireDate >= oneMonthAgo;
      }).length,
      change: "+42%",
      subtitle: "Last week's statistics",
      icon: <Clock size={20} />,
      color: theme.palette.warning.main,
      bgColor: alpha(theme.palette.warning.main, 0.1),
    },
  ];

  return (
    <Container maxWidth="xl">
      <Box sx={{ py: 4 }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Employee Management
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage information and status of all employees in the system
          </Typography>
        </Box>

        {loading && (
          <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
            <CircularProgress />
          </Box>
        )}

        {error && (
          <Typography color="error" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}

        <Grid container spacing={3} sx={{ mb: 4 }}>
          {stats.map((stat, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <StatCard
                title={stat.title}
                value={stat.value}
                change={stat.change}
                subtitle={stat.subtitle}
                icon={stat.icon}
                color={stat.color}
                bgColor={stat.bgColor}
              />
            </Grid>
          ))}
        </Grid>

        <Card sx={{ mb: 4, p: 2 }}>
          <Typography variant="h6" sx={{ mb: 2, px: 1 }}>
            Filters
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth size="small">
                <InputLabel>Role</InputLabel>
                <Select
                  value={selectedRole}
                  label="Role"
                  onChange={(e) => {
                    setSelectedRole(e.target.value);
                    setPage(0);
                  }}
                  disabled={loading}
                >
                  <MenuItem value="">All Roles</MenuItem>
                  {ROLES.map((role) => (
                    <MenuItem key={role.name} value={role.name}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Box sx={{ color: role.color }}>{role.icon}</Box>
                        {role.name}
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth size="small">
                <InputLabel>Status</InputLabel>
                <Select
                  value={selectedStatus}
                  label="Status"
                  onChange={(e) => {
                    setSelectedStatus(e.target.value);
                    setPage(0);
                  }}
                  disabled={loading}
                >
                  <MenuItem value="">All Statuses</MenuItem>
                  {EMPLOYEE_STATUS.map((status) => (
                    <MenuItem key={status} value={status}>
                      {status}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Card>

        <Card sx={{ mb: 4 }}>
          <Box
            sx={{
              p: 2,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 2,
            }}
          >
            <TextField
              placeholder="Search Employees"
              size="small"
              sx={{ minWidth: 240 }}
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPage(0);
              }}
              disabled={loading}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search size={18} />
                  </InputAdornment>
                ),
              }}
            />
            <Stack direction="row" spacing={1}>
              {selectedEmployees.length > 0 && (
                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<Trash2 size={18} />}
                  onClick={handleDeleteSelected}
                  disabled={loading}
                >
                  Delete ({selectedEmployees.length})
                </Button>
              )}
              <Button
                variant="outlined"
                color="primary"
                startIcon={<RefreshCcw size={18} />}
                onClick={() => {
                  setSearchQuery("");
                  setSelectedRole("");
                  setSelectedStatus("");
                }}
                disabled={loading}
              >
                Refresh
              </Button>
              <Button variant="outlined" startIcon={<Download size={18} />} disabled={loading}>
                Export to Excel
              </Button>
              <Button
                variant="contained"
                startIcon={loading ? <CircularProgress size={18} /> : <Plus size={18} />}
                onClick={() => setOpenDialog(true)}
                disabled={loading}
              >
                Add Employee
              </Button>
            </Stack>
          </Box>

          <Divider />

          <EmployeeTable
            employees={filteredEmployees}
            page={page}
            rowsPerPage={rowsPerPage}
            selectedEmployees={selectedEmployees}
            handleSelectEmployee={handleSelectEmployee}
            handleSelectAll={handleSelectAll}
            handleDeleteEmployee={handleDeleteEmployee}
            getRoleConfig={getRoleConfig}
          />

          <TablePagination
            rowsPerPageOptions={[5, 10, 25, 50]}
            component="div"
            count={filteredEmployees.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            labelRowsPerPage="Rows per page:"
            labelDisplayedRows={({ from, to, count }) => `${from}-${to} of ${count}`}
          />
        </Card>
      </Box>

      <AddEmployeeDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        newEmployee={newEmployee}
        setNewEmployee={setNewEmployee}
        handleAddEmployee={handleAddEmployee}
        roles={ROLES}
        employmentTypes={EMPLOYMENT_TYPES}
        maritalStatus={MARITAL_STATUS}
        employeeStatus={EMPLOYEE_STATUS}
        billingOptions={BILLING_OPTIONS}
        loading={loading}
      />
    </Container>
  );
};

export default EmployeeManagement;