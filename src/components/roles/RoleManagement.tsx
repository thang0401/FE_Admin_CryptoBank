    import { useState, useMemo } from 'react'
    import {
        Box,
        Card,
        CardContent,
        Typography,
        Button,
        TextField,
        Table,
        TableBody,
        TableCell,
        TableContainer,
        TableHead,
        TableRow,
        Paper,
        IconButton,
        Chip,
        Grid,
        Dialog,
        DialogTitle,
        DialogContent,
        DialogActions,
        TablePagination,
        FormControl,
        InputLabel,
        Select,
        MenuItem,
        Switch,
        FormControlLabel,
        Avatar
    } from '@mui/material'
    import {
        Shield,
        Megaphone,
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
        Search,
        Plus,
        Eye,
        Trash2,
        Edit,
        FileText
    } from 'lucide-react'

    // Types
    interface Permission {
        id: string;
        name: string;
        description: string;
    }

    interface RoleConfig {
        name: string;
        icon: JSX.Element;
        color: string;
    }

    interface Role {
        id: string;
        name: string;
        icon: JSX.Element | string;
        color: string;
        totalEmployees: number;
        permissions: string[];
    }

    // Role configurations
    const ROLE_CONFIGS: RoleConfig[] = [
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

    // Permissions
    const PERMISSIONS: Permission[] = [
        {
            id: 'admin_access',
            name: 'Admin access',
            description: 'Full system administration access'
        },
        {
            id: 'api_control',
            name: 'API Control',
            description: 'Manage API keys and access'
        },
        {
            id: 'content_management',
            name: 'Content management',
            description: 'Manage website content and assets'
        },
        {
            id: 'database_management',
            name: 'Database management',
            description: 'Manage database operations and backups'
        },
        {
            id: 'disputes_management',
            name: 'Disputes management',
            description: 'Handle customer disputes and resolutions'
        },
        {
            id: 'financial_management',
            name: 'Financial management',
            description: 'Manage financial transactions and reports'
        },
        {
            id: 'payroll',
            name: 'Payroll',
            description: 'Manage employee payroll and compensation'
        },
        {
            id: 'reporting',
            name: 'Reporting',
            description: 'Access and generate system reports'
        },
        {
            id: 'repository_management',
            name: 'Repository management',
            description: 'Manage code repositories and versions'
        },
        {
            id: 'user_management',
            name: 'User management',
            description: 'Manage user accounts and permissions'
        }
    ]

    const RoleManagement = () => {
        const [roles, setRoles] = useState<Role[]>(
            ROLE_CONFIGS.map((config, index) => ({
                id: (index + 1).toString(),
                name: config.name,
                icon: config.icon,
                color: config.color,
                totalEmployees: Math.floor(Math.random() * 50) + 1,
                permissions: index === 0 ? PERMISSIONS.map(p => p.id) : []
            }))
        )

        const [searchQuery, setSearchQuery] = useState('')
        const [page, setPage] = useState(0)
        const [rowsPerPage, setRowsPerPage] = useState(10)
        const [openDialog, setOpenDialog] = useState(false)
        const [editingRole, setEditingRole] = useState<Role | null>(null)
        const [selectedPermissions, setSelectedPermissions] = useState<string[]>([])
        const [newRole, setNewRole] = useState({
            name: '',
            roleType: '',
            iconUrl: ''
        })

        // Filter roles based on search
        const filteredRoles = useMemo(() => {
            return roles.filter(role =>
                role.name.toLowerCase().includes(searchQuery.toLowerCase())
            )
        }, [roles, searchQuery])

        const handleChangePage = (event: unknown, newPage: number) => {
            setPage(newPage)
        }

        const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
            setRowsPerPage(parseInt(event.target.value, 10))
            setPage(0)
        }

        const handleEditRole = (role: Role) => {
            setEditingRole(role)
            setSelectedPermissions(role.permissions)
            setNewRole({
                name: role.name,
                roleType: role.name,
                iconUrl: typeof role.icon === 'string' ? role.icon : '' // Thêm trường iconUrl
            })
            setOpenDialog(true)
        }

        const handleSaveRole = () => {
            if (editingRole) {
                // Update existing role
                setRoles(roles.map(role =>
                    role.id === editingRole.id
                        ? {
                              ...editingRole,
                              name: newRole.name,
                              icon: newRole.iconUrl || editingRole.icon,
                              permissions: selectedPermissions,
                          }
                        : role
                ))
            } else {
                // Add new role with custom icon
                const roleConfig = ROLE_CONFIGS.find(config => config.name === newRole.roleType)
                if (roleConfig) {
                    const newRoleData: Role = {
                        id: (roles.length + 1).toString(),
                        name: newRole.name || "Untitled Role",
                        icon: newRole.iconUrl || roleConfig.icon, // Use custom icon if provided
                        color: roleConfig.color,
                        totalEmployees: 0,
                        permissions: selectedPermissions,
                    }
                    setRoles(prevRoles => [...prevRoles, newRoleData])
                }
            }
            
            handleCloseDialog()
        }
       
        const handleCloseDialog = () => {
            setOpenDialog(false)
            setEditingRole(null)
            setSelectedPermissions([])
            setNewRole({
                name: '',
                roleType: '',
                iconUrl: ''
            })
        }


        const handlePermissionToggle = (permissionId: string) => {
            setSelectedPermissions(prev =>
                prev.includes(permissionId)
                    ? prev.filter(id => id !== permissionId)
                    : [...prev, permissionId]
            )
        }

        const RoleIcon = ({ icon }: { icon: JSX.Element | string }) => {
            if (typeof icon === 'string') {
                return (
                    <Avatar
                        sx={{ width: 24, height: 24 }}
                        src={icon}
                        alt="role icon"
                    />
                )
            }
            return icon
        }

        return (
            <Box sx={{ p: 4 }}>
                <Grid container spacing={3}>
                    {/* Role Stats Cards */}
                    {roles.map((role) => (
                        <Grid item xs={12} md={3} key={role.id}>
                            <Card>
                                <CardContent>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                        <Box>
                                            <Typography color="text.secondary" variant="body2">{role.name}</Typography>
                                            <Box sx={{ display: 'flex', alignItems: 'baseline', mt: 1, mb: 0.5 }}>
                                                <Typography variant="h4" component="span">{role.totalEmployees}</Typography>
                                                <Typography color="text.secondary" variant="body2" sx={{ ml: 1 }}>employees</Typography>
                                            </Box>
                                            <Typography color="text.secondary" variant="body2">
                                                {role.permissions.length} permissions
                                            </Typography>
                                        </Box>
                                        <Box sx={{ p: 1, bgcolor: `${role.color}20`, borderRadius: '50%' }}>
                                            <Box sx={{ color: role.color }}>{role.icon}</Box>
                                        </Box>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}

                    {/* Search and Controls */}
                    <Grid item xs={12}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                            <TextField
                                placeholder="Search Roles"
                                size="small"
                                sx={{ width: 240 }}
                                value={searchQuery}
                                onChange={(e) => {
                                    setSearchQuery(e.target.value)
                                    setPage(0)
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
                                    onClick={() => {
                                        setEditingRole(null)
                                        setSelectedPermissions([])
                                        setOpenDialog(true)
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
                                        <TableCell>Total Employees</TableCell>
                                        <TableCell>Permissions</TableCell>
                                        <TableCell align="right">Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {filteredRoles
                                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
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
                                                <TableCell>{role.totalEmployees}</TableCell>
                                                <TableCell>
                                                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                                                        {role.permissions.slice(0, 3).map((permId) => (
                                                            <Chip
                                                                key={permId}
                                                                label={PERMISSIONS.find(p => p.id === permId)?.name}
                                                                size="small"
                                                            />
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
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => handleEditRole(role)}
                                                    >
                                                        <Edit size={20} />
                                                    </IconButton>
                                                    <IconButton size="small">
                                                        <Eye size={20} />
                                                    </IconButton>
                                                    <IconButton size="small">
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
                                count={filteredRoles.length}
                                rowsPerPage={rowsPerPage}
                                page={page}
                                onPageChange={handleChangePage}
                                onRowsPerPageChange={handleChangeRowsPerPage}
                            />
                        </TableContainer>
                    </Grid>
                </Grid>

                {/* Add/Edit Role Dialog */}
                <Dialog
                    open={openDialog}
                    onClose={handleCloseDialog}
                    maxWidth="md"
                    fullWidth
                >
                    <DialogTitle>
                        {editingRole ? `Edit Role: ${editingRole.name}` : 'Add New Role'}
                    </DialogTitle>
                    <DialogContent>
                        <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 3 }}>
                            {!editingRole && (
                                <>
                                    <TextField
                                        label="Role Name"
                                        fullWidth
                                        value={newRole.name}
                                        onChange={(e) => setNewRole({ ...newRole, name: e.target.value })}
                                    />
                                    <TextField
                                        label="Icon URL (Lucide)"
                                        fullWidth
                                        value={newRole.iconUrl}
                                        onChange={(e) => setNewRole({ ...newRole, iconUrl: e.target.value })}
                                        helperText="Paste the data URL of a Lucide icon (e.g., data:image/svg+xml;base64,...)"
                                    />
                                    {newRole.iconUrl && (
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <Typography>Preview:</Typography>
                                            <Avatar
                                                sx={{ width: 24, height: 24 }}
                                                src={newRole.iconUrl}
                                                alt="icon preview"
                                            />
                                        </Box>
                                    )}
                                </>
                            )}

                            <Typography variant="h6" sx={{ mt: 2 }}>Permissions</Typography>
                            <Grid container spacing={2}>
                                {PERMISSIONS.map((permission) => (
                                    <Grid item xs={12} md={6} key={permission.id}>
                                        <FormControlLabel
                                            control={
                                                <Switch
                                                    checked={selectedPermissions.includes(permission.id)}
                                                    onChange={() => handlePermissionToggle(permission.id)}
                                                />
                                            }
                                            label={
                                                <Box>
                                                    <Typography variant="body1">{permission.name}</Typography>
                                                    <Typography variant="body2" color="text.secondary">
                                                        {permission.description}
                                                    </Typography>
                                                </Box>
                                            }
                                        />
                                    </Grid>
                                ))}
                            </Grid>
                        </Box>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseDialog}>
                            Cancel
                        </Button>
                        <Button onClick={handleSaveRole} variant="contained">
                            Submit
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>
        )
    }

    export default RoleManagement