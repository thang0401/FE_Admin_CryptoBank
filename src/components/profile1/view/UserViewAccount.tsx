// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
// import Avatar from '@mui/material/Avatar'
// import Tooltip from '@mui/material/Tooltip'
import { styled } from '@mui/material/styles'
// import TimelineDot from '@mui/lab/TimelineDot'
// import TimelineItem from '@mui/lab/TimelineItem'
// import CardHeader from '@mui/material/CardHeader'
// import Typography from '@mui/material/Typography'
// import AvatarGroup from '@mui/material/AvatarGroup'
// import CardContent from '@mui/material/CardContent'
// import TimelineContent from '@mui/lab/TimelineContent'
// import TimelineSeparator from '@mui/lab/TimelineSeparator'
// import TimelineConnector from '@mui/lab/TimelineConnector'
import MuiTimeline, { TimelineProps } from '@mui/lab/Timeline'
import SearchIcon from '@mui/icons-material/Search'
import RefreshIcon from '@mui/icons-material/Refresh'
import Send from '@mui/icons-material/Send'
import router from 'next/router'

// ** Types
import { InvoiceType } from 'src/types/apps/invoiceTypes'

// ** Demo Component Imports
//import UsersInvoiceListTable from './UsersInvoiceListTable'
import UsersProjectListTable from './UsersProjectListTable'
import { Autocomplete, Button, IconButton, TextField } from '@mui/material'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import React from 'react'

interface Props {
  invoiceData: InvoiceType[]
}

// Styled Timeline component
const Timeline = styled(MuiTimeline)<TimelineProps>(({ theme }) => ({
  margin: 0,
  padding: 0,
  marginLeft: theme.spacing(0.75),
  '& .MuiTimelineItem-root': {
    '&:before': {
      display: 'none'
    },
    '&:last-child': {
      minHeight: 60
    }
  }
}))
export const rows = [
  {
    id: 1,
    portfolioID: 'pf0001',
    full_name: '12 months',
    portfolio: 'portfolio1',
    email: 'Thangnc0401@gmail.com',
    end_date: Date.now(),
    start_date: Date.now(),
    ID_number: 'xxx-xxx-xxx-123',
    status: 'Hoạt động'
  },
  {
    id: 2,
    full_name: '12 months',
    portfolioID: 'pf0002',
    portfolio: 'portfolio2',
    email: 'Thangnc0401@gmail.com',
    end_date: Date.now(),
    start_date: Date.now(),
    status: 'Hoạt động'
  },
  {
    id: 3,
    full_name: '12 months',
    portfolioID: 'pf0003',
    portfolio: 'portfolio3',
    email: 'Thangnc0401@gmail.com',
    end_date: Date.now(),
    start_date: Date.now(),
    status: 'Hoạt động'
  },
  {
    id: 4,
    full_name: '12 months',
    portfolioID: 'pf0004',
    portfolio: 'portfolio4',
    email: 'Thangnc0401@gmail.com',
    end_date: Date.now(),
    start_date: Date.now(),
    status: 'Hoạt động'
  },
  {
    id: 5,
    full_name: '12 months',
    portfolioID: 'pf0005',
    portfolio: 'portfolio5',
    email: 'Thangnc0401@gmail.com',
    end_date: Date.now(),
    start_date: Date.now(),
    status: 'Hoạt động'
  },
  {
    id: 6,
    full_name: '12 months',
    portfolioID: 'pf0006',
    portfolio: 'portfolio6',
    email: 'Thangnc0401@gmail.com',
    end_date: Date.now(),
    start_date: Date.now(),
    status: 'Hoạt động'
  },
  {
    id: 7,
    full_name: '12 months',
    portfolioID: 'pf0007',
    portfolio: 'portfolio7',
    email: 'Thangnc0401@gmail.com',
    end_date: Date.now(),
    start_date: Date.now(),
    status: 'Hoạt động'
  },
  {
    id: 8,
    full_name: '12 months',
    portfolioID: 'pf0008',
    portfolio: 'portfolio8',
    email: 'Thangnc0401@gmail.com',
    end_date: Date.now(),
    start_date: Date.now(),
    status: 'Hoạt động'
  },
  {
    id: 9,
    full_name: '12 months',
    portfolioID: 'pf0009',
    portfolio: 'portfolio9',
    email: 'Thangnc0401@gmail.com',
    end_date: Date.now(),
    start_date: Date.now(),
    status: 'Hoạt động'
  },
  {
    id: 10,
    full_name: '12 months',
    portfolioID: 'pf00010',
    portfolio: 'portfolio10',
    email: 'Thangnc0401@gmail.com',
    end_date: Date.now(),
    start_date: Date.now(),
    status: 'Hoạt động'
  },
  {
    id: 11,
    full_name: '12 months',
    portfolioID: 'pf00011',
    portfolio: 'portfolio11',
    email: 'Thangnc0401@gmail.com',
    end_date: Date.now(),
    start_date: Date.now(),
    status: 'Hoạt động'
  },
  {
    id: 12,
    full_name: '12 months',
    portfolioID: 'pf00012',
    portfolio: 'portfolio12',
    email: 'Thangnc0401@gmail.com',
    end_date: Date.now(),
    start_date: Date.now(),
    status: 'Hoạt động'
  }
]

const UserViewOverview = ({ invoiceData }: Props) => {
  const getCommodities: string[] = ['Portfolio1', 'Portfolio2', 'Portfolio3', 'Portfolio4', 'Portfolio5']
  const getCommodityGroup: string[] = ['Pf0001', 'Pf0002', 'Pf0003', 'Pf0004', 'Pf0005']
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
    },
    {
      flex: 0.1,
      field: 'portfolioID',
      minWidth: 180,
      headerName: 'Mã danh mục'
    },
    {
      flex: 0.25,
      minWidth: 200,
      field: 'portfolio',
      headerName: 'Tên danh mục'
    },
    // {
    //   flex: 0.25,
    //   minWidth: 150,
    //   field: 'full_name',
    //   headerName: 'Thời hạn'
    // },
    // {
    //   flex: 0.25,
    //   minWidth: 150,
    //   field: 'start_date',
    //   headerName: 'Ngày bắt đầu',
    //   valueGetter: params => {
    //     const date = new Date(params.value)
    //     return date.toISOString().split('T')[0] // This will return 'YYYY-MM-DD'
    //   }
    // },
    // {
    //   flex: 0.15,
    //   minWidth: 150,
    //   headerName: 'Ngày kết thúc',
    //   field: 'end_date',
    //   valueGetter: params => {
    //     const date = new Date(params.value)
    //     return date.toISOString().split('T')[0] // This will return 'YYYY-MM-DD'
    //   }
    // },
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
                <TextField {...params} label='Tìm bằng tên danh mục' placeholder='Tìm bằng tên danh mục' />
              )}
            />
          </Grid>
          <Grid item xs={3}>
            <Autocomplete
              options={getCommodityGroup}
              renderInput={params => (
                <TextField {...params} label='Tìm bằng mã danh mục' placeholder='Tìm bằng mã danh mục' />
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

export default UserViewOverview
