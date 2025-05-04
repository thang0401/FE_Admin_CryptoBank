import { ChangeEvent, useState } from 'react';
import Link from 'next/link';
import axios from 'axios';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import CardHeader from '@mui/material/CardHeader';
import AlertTitle from '@mui/material/AlertTitle';
import InputLabel from '@mui/material/InputLabel';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';
import FormControl from '@mui/material/FormControl';
import DialogTitle from '@mui/material/DialogTitle';
import OutlinedInput from '@mui/material/OutlinedInput';
import DialogContent from '@mui/material/DialogContent';
import InputAdornment from '@mui/material/InputAdornment';
import Icon from 'src/@core/components/icon';

interface State {
  newPassword: string;
  showNewPassword: boolean;
  confirmNewPassword: string;
  showConfirmNewPassword: boolean;
}

export default function ChangePass() {
  const [defaultValues, setDefaultValues] = useState<any>({ mobile: 'thangnc0401@gmail.com' });
  const [mobileNumber, setMobileNumber] = useState<string>(defaultValues.mobile);
  const [openEditMobileNumber, setOpenEditMobileNumber] = useState<boolean>(false);
  const [values, setValues] = useState<State>({
    newPassword: '',
    showNewPassword: false,
    confirmNewPassword: '',
    showConfirmNewPassword: false,
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Retrieve EmployeeId from localStorage
  const userData = typeof window !== 'undefined' ? localStorage.getItem('userData') : null;
  const employeeId = userData ? JSON.parse(userData)?.id : null;

  // Password validation
  const validatePassword = (password: string): boolean => {
    const minLength = password.length >= 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    return minLength && hasUpperCase && hasSpecialChar;
  };

  // Handle Password
  const handleNewPasswordChange = (prop: keyof State) => (event: ChangeEvent<HTMLInputElement>) => {
    setValues({ ...values, [prop]: event.target.value });
    setError(null); // Clear error on input change
  };

  const handleClickShowNewPassword = () => {
    setValues({ ...values, showNewPassword: !values.showNewPassword });
  };

  // Handle Confirm Password
  const handleConfirmNewPasswordChange = (prop: keyof State) => (event: ChangeEvent<HTMLInputElement>) => {
    setValues({ ...values, [prop]: event.target.value });
    setError(null); // Clear error on input change
  };

  const handleClickShowConfirmNewPassword = () => {
    setValues({ ...values, showConfirmNewPassword: !values.showConfirmNewPassword });
  };

  // Handle edit mobile number dialog
  const handleEditMobileNumberClickOpen = () => setOpenEditMobileNumber(true);
  const handleEditMobileNumberClose = () => setOpenEditMobileNumber(false);

  const handleCancelClick = () => {
    setMobileNumber(defaultValues.mobile);
    handleEditMobileNumberClose();
  };

  const handleSubmitClick = () => {
    setDefaultValues({ ...defaultValues, mobile: mobileNumber });
    handleEditMobileNumberClose();
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // Validate EmployeeId
    if (!employeeId) {
      setError('Không tìm thấy EmployeeId. Vui lòng đăng nhập lại.');
      return;
    }

    // Validate inputs
    if (!values.newPassword || !values.confirmNewPassword) {
      setError('Vui lòng nhập mật khẩu mới và xác nhận mật khẩu.');
      return;
    }

    if (values.newPassword !== values.confirmNewPassword) {
      setError('Mật khẩu mới và xác nhận mật khẩu không khớp.');
      return;
    }

    if (!validatePassword(values.newPassword)) {
      setError('Mật khẩu phải dài ít nhất 8 ký tự, chứa chữ hoa và ký tự đặc biệt.');
      return;
    }

    try {
      const response = await axios.put('https://be-crypto-depot.name.vn/api/employee/auth/changePassword', {
        employeeId: employeeId,
        newPassword: values.newPassword,
        changePass: true,
      }, {
        headers: {
          'Content-Type': 'application/json',
          // Add authorization header if required
          // 'Authorization': `Bearer ${yourToken}`,
        },
      });

      setSuccess('Đổi mật khẩu thành công!');
      setValues({
        newPassword: '',
        showNewPassword: false,
        confirmNewPassword: '',
        showConfirmNewPassword: false,
      });
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Có lỗi xảy ra. Vui lòng thử lại.';
      setError(errorMessage);
    }
  };

  return (
    <div>
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <Card>
            <CardHeader title='Nhân viên mới phải đổi mật khẩu' />
            <CardContent>
              <Alert icon={false} severity='warning' sx={{ mb: 6 }}>
                <AlertTitle sx={{ fontWeight: 600, mb: (theme) => `${theme.spacing(1)} !important` }}>
                  Đảm bảo các yêu cầu chúng tôi:
                </AlertTitle>
                Dài tối thiểu 8 ký tự, viết hoa và ký hiệu
              </Alert>

              {error && (
                <Alert severity='error' sx={{ mb: 6 }}>
                  {error}
                </Alert>
              )}

              {success && (
                <Alert severity='success' sx={{ mb: 6 }}>
                  {success}
                </Alert>
              )}

              <form onSubmit={handleSubmit}>
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
                              onMouseDown={(e) => e.preventDefault()}
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
                              onMouseDown={(e) => e.preventDefault()}
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

      {/* Mobile Number Edit Dialog */}
      <Dialog open={openEditMobileNumber} onClose={handleEditMobileNumberClose}>
        <DialogTitle>Chỉnh sửa số điện thoại</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin='dense'
            label='Số điện thoại'
            type='text'
            fullWidth
            value={mobileNumber}
            onChange={(e) => setMobileNumber(e.target.value)}
          />
        </DialogContent>
        <Box sx={{ p: 4, display: 'flex', justifyContent: 'flex-end' }}>
          <Button onClick={handleCancelClick} sx={{ mr: 2 }}>
            Hủy
          </Button>
          <Button onClick={handleSubmitClick} variant='contained'>
            Lưu
          </Button>
        </Box>
      </Dialog>
    </div>
  );
}