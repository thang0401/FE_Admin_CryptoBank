// Define the Order type
export interface Order {
    id: number
    type: "buy" | "sell"
    status: "pending" | "approved" | "rejected"
    amount: string
    total: string
    user: string
    userId: number
    email: string
    createdAt: string
    updatedAt: string
    paymentMethod: string
    bankAccount: string | null
    walletAddress: string | null
  }
  
  // Define the Stats type
  export interface Stats {
    totalOrders: number
    pendingOrders: number
    approvedOrders: number
    rejectedOrders: number
    totalBuyVolume: string
    totalSellVolume: string
  }
  
  