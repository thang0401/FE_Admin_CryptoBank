// "use client"

// import type React from "react"
// import { useState } from "react"
// import {
//   Box,
//   Typography,
//   TableContainer,
//   Table,
//   TableHead,
//   TableRow,
//   TableCell,
//   TableBody,
//   Chip,
//   IconButton,
//   Tooltip,
//   TextField,
//   InputAdornment,
//   Tabs,
//   Tab,
//   Button,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Grid,
//   useTheme,
// } from "@mui/material"
// import { Search, ArrowUpward, ArrowDownward, FilterList, Info } from "@mui/icons-material"
// import type { TransactionData } from "src/types/asset-management/type"

// interface TransactionsTabProps {
//   transactions: TransactionData[]
// }

// const TransactionsTab: React.FC<TransactionsTabProps> = ({ transactions }) => {
//   const theme = useTheme()
//   const [searchTerm, setSearchTerm] = useState("")
//   const [transactionTypeTab, setTransactionTypeTab] = useState(0)
//   const [selectedTransaction, setSelectedTransaction] = useState<TransactionData | null>(null)
//   const [detailsDialogOpen, setDetailsDialogOpen] = useState(false)

//   const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
//     setTransactionTypeTab(newValue)
//   }

//   const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     setSearchTerm(event.target.value)
//   }

//   const handleTransactionClick = (transaction: TransactionData) => {
//     setSelectedTransaction(transaction)
//     setDetailsDialogOpen(true)
//   }

//   const handleCloseDetailsDialog = () => {
//     setDetailsDialogOpen(false)
//   }

//   const formatCurrency = (value: number, currency: string): string => {
//     if (currency === "USDC") {
//       return `$${value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
//     } else if (currency === "VND") {
//       return `₫${value.toLocaleString("vi-VN")}`
//     } else if (currency === "ETH") {
//       return `${value.toLocaleString("en-US", { minimumFractionDigits: 6, maximumFractionDigits: 6 })} ETH`
//     }
//     return value.toString()
//   }

//   const getStatusColor = (
//     status: string,
//   ): "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning" => {
//     switch (status) {
//       case "completed":
//         return "success"
//       case "pending":
//         return "warning"
//       case "failed":
//         return "error"
//       default:
//         return "default"
//     }
//   }

//   const chipBackgroundColors = {
//     deposit: theme.palette.mode === "dark" ? "#0d3b2c" : "#e8f5e9",
//     withdrawal: theme.palette.mode === "dark" ? "#542233" : "#fbe9e7",
//     gas: theme.palette.mode === "dark" ? "#0f3057" : "#e3f2fd",
//     adjustment: theme.palette.mode === "dark" ? "#493657" : "#f3e5f5",
//   }

//   const filteredTransactions = transactions
//     .filter((transaction) => {
//       // Filter by transaction type tab
//       if (transactionTypeTab === 1) return transaction.assetType === "fiat"
//       if (transactionTypeTab === 2) return transaction.assetType === "crypto"
//       return true
//     })
//     .filter((transaction) => {
//       // Filter by search term
//       if (!searchTerm) return true
//       const searchLower = searchTerm.toLowerCase()
//       return (
//         transaction.asset.toLowerCase().includes(searchLower) ||
//         transaction.user.toLowerCase().includes(searchLower) ||
//         transaction.type.toLowerCase().includes(searchLower) ||
//         (transaction.txHash && transaction.txHash.toLowerCase().includes(searchLower)) ||
//         (transaction.reference && transaction.reference.toLowerCase().includes(searchLower))
//       )
//     })

//   return (
//     <Box sx={{ p: 3 }}>
//       <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
//         <Typography variant="h6">Transactions</Typography>
//         <Box sx={{ display: "flex", gap: 2 }}>
//           <TextField
//             placeholder="Search transactions"
//             size="small"
//             value={searchTerm}
//             onChange={handleSearchChange}
//             InputProps={{
//               startAdornment: (
//                 <InputAdornment position="start">
//                   <Search />
//                 </InputAdornment>
//               ),
//             }}
//             sx={{ width: 250 }}
//           />
//           <Button variant="outlined" startIcon={<FilterList />}>
//             Filters
//           </Button>
//         </Box>
//       </Box>

