"use client"

import type React from "react"
import { useState } from "react"
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardHeader,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  type SelectChangeEvent,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material"
import { FileDownload, TrendingUp, TrendingDown, BarChart, PieChart, Timeline } from "@mui/icons-material"
import type { AssetData, TransactionData } from "src/types/asset-management/type"

interface ReportsStatisticsProps {
  assets: AssetData[]
  transactions: TransactionData[]
}

const ReportsStatistics: React.FC<ReportsStatisticsProps> = ({ assets, transactions }) => {
  const [timeRange, setTimeRange] = useState("7d")
  const [reportType, setReportType] = useState(0)

  const handleTimeRangeChange = (event: SelectChangeEvent) => {
    setTimeRange(event.target.value)
  }

  const handleReportTypeChange = (_event: React.SyntheticEvent, newValue: number) => {
    setReportType(newValue)
  }

  const formatCurrency = (value: number, currency: string): string => {
    if (currency === "USDC") {
      return `$${value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
    } else if (currency === "VND") {
      return `₫${value.toLocaleString("vi-VN")}`
    } else if (currency === "ETH") {
      return `${value.toLocaleString("en-US", { minimumFractionDigits: 6, maximumFractionDigits: 6 })} ETH`
    }
    return value.toString()
  }

  // Calculate total balances
  const totalCryptoBalance = assets
    .filter((asset) => asset.type === "crypto")
    .reduce((sum, asset) => {
      // Convert to USD for simplification
      if (asset.name === "USDC") return sum + asset.balance
      if (asset.name === "ETH") return sum + asset.balance * 3000 // Simplified ETH to USD conversion
      return sum
    }, 0)

  const totalFiatBalance = assets
    .filter((asset) => asset.type === "fiat")
    .reduce((sum, asset) => {
      // Convert to USD for simplification
      if (asset.name === "VND") return sum + asset.balance / 24000 // Simplified VND to USD conversion
      return sum
    }, 0)

  // Calculate transaction statistics
  const depositTransactions = transactions.filter((t) => t.type.includes("deposit"))
  const withdrawalTransactions = transactions.filter((t) => t.type.includes("withdrawal"))

  const totalDeposits = depositTransactions.reduce((sum, t) => {
    if (t.asset === "USDC") return sum + t.amount
    if (t.asset === "ETH") return sum + t.amount * 3000 // Simplified ETH to USD
    if (t.asset === "VND") return sum + t.amount / 24000 // Simplified VND to USD
    return sum
  }, 0)

  const totalWithdrawals = withdrawalTransactions.reduce((sum, t) => {
    if (t.asset === "USDC") return sum + t.amount
    if (t.asset === "ETH") return sum + t.amount * 3000 // Simplified ETH to USD
    if (t.asset === "VND") return sum + t.amount / 24000 // Simplified VND to USD
    return sum
  }, 0)

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
        <Typography variant="h6">Reports & Statistics</Typography>
        <Box sx={{ display: "flex", gap: 2 }}>
          <FormControl sx={{ minWidth: 120 }} size="small">
            <InputLabel>Time Range</InputLabel>
            <Select value={timeRange} label="Time Range" onChange={handleTimeRangeChange}>
              <MenuItem value="24h">Last 24 Hours</MenuItem>
              <MenuItem value="7d">Last 7 Days</MenuItem>
              <MenuItem value="30d">Last 30 Days</MenuItem>
              <MenuItem value="90d">Last 90 Days</MenuItem>
              <MenuItem value="1y">Last Year</MenuItem>
            </Select>
          </FormControl>
          <Button variant="contained" startIcon={<FileDownload />}>
            Export Report
          </Button>
        </Box>
      </Box>

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="subtitle2" color="text.secondary">
                Total Assets (USD)
              </Typography>
              <Typography variant="h4" sx={{ mt: 1 }}>
                ${(totalCryptoBalance + totalFiatBalance).toLocaleString("en-US", { maximumFractionDigits: 2 })}
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
                <TrendingUp color="success" fontSize="small" sx={{ mr: 0.5 }} />
                <Typography variant="body2" color="success.main">
                  +2.5%
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                  vs. previous period
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="subtitle2" color="text.secondary">
                Total Deposits (USD)
              </Typography>
              <Typography variant="h4" sx={{ mt: 1 }}>
                ${totalDeposits.toLocaleString("en-US", { maximumFractionDigits: 2 })}
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
                <TrendingUp color="success" fontSize="small" sx={{ mr: 0.5 }} />
                <Typography variant="body2" color="success.main">
                  +5.3%
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                  vs. previous period
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="subtitle2" color="text.secondary">
                Total Withdrawals (USD)
              </Typography>
              <Typography variant="h4" sx={{ mt: 1 }}>
                ${totalWithdrawals.toLocaleString("en-US", { maximumFractionDigits: 2 })}
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
                <TrendingDown color="error" fontSize="small" sx={{ mr: 0.5 }} />
                <Typography variant="body2" color="error.main">
                  -1.2%
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                  vs. previous period
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="subtitle2" color="text.secondary">
                Transaction Count
              </Typography>
              <Typography variant="h4" sx={{ mt: 1 }}>
                {transactions.length}
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
                <TrendingUp color="success" fontSize="small" sx={{ mr: 0.5 }} />
                <Typography variant="body2" color="success.main">
                  +12.7%
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                  vs. previous period
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Report Types */}
      <Paper sx={{ mb: 3 }}>
        <Tabs
          value={reportType}
          onChange={handleReportTypeChange}
          textColor="primary"
          indicatorColor="primary"
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab icon={<BarChart />} label="Asset Distribution" />
          <Tab icon={<Timeline />} label="Transaction History" />
          <Tab icon={<PieChart />} label="Asset Allocation" />
        </Tabs>

        {/* Asset Distribution Report */}
        {reportType === 0 && (
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Asset Distribution
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <strong>Asset</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Type</strong>
                    </TableCell>
                    <TableCell align="right">
                      <strong>Balance</strong>
                    </TableCell>
                    <TableCell align="right">
                      <strong>USD Equivalent</strong>
                    </TableCell>
                    <TableCell align="right">
                      <strong>% of Portfolio</strong>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {assets.map((asset) => {
                    // Calculate USD equivalent
                    let usdEquivalent = 0
                    if (asset.name === "USDC") usdEquivalent = asset.balance
                    else if (asset.name === "ETH") usdEquivalent = asset.balance * 3000
                    else if (asset.name === "VND") usdEquivalent = asset.balance / 24000

                    // Calculate percentage
                    const percentage = ((usdEquivalent / (totalCryptoBalance + totalFiatBalance)) * 100).toFixed(2)

                    return (
                      <TableRow key={asset.id}>
                        <TableCell>{asset.name}</TableCell>
                        <TableCell>{asset.type === "crypto" ? "Cryptocurrency" : "Fiat Currency"}</TableCell>
                        <TableCell align="right">{formatCurrency(asset.balance, asset.name)}</TableCell>
                        <TableCell align="right">
                          ${usdEquivalent.toLocaleString("en-US", { maximumFractionDigits: 2 })}
                        </TableCell>
                        <TableCell align="right">{percentage}%</TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </TableContainer>

            {/* Placeholder for chart */}
            <Box
              sx={{
                height: 300,
                mt: 3,
                bgcolor: "action.hover",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 1,
              }}
            >
              <Typography variant="body1" color="text.secondary">
                Asset Distribution Chart (Bar Chart)
              </Typography>
            </Box>
          </Box>
        )}

        {/* Transaction History Report */}
        {reportType === 1 && (
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Transaction History
            </Typography>

            <Grid container spacing={3} sx={{ mb: 3 }}>
              <Grid item xs={12} md={6}>
                <Card>
                  <CardHeader title="Deposits vs Withdrawals" />
                  <CardContent>
                    {/* Placeholder for chart */}
                    <Box
                      sx={{
                        height: 200,
                        bgcolor: "action.hover",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: 1,
                      }}
                    >
                      <Typography variant="body1" color="text.secondary">
                        Transaction Volume Chart (Line Chart)
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={6}>
                <Card>
                  <CardHeader title="Transaction Status Distribution" />
                  <CardContent>
                    {/* Placeholder for chart */}
                    <Box
                      sx={{
                        height: 200,
                        bgcolor: "action.hover",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: 1,
                      }}
                    >
                      <Typography variant="body1" color="text.secondary">
                        Transaction Status Chart (Pie Chart)
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            <Typography variant="subtitle1" gutterBottom>
              Recent Transactions
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <strong>Type</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Asset</strong>
                    </TableCell>
                    <TableCell align="right">
                      <strong>Amount</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Date</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Status</strong>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {transactions.slice(0, 5).map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell>{transaction.type.replace("_", " ")}</TableCell>
                      <TableCell>{transaction.asset}</TableCell>
                      <TableCell align="right">{formatCurrency(transaction.amount, transaction.asset)}</TableCell>
                      <TableCell>{new Date(transaction.timestamp).toLocaleDateString()}</TableCell>
                      <TableCell>{transaction.status}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        )}

        {/* Asset Allocation Report */}
        {reportType === 2 && (
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Asset Allocation
            </Typography>

            <Grid container spacing={3} sx={{ mb: 3 }}>
              <Grid item xs={12} md={6}>
                <Card>
                  <CardHeader title="Crypto vs Fiat Distribution" />
                  <CardContent>
                    {/* Placeholder for chart */}
                    <Box
                      sx={{
                        height: 250,
                        bgcolor: "action.hover",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: 1,
                      }}
                    >
                      <Typography variant="body1" color="text.secondary">
                        Asset Type Distribution Chart (Pie Chart)
                      </Typography>
                    </Box>

                    <Box sx={{ mt: 2 }}>
                      <Typography variant="body2">
                        <strong>Cryptocurrency:</strong> $
                        {totalCryptoBalance.toLocaleString("en-US", { maximumFractionDigits: 2 })}(
                        {((totalCryptoBalance / (totalCryptoBalance + totalFiatBalance)) * 100).toFixed(2)}%)
                      </Typography>
                      <Typography variant="body2">
                        <strong>Fiat Currency:</strong> $
                        {totalFiatBalance.toLocaleString("en-US", { maximumFractionDigits: 2 })}(
                        {((totalFiatBalance / (totalCryptoBalance + totalFiatBalance)) * 100).toFixed(2)}%)
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={6}>
                <Card>
                  <CardHeader title="Asset Growth Over Time" />
                  <CardContent>
                    {/* Placeholder for chart */}
                    <Box
                      sx={{
                        height: 250,
                        bgcolor: "action.hover",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: 1,
                      }}
                    >
                      <Typography variant="body1" color="text.secondary">
                        Asset Growth Chart (Line Chart)
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            <Typography variant="subtitle1" gutterBottom>
              Allocation Recommendations
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <strong>Asset</strong>
                    </TableCell>
                    <TableCell align="right">
                      <strong>Current Allocation</strong>
                    </TableCell>
                    <TableCell align="right">
                      <strong>Recommended Allocation</strong>
                    </TableCell>
                    <TableCell align="right">
                      <strong>Difference</strong>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {assets.map((asset) => {
                    // Calculate USD equivalent
                    let usdEquivalent = 0
                    if (asset.name === "USDC") usdEquivalent = asset.balance
                    else if (asset.name === "ETH") usdEquivalent = asset.balance * 3000
                    else if (asset.name === "VND") usdEquivalent = asset.balance / 24000

                    // Calculate current percentage
                    const currentPercentage = (usdEquivalent / (totalCryptoBalance + totalFiatBalance)) * 100

                    // Mock recommended percentages
                    const recommendedPercentage =
                      asset.name === "USDC" ? 40 : asset.name === "ETH" ? 10 : asset.name === "VND" ? 50 : 0

                    const difference = recommendedPercentage - currentPercentage

                    return (
                      <TableRow key={asset.id}>
                        <TableCell>{asset.name}</TableCell>
                        <TableCell align="right">{currentPercentage.toFixed(2)}%</TableCell>
                        <TableCell align="right">{recommendedPercentage}%</TableCell>
                        <TableCell
                          align="right"
                          sx={{
                            color: difference > 0 ? "success.main" : difference < 0 ? "error.main" : "text.primary",
                          }}
                        >
                          {difference > 0 ? "+" : ""}
                          {difference.toFixed(2)}%
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        )}
      </Paper>
    </Box>
  )
}

export default ReportsStatistics

