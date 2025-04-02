"use client"

import type React from "react"
import { useState } from "react"
import { Box, Typography, Tabs, Tab, Paper, useTheme } from "@mui/material"
import { AccountBalance, History, Security, AdminPanelSettings, Assessment, Settings } from "@mui/icons-material"

import AssetsOverview from "./AssetsOverview"
import TransactionsTab from "./TransactionsTab"

import AdminActivityLog from "./AdminActivityLog"
import ReportsStatistics from "./ReportsStatistics"
import SettingsTab from "./SettingsTab"
import type { AssetData, TransactionData, AlertData } from "src/types/asset-management/type"
import SecuritySettings from "./SecuritySettings"

// Mock data
const mockAssets: AssetData[] = [
  {
    id: 1,
    name: "USDC",
    type: "crypto",
    balance: 2500000.0,
    address: "0x1234...5678",
    transactions: 1250,
    status: "active",
    dailyLimit: 500000,
    weeklyLimit: 2000000,
    monthlyLimit: 5000000,
  },
  {
    id: 2,
    name: "VND",
    type: "fiat",
    balance: 58000000000.0,
    bankAccount: "19034857623",
    bankName: "Vietcombank",
    transactions: 950,
    status: "active",
    dailyLimit: 10000000000,
    weeklyLimit: 50000000000,
    monthlyLimit: 200000000000,
  },
  {
    id: 3,
    name: "ETH",
    type: "crypto",
    balance: 45.28,
    address: "0x9876...3456",
    transactions: 425,
    status: "active",
    dailyLimit: 10,
    weeklyLimit: 50,
    monthlyLimit: 100,
  },
]

const mockTransactions: TransactionData[] = [
  {
    id: 1,
    type: "deposit",
    asset: "USDC",
    assetType: "crypto",
    amount: 250000.0,
    user: "user123",
    timestamp: "2025-03-29T09:15:00Z",
    status: "completed",
    txHash: "0xabc...123",
  },
  {
    id: 2,
    type: "withdrawal",
    asset: "USDC",
    assetType: "crypto",
    amount: 50000.0,
    user: "user456",
    timestamp: "2025-03-29T08:20:00Z",
    status: "pending",
    txHash: "0xdef...456",
  },
  {
    id: 3,
    type: "gas_fee",
    asset: "ETH",
    assetType: "crypto",
    amount: 0.05,
    user: "system",
    timestamp: "2025-03-29T07:45:00Z",
    status: "completed",
    txHash: "0xghi...789",
  },
  {
    id: 4,
    type: "deposit",
    asset: "VND",
    assetType: "fiat",
    amount: 5000000000.0,
    user: "user789",
    timestamp: "2025-03-28T15:30:00Z",
    status: "completed",
    reference: "VCB-12345",
  },
  {
    id: 5,
    type: "withdrawal",
    asset: "VND",
    assetType: "fiat",
    amount: 2000000000.0,
    user: "user234",
    timestamp: "2025-03-28T14:10:00Z",
    status: "failed",
    reference: "VCB-67890",
  },
]

const mockAlerts: AlertData[] = [
  { id: 1, message: "ETH balance low for gas fees", severity: "warning", time: "10 minutes ago" },
  { id: 2, message: "USDC large withdrawal pending approval", severity: "info", time: "45 minutes ago" },
  {
    id: 3,
    message: "Abnormal transaction detected: Multiple large withdrawals",
    severity: "error",
    time: "2 hours ago",
  },
]

const mockAdminLogs = [
  {
    id: 1,
    admin: "admin@example.com",
    action: "Approved withdrawal",
    details: "USDC 50,000",
    timestamp: "2025-03-29T10:15:00Z",
    ip: "192.168.1.1",
  },
  {
    id: 2,
    admin: "superadmin@example.com",
    action: "Adjusted balance",
    details: "Added ETH 5.0",
    timestamp: "2025-03-29T09:30:00Z",
    ip: "192.168.1.2",
  },
  {
    id: 3,
    admin: "admin@example.com",
    action: "Changed security settings",
    details: "Updated withdrawal limits",
    timestamp: "2025-03-28T14:45:00Z",
    ip: "192.168.1.1",
  },
]

const AssetManagementPage: React.FC = () => {
  const theme = useTheme()
  const [tabValue, setTabValue] = useState<number>(0)
  const [assets, setAssets] = useState<AssetData[]>(mockAssets)
  const [transactions, setTransactions] = useState<TransactionData[]>(mockTransactions)
  const [alerts] = useState<AlertData[]>(mockAlerts)
  const [adminLogs] = useState(mockAdminLogs)

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number): void => {
    setTabValue(newValue)
  }

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Typography variant="h4" gutterBottom component="div" sx={{ fontWeight: "bold" }}>
        Asset Management
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" gutterBottom>
        Admin Dashboard
      </Typography>

      {/* Main content tabs */}
      <Paper sx={{ width: "100%", mt: 3, boxShadow: 3 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          textColor="primary"
          indicatorColor="primary"
          sx={{ borderBottom: 1, borderColor: "divider" }}
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab label="Assets Overview" icon={<AccountBalance />} iconPosition="start" />
          <Tab label="Transactions" icon={<History />} iconPosition="start" />
          <Tab label="Security" icon={<Security />} iconPosition="start" />
          <Tab label="Admin Activity" icon={<AdminPanelSettings />} iconPosition="start" />
          <Tab label="Reports & Statistics" icon={<Assessment />} iconPosition="start" />
          <Tab label="Settings" icon={<Settings />} iconPosition="start" />
        </Tabs>

        {/* Assets Tab */}
        {tabValue === 0 && (
          <AssetsOverview
            assets={assets}
            setAssets={setAssets}
            transactions={transactions}
            setTransactions={setTransactions}
            alerts={alerts}
          />
        )}

        {/* Transactions Tab */}
        {tabValue === 1 && <TransactionsTab transactions={transactions} />}

        {/* Security Tab */}
        {tabValue === 2 && <SecuritySettings />}

        {/* Admin Activity Log Tab */}
        {tabValue === 3 && <AdminActivityLog adminLogs={adminLogs} />}

        {/* Reports & Statistics Tab */}
        {tabValue === 4 && <ReportsStatistics assets={assets} transactions={transactions} />}

        {/* Settings Tab */}
        {tabValue === 5 && <SettingsTab />}
      </Paper>
    </Box>
  )
}

export default AssetManagementPage

