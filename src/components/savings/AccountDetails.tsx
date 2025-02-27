'use client'

import type React from 'react'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  TextField,
  Button,
  Paper,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  DialogContentText
} from '@mui/material'
import { styled } from '@mui/material/styles'
import { format } from 'date-fns'
import ContractUpload from './contract-upload'
import { getContract, getContractWithSigner } from '../../configs/web3'

const StyledCard = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
}))

interface SavingsAccount {
  id: string
  status: 'active' | 'pending' | 'completed'
  heirStatus: 'no_heir' | 'has_heir' | 'in_process'
  owner: { id: string; name: string; email: string; phone: string }
  term: string
  startDate: string
  endDate: string
  balance: string
  supportStaff: string
  contractUrl: string
  googleDriveUrl: string
}

const formatDate = (dateString: string) => {
  const date = isNaN(parseInt(dateString)) ? new Date(dateString) : new Date(parseInt(dateString) * 1000)
  return format(date, 'dd/MM/yyyy')
}

const mockAccounts: SavingsAccount[] = [
  {
    id: 'SAV001',
    status: 'active',
    heirStatus: 'no_heir',
    owner: { id: 'USRER001', name: 'Nguyen Van Thuan', email: 'thuannv.it@gmail.com', phone: '+8434567890' },
    term: '12 months',
    startDate: '2024-02-24',
    endDate: '2025-02-24',
    balance: '50 USDC',
    supportStaff: 'Staff01',
    contractUrl: '',
    googleDriveUrl: ''
  },
  {
    id: 'SAV002',
    status: 'pending',
    heirStatus: 'has_heir',
    owner: { id: 'USRER002', name: 'Tran Huu Luan', email: 'luantr@gmail.com', phone: '+8434567891' },
    term: '6 months',
    startDate: '2024-02-25',
    endDate: '2024-08-25',
    balance: '3 USDC',
    supportStaff: 'Staff02',
    contractUrl: '',
    googleDriveUrl: ''
  }
]

const AccountDetails: React.FC = () => {
  const router = useRouter()
  const { id } = router.query

  const [editedAccount, setEditedAccount] = useState<SavingsAccount | null>(null)
  const [isConfirmDialogOpen, setConfirmDialogOpen] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [showSnackbar, setShowSnackbar] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (!id) return
    fetchContractData(id as string)
  }, [id])

  const fetchContractData = async (savingAccountId: string) => {
    try {
      const contract = getContract()
      const data = await contract.methods.getContractDetails(savingAccountId).call()
      const account: SavingsAccount = {
        id: data.savingAccountId,
        status: data.status as 'active' | 'pending' | 'completed',
        heirStatus: data.heirStatus as 'no_heir' | 'has_heir' | 'in_process',
        owner: {
          id: data.ownerId,
          name: data.ownerName,
          email: data.email,
          phone: data.phone
        },
        term: data.term,
        startDate: data.startDate.toString(),
        endDate: data.endDate.toString(),
        balance: 'N/A',
        supportStaff: data.supportStaff,
        contractUrl: '',
        googleDriveUrl: data.ggDriveUrl
      }
      setEditedAccount(account)
    } catch (error) {
      console.error('Error fetching from contract:', error)
      const account = mockAccounts.find(acc => acc.id === savingAccountId)
      setEditedAccount(account || null)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    if (editedAccount) {
      const updatedAccount = { ...editedAccount }
      if (field.startsWith('owner.')) {
        const ownerField = field.split('.')[1]
        updatedAccount.owner = { ...updatedAccount.owner, [ownerField]: value }
      } else {
        ;(updatedAccount as any)[field] = value
      }
      setEditedAccount(updatedAccount)
      setHasChanges(true)
    }
  }

  const handleSubmit = () => {
    if (hasChanges) {
      setConfirmDialogOpen(true)
    }
  }

  const handleConfirmSubmit = async () => {
    if (!editedAccount) return

    setIsSubmitting(true)
    try {
      const contract = await getContractWithSigner()
      if (!contract.currentProvider || !window.ethereum) {
        throw new Error('MetaMask is not installed or not connected. Please install MetaMask and connect your wallet.')
      }

      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
      if (!accounts || accounts.length === 0) {
        throw new Error('No accounts found. Please unlock MetaMask and select an account.')
      }

      const startDateParts = editedAccount.startDate.split('/')
      const endDateParts = editedAccount.endDate.split('/')
      const startDate =
        startDateParts.length === 3
          ? Math.floor(new Date(`${startDateParts[2]}-${startDateParts[1]}-${startDateParts[0]}`).getTime() / 1000)
          : parseInt(editedAccount.startDate)
      const endDate =
        endDateParts.length === 3
          ? Math.floor(new Date(`${endDateParts[2]}-${endDateParts[1]}-${endDateParts[0]}`).getTime() / 1000)
          : parseInt(editedAccount.endDate)

      const input = {
        savingAccountId: editedAccount.id,
        term: editedAccount.term,
        startDate: startDate,
        endDate: endDate,
        supportStaff: editedAccount.supportStaff,
        ggDriveUrl: editedAccount.googleDriveUrl,
        ownerName: editedAccount.owner.name,
        ownerId: editedAccount.owner.id,
        email: editedAccount.owner.email,
        phone: editedAccount.owner.phone,
        status: editedAccount.status,
        heirStatus: editedAccount.heirStatus
      }

      let exists
      try {
        exists = await contract.methods.contracts(editedAccount.id).call()
      } catch (error) {
        console.error('Error checking contract existence:', error)
        exists = null
      }

      if (!exists || !exists.savingAccountId) {
        console.log("Creating new contract...")
        await contract.methods.createContract(input).send({ from: accounts[0] })
        setSuccessMessage(`Created contract ${editedAccount.id} on blockchain!`)
      } else {
        console.log("Updating contract status...")
        await contract.methods.updateStatus(editedAccount.id, editedAccount.status).send({ from: accounts[0] })
        setSuccessMessage(`Updated status for ${editedAccount.id} on blockchain!`)
      }


      const accountIndex = mockAccounts.findIndex(acc => acc.id === editedAccount.id)
      if (accountIndex !== -1) {
        mockAccounts[accountIndex] = {
          ...editedAccount,
          startDate: editedAccount.startDate,
          endDate: editedAccount.endDate
        }
      } else {
        mockAccounts.push({ ...editedAccount, startDate: editedAccount.startDate, endDate: editedAccount.endDate })
      }
    }catch (error) {
      console.error('Error submitting to contract:', error)
      const errorMessage = error instanceof Error ? error.message : String(error)
      setSuccessMessage('Failed to save changes: ' + (errorMessage || 'Unknown error'))
    }finally {
      setConfirmDialogOpen(false)
      setHasChanges(false)
      setIsSubmitting(false)
      setShowSnackbar(true)
    }
  }

  const handleUploadComplete = (localFileUrl: string, driveUrl: string) => {
    if (editedAccount) {
      handleInputChange('contractUrl', localFileUrl)
      handleInputChange('googleDriveUrl', driveUrl)
    }
  }

  const StatusChip = ({ status }: { status: string }) => {
    const getStatusColor = () => {
      switch (status) {
        case 'no_heir':
          return { bgcolor: '#fff3e0', color: '#f57c00' }
        case 'has_heir':
          return { bgcolor: '#e8f5e9', color: '#43a047' }
        case 'in_process':
          return { bgcolor: '#e3f2fd', color: '#1976d2' }
        default:
          return { bgcolor: '#f5f5f5', color: '#757575' }
      }
    }
    const { bgcolor, color } = getStatusColor()
    return <Chip label={status.replace('_', ' ').toUpperCase()} sx={{ bgcolor, color }} />
  }

  if (!editedAccount) {
    return <Typography>Account not found</Typography>
  }

  return (
    <Box sx={{ p: 3 }}>
      <StyledCard>
        <CardContent>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant='h6' gutterBottom>
                Account Details - {editedAccount.id}
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Paper sx={{ p: 2 }}>
                <Typography variant='subtitle1' gutterBottom>
                  Status
                </Typography>
                <StatusChip status={editedAccount.heirStatus} />
              </Paper>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Paper sx={{ p: 2 }}>
                <Typography variant='subtitle1' gutterBottom>
                  Current Balance
                </Typography>
                <Typography variant='h5'>{editedAccount.balance}</Typography>
              </Paper>
            </Grid>

            <Grid item xs={12}>
              <Paper sx={{ p: 2 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField fullWidth label='Account ID' value={editedAccount.id} InputProps={{ readOnly: true }} />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label='Term'
                      value={editedAccount.term}
                      onChange={e => handleInputChange('term', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label='Start Date'
                      value={formatDate(editedAccount.startDate)}
                      onChange={e => handleInputChange('startDate', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label='End Date'
                      value={formatDate(editedAccount.endDate)}
                      onChange={e => handleInputChange('endDate', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label='Support Staff'
                      value={editedAccount.supportStaff}
                      onChange={e => handleInputChange('supportStaff', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label='Google Drive URL'
                      value={editedAccount.googleDriveUrl}
                      onChange={e => handleInputChange('googleDriveUrl', e.target.value)}
                      placeholder='No URL provided'
                      InputProps={{ readOnly: true }}
                    />
                  </Grid>
                </Grid>
              </Paper>
            </Grid>

            <Grid item xs={12}>
              <Paper sx={{ p: 2 }}>
                <Typography variant='subtitle1' gutterBottom>
                  Owner Information
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label='Name'
                      value={editedAccount.owner.name}
                      InputProps={{ readOnly: true }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField fullWidth label='ID' value={editedAccount.owner.id} InputProps={{ readOnly: true }} />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label='Email'
                      value={editedAccount.owner.email}
                      InputProps={{ readOnly: true }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label='Phone'
                      value={editedAccount.owner.phone}
                      InputProps={{ readOnly: true }}
                    />
                  </Grid>
                </Grid>
              </Paper>
            </Grid>

            <Grid item xs={12}>
              <Paper sx={{ p: 2 }}>
                <Typography variant='subtitle1' gutterBottom>
                  Contract Document
                </Typography>
                <ContractUpload onUploadComplete={handleUploadComplete} />
                {editedAccount.contractUrl && (
                  <Alert severity='success'>
                    Contract uploaded successfully.
                    <Button color='inherit' size='small' href={editedAccount.contractUrl} target='_blank'>
                      View Contract
                    </Button>
                    {editedAccount.googleDriveUrl && (
                      <Button color='inherit' size='small' href={editedAccount.googleDriveUrl} target='_blank'>
                        View on Google Drive
                      </Button>
                    )}
                  </Alert>
                )}
              </Paper>
            </Grid>

            <Grid item xs={12}>
              <Box display='flex' justifyContent='flex-end' gap={2}>
                <Button variant='outlined' color='secondary' onClick={() => router.push('/savings-management')}>
                  Back
                </Button>
                <Button
                  variant='contained'
                  color='primary'
                  onClick={handleSubmit}
                  disabled={!hasChanges || isSubmitting}
                >
                  Submit Changes
                </Button>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </StyledCard>

      <Dialog open={isConfirmDialogOpen} onClose={() => setConfirmDialogOpen(false)}>
        <DialogTitle>Confirm Changes</DialogTitle>
        <DialogContent>
          <DialogContentText>Are you sure you want to save the changes to this savings account?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleConfirmSubmit} variant='contained' color='primary' disabled={isSubmitting}>
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>

      {/* {showSnackbar && (
        <Alert severity={successMessage.includes("Failed") ? "error" : "success"} onClose={() => setShowSnackbar(false)}>
          {successMessage}
        </Alert>
      )} */}
    </Box>
  )
}

export default AccountDetails
