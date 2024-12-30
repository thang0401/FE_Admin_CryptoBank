// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'

// import CardHeader from '@mui/material/CardHeader'
import { DataGrid, GridColDef } from '@mui/x-data-grid'

// ** Data Import
import { rows } from 'src/@fake-db/table/static-data'

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
    minWidth: 150,
    field: 'email',
    headerName: 'Gmail Address'
  },
  {
    flex: 0.15,
    minWidth: 130,
    headerName: 'Phone Number',
    field: 'Phone',
    valueGetter: params => new Date(params.value)
  },
  {
    flex: 0.15,
    minWidth: 120,
    field: 'experience',
    headerName: 'ID number'
  },
  {
    flex: 0.1,
    field: 'age',
    minWidth: 80,
    headerName: 'status'
  },
  {
    flex: 0.25,
    minWidth: 100,
    field: 'button',
    headerName: 'Deposit'
  }
]

const TableBasic = () => {
  return (
    <Card>
      {/* <CardHeader title='MY PORTFOLIOS' /> */}
      <Box sx={{ height: 500 }}>
        <DataGrid columns={columns} rows={rows.slice(0, 10)} />
      </Box>
    </Card>
  )
}

export default TableBasic
