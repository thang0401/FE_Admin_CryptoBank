"use client"

import type React from "react"
import { Box, Card, CardContent, Typography, alpha, useTheme } from "@mui/material"

interface StatCardProps {
  title: string
  value: number
  change: string
  subtitle: string
  icon: React.ReactNode
  color: string
  bgColor: string
}

const StatCard: React.FC<StatCardProps> = ({ title, value, change, subtitle, icon, color, bgColor }) => {
  const theme = useTheme()
  const isPositive = change.startsWith("+")

  return (
    <Card
      elevation={0}
      sx={{
        height: "100%",
        borderRadius: 2,
        border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        transition: "transform 0.2s, box-shadow 0.2s",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: theme.shadows[4],
        },
      }}
    >
      <CardContent>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <Box>
            <Typography color="text.secondary" variant="body2" fontWeight="medium">
              {title}
            </Typography>
            <Box sx={{ display: "flex", alignItems: "baseline", mt: 1, mb: 0.5 }}>
              <Typography variant="h4" component="span" fontWeight="bold">
                {value.toLocaleString()}
              </Typography>
              <Typography
                color={isPositive ? "success.main" : "error.main"}
                variant="body2"
                sx={{ ml: 1, fontWeight: "medium" }}
              >
                {change}
              </Typography>
            </Box>
            <Typography color="text.secondary" variant="body2">
              {subtitle}
            </Typography>
          </Box>
          <Box
            sx={{
              p: 1.5,
              bgcolor: bgColor,
              borderRadius: "12px",
              color: color,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {icon}
          </Box>
        </Box>
      </CardContent>
    </Card>
  )
}

export default StatCard

