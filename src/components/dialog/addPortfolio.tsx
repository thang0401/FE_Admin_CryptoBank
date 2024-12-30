import { CardContent, Grid, TextField } from '@mui/material'

//import React, { useCallback, useEffect, useMemo, useState } from 'react'
import MuiDialogContent from 'src/@core/components/dialog/DialogContent'

//import toast from 'react-hot-toast'
// import { dialogType } from '../res_system'

export default function AddPortfolio() {
  return (
    <MuiDialogContent

    // onSubmit={submit}
    >
      <CardContent>
        <Grid>
          <Grid item>
            <TextField
              label='Tên Hàng Hoá'
              placeholder='Nhập Tên Hàng Hoá'
              variant='outlined'
              fullWidth
              multiline
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item style={{ marginTop: 30 }}>
            <TextField
              label='Ghi chú'
              placeholder='Nhập Ghi Chú'
              fullWidth
              multiline
              rows={10}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
        </Grid>
      </CardContent>
    </MuiDialogContent>
  )
}
