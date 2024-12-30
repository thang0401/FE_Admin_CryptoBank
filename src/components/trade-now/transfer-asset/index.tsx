import React from 'react'
import { Grid, Card, Button, TextField, Box, Autocomplete, IconButton } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import RefreshIcon from '@mui/icons-material/Refresh'
import SendIcon from '@mui/icons-material/Send'
import TableBasic from 'src/views/table/data-grid/TableBasic'
import InvoiceAdd from './add'
import { useRouter } from 'next/router'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import Send from '@mui/icons-material/Send'

// import { DataGrid } from '@mui/x-data-grid'

export const rows = [
  {
    id: 1,
    full_name: 'Nguyen Cao Thang',
    portfolio: 'portfolio1',
    portfolioID: 'pf0001',
    email: 'Thangnc0401@gmail.com',
    phone: '0123456789',
    ID_number: 'xxx-xxx-xxx-123',
    status: 'Active'
  },
  {
    id: 2,
    full_name: 'Nguyen Cao Thang',
    portfolioID: 'pf0002',
    portfolio: 'portfolio2',
    email: 'Thangnc0401@gmail.com',
    phone: '0123456789',
    ID_number: 'xxx-xxx-xxx-123',
    status: 'Active'
  },
  {
    id: 3,
    full_name: 'Nguyen Cao Thang',
    portfolioID: 'pf0003',
    portfolio: 'portfolio3',
    email: 'Thangnc0401@gmail.com',
    phone: '0123456789',
    ID_number: 'xxx-xxx-xxx-123',
    status: 'Active'
  },
  {
    id: 4,
    full_name: 'Nguyen Cao Thang',
    portfolioID: 'pf0004',
    portfolio: 'portfolio4',
    email: 'Thangnc0401@gmail.com',
    phone: '0123456789',
    ID_number: 'xxx-xxx-xxx-123',
    status: 'Active'
  },
  {
    id: 5,
    full_name: 'Nguyen Cao Thang',
    portfolioID: 'pf0005',
    portfolio: 'portfolio5',
    email: 'Thangnc0401@gmail.com',
    phone: '0123456789',
    ID_number: 'xxx-xxx-xxx-123',
    status: 'Active'
  },
  {
    id: 6,
    full_name: 'Nguyen Cao Thang',
    portfolioID: 'pf0006',
    portfolio: 'portfolio6',
    email: 'Thangnc0401@gmail.com',
    phone: '0123456789',
    ID_number: 'xxx-xxx-xxx-123',
    status: 'Active'
  },
  {
    id: 7,
    full_name: 'Nguyen Cao Thang',
    portfolioID: 'pf007',
    portfolio: 'portfolio7',
    email: 'Thangnc0401@gmail.com',
    phone: '0123456789',
    ID_number: 'xxx-xxx-xxx-123',
    status: 'Active'
  },
  {
    id: 8,
    full_name: 'Nguyen Cao Thang',
    portfolioID: 'pf0008',
    portfolio: 'portfolio8',
    email: 'Thangnc0401@gmail.com',
    phone: '0123456789',
    ID_number: 'xxx-xxx-xxx-123',
    status: 'Active'
  },
  {
    id: 9,
    full_name: 'Nguyen Cao Thang',
    portfolioID: 'pf0009',
    portfolio: 'portfolio9',
    email: 'Thangnc0401@gmail.com',
    phone: '0123456789',
    ID_number: 'xxx-xxx-xxx-123',
    status: 'Active'
  },
  {
    id: 10,
    full_name: 'Nguyen Cao Thang',
    portfolioID: 'pf00010',
    portfolio: 'portfolio10',
    email: 'Thangnc0401@gmail.com',
    phone: '0123456789',
    ID_number: 'xxx-xxx-xxx-123',
    status: 'Active'
  },
  {
    id: 11,
    full_name: 'Nguyen Cao Thang',
    portfolioID: 'pf00011',
    portfolio: 'portfolio11',
    email: 'Thangnc0401@gmail.com',
    phone: '0123456789',
    ID_number: 'xxx-xxx-xxx-123',
    status: 'Active'
  },
  {
    id: 12,
    full_name: 'Nguyen Cao Thang',
    portfolioID: 'pf00012',
    portfolio: 'portfolio12',
    email: 'Thangnc0401@gmail.com',
    phone: '0123456789',
    ID_number: 'xxx-xxx-xxx-123',
    status: 'Active'
  }
]

const Transfer = () => {
  const getCommodities: string[] = ['Portfolio1', 'Portfolio2', 'Portfolio3', 'Portfolio4', 'Portfolio5']
  const getCommodityGroup: string[] = ['Pf0001', 'Pf0002', 'Pf0003', 'Pf0004', 'Pf0005']
  const router = useRouter()
  const handleTransferClick = () => {
    router.push('/trade-now/transfer-asset/add/')
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
      minWidth: 200,
      field: 'full_name',
      headerName: 'Owner Name'
    },
    {
      flex: 0.25,
      minWidth: 80,
      field: 'portfolioID',
      headerName: 'Portfolio ID'
    },
    {
      flex: 0.25,
      minWidth: 150,
      field: 'portfolio',
      headerName: 'Portfolio Name'
    },
    {
      flex: 0.25,
      minWidth: 150,
      field: 'email',
      headerName: 'Gmail Address'
    },
    {
      flex: 0.15,
      minWidth: 150,
      headerName: 'Phone Number',
      field: 'phone'
      // valueGetter: params => new Date(params.value)
    },
    {
      flex: 0.15,
      minWidth: 180,
      field: 'ID_number',
      headerName: 'ID number'
    },
    {
      flex: 0.1,
      field: 'status',
      minWidth: 110,
      headerName: 'status'
    },
    {
      flex: 0.25,
      minWidth: 80,
      field: 'button',
      headerName: 'Transfer now',
      renderCell: params => {
        return (
          <div className='flex justify-center'>
            <IconButton title='Transfer Now' onClick={handleTransferClick}>
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
          <Grid display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
          <h2 style={{ textAlign: 'center', textTransform: 'uppercase', marginLeft: 30 }}>Chuyền tài sản giữa các danh mục trong hệ thống</h2>

            {/* <button onClick={handleTransferClick}> transfer </button> */}
          </Grid>
          {/* <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h2 style={{ textAlign: 'center', textTransform: 'uppercase', marginLeft: 30 }}>Chuyền tài sản giữa các danh mục trong hệ thống</h2>
            <Box sx={{ display: 'flex', gap: '11px' }}>
              <Box sx={{ display: 'flex', gap: '11px' }}></Box>
            </Box>
          </Box> */}
        </Grid>
      </Grid>
      <Card sx={{ padding: 5, height: 100 }}>
        <Grid container justifyItems={'right'} columnSpacing={{ xs: 1, sm: 2, md: 3 }} marginBottom={4}>
          <Grid item xs={3} marginLeft={2}>
            <Autocomplete
              options={getCommodities}
              renderInput={params => (
                <TextField {...params} label='Received portfolio name' placeholder='Received portfolio name' />
              )}
            />
          </Grid>
          <Grid item xs={3}>
            <Autocomplete
              options={getCommodityGroup}
              renderInput={params => (
                <TextField {...params} label='Received portfolio ID' placeholder='Received portfolio ID' />
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
      </Card>

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

export default Transfer
