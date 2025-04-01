import { useEffect, useState } from "react";
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
} from "@mui/material";
import { useRouter } from "next/router"; // Page Router
import { Employee } from "src/types/employee-management/type";
import { ArrowLeft } from "lucide-react";

const EmployeeDetails = () => {
  const theme = useTheme();
  const router = useRouter();
  const { id } = router.query; // Lấy id từ query params

  const [employee, setEmployee] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch thông tin nhân viên dựa trên id
  useEffect(() => {
    const fetchEmployee = async () => {
      if (!id) return;

      setLoading(true);
      setError(null);

      try {
        // const response = await fetch(`/api/employees/${id}`, {
        //   method: "GET",
        //   headers: {
        //     "Content-Type": "application/json",
        //   },
        // });

        // if (!response.ok) {
        //   throw new Error("Failed to fetch employee details");
        // }

        // const data = await response.json();
        // setEmployee(data);

        //mock
        await new Promise((resolve) => setTimeout(resolve, 1000));

      
        const mockData: Employee = {
          id: id as string,
          avatar: "",
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
        };

        setEmployee(mockData);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message || "An error occurred while fetching employee details");
        } else {
          setError("An unknown error occurred");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchEmployee();
  }, [id]);

  if (loading) {
    return (
      <Container maxWidth="xl">
        <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error || !employee) {
    return (
      <Container maxWidth="xl">
        <Box sx={{ py: 4 }}>
          <Typography variant="h4" color="error">
            {error || "Employee not found"}
          </Typography>
          <Button
            variant="outlined"
            startIcon={<ArrowLeft size={18} />}
            onClick={() => router.push("/employees")}
            sx={{ mt: 2 }}
          >
            Back to Employee List
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl">
      <Box sx={{ py: 4 }}>
        <Box sx={{ mb: 4, display: "flex", alignItems: "center", gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<ArrowLeft size={18} />}
            onClick={() => router.push("/employee-management")}
          >
            Back
          </Button>
          <Typography variant="h4" fontWeight="bold">
            Employee Details: {employee.name}
          </Typography>
        </Box>

        <Card sx={{ p: 3, boxShadow: theme.shadows[5], borderRadius: 2 }}>
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
                      label="Full Name"
                      value={employee.name}
                      InputProps={{ readOnly: true }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Username"
                      value={employee.username}
                      InputProps={{ readOnly: true }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Role"
                      value={employee.role}
                      InputProps={{ readOnly: true }}
                    />
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
                    <TextField
                      fullWidth
                      label="Employment Type"
                      value={employee.employment_type}
                      InputProps={{ readOnly: true }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Status"
                      value={employee.status}
                      InputProps={{ readOnly: true }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Hire Date"
                      value={employee.hire_date}
                      InputProps={{ readOnly: true }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Termination Date"
                      value={employee.termination_date || "N/A"}
                      InputProps={{ readOnly: true }}
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
                      value={`${employee.salary.toLocaleString()} VND`}
                      InputProps={{ readOnly: true }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Bonus"
                      value={`${employee.bonus.toLocaleString()} VND`}
                      InputProps={{ readOnly: true }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Payment Method"
                      value={employee.billing}
                      InputProps={{ readOnly: true }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Marital Status"
                      value={employee.marital_status}
                      InputProps={{ readOnly: true }}
                    />
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
                      value={employee.bank_account || "N/A"}
                      InputProps={{ readOnly: true }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Bank Name"
                      value={employee.bank_name || "N/A"}
                      InputProps={{ readOnly: true }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Insurance Number"
                      value={employee.insurance_number || "N/A"}
                      InputProps={{ readOnly: true }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Tax Code"
                      value={employee.tax_code || "N/A"}
                      InputProps={{ readOnly: true }}
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
                      value={employee.emergency_contact_name || "N/A"}
                      InputProps={{ readOnly: true }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Phone Number"
                      value={employee.emergency_contact_phone || "N/A"}
                      InputProps={{ readOnly: true }}
                    />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Box>
        </Card>
      </Box>
    </Container>
  );
};

export default EmployeeDetails;