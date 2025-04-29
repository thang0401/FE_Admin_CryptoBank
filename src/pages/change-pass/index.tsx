// ** React Imports
import { ChangeEvent, useState } from 'react'

// ** Next Import
import Link from 'next/link'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Alert from '@mui/material/Alert'
import Table from '@mui/material/Table'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import Divider from '@mui/material/Divider'
import TableRow from '@mui/material/TableRow'
import TableHead from '@mui/material/TableHead'
import TableCell from '@mui/material/TableCell'
import TableBody from '@mui/material/TableBody'
import TextField from '@mui/material/TextField'
import CardHeader from '@mui/material/CardHeader'
import AlertTitle from '@mui/material/AlertTitle'
import InputLabel from '@mui/material/InputLabel'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import FormControl from '@mui/material/FormControl'
import DialogTitle from '@mui/material/DialogTitle'
import OutlinedInput from '@mui/material/OutlinedInput'
import DialogContent from '@mui/material/DialogContent'
import InputAdornment from '@mui/material/InputAdornment'
import TableContainer from '@mui/material/TableContainer'


// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Types
import { ThemeColor } from 'src/@core/layouts/types'
import Grid2 from '@mui/material/Unstable_Grid2'

interface State {
  newPassword: string
  showNewPassword: boolean
  confirmNewPassword: string
  showConfirmNewPassword: boolean
}

interface DataType {
  icon: string
  device: string
  browser: string
  location: string
  iconColor: ThemeColor
  recentActivity: string
}


export default function ChangePass() {

 const [defaultValues, setDefaultValues] = useState<any>({ mobile: 'thangnc0401@gmail.com' })
 const [mobileNumber, setMobileNumber] = useState<string>(defaultValues.mobile)
 const [openEditMobileNumber, setOpenEditMobileNumber] = useState<boolean>(false)
 const [values, setValues] = useState<State>({
   newPassword: '',
   showNewPassword: false,
   confirmNewPassword: '',
   showConfirmNewPassword: false
 })

 // Handle Password
 const handleNewPasswordChange = (prop: keyof State) => (event: ChangeEvent<HTMLInputElement>) => {
   setValues({ ...values, [prop]: event.target.value })
 }
 const handleClickShowNewPassword = () => {
   setValues({ ...values, showNewPassword: !values.showNewPassword })
 }

 // Handle Confirm Password
 const handleConfirmNewPasswordChange = (prop: keyof State) => (event: ChangeEvent<HTMLInputElement>) => {
   setValues({ ...values, [prop]: event.target.value })
 }
 const handleClickShowConfirmNewPassword = () => {
   setValues({ ...values, showConfirmNewPassword: !values.showConfirmNewPassword })
 }

 // Handle edit mobile number dialog
 const handleEditMobileNumberClickOpen = () => setOpenEditMobileNumber(true)
 const handleEditMobileNumberClose = () => setOpenEditMobileNumber(false)

 // Handle button click inside the dialog
 const handleCancelClick = () => {
   setMobileNumber(defaultValues.mobile)
   handleEditMobileNumberClose()
 }
 const handleSubmitClick = () => {
   setDefaultValues({ ...defaultValues, mobile: mobileNumber })
   handleEditMobileNumberClose()
 }
  return (
    <div>
      <Grid container spacing={6}>
            <Grid item xs={12}>
              <Card>
                <CardHeader title='Nhân viên mới phải đổi mật khẩu' />
                <CardContent>
                  <Alert icon={false} severity='warning' sx={{ mb: 6 }}>
                    <AlertTitle sx={{ fontWeight: 600, mb: theme => `${theme.spacing(1)} !important` }}>
                     Đảm bảo các yêu cầu chúng tôi:
                    </AlertTitle>
                    Dài tối thiểu 8 ký tự, viết hoa và ký hiệu
                  </Alert>

                  <form onSubmit={e => e.preventDefault()}>
                    <Grid container spacing={6}>
                      <Grid item xs={12} sm={6}>
                        <FormControl fullWidth>
                          <InputLabel htmlFor='user-view-security-new-password'>Mật khẩu mới</InputLabel>
                          <OutlinedInput
                            label='New Password'
                            value={values.newPassword}
                            id='user-view-security-new-password'
                            onChange={handleNewPasswordChange('newPassword')}
                            type={values.showNewPassword ? 'text' : 'password'}
                            endAdornment={
                              <InputAdornment position='end'>
                                <IconButton
                                  edge='end'
                                  onClick={handleClickShowNewPassword}
                                  onMouseDown={e => e.preventDefault()}
                                  aria-label='toggle password visibility'
                                >
                                  <Icon icon={values.showNewPassword ? 'bx:show' : 'bx:hide'} />
                                </IconButton>
                              </InputAdornment>
                            }
                          />
                        </FormControl>
                      </Grid>

                      <Grid item xs={12} sm={6}>
                        <FormControl fullWidth>
                          <InputLabel htmlFor='user-view-security-confirm-new-password'>Xác nhận mật khẩu mới</InputLabel>
                          <OutlinedInput
                            label='Confirm New Password'
                            value={values.confirmNewPassword}
                            id='user-view-security-confirm-new-password'
                            type={values.showConfirmNewPassword ? 'text' : 'password'}
                            onChange={handleConfirmNewPasswordChange('confirmNewPassword')}
                            endAdornment={
                              <InputAdornment position='end'>
                                <IconButton
                                  edge='end'
                                  onMouseDown={e => e.preventDefault()}
                                  aria-label='toggle password visibility'
                                  onClick={handleClickShowConfirmNewPassword}
                                >
                                  <Icon icon={values.showConfirmNewPassword ? 'bx:show' : 'bx:hide'} />
                                </IconButton>
                              </InputAdornment>
                            }
                          />
                        </FormControl>
                      </Grid>

                      <Grid item xs={12}>
                        <Button type='submit' variant='contained'>
                          Đổi mật khẩu
                        </Button>
                      </Grid>
                    </Grid>
                  </form>
                </CardContent>
              </Card>
            </Grid>
            </Grid>
    </div>
  )
}
