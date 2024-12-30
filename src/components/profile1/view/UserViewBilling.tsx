import { Send } from '@mui/icons-material'
import { Autocomplete, Button, IconButton, TextField } from '@mui/material'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import React from 'react'
import MuiTimeline, { TimelineProps } from '@mui/lab/Timeline'
import SearchIcon from '@mui/icons-material/Search'
import RefreshIcon from '@mui/icons-material/Refresh'
import router from 'next/router'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
export const rows = [
  {
    id: 1,
    assetType: 'SOL',
    trasactionType: 'Nạp tài sản',
    amount: '83',
    email: 'Thangnc0401@gmail.com',
    end_date: Date.now(),
    start_date: Date.now(),
    ID_number: 'xxx-xxx-xxx-123',
    status: 'Thành công'
  },
  {
    id: 2,
    trasactionType: 'Rút tài sản',
    assetType: 'LPSFC',
    amount: '66',
    email: 'Thangnc0401@gmail.com',
    end_date: Date.now(),
    start_date: Date.now(),
    status: 'Thành công'
  },
  {
    id: 3,
    trasactionType: 'Chuyển tài sản',
    assetType: 'SFC-VND',
    amount: '17',
    email: 'Thangnc0401@gmail.com',
    end_date: Date.now(),
    start_date: Date.now(),
    status: 'Thành công'
  },
  {
    id: 4,
    trasactionType: 'Chuyển tài sản',
    assetType: 'SOL',
    amount: '52',
    email: 'Thangnc0401@gmail.com',
    end_date: Date.now(),
    start_date: Date.now(),
    status: 'Thành công'
  },
  {
    id: 5,
    trasactionType: 'Nạp tài sản',
    assetType: 'LPSFC',
    amount: '16',
    email: 'Thangnc0401@gmail.com',
    end_date: Date.now(),
    start_date: Date.now(),
    status: 'Thành công'
  },
  {
    id: 6,
    trasactionType: 'Rút tài sản',
    assetType: 'SOL',
    amount: '85',
    email: 'Thangnc0401@gmail.com',
    end_date: Date.now(),
    start_date: Date.now(),
    status: 'Thành công'
  },
  {
    id: 7,
    trasactionType: 'Chuyển tài sản',
    assetType: 'SFC-VND',
    amount: '17',
    email: 'Thangnc0401@gmail.com',
    end_date: Date.now(),
    start_date: Date.now(),
    status: 'Thành công'
  },
  {
    id: 8,
    trasactionType: 'Chuyển tài sản',
    assetType: 'LPSFC',
    amount: '17',
    email: 'Thangnc0401@gmail.com',
    end_date: Date.now(),
    start_date: Date.now(),
    status: 'Thành công'
  },
  {
    id: 9,
    trasactionType: 'Nạp tài sản',
    assetType: 'SOL',
    amount: '71',
    email: 'Thangnc0401@gmail.com',
    end_date: Date.now(),
    start_date: Date.now(),
    status: 'Thành công'
  },
  {
    id: 10,
    trasactionType: 'Rút tài sản',
    assetType: 'SFC-VND',
    amount: '470',
    email: 'Thangnc0401@gmail.com',
    end_date: Date.now(),
    start_date: Date.now(),
    status: 'Thành công'
  },
  {
    id: 11,
    trasactionType: 'Nạp tài sản',
    assetType: 'SOL',
    amount: '171',
    email: 'Thangnc0401@gmail.com',
    end_date: Date.now(),
    start_date: Date.now(),
    status: 'Thành công'
  },
  {
    id: 12,
    trasactionType: 'Nạp tài sản',
    assetType: 'SFC-VND',
    amount: '42',
    email: 'Thangnc0401@gmail.com',
    end_date: Date.now(),
    start_date: Date.now(),
    status: 'Thành công'
  }
]

const UserViewBilling = () => {
  const getCommodities: string[] = ['Nạp tài sản', 'Chuyển tài sản', 'Rút tài sản']
  const getCommodityGroup: string[] =['Solana', 'Ethereum', 'bitcoin', 'SFC-VND', 'LPSFC']

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
      minWidth: 120,
      headerName: 'STT'
    }
    ,
    {
      flex: 0.1,
      field: 'trasactionType',
      minWidth: 180,
      headerName: 'Loại giao dịch'
    },
    {
      flex: 0.1,
      field: 'assetType',
      minWidth: 120,
      headerName: 'Loại tài sản'
    },
    {
      flex: 0.25,
      minWidth: 100,
      field: 'amount',
      headerName: 'Số lượng'
    },

    {
      flex: 0.15,
      minWidth: 180,
      field: 'status',
      headerName: 'Trạng thái'
    },
    {
      flex: 0.25,
      minWidth: 120,
      field: 'button',
      headerName: 'Xem chi tiết',
      renderCell: params => {
        return (
          <div className='flex justify-center'>
            <IconButton title='Xem chi tiết' onClick={handleViewDetail}>
              <Send />
            </IconButton>
          </div>
        )
      }
    }
  ]
  const handleViewDetail = () => {
    router.push('/trade-now/portfolio/personal-portfolio/detail')
  }
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
      <Card sx={{ padding: 5, height: 100 }}>
        <Grid container columnSpacing={{ xs: 1, sm: 2, md: 3 }} marginBottom={4}>
          <Grid item xs={3} marginLeft={2}>
            <Autocomplete
              options={getCommodities}
              renderInput={params => (
                <TextField {...params} label='Tìm bằng Loại Giao dịch' placeholder='Tìm bằng Loại Giao dịch' />
              )}
            />
          </Grid>
          <Grid item xs={3}>
            <Autocomplete
              options={getCommodityGroup}
              renderInput={params => (
                <TextField {...params} label='Tìm bằng loại tài sản' placeholder='Tìm bằng loại tài sản' />
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

    </Grid>
  )
}
export default UserViewBilling



