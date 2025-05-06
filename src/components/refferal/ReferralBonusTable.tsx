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


interface ReferralBonusTableProps {
  referralBonuses: ReferralBonus[]
  page: number
  rowsPerPage: number
  selectedReferralBonuses: string[]
  handleSelectReferralBonus: (id: string, isViewDetails?: boolean) => void;
  handleSelectAll: (event: React.ChangeEvent<HTMLInputElement>) => void
  handleDeleteReferralBonus: (id: string) => void
}

const ReferralBonusTable: React.FC<ReferralBonusTableProps> = ({
  referralBonuses,
  page,
  rowsPerPage,
  selectedReferralBonuses,
  handleSelectReferralBonus,
  handleSelectAll,
  handleDeleteReferralBonus,
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

  const formatDate = (dateString: string) => {
    if (!dateString) return ""
    const date = new Date(dateString)
    return date.toLocaleDateString("vi-VN")
  }
  
  const displayedReferralBonuses = referralBonuses.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)

  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell padding="checkbox">
              <Checkbox
                indeterminate={selectedReferralBonuses.length > 0 && selectedReferralBonuses.length < referralBonuses.length}
                checked={referralBonuses.length > 0 && selectedReferralBonuses.length === referralBonuses.length}
                onChange={handleSelectAll}
              />
            </TableCell>
            <TableCell>ID</TableCell>
            <TableCell>User</TableCell>
            <TableCell>Referral User</TableCell>
            <TableCell>Bonus</TableCell>
            <TableCell>Status</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {displayedReferralBonuses.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} align="center" sx={{ py: 3 }}>
                <Typography variant="body1" color="text.secondary">
                  No referral bonus found
                </Typography>
              </TableCell>
            </TableRow>
          ) : (
            displayedReferralBonuses.map((referralBonus) => (
              <TableRow
                key={referralBonus.id}
                selected={selectedReferralBonuses.includes(referralBonus.id)}
                sx={{
                  "&:hover": {
                    backgroundColor: theme.palette.action.hover,
                  },
                  transition: "background-color 0.2s",
                }}
              >
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selectedReferralBonuses.includes(referralBonus.id)}
                    onChange={() => handleSelectReferralBonus(referralBonus.id)}
                  />
                </TableCell>
                <TableCell>{referralBonus.id}</TableCell>
                <TableCell>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    {referralBonus.user.avatar ? (
                      <Avatar src={referralBonus.user.avatar} />
                    ) : (
                      <Avatar sx={{ bgcolor: theme.palette.primary.main }}>{referralBonus.user.fullname.charAt(0)}</Avatar>
                    )}
                    <Box>
                      <Typography variant="subtitle2" fontWeight="medium">
                        {referralBonus.user.fullname}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {referralBonus.user.email}
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    {referralBonus.referralUser.avatar ? (
                      <Avatar src={referralBonus.referralUser.avatar} />
                    ) : (
                      <Avatar sx={{ bgcolor: theme.palette.primary.main }}>{referralBonus.referralUser.fullname.charAt(0)}</Avatar>
                    )}
                    <Box>
                      <Typography variant="body2" fontWeight="medium">
                        {referralBonus.referralUser.fullname}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {referralBonus.referralUser.email}
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>{referralBonus.bonusAmount}</TableCell>
                <TableCell>
                  <Chip
                    label={referralBonus.status}
                    color={getStatusColor(referralBonus.status) as any}
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
                        onClick={() => handleSelectReferralBonus(referralBonus.id, true)}
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
                        onClick={() => handleDeleteReferralBonus(referralBonus.id)}
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

export default ReferralBonusTable