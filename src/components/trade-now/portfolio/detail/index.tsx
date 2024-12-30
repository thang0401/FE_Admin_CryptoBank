import React from 'react'
import { Grid, Card, Button, TextField, Box, Autocomplete, IconButton } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import RefreshIcon from '@mui/icons-material/Refresh'
import TableBasic from 'src/views/table/data-grid/TableBasic'
import { signal } from '@preact/signals-react'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import Send from '@mui/icons-material/Send'

// import AddPortfolio from './add-portfolio'
export const dialogTypes = signal<'add' | 'update'>('add')
const colorActive = {
  backgroundColor: '#025061'
}
export const rows = [
  {
    id: 1,
    type: 'SOL',
    logo: '/png',
    name: 'SOLANA',
    quantity: '4.3',
    unit: 'SOL'
  },
  {
    id: 2,
    type: 'ETH',
    logo: '/png',
    name: 'ETHEREUM',
    quantity: '4.3',
    unit: 'ETH'
  },
  {
    id: 3,
    type: 'BTC',
    logo: '/png',
    name: 'BITCOIN',
    quantity: '4.3',
    unit: 'BTC'
  },
  {
    id: 4,
    type: 'SFC-VND',
    logo: '/png',
    name: 'SFC-VND',
    quantity: '4.3',
    unit: 'SFC-VND'
  },
  {
    id: 5,
    type: 'LPSFC',
    logo: '/png',
    name: 'LPSFC',
    quantity: '4.3',
    unit: 'LPSFC'
  },
  {
    id: 6,
    type: 'SOL',
    logo: '/png',
    name: 'SOLANA',
    quantity: '4.3',
    unit: 'SOL'
  },
  {
    id: 7,
    type: 'SOL',
    logo: '/png',
    name: 'SOLANA',
    quantity: '4.3',
    unit: 'SOL'
  },
  {
    id: 8,
    type: 'SOL',
    logo: '/png',
    name: 'SOLANA',
    quantity: '4.3',
    unit: 'SOL'
  },
  {
    id: 9,
    type: 'SOL',
    logo: '/png',
    name: 'SOLANA',
    quantity: '4.3',
    unit: 'SOL'
  },
  {
    id: 10,
    type: 'SOL',
    logo: '/png',
    name: 'SOLANA',
    quantity: '4.3',
    unit: 'SOL'
  },
  {
    id: 11,
    type: 'SOL',
    logo: '/png',
    name: 'SOLANA',
    quantity: '4.3',
    unit: 'SOL'
  }
]

export default function PortfolioDetail() {
  //const getUser: string[] = ['Nguyễn Cao Thăng', 'Nguyễn Văn A']
  const getCommodities: string[] = ['0123456789', '0123456789']
  const getCommodityGroup: string[] = ['Nguyễn Cao Thăng', 'Thangnc0401']
  const [open, setOpen] = React.useState(false)

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }
  const columns: GridColDef[] = [
    {
      flex: 0.1,
      field: 'id',
      minWidth: 80,
      headerName: 'STT'
    },
    {
      flex: 0.25,
      maxWidth: 60,
      field: 'logo',
      headerName: 'Logo'
    },
    {
      flex: 0.25,
      maxWidth: 200,
      field: 'type',
      headerName: 'Asset Type'
    },
    {
      flex: 0.25,
      minWidth: 150,
      field: 'name',
      headerName: 'Asset Name'
    },
    {
      flex: 0.25,
      maxWidth: 150,
      field: 'quantity',
      headerName: 'Quantity'
      //   valueGetter: params => new Date(params.value)
    },
    {
      flex: 0.15,
      minWidth: 150,
      headerName: 'Unit',
      field: 'unit'
      //   valueGetter: params => new Date(params.value)
    },
    {
      flex: 0.25,
      minWidth: 80,
      field: 'button',
      headerName: 'Trade',
      renderCell: params => {
        return (
          <div className='flex justify-center'>
            <IconButton title='Xem chi tiết'>
              <Send />
            </IconButton>
          </div>
        )
      }
    }
  ]

  return (
    <Grid>
      <Grid container>
        <Grid item xs={12}>
          <Grid display={'flex'} justifyContent={'space-between'} alignItems={'center'} height={50}>

          </Grid>

          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h2 style={{ textAlign: 'center', textTransform: 'uppercase', marginLeft: 30 }}>Portfolio Name</h2>
            <Box sx={{ display: 'flex', gap: '11px' }}>
              <Grid display={'flex'} width={300} gap={2}>
                <React.Fragment>
                  <Button variant='outlined' onClick={handleClickOpen}>
                    Add Heir This Portfolio
                  </Button>
                  <Dialog
                    open={open}
                    onClose={handleClose}
                    onSubmit={(event: any) => {
                      event.preventDefault()
                      const formData = new FormData(event.currentTarget)
                      const formJson = Object.fromEntries((formData as any).entries())
                      const email = formJson.email
                      console.log(email)
                      handleClose()
                    }}
                  >
                    <DialogTitle>Add Heir ID number</DialogTitle>
                    <DialogContent>
                      <DialogContentText>You must to enter exactly ID card number of the heir</DialogContentText>
                      <TextField
                        autoFocus
                        required
                        margin='dense'
                        id='name'
                        name='email'
                        label='ID number'
                        type='email'
                        fullWidth
                        variant='standard'
                      />
                      <TextField
                        required
                        margin='dense'
                        id='name'
                        name='email'
                        label='note'
                        type='text'
                        fullWidth
                        variant='standard'
                      />
                    </DialogContent>
                    <DialogActions>
                      <Button onClick={handleClose}>Cancel</Button>
                      <Button type='submit'>Add</Button>
                    </DialogActions>
                  </Dialog>
                </React.Fragment>
              </Grid>
            </Box>
          </Box>
        </Grid>
      </Grid>
      {/* <Card sx={{ padding: 5, height: 100 }}>
        <Grid container columnSpacing={{ xs: 1, sm: 2, md: 3 }} marginBottom={4}>
          <Grid item xs={3} marginLeft={2}>
            <Autocomplete
              options={getCommodities}
              renderInput={params => (
                <TextField {...params} label='Find by Portfolio Name' placeholder='Receiver end_date number' />
              )}
            />
          </Grid>
          <Grid item xs={3}>
            <Autocomplete
              options={getCommodityGroup}
              renderInput={params => (
                <TextField {...params} label='Find Asset by ID' placeholder='Find by Portfolio ID' />
              )}
            />
          </Grid>
          <Button
            sx={{ borderRadius: 0 }}
            variant='contained'
            style={{ backgroundColor: '#0292B1', width: 56, height: 56 }}
          >
            <SearchIcon />
          </Button>
          <Button
            sx={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}
            variant='contained'
            style={{ backgroundColor: '#AEB4AB', width: 45, height: 56 }}
          >
            <RefreshIcon />
          </Button>
        </Grid>
      </Card> */}

      <Grid item xs={12} sx={{ mt: 3 }}>
        <Grid item xs={12}>
          <Card>
            {/* <CardHeader title='MY PORTFOLIOS' /> */}
            <Box sx={{ height: 500 }}>
              <DataGrid columns={columns} rows={rows.slice(0, 10)} />
            </Box>
          </Card>
        </Grid>
      </Grid>
    </Grid>
  )
}
