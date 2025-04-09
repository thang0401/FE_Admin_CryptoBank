import { Box, Container, Typography } from '@mui/material'
import Head from 'next/head'
import React from 'react'
import AdminLayout from 'src/components/orders/AdminLayout'
import OrdersManagementPage from 'src/components/orders/OrdersManagement'

const BuyOrdersPage = () => {
  return (
   
        <OrdersManagementPage orderType="buy" />
  
  )
}

export default BuyOrdersPage