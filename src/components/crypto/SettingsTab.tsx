"use client"

import type React from "react"
import { useState } from "react"
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardHeader,
  Grid,
  Switch,
  FormControlLabel,
  TextField,
  Button,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  type SelectChangeEvent,
  Alert,
} from "@mui/material"
import { Save, Notifications, Language, Palette } from "@mui/icons-material"

const SettingsTab: React.FC = () => {
  const [darkMode, setDarkMode] = useState(false)
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [language, setLanguage] = useState("en")
  const [timezone, setTimezone] = useState("UTC+7")
  const [dateFormat, setDateFormat] = useState("DD/MM/YYYY")
  const [currencyFormat, setCurrencyFormat] = useState("symbol")

  const handleDarkModeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDarkMode(event.target.checked)
  }

  const handleEmailNotificationsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmailNotifications(event.target.checked)
  }

  const handleLanguageChange = (event: SelectChangeEvent) => {
    setLanguage(event.target.value)
  }

  const handleTimezoneChange = (event: SelectChangeEvent) => {
    setTimezone(event.target.value)
  }

  const handleDateFormatChange = (event: SelectChangeEvent) => {
    setDateFormat(event.target.value)
  }

  const handleCurrencyFormatChange = (event: SelectChangeEvent) => {
    setCurrencyFormat(event.target.value)
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Settings
      </Typography>

      <Grid container spacing={3}>
        {/* Appearance Settings */}
        {/* <Grid item xs={12} md={6}>
          <Card>
            <CardHeader title="Appearance" avatar={<Palette color="primary" />} />
            <CardContent> 
              <Divider sx={{ my: 2 }} />
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Currency Format</InputLabel>
                <Select value={currencyFormat} label="Currency Format" onChange={handleCurrencyFormatChange}>
                  <MenuItem value="symbol">Symbol First ($1,234.56)</MenuItem>
                  <MenuItem value="code">Code First (USD 1,234.56)</MenuItem>
                  <MenuItem value="symbolAfter">Symbol After (1,234.56$)</MenuItem>
                </Select>
              </FormControl>
            </CardContent>
          </Card>
        </Grid> */}

        {/* Notification Settings */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader title="Notifications" avatar={<Notifications color="primary" />} />
            <CardContent>
              <FormControlLabel
                control={
                  <Switch checked={emailNotifications} onChange={handleEmailNotificationsChange} color="primary" />
                }
                label="Email Notifications"
              />
              <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 1, mb: 2 }}>
                Receive email alerts for important events
              </Typography>

              <TextField label="Email for Notifications" fullWidth defaultValue="admin@example.com" sx={{ mb: 2 }} />

              <Alert severity="info" sx={{ mt: 2 }}>
                Critical security alerts will always be sent regardless of notification settings.
              </Alert>
            </CardContent>
          </Card>
        </Grid>

        {/* Localization Settings */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader title="Localization" avatar={<Language color="primary" />} />
            <CardContent>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Language</InputLabel>
                <Select value={language} label="Language" onChange={handleLanguageChange}>
                  <MenuItem value="en">English</MenuItem>
                  <MenuItem value="vi">Vietnamese</MenuItem>
                  <MenuItem value="zh">Chinese</MenuItem>
                </Select>
              </FormControl>

              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Timezone</InputLabel>
                <Select value={timezone} label="Timezone" onChange={handleTimezoneChange}>
                  <MenuItem value="UTC+7">Vietnam (UTC+7)</MenuItem>
                  <MenuItem value="UTC+8">Singapore/Hong Kong (UTC+8)</MenuItem>
                  <MenuItem value="UTC+0">London (UTC+0)</MenuItem>
                  <MenuItem value="UTC-5">New York (UTC-5)</MenuItem>
                </Select>
              </FormControl>

              <FormControl fullWidth>
                <InputLabel>Date Format</InputLabel>
                <Select value={dateFormat} label="Date Format" onChange={handleDateFormatChange}>
                  <MenuItem value="DD/MM/YYYY">DD/MM/YYYY</MenuItem>
                  <MenuItem value="MM/DD/YYYY">MM/DD/YYYY</MenuItem>
                  <MenuItem value="YYYY-MM-DD">YYYY-MM-DD</MenuItem>
                </Select>
              </FormControl>
            </CardContent>
          </Card>
        </Grid>

        {/* Save Button */}
        <Grid item xs={12}>
          <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
            <Button variant="contained" color="primary" startIcon={<Save />}>
              Save Settings
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  )
}

export default SettingsTab