//       {/* Transaction Type Tabs */}
//       <Tabs
//         value={transactionTypeTab}
//         onChange={handleTabChange}
//         textColor="primary"
//         indicatorColor="primary"
//         sx={{ mb: 2 }}
//       >
//         <Tab label="All Transactions" />
//         <Tab label="Fiat Transactions" />
//         <Tab label="Crypto Transactions" />
//       </Tabs>

//       <TableContainer>
//         <Table sx={{ minWidth: 650 }}>
//           <TableHead>
//             <TableRow>
//               <TableCell>
//                 <strong>Type</strong>
//               </TableCell>
//               <TableCell>
//                 <strong>Asset</strong>
//               </TableCell>
//               <TableCell align="right">
//                 <strong>Amount</strong>
//               </TableCell>
//               <TableCell>
//                 <strong>User</strong>
//               </TableCell>
//               <TableCell>
//                 <strong>Date & Time</strong>
//               </TableCell>
//               <TableCell>
//                 <strong>Status</strong>
//               </TableCell>
//               <TableCell>
//                 <strong>Reference / Hash</strong>
//               </TableCell>
//               <TableCell>
//                 <strong>Actions</strong>
//               </TableCell>
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {filteredTransactions.map((transaction) => (
//               <TableRow
//                 key={transaction.id}
//                 sx={{
//                   "&:last-child td, &:last-child th": { border: 0 },
//                   cursor: "pointer",
//                   "&:hover": { backgroundColor: theme.palette.action.hover },
//                 }}
//                 onClick={() => handleTransactionClick(transaction)}
//               >
//                 <TableCell>
//                   <Chip
//                     icon={transaction.type.includes("withdrawal") ? <ArrowUpward /> : <ArrowDownward />}
//                     label={transaction.type.replace("_", " ")}
//                     size="small"
//                     sx={{
//                       backgroundColor: transaction.type.includes("deposit")
//                         ? chipBackgroundColors.deposit
//                         : transaction.type.includes("withdrawal")
//                           ? chipBackgroundColors.withdrawal
//                           : transaction.type.includes("gas")
//                             ? chipBackgroundColors.gas
//                             : chipBackgroundColors.adjustment,
//                       textTransform: "capitalize",
//                     }}
//                   />
//                 </TableCell>
//                 <TableCell>
//                   <Box sx={{ display: "flex", flexDirection: "column" }}>
//                     <Typography variant="body2">{transaction.asset}</Typography>
//                     <Typography variant="caption" color="text.secondary">
//                       {transaction.assetType === "crypto" ? "Cryptocurrency" : "Fiat Currency"}
//                     </Typography>
//                   </Box>
//                 </TableCell>
//                 <TableCell align="right">
//                   <Typography
//                     variant="body2"
//                     sx={{
//                       color:
//                         transaction.type.includes("withdrawal") ||
//                         transaction.type.includes("gas") ||
//                         transaction.type.includes("remove")
//                           ? "#d32f2f"
//                           : "#2e7d32",
//                     }}
//                   >
//                     {transaction.type.includes("withdrawal") ||
//                     transaction.type.includes("gas") ||
//                     transaction.type.includes("remove")
//                       ? "-"
//                       : "+"}
//                     {formatCurrency(transaction.amount, transaction.asset)}
//                   </Typography>
//                 </TableCell>
//                 <TableCell>{transaction.user}</TableCell>
//                 <TableCell>{new Date(transaction.timestamp).toLocaleString()}</TableCell>
//                 <TableCell>
//                   <Chip label={transaction.status} size="small" color={getStatusColor(transaction.status)} />
//                 </TableCell>
//                 <TableCell>
//                   <Typography variant="body2" sx={{ fontSize: "0.875rem" }}>
//                     {transaction.txHash || transaction.reference || "N/A"}
//                   </Typography>
//                 </TableCell>
//                 <TableCell>
//                   <Tooltip title="View details">
//                     <IconButton
//                       size="small"
//                       onClick={(e) => {
//                         e.stopPropagation()
//                         handleTransactionClick(transaction)
//                       }}
//                     >
//                       <Info />
//                     </IconButton>
//                   </Tooltip>
//                 </TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </TableContainer>

//       {/* Transaction Details Dialog */}
//       <Dialog open={detailsDialogOpen} onClose={handleCloseDetailsDialog} maxWidth="md" fullWidth>
//         <DialogTitle>Transaction Details</DialogTitle>
//         <DialogContent>
//           {selectedTransaction && (
//             <Grid container spacing={2} sx={{ mt: 1 }}>
//               <Grid item xs={12} sm={6}>
//                 <Typography variant="subtitle2">Transaction Type</Typography>
//                 <Typography variant="body1" sx={{ mb: 2 }}>
//                   {selectedTransaction.type.replace("_", " ")}
//                 </Typography>
//               </Grid>
//               <Grid item xs={12} sm={6}>
//                 <Typography variant="subtitle2">Asset</Typography>
//                 <Typography variant="body1" sx={{ mb: 2 }}>
//                   {selectedTransaction.asset} ({selectedTransaction.assetType})
//                 </Typography>
//               </Grid>
//               <Grid item xs={12} sm={6}>
//                 <Typography variant="subtitle2">Amount</Typography>
//                 <Typography variant="body1" sx={{ mb: 2 }}>
//                   {formatCurrency(selectedTransaction.amount, selectedTransaction.asset)}
//                 </Typography>
//               </Grid>
//               <Grid item xs={12} sm={6}>
//                 <Typography variant="subtitle2">Status</Typography>
//                 <Chip
//                   label={selectedTransaction.status}
//                   size="small"
//                   color={getStatusColor(selectedTransaction.status)}
//                   sx={{ mb: 2 }}
//                 />
//               </Grid>
//               <Grid item xs={12} sm={6}>
//                 <Typography variant="subtitle2">User</Typography>
//                 <Typography variant="body1" sx={{ mb: 2 }}>
//                   {selectedTransaction.user}
//                 </Typography>
//               </Grid>
//               <Grid item xs={12} sm={6}>
//                 <Typography variant="subtitle2">Date & Time</Typography>
//                 <Typography variant="body1" sx={{ mb: 2 }}>
//                   {new Date(selectedTransaction.timestamp).toLocaleString()}
//                 </Typography>
//               </Grid>
//               <Grid item xs={12}>
//                 <Typography variant="subtitle2">
//                   {selectedTransaction.assetType === "crypto" ? "Transaction Hash" : "Reference"}
//                 </Typography>
//                 <Typography variant="body1" sx={{ mb: 2, wordBreak: "break-all" }}>
//                   {selectedTransaction.txHash || selectedTransaction.reference || "N/A"}
//                 </Typography>
//               </Grid>

//               {selectedTransaction.approvals && (
//                 <Grid item xs={12}>
//                   <Typography variant="subtitle2" sx={{ mt: 2 }}>
//                     Approvals
//                   </Typography>
//                   <Table size="small">
//                     <TableHead>
//                       <TableRow>
//                         <TableCell>Admin</TableCell>
//                         <TableCell>Status</TableCell>
//                         <TableCell>Timestamp</TableCell>
//                       </TableRow>
//                     </TableHead>
//                     <TableBody>
//                       {selectedTransaction.approvals.map((approval, index) => (
//                         <TableRow key={index}>
//                           <TableCell>{approval.admin}</TableCell>
//                           <TableCell>
//                             <Chip label={approval.status} size="small" color={getStatusColor(approval.status)} />
//                           </TableCell>
//                           <TableCell>{new Date(approval.timestamp).toLocaleString()}</TableCell>
//                         </TableRow>
//                       ))}
//                     </TableBody>
//                   </Table>
//                 </Grid>
//               )}
//             </Grid>
//           )}
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={handleCloseDetailsDialog}>Close</Button>
//         </DialogActions>
//       </Dialog>
//     </Box>
//   )
// }

// export default TransactionsTab

