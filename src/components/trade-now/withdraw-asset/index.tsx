import React from 'react'
import { Grid, Card, Button, TextField, Box, Autocomplete, IconButton } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import RefreshIcon from '@mui/icons-material/Refresh'
import TableBasic from 'src/views/table/data-grid/TableBasic'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import Send from '@mui/icons-material/Send'
import router from 'next/router'

export const rows = [
  {
    id: 1,
    full_name: '12 months',
    portfolioID: 'pf0001',
    portfolio: 'portfolio1',
    email: 'Thangnc0401@gmail.com',
    end_date: Date.now(),
    start_date: Date.now(),
    ID_number: 'xxx-xxx-xxx-123',
    status: 'Active'
  },
  {
    id: 2,
    full_name: '12 months',
    portfolioID: 'pf0002',
    portfolio: 'portfolio2',
    email: 'Thangnc0401@gmail.com',
    end_date: Date.now(),
    start_date: Date.now(),
    status: 'Active'
  },
  {
    id: 3,
    full_name: '12 months',
    portfolioID: 'pf0003',
    portfolio: 'portfolio3',
    email: 'Thangnc0401@gmail.com',
    end_date: Date.now(),
    start_date: Date.now(),
    status: 'Active'
  },
  {
    id: 4,
    full_name: '12 months',
    portfolioID: 'pf0004',
    portfolio: 'portfolio4',
    email: 'Thangnc0401@gmail.com',
    end_date: Date.now(),
    start_date: Date.now(),
    status: 'Active'
  },
  {
    id: 5,
    full_name: '12 months',
    portfolioID: 'pf0005',
    portfolio: 'portfolio5',
    email: 'Thangnc0401@gmail.com',
    end_date: Date.now(),
    start_date: Date.now(),
    status: 'Active'
  },
  {
    id: 6,
    full_name: '12 months',
    portfolioID: 'pf06',
    portfolio: 'portfolio6',
    email: 'Thangnc0401@gmail.com',
    end_date: Date.now(),
    start_date: Date.now(),
    status: 'Active'
  },
  {
    id: 7,
    full_name: '12 months',
    portfolioID: 'pf00017',
    portfolio: 'portfolio7',
    email: 'Thangnc0401@gmail.com',
    end_date: Date.now(),
    start_date: Date.now(),
    status: 'Active'
  },
  {
    id: 8,
    full_name: '12 months',
    portfolioID: 'pf0008',
    portfolio: 'portfolio8',
    email: 'Thangnc0401@gmail.com',
    end_date: Date.now(),
    start_date: Date.now(),
    status: 'Active'
  },
  {
    id: 9,
    full_name: '12 months',
    portfolioID: 'pf0009',
    portfolio: 'portfolio9',
    email: 'Thangnc0401@gmail.com',
    end_date: Date.now(),
    start_date: Date.now(),
    status: 'Active'
  },
  {
    id: 10,
    full_name: '12 months',
    portfolioID: 'pf00010',
    portfolio: 'portfolio10',
    email: 'Thangnc0401@gmail.com',
    end_date: Date.now(),
    start_date: Date.now(),
    status: 'Active'
  },
  {
    id: 11,
    full_name: '12 months',
    portfolioID: 'pf00011',
    portfolio: 'portfolio11',
    email: 'Thangnc0401@gmail.com',
    end_date: Date.now(),
    start_date: Date.now(),
    status: 'Active'
  },
  {
    id: 12,
    full_name: '12 months',
    portfolioID: 'pf00012',
    portfolio: 'portfolio12',
    email: 'Thangnc0401@gmail.com',
    end_date: Date.now(),
    start_date: Date.now(),
    status: 'Active'
  }
]

export default function Withdraw() {
  //const getUser: string[] = ['Nguyễn Cao Thăng', 'Nguyễn Văn A']
  const getCommodities: string[] = ['Portfolio1', 'Portfolio2', 'Portfolio3', 'Portfolio4', 'Portfolio5']
  const getCommodityGroup: string[] = ['Pf0001', 'Pf0002', 'Pf0003', 'Pf0004', 'Pf0005']

  const columns: GridColDef[] = [
    {
      flex: 0.1,
      field: 'id',
      minWidth: 80,
      headerName: 'STT'
    },
    {
      flex: 0.25,
      minWidth: 80,
      field: 'portfolioID',
      headerName: 'Mã danh mục'
    },
    {
      flex: 0.25,
      minWidth: 200,
      field: 'portfolio',
      headerName: 'Tên danh mục'
    },
    {
      flex: 0.25,
      minWidth: 150,
      field: 'full_name',
      headerName: 'Thời hạn'
    },
    {
      flex: 0.25,
      minWidth: 150,
      field: 'start_date',
      headerName: 'Ngày bắt đầu',
      valueGetter: params => {
        const date = new Date(params.value)
        return date.toISOString().split('T')[0] // This will return 'YYYY-MM-DD'
      }
    },
    {
      flex: 0.15,
      minWidth: 150,
      headerName: 'Ngày kết thúc',
      field: 'end_date',
      valueGetter: params => {
        const date = new Date(params.value)
        return date.toISOString().split('T')[0] // This will return 'YYYY-MM-DD'
      }
    },
    {
      flex: 0.15,
      minWidth: 180,
      field: 'status',
      headerName: 'Trạng thái'
    },
    {
      flex: 0.25,
      minWidth: 80,
      field: 'button',
      headerName: 'Rút tài sản',
      renderCell: params => {
        return (
          <div className='flex justify-center' onClick={handleWithdraw}>
            <IconButton title='Withdraw'>
              <Send />
            </IconButton>
          </div>
        )
      }
    }
  ]
  const handleWithdraw = () => {
    router.push('/trade-now/withdraw-asset/add')
  }
  return (
    <Grid>
      <Grid container>
        <Grid item xs={12} marginBottom={3}>
          <Grid display={'flex'} justifyContent={'space-between'} alignItems={'center'} height={50}>
          <h2 style={{ textAlign: 'center', textTransform: 'uppercase', marginLeft: 30 }}>Rút tài sản</h2>
            {/* <Grid display={'flex'} width={300} gap={2}>
              <Grid>
                <h2>Connect to</h2>
              </Grid>
              <Grid marginTop={3}>
                <PhantomWalletButton />
              </Grid>
            </Grid> */}
          </Grid>

          {/* <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h2 style={{ textAlign: 'center', textTransform: 'uppercase', marginLeft: 30 }}>Rút tài sản</h2>
            <Box sx={{ display: 'flex', gap: '11px' }}>
              <Box sx={{ display: 'flex', gap: '11px' }}>
                <PhantomWalletButton />
              </Box>
            </Box>
          </Box> */}
        </Grid>
      </Grid>
      <Card sx={{ padding: 5, height: 100 }}>
        <Grid container columnSpacing={{ xs: 1, sm: 2, md: 3 }} marginBottom={4}>
          <Grid item xs={3} marginLeft={2}>
            <Autocomplete
              options={getCommodities}
              renderInput={params => (
                <TextField {...params} label='Tìm bằng mã danh mục' placeholder='Tìm bằng mã danh mục' />
              )}
            />
          </Grid>
          <Grid item xs={3}>
            <Autocomplete
              options={getCommodityGroup}
              renderInput={params => (
                <TextField {...params} label='Tìm bằng tên danh mục' placeholder='Tìm bằng tên danh mục' />
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
