import type React from "react"
import { StyledChip } from "./StyledComponents"
import CheckCircleIcon from "@mui/icons-material/CheckCircle"
import CancelIcon from "@mui/icons-material/Cancel"
import PendingActionsIcon from "@mui/icons-material/PendingActions"

interface StatusChipProps {
  status: "pending" | "approved" | "rejected"
}

const StatusChip: React.FC<StatusChipProps> = ({ status }) => {
  let color: "warning" | "success" | "error"
  let icon

  switch (status) {
    case "approved":
      color = "success"
      icon = <CheckCircleIcon fontSize="small" />
      break
    case "rejected":
      color = "error"
      icon = <CancelIcon fontSize="small" />
      break
    case "pending":
    default:
      color = "warning"
      icon = <PendingActionsIcon fontSize="small" />
  }

  return <StyledChip label={status.charAt(0).toUpperCase() + status.slice(1)} color={color} size="small" icon={icon} />
}

export default StatusChip

