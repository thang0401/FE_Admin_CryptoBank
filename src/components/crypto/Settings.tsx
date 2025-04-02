"use client"

import React from "react"
import { Box, IconButton, Menu, MenuItem, ListItemIcon, ListItemText } from "@mui/material"
import { Settings as SettingsIcon, Security, Notifications, Language, Logout } from "@mui/icons-material"

const Settings: React.FC = () => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  return (
    <Box>
      <IconButton
        onClick={handleClick}
        size="small"
        aria-controls={open ? "settings-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
      >
        <SettingsIcon />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        id="settings-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <MenuItem>
          <ListItemIcon>
            <Security fontSize="small" />
          </ListItemIcon>
          <ListItemText>Security Settings</ListItemText>
        </MenuItem>
        <MenuItem>
          <ListItemIcon>
            <Notifications fontSize="small" />
          </ListItemIcon>
          <ListItemText>Notification Preferences</ListItemText>
        </MenuItem>
        <MenuItem>
          <ListItemIcon>
            <Language fontSize="small" />
          </ListItemIcon>
          <ListItemText>Language & Region</ListItemText>
        </MenuItem>
        <MenuItem>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          <ListItemText>Logout</ListItemText>
        </MenuItem>
      </Menu>
    </Box>
  )
}

export default Settings

