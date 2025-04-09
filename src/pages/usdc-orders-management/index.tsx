import { useRouter } from 'next/router'
import React, { useEffect } from 'react'
import OrdersManagementPage from 'src/components/orders/OrdersManagement'


const Index = () => {
    const router = useRouter()

    useEffect(() => {
      // Chuyển hướng đến trang đơn hàng mua theo mặc định
      router.replace("/usdc-orders-management/buy-orders")
    }, [router])
  
    // Trả về null vì trang này chỉ dùng để chuyển hướng
    return null
}

export default Index

