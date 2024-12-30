// ** Next Import
import Link from 'next/link'

// ** MUI Imports
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Select from '@mui/material/Select'
import Button from '@mui/material/Button'
import Switch from '@mui/material/Switch'
import MenuItem from '@mui/material/MenuItem'
import { styled } from '@mui/material/styles'
import InputLabel from '@mui/material/InputLabel'
import Box, { BoxProps } from '@mui/material/Box'
import FormControl from '@mui/material/FormControl'
import CardContent from '@mui/material/CardContent'

// ** Icon Imports
import Icon from 'src/@core/components/icon'
import { Accordion, AccordionDetails, AccordionSummary, Typography } from '@mui/material'

const OptionsWrapper = styled(Box)<BoxProps>(() => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between'
}))

const AddActions = () => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <CardContent>
            {/* <Button fullWidth sx={{ mb: 4 }} variant='contained' startIcon={<Icon icon='bx:paper-plane' />}></Button> */}
            <Button
              fullWidth
              sx={{ mb: 4 }}
              component={Link}
              // color='secondary'
              variant='outlined'
              href='/trade-now/transfer-asset/preview/4987'
              startIcon={<Icon icon='bx:paper-plane' />}
            >
              Transfer
            </Button>
            <Button fullWidth color='secondary' variant='outlined'>
              Save
            </Button>
          </CardContent>
        </Card>
      </Grid>
      {/* <Grid item xs={12}>
        <FormControl fullWidth>
          <InputLabel id='payment-select'>Accept payments via</InputLabel>
          <Select
            fullWidth
            sx={{ mb: 4 }}
            labelId='payment-select'
            label='Accept payments via'
            defaultValue='Internet Banking'
          >
            <MenuItem value='Internet Banking'>Internet Banking</MenuItem>
            <MenuItem value='Debit Card'>Debit Card</MenuItem>
            <MenuItem value='Credit Card'>Credit Card</MenuItem>
            <MenuItem value='Paypal'>Paypal</MenuItem>
            <MenuItem value='UPI Transfer'>UPI Transfer</MenuItem>
          </Select>
        </FormControl>
        <OptionsWrapper>
          <InputLabel htmlFor='invoice-add-payment-terms' sx={{ cursor: 'pointer' }}>
            Payment Terms
          </InputLabel>
          <Switch defaultChecked id='invoice-add-payment-terms' />
        </OptionsWrapper>
        <OptionsWrapper>
          <InputLabel htmlFor='invoice-add-client-notes' sx={{ cursor: 'pointer' }}>
            Client Notes
          </InputLabel>
          <Switch id='invoice-add-client-notes' />
        </OptionsWrapper>
        <OptionsWrapper>
          <InputLabel sx={{ cursor: 'pointer' }} htmlFor='invoice-add-payment-stub'>
            Payment Stub
          </InputLabel>
          <Switch id='invoice-add-payment-stub' />
        </OptionsWrapper>
      </Grid> */}
      <Grid sx={{ ml: 4 , mt:5}}>
      <Typography sx={{ mb: 4, fontWeight: 500 }}>FAQ?</Typography>
          <Accordion>
            <AccordionSummary>
              <Typography sx={{ fontWeight: '500' }}>Transfer trên CryptoDepot là gì?</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography sx={{ color: 'text.secondary' }}>
                Trả lời: Transfer là tính năng cho phép bạn chuyển tài sản Web 3 từ tài khoản CryptoDepot của mình sang một tài khoản CryptoDepot khác chỉ bằng ID danh mục của người nhận.
              </Typography>
            </AccordionDetails>
          </Accordion>
          <Accordion>
            <AccordionSummary>
              <Typography sx={{ fontWeight: '500' }}>Làm thế nào để tôi chuyển tài sản giữa các tài khoản CryptoDepot?</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography sx={{ color: 'text.secondary' }}>
                Trả lời: Để chuyển tài sản, bạn chỉ cần nhập ID danh mục của người nhận, chọn số lượng tài sản bạn muốn chuyển và xác nhận giao dịch. Sau khi xác nhận, tài sản sẽ được chuyển ngay lập tức giữa các danh mục tài sản Web 3 trong hệ thống CryptoDepot.
              </Typography>
            </AccordionDetails>
          </Accordion>
          <Accordion>
            <AccordionSummary>
              <Typography sx={{ fontWeight: '500' }}>Có thể chuyển tiền từ tài khoản CryptoDepot đến các ví bên ngoài không?</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography sx={{ color: 'text.secondary' }}>
                Trả lời: Hiện tại, tính năng Transfer chỉ hỗ trợ chuyển tiền giữa các tài khoản trên CryptoDepot. Để chuyển tài sản ra ngoài ví của bạn, bạn cần sử dụng tính năng Withdraw (Rút tiền).
              </Typography>
            </AccordionDetails>
          </Accordion>
          <Accordion>
            <AccordionSummary>
              <Typography sx={{ fontWeight: '500' }}>Transfer có mất phí không?</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography sx={{ color: 'text.secondary' }}>
                Trả lời: CryptoDepot không tính phí cho các giao dịch Transfer nội bộ giữa các tài khoản trong hệ thống.
              </Typography>
            </AccordionDetails>
          </Accordion>
          <Accordion>
            <AccordionSummary>
              <Typography sx={{ fontWeight: '500' }}>Thời gian chuyển tiền nội bộ giữa các tài khoản là bao lâu?</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography sx={{ color: 'text.secondary' }}>
                Trả lời: Giao dịch chuyển tiền nội bộ giữa các tài khoản CryptoDepot thường được xử lý tức thì và số dư của cả hai bên sẽ được cập nhật ngay lập tức.
              </Typography>
            </AccordionDetails>
          </Accordion>
      </Grid>
    </Grid>
  )
}

export default AddActions
