export interface AssetData {
    id: number
    name: string
    type: "crypto" | "fiat"
    balance: number
    address?: string
    bankAccount?: string
    bankName?: string
    transactions: number
    status: string
    dailyLimit: number
    weeklyLimit: number
    monthlyLimit: number
  }
  
  export interface TransactionData {
    id: number
    type: string
    asset: string
    assetType: "crypto" | "fiat"
    amount: number
    user: string
    timestamp: string
    status: string
    txHash?: string
    reference?: string
    approvals?: {
      admin: string
      timestamp: string
      status: "approved" | "rejected" | "pending"
    }[]
  }
  
  export interface AlertData {
    id: number
    message: string
    severity: "warning" | "info" | "error" | "success"
    time: string
  }
  
  export interface AdminLogData {
    id: number
    admin: string
    action: string
    details: string
    timestamp: string
    ip: string
  }
  
  export interface ApprovalThreshold {
    amount: number
    requiredApprovals: number
  }
  
  export interface SecuritySettings {
    twoFactorEnabled: boolean
    passwordConfirmationRequired: boolean
    approvalThresholds: ApprovalThreshold[]
    trustedAddresses: string[]
    dailyTransactionLimit: number
  }
  
  