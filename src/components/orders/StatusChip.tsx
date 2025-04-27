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
  let label: string

  switch (status) {
    case "approved":
      color = "success"
      icon = <CheckCircleIcon fontSize="small" />
      label = "Success"
      break
    case "rejected":
      color = "error"
      icon = <CancelIcon fontSize="small" />
      label = "Failed"
      break
    case "pending":
    default:
      color = "warning"
      icon = <PendingActionsIcon fontSize="small" />
      label = "Pending"
  }

  return <StyledChip label={label} color={color} size="small" icon={icon} />
}

export default StatusChip