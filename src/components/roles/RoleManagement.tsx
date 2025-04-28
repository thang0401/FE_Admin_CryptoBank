import { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import {
  Box, Card, CardContent, Typography, Button, TextField, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper, IconButton, Chip, Grid, Dialog, DialogTitle,
  DialogContent, DialogActions, TablePagination, FormControlLabel, Switch, Avatar,
} from '@mui/material';
import {
  Shield, Megaphone, ClipboardList, Users2, Search, Plus, Eye, Trash2, Edit, FileText,
} from 'lucide-react';

// Types
interface Role {
  id: string;
  name: string;
  icon: JSX.Element | string;
  color: string;
  permissions: string[];
}

interface RoleConfig {
  name: string;
  icon: JSX.Element;
  color: string;
}

// Role configurations
const ROLE_CONFIGS: RoleConfig[] = [
  { name: "ADMIN", icon: <Shield size={20} />, color: "#f44336" },
  { name: "NHANVIEN", icon: <Megaphone size={20} />, color: "#2196f3" },
  { name: "NHANVIENP2P", icon: <ClipboardList size={20} />, color: "#ff9800" },
  { name: "CUSTOMER", icon: <Users2 size={20} />, color: "#4caf50" },
];

const RoleManagement = () => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [newRole, setNewRole] = useState({ name: '', roleType: '', iconUrl: '' });
  const [totalElements, setTotalElements] = useState(0);

  // Fetch roles từ API
  const fetchRoles = async () => {
    try {
      const roleResponse = await axios.get('https://be-crypto-depot.name.vn/api/role', {
        params: { page: page + 1, size: rowsPerPage },
      });
      const roleUrlResponse = await axios.get('https://be-crypto-depot.name.vn/api/role/url', {
        params: { page: 1, size: 100 },
      });

      const rolesData = roleResponse.data.content || [];
      const roleUrlsData = roleUrlResponse.data || [];

      const mappedRoles = rolesData.map((role: any) => {
        const config = ROLE_CONFIGS.find((r) => r.name === role.name) || ROLE_CONFIGS[0];
        const permissions = roleUrlsData
          .filter((url: any) => url.roleName === role.name)
          .map((url: any) => url.functionUrl);

        return {
          id: role.id,
          name: role.name,
          icon: config.icon,
          color: config.color,
          permissions: permissions || [],
        };
      });

      setRoles(mappedRoles);
      setTotalElements(roleResponse.data.page.totalElements || 0);
    } catch (error) {
      console.error('Error fetching roles:', error);
      setRoles([]);
      setTotalElements(0);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, [page, rowsPerPage]);

  const filteredRoles = useMemo(() => {
    if (!searchQuery) return roles;
    return roles.filter((role) =>
      role.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [roles, searchQuery]);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleEditRole = (role: Role) => {
    setEditingRole(role);
    setSelectedPermissions(role.permissions);
    setNewRole({ name: role.name, roleType: role.name, iconUrl: '' });
    setOpenDialog(true);
  };

  const handleCreateRole = async () => {
    try {
      const roleConfig = ROLE_CONFIGS.find((config) => config.name === newRole.roleType);
      const payload = { name: newRole.name || 'Untitled Role', note: null };
      const response = await axios.post('https://be-crypto-depot.name.vn/api/role', payload);
      const newRoleId = response.data.id;

      await Promise.all(
        selectedPermissions.map((perm) =>
          axios.post('https://be-crypto-depot.name.vn/api/role/url', {
            roleName: newRole.name,
            functionUrl: perm,
          })
        )
      );

      const newRoleData: Role = {
        id: newRoleId,
        name: newRole.name,
        icon: newRole.iconUrl || (roleConfig?.icon ?? ROLE_CONFIGS[0].icon),
        color: roleConfig?.color ?? ROLE_CONFIGS[0].color,
        permissions: selectedPermissions,
      };
      setRoles((prevRoles) => [...prevRoles, newRoleData]);
      handleCloseDialog();
      fetchRoles();
    } catch (error) {
      console.error('Error creating role:', error);
    }
  };

  const handleUpdateRole = async () => {
    if (!editingRole) return;
    try {
      const payload = { name: newRole.name };
      await axios.put(`https://be-crypto-depot.name.vn/api/role/${editingRole.id}`, payload);

      // await axios.delete(`https://be-crypto-depot.name.vn/api/role/url/${editingRole.id}`);
      await Promise.all(
        selectedPermissions.map((perm) =>
          axios.post('https://be-crypto-depot.name.vn/api/role/url', {
            roleName: newRole.name,
            functionUrl: perm,
          })
        )
      );

      setRoles(
        roles.map((role) =>
          role.id === editingRole.id
            ? { ...editingRole, name: newRole.name, permissions: selectedPermissions }
            : role
        )
      );
      handleCloseDialog();
      fetchRoles();
    } catch (error) {
      console.error('Error updating role:', error);
    }
  };

  const handleDeleteRole = async (roleId: string) => {
    try {
      await axios.delete(`https://be-crypto-depot.name.vn/api/role/${roleId}`);
      setRoles(roles.filter((role) => role.id !== roleId));
      fetchRoles();
    } catch (error) {
      console.error('Error deleting role:', error);
    }
  };

  const handleSaveRole = () => {
    if (editingRole) {
      handleUpdateRole();
    } else {
      handleCreateRole();
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingRole(null);
    setSelectedPermissions([]);
    setNewRole({ name: '', roleType: '', iconUrl: '' });
  };

  const handlePermissionToggle = (permissionId: string) => {
    setSelectedPermissions((prev) =>
      prev.includes(permissionId) ? prev.filter((id) => id !== permissionId) : [...prev, permissionId]
    );
  };

  const RoleIcon = ({ icon }: { icon: JSX.Element | string }) => {
    if (typeof icon === 'string') {
      return <Avatar sx={{ width: 24, height: 24 }} src={icon} alt="role icon" />;
    }
    return icon;
  };

  return (
    <Box sx={{ p: 4 }}>
      <Grid container spacing={3}>
        {/* Search and Controls */}
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <TextField
              placeholder="Search Roles"
              size="small"
              sx={{ width: 240 }}
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPage(0);
              }}
              InputProps={{ startAdornment: <Search size={20} /> }}
            />
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button variant="outlined" startIcon={<FileText />}>
                Export
              </Button>
              <Button
                variant="contained"
                startIcon={<Plus />}
                onClick={() => {
                  setEditingRole(null);
                  setSelectedPermissions([]);
                  setOpenDialog(true);
                }}
              >
                Add New Role
              </Button>
            </Box>
          </Box>
        </Grid>

        {/* Roles Table */}
        <Grid item xs={12}>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Role Name</TableCell>
                  <TableCell>Permissions</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredRoles
                  .map((role) => (
                    <TableRow key={role.id}>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Box sx={{ color: role.color }}>
                            <RoleIcon icon={role.icon} />
                          </Box>
                          <Typography variant="subtitle2">{role.name}</Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                          {role.permissions.slice(0, 3).map((perm) => (
                            <Chip key={perm} label={perm} size="small" />
                          ))}
                          {role.permissions.length > 3 && (
                            <Chip
                              label={`+${role.permissions.length - 3} more`}
                              size="small"
                              variant="outlined"
                            />
                          )}
                        </Box>
                      </TableCell>
                      <TableCell align="right">
                        <IconButton size="small" onClick={() => handleEditRole(role)}>
                          <Edit size={20} />
                        </IconButton>
                        <IconButton size="small">
                          <Eye size={20} />
                        </IconButton>
                        <IconButton size="small" onClick={() => handleDeleteRole(role.id)}>
                          <Trash2 size={20} />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={totalElements}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </TableContainer>
        </Grid>
      </Grid>

      {/* Add/Edit Role Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>{editingRole ? `Edit Role: ${editingRole.name}` : 'Add New Role'}</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 3 }}>
            <TextField
              label="Role Name"
              fullWidth
              value={newRole.name}
              onChange={(e) => setNewRole({ ...newRole, name: e.target.value })}
            />
            {!editingRole && (
              <TextField
                label="Icon URL (Lucide)"
                fullWidth
                value={newRole.iconUrl}
                onChange={(e) => setNewRole({ ...newRole, iconUrl: e.target.value })}
                helperText="Paste the data URL of a Lucide icon (e.g., data:image/svg+xml;base64,...)"
              />
            )}
            {newRole.iconUrl && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography>Preview:</Typography>
                <Avatar sx={{ width: 24, height: 24 }} src={newRole.iconUrl} alt="icon preview" />
              </Box>
            )}

            <Typography variant="h6" sx={{ mt: 2 }}>Permissions</Typography>
            <Grid container spacing={2}>
              {roles.flatMap((role) =>
                role.permissions.map((perm) => (
                  <Grid item xs={12} md={6} key={perm}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={selectedPermissions.includes(perm)}
                          onChange={() => handlePermissionToggle(perm)}
                        />
                      }
                      label={
                        <Box>
                          <Typography variant="body1">{perm}</Typography>
                          <Typography variant="body2" color="text.secondary">URL Access</Typography>
                        </Box>
                      }
                    />
                  </Grid>
                ))
              )}
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSaveRole} variant="contained">
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default RoleManagement;