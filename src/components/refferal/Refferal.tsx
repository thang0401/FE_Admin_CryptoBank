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
import { useRouter } from "next/router";
import ReferralBonusTable from "./ReferralBonusTable";

interface ReferralBonus {
  id: string;
  bonusAmount: number;
  status: string;
  user: {
    id: string;
    avatar: string;
    fullname: string;
    email: string;
  };
  referralUser: {
    id: string;
    avatar: string;
    fullname: string;
    email: string;
  };
}

const ReferralBonusManagement = () => {
  const theme = useTheme();
  const router = useRouter();
  const [referralBonuses, setReferralBonuses] = useState<ReferralBonus[]>([]);
  const [selectedReferralBonuses, setSelectedReferralBonuses] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalRows, setTotalRows] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [newReferralBonus, setNewReferralBonus] = useState<ReferralBonus>({
    id: "",
    bonusAmount: 0,
    status: "",
    user: {
      id: "",
      avatar: "",
      fullname: "",
      email: ""
    },
    referralUser: {
      id: "",
      avatar: "",
      fullname: "",
      email: ""
    }
  });

  // Fetch danh sách nhân viên khi component mount
  useEffect(() => {
    const fetchReferralBonus = async () => {
      setLoading(true);
      setError(null);

      try {
        const request = new URLSearchParams({ page: (page + 1).toString(), size: rowsPerPage.toString() }).toString();
        const response = await fetch(`https://be-crypto-depot.name.vn/api/referral_bonus?${request}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch Referral Bonus");
        }

        const data: { content: any[]; page: any } = await response.json();
        const formattedReferralBonus: ReferralBonus[] = data.content.map((referralBonus: any) => ({
          id: referralBonus.id || "",
          bonusAmount: referralBonus.bonusAmount || 0,
          status: referralBonus.status || "",
          user: {
            id: referralBonus.user.id || "",
            avatar: referralBonus.user.avatar || "",
            fullname: referralBonus.user.fullName || "",
            email: referralBonus.user.email || ""
          },
          referralUser: {
            id: referralBonus.referralUser.id || "",
            avatar: referralBonus.referralUser.avatar || "",
            fullname: referralBonus.referralUser.fullName || "",
            email: referralBonus.referralUser.email || ""
          }
        }));
        setReferralBonuses(formattedReferralBonus);
        setTotalRows(data.page.totalElements);
      } catch (err) {
        // Ép kiểu err thành Error hoặc kiểm tra kiểu
        if (err instanceof Error) {
          setError(err.message || "An error occurred while fetching referral bonus");
        } else {
          setError("An unknown error occurred while fetching referral bonus");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchReferralBonus();
  }, [page, rowsPerPage]);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(Number.parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleAddReferralBonus = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("https://be-crypto-depot.name.vn/api/referral_bonus", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newReferralBonus),
      });

      if (!response.ok) {
        throw new Error("Failed to add referral bonus");
      }

      const addedReferralBonus = await response.json();
      setReferralBonuses([...referralBonuses, addedReferralBonus]);
      setOpenDialog(false);
      setNewReferralBonus({
        id: "",
        bonusAmount: 0,
        status: "",
        user: {
          id: "",
          avatar: "",
          fullname: "",
          email: ""
        },
        referralUser: {
          id: "",
          avatar: "",
          fullname: "",
          email: ""
        }
      });
    } catch (err) {
      // Ép kiểu err thành Error hoặc kiểm tra kiểu
      if (err instanceof Error) {
        setError(err.message || "An error occurred while adding the referral bonus");
      } else {
        setError("An unknown error occurred while adding the referral bonus");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSelectReferralBonus = (id: string, isViewDetails? : boolean) => {
    if(isViewDetails){
      router.push(`/employee-management/${id}`);
    }else{
    setSelectedReferralBonuses((prev) =>
      prev.includes(id) ? prev.filter((referralBonusId) => referralBonusId !== id) : [...prev, id]
    );
    }
  };

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    // if (event.target.checked) {
    //   const allReferralBonusesIds = filteredReferralBonuseses.map((referralBonus) => referralBonus.id);
    //   setSelectedReferralBonuses(allReferralBonusesIds);
    // } else {
    //   setSelectedReferralBonuses([]);
    // }
    setSelectedReferralBonuses([]);
  };

  const handleDeleteSelected = () => {
    setReferralBonuses(referralBonuses.filter((referralBonus) => !selectedReferralBonuses.includes(referralBonus.id)));
    setSelectedReferralBonuses([]);
  };

  const handleDeleteReferralBonus = (id: string) => {
    setReferralBonuses(referralBonuses.filter((referralBonus) => referralBonus.id !== id));
    setSelectedReferralBonuses(selectedReferralBonuses.filter((referralBonusId) => referralBonusId !== id));
  };

  // const filteredReferralBonuses = useMemo(() => {
  //   return referralBonuses.filter((referralBonus) => {
  //     const matchesSearch =
  //       searchQuery.toLowerCase() === "" ||
  //       employee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
  //       employee.username.toLowerCase().includes(searchQuery.toLowerCase());

  //     const matchesRole = selectedRole === "" || employee.role.toLowerCase() === selectedRole.toLowerCase();

  //     const matchesStatus = selectedStatus === "" || employee.status.toLowerCase() === selectedStatus.toLowerCase();

  //     return matchesSearch && matchesRole && matchesStatus;
  //   });
  // }, [referralBonuses, searchQuery, selectedRole, selectedStatus]);

  const stats = [
    {
      title: "Total Referral Bonus",
      value: referralBonuses.length,
      change: "+29%",
      subtitle: "Total number of referral bonuses",
      icon: <Users size={20} />,
      color: theme.palette.primary.main,
      bgColor: alpha(theme.palette.primary.main, 0.1),
    }
  ];

  return (
    <Container maxWidth="xl">
      <Box sx={{ py: 4 }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Referral Bonuses
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage information of all referral bonuses in the system
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

        {/* <Grid container spacing={3} sx={{ mb: 4 }}>
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
        </Grid> */}

        <Card sx={{ mb: 4, p: 2 }}>
          <Typography variant="h6" sx={{ mb: 2, px: 1 }}>
            Filters
          </Typography>
          <Grid container spacing={2}>
            {/* <Grid item xs={12} md={6}>
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
            </Grid> */}
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
              placeholder="Search Referral Bonus"
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
              {selectedReferralBonuses.length > 0 && (
                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<Trash2 size={18} />}
                  onClick={handleDeleteSelected}
                  disabled={loading}
                >
                  Delete ({selectedReferralBonuses.length})
                </Button>
              )}
              <Button
                variant="outlined"
                color="primary"
                startIcon={<RefreshCcw size={18} />}
                onClick={() => {
                  setSearchQuery("");
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
                Add Referral Bonus
              </Button>
            </Stack>
          </Box>

          <Divider />

          <ReferralBonusTable
            referralBonuses={referralBonuses}
            page={page}
            rowsPerPage={rowsPerPage}
            selectedReferralBonuses={selectedReferralBonuses}
            handleSelectReferralBonus={handleSelectReferralBonus}
            handleSelectAll={handleSelectAll}
            handleDeleteReferralBonus={handleDeleteReferralBonus}
            // getRoleConfig={getRoleConfig}
          />

          <TablePagination
            rowsPerPageOptions={[5, 10, 25, 50]}
            component="div"
            count={totalRows}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            labelRowsPerPage="Rows per page:"
            labelDisplayedRows={({ from, to, count }) => `${from}-${to} of ${count}`}
          />
        </Card>
      </Box>

      {/* <AddEmployeeDialog
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
      /> */}
    </Container>
  );
};

export default ReferralBonusManagement;