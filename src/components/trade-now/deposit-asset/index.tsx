import React, { useCallback, useEffect } from 'react'
import { Grid, Card, Button, TextField, Box, Autocomplete, IconButton } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import RefreshIcon from '@mui/icons-material/Refresh'
import { useQuery } from '@apollo/client'
import { GET_PORTFOLIO_BY_AUTOCOMPLETE, GET_PORTFOLIO_DATA_TO_TABLE } from './graphql/query'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import Send from '@mui/icons-material/Send'
import router from 'next/router'
import { FC, useMemo } from 'react'
import { table_data } from './graphql/variables'
import cluster from 'cluster'
import Link from 'next/link'
export const rows = [
  {
    id: 1,
    full_name: 'Nguyen Cao Thang',
    portfolioID: 'pf0001',
    portfolio: 'portfolio1',
    email: 'Thangnc0401@gmail.com',
    phone: 'xxx456789',
    ID_number: 'xxx-xxx-xxx-123',
    status: 'Hoạt động'
  }
]

const Deposit = () => {
  // const getCommodities: string[] = ['Portfolio1', 'Portfolio2', 'Portfolio3', 'Portfolio4', 'Portfolio5']
  // const getCommodityGroup: string[] = ['Pf0001', 'Pf0002', 'Pf0003', 'Pf0004', 'Pf0005']
  const columns: GridColDef[] = [

    {
      flex: 0.1,
      field: 'index',
      minWidth: 80,
      headerName: 'STT'
    },
    {
      flex: 0.25,
      minWidth: 200,
      field: 'firstName',
      headerName: 'Tên chủ sở hữu',
      renderCell: (params)=>{
        return `${params.row.user.firstName} ${params.row.user.lastName}`
      }
    },
    {
      flex: 0.25,
      minWidth: 80,
      field: 'id',
      headerName: 'Mã danh mục'
    },
    {
      flex: 0.25,
      minWidth: 150,
      field: 'name',
      headerName: 'Tên danh mục'
    },
    {
      flex: 0.25,
      minWidth: 150,
      field: 'email',
      headerName: 'Email',
      renderCell: params => {
        return `${params.row?.user?.email} `
      }

    },
    {
      flex: 0.15,
      minWidth: 150,
      headerName: 'Số điện thoại',
      field: 'phone',
      renderCell:(params) =>{
        return `${params.row?.user?.phoneNum}`
      }

    },
    {
      flex: 0.15,
      minWidth: 180,
      field: 'ID_number',
      headerName: 'CCCD',
      renderCell: (params) => {
        return `${params.row?.user?.idNumber}`
      }
    },
    {
      flex: 0.1,
      field: 'status',
      minWidth: 110,
      headerName: 'Trạng thái',
      renderCell: (params) =>{
        return `${params.row?.status}`
      }
    },
    {
      flex: 0.25,
      minWidth: 80,
      field: 'button',
      headerName: 'Nạp Tài sản',
      renderCell: params => {
        return (
          <div className='flex justify-center'>
            {/* <Link href="/trade-now/deposit-asset/add/" passHref> */}
            <IconButton
              title='Deposit'
              onClick={() => {
                router.push('/trade-now/deposit-asset/add')
              }}
            >
              <Send />
            </IconButton>
            {/* </Link> */}
          </div>
        )
      }
    }
  ]
  const headleDeposit = () => {
    router.push('/trade-now/deposit-asset/add')
  }

  const { data: get_portfolio_by_id } = useQuery(GET_PORTFOLIO_BY_AUTOCOMPLETE)
  console.log('get_portfolio_by_id', get_portfolio_by_id)
  const getPortById = useMemo(() => {
    return get_portfolio_by_id?.getPortfolio?.items ?? []
  }, [get_portfolio_by_id])
  console.log('getPortById', getPortById)

  const { data: Get_Portfolio_Data_To_Table, loading, error } = useQuery(GET_PORTFOLIO_DATA_TO_TABLE)
  console.log('Get_Portfolio_Data_To_Table', Get_Portfolio_Data_To_Table)
  const table_data = useMemo(() => {
    return Get_Portfolio_Data_To_Table?.getPortfolio?.items ?? []
  }, [Get_Portfolio_Data_To_Table])
  console.log('table_data', table_data)

  return (
    <Grid>
      <Grid container>
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h2 style={{ textAlign: 'center', textTransform: 'uppercase', marginLeft: 30 }}>Nạp tài sản </h2>
            <Box sx={{ display: 'flex', gap: '11px' }}>
              <Box sx={{ display: 'flex', gap: '11px' }}></Box>
            </Box>
          </Box>
        </Grid>
      </Grid>
      <Card sx={{ padding: 5, height: 100 }}>
        <Grid container justifyItems={'right'} columnSpacing={{ xs: 1, sm: 2, md: 3 }} marginBottom={4}>
          <Grid item xs={3} marginLeft={2}>
            <Autocomplete
              options={getPortById}
              value={getPortById.name}
              renderInput={params => (
                <TextField {...params} label='Tên danh mục nhận tài sản' placeholder='Tên danh mục nhận tài sản' />
              )}
              getOptionLabel={Option => Option.name}
            />
          </Grid>

          {/* options={getCommodities}
              value={getCommodities.find((x: any) => x.id === search.commuditiesId) ?? null}
              renderInput={params => <TextField {...params} label='loại hàng hoá' placeholder='Chọn loại hàng hoá' />}
              getOptionLabel={Option => Option.name} */}

          <Grid item xs={3}>
            <Autocomplete
              options={getPortById}
              value={getPortById.id}
              renderInput={params => (
                <TextField {...params} label='Mã danh mục nhận tài sản' placeholder='Mã danh mục nhận tài sản' />
              )}
              getOptionLabel={option => option.id}
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
              <DataGrid columns={columns}
              rows={table_data}

              />
            </Box>
          </Card>
        </Grid>
      </Grid>
    </Grid>
  )
}

{
  /* <DataGrid
              columns={columns}
              rows={cansaleList.map((item: any, index1: number) => ({ ...item }))}
              loading={loading}
              slots={{
                noRowsOverlay: () => (
                  <div style={{ marginTop: 20, width: '100%', textAlign: 'center' }}>Không có dữ liệu</div>
                ),
                noResultsOverlay: () => (
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      alignContent: 'center',
                      height: '100%'
                    }}
                  >
                    <span>Không tìm thấy dữ liệu</span>
                  </div>
                )
              }}
              style={{ minHeight: 500, height: '60vh' }}
            /> */
}

export default Deposit
