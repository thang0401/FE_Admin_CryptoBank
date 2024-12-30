// ** Next Import
import Link from 'next/link'

// ** MUI Imports
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import CardContent from '@mui/material/CardContent'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

interface Props {
  // id: string | undefined
  toggleAddPaymentDrawer: () => void
  toggleSendInvoiceDrawer: () => void
}

const WithdrawActions = ({
  // id,
  toggleSendInvoiceDrawer,
  toggleAddPaymentDrawer
}: Props) => {
  return (
    <Card>
      <CardContent>
        <Button
          fullWidth
          sx={{ mb: 4 }}
          variant='contained'
          onClick={toggleSendInvoiceDrawer}
          startIcon={<Icon icon='bx:paper-plane' />}
        >
          Withdraw Here
        </Button>
        <Button fullWidth sx={{ mb: 4 }} variant='outlined' color='secondary'>
          Download
        </Button>
        <Button
          fullWidth
          sx={{ mb: 4 }}
          target='_blank'
          component={Link}
          color='secondary'
          variant='outlined'
          href={`/trade-now/transfer-asset/print/`}
        >
          Print
        </Button>
        {/* <Button
          fullWidth
          sx={{ mb: 4 }}
          // component={Link}
          color='secondary'
          variant='outlined'
          // href={`/apps/invoice/edit/${id}`}
        >
          Edit Invoice
        </Button> */}
        {/* <Button fullWidth variant='contained' onClick={toggleAddPaymentDrawer} startIcon={<Icon icon='bx:dollar' />}>
          Add Payment
        </Button> */}
      </CardContent>
    </Card>
  )
}

export default WithdrawActions
