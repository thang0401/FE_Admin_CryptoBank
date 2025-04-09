import Head from "next/head"
import { Box, Container, Typography } from "@mui/material"
import AdminLayout from "src/components/orders/AdminLayout"
import OrdersManagementPage from "src/components/orders/OrdersManagement"

export default function SellOrdersPage() {
    return (
        <OrdersManagementPage orderType="sell" />
    )
}
