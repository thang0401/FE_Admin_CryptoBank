import { styled } from "@mui/material/styles"
import { Paper, Button, TableContainer, Chip } from "@mui/material"

// Styled components
export const StyledCard = styled(Paper)(({ theme }) => ({
  borderRadius: "16px",
  boxShadow: "0 4px 20px 0 rgba(0,0,0,0.1)",
  padding: "24px",
}))

export const StyledButton = styled(Button)(({ theme }) => ({
  borderRadius: "12px",
  padding: "10px 20px",
  fontWeight: "bold",
  textTransform: "none",
  fontSize: "14px",
}))

export const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  borderRadius: "12px",
  boxShadow: "none",
  border: "1px solid #e0e0e0",
}))

export const StyledChip = styled(Chip)(({ theme, color }) => ({
  fontWeight: "bold",
  borderRadius: "8px",
}))

export const CryptoIcon = styled("div")(({ theme }) => ({
  width: "24px",
  height: "24px",
  borderRadius: "50%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  marginRight: "8px",
}))

