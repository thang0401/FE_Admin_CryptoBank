"use client"

import type React from "react"
import { useState, useEffect } from "react"
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Box,
  CircularProgress,
} from "@mui/material"

interface TwoFactorVerificationProps {
  open: boolean
  onSuccess: () => void
  onCancel: () => void
}

const TwoFactorVerification: React.FC<TwoFactorVerificationProps> = ({ open, onSuccess, onCancel }) => {
  const [otp, setOtp] = useState("")
  const [isVerifying, setIsVerifying] = useState(false)
  const [error, setError] = useState("")
  const [timeLeft, setTimeLeft] = useState(60)

  useEffect(() => {
    if (open) {
      setOtp("")
      setError("")
      setTimeLeft(60)
    }
  }, [open])

  useEffect(() => {
    if (!open || timeLeft <= 0) return

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [open, timeLeft])

  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOtp(e.target.value)
    if (error) setError("")
  }

  const handleVerify = () => {
    if (!otp) {
      setError("Please enter the verification code")
      return
    }

    setIsVerifying(true)

    // Simulate verification process
    setTimeout(() => {
      // For demo purposes, accept any 6-digit code
      if (otp.length === 6 && /^\d+$/.test(otp)) {
        setIsVerifying(false)
        onSuccess()
      } else {
        setIsVerifying(false)
        setError("Invalid verification code. Please try again.")
      }
    }, 1500)
  }

  const handleResendCode = () => {
    setTimeLeft(60)
    // Simulate resending code
    setError("")
  }

  return (
    <Dialog open={open} onClose={onCancel} maxWidth="xs" fullWidth>
      <DialogTitle>Two-Factor Authentication</DialogTitle>
      <DialogContent>
        <Box sx={{ py: 1 }}>
          <Typography variant="body1" gutterBottom>
            Please enter the verification code sent to your device.
          </Typography>

          <TextField
            label="Verification Code"
            fullWidth
            value={otp}
            onChange={handleOtpChange}
            margin="normal"
            placeholder="Enter 6-digit code"
            error={!!error}
            helperText={error}
            inputProps={{ maxLength: 6 }}
          />

          <Box sx={{ mt: 2, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Button disabled={timeLeft > 0} onClick={handleResendCode} size="small">
              Resend Code {timeLeft > 0 && `(${timeLeft}s)`}
            </Button>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel} color="inherit">
          Cancel
        </Button>
        <Button
          onClick={handleVerify}
          variant="contained"
          disabled={isVerifying}
          startIcon={isVerifying ? <CircularProgress size={20} /> : null}
        >
          {isVerifying ? "Verifying..." : "Verify"}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default TwoFactorVerification

