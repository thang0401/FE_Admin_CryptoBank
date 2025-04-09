// ** React Imports
import { SyntheticEvent, useState } from 'react'

// ** MUI Imports
import Tab from '@mui/material/Tab'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Table from '@mui/material/Table'
import TabPanel from '@mui/lab/TabPanel'
import TabContext from '@mui/lab/TabContext'
import TableRow from '@mui/material/TableRow'
import { styled } from '@mui/material/styles'
import TableBody from '@mui/material/TableBody'
import TableHead from '@mui/material/TableHead'
import TableCell from '@mui/material/TableCell'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import TableContainer from '@mui/material/TableContainer'
import LinearProgress from '@mui/material/LinearProgress'
import MuiTabList, { TabListProps } from '@mui/lab/TabList'

// ** Type Import
import { ThemeColor } from 'src/@core/layouts/types'

interface DataType {
  //src: string
  system?: string
  transactionType?: string
  country?: string
  color: ThemeColor
  percentage: number
  value: string | number
}

const transactionType: DataType[] = [
  {
    value: '8.92k',
    color: 'success',
    transactionType: 'Mua USDC',
    percentage: 64.91,
    //src: '/images/cards/chrome.png'
  },
  {
    value: '1.29k',
    color: 'primary',
    transactionType: 'Bán USDC',
    percentage: 19.03,
    //src: '/images/cards/safari.png'
  },
  {
    value: 328,
    color: 'info',
    percentage: 3.26,
    transactionType: 'Nạp USDC',
    //src: '/images/cards/firefox.png'
  },
  {
    value: 142,
    transactionType: 'Chuyển USDC',
    color: 'warning',
    percentage: 3.99,
    //src: '/images/cards/edge.png'
  },
  {
    value: 85,
    color: 'error',
    transactionType: 'Nạp tiền tiết kiệm',
    percentage: 2.12,
    //src: '/images/cards/opera.png'
  },
  {
    value: 36,
    color: 'info',
    transactionType: 'Rút tiền tiết kiệm',
    percentage: 1.06,
    //src: '/images/cards/brave.png'
  },
  {
    value: 36,
    color: 'info',
    transactionType: 'Tiền gửi bảo hiểm',
    percentage: 1.06,
    //src: '/images/cards/brave.png'
  }
]
const osData: DataType[] = [
  {
    color: 'success',
    percentage: 61.5,
    value: '475.26k',
    system: 'Windows',
    //src: '/images/cards/windows.png'
  },
  {
    system: 'Mac',
    color: 'primary',
    value: '89.12k',
    percentage: 15.67,
    //src: '/images/cards/mac.png'
  },
  {
    color: 'info',
    value: '38.68k',
    system: 'Ubuntu',
    percentage: 5.82,
    //src: '/images/cards/ubuntu.png'
  },
  {
    color: 'warning',
    value: '30.27k',
    system: 'Linux',
    percentage: 5.03,
    //src: '/images/cards/linux.png'
  },
  {
    value: '8.34k',
    color: 'error',
    system: 'Chrome',
    percentage: 3.25,
    //src: '/images/cards/chrome.png'
  },
  {
    color: 'info',
    system: 'Cent',
    value: '2.25k',
    percentage: 1.76,
    //src: '/images/cards/cent.png'
  }
]
const countryData: DataType[] = [
  {
    country: 'USA',
    color: 'success',
    value: '87.24k',
    percentage: 38.12,
    //src: '/images/cards/usa.png'
  },
  {
    color: 'primary',
    value: '42.69k',
    country: 'Brazil',
    percentage: 28.23,
    //src: '/images/cards/brazil.png'
  },
  {
    color: 'info',
    country: 'India',
    value: '12.58k',
    percentage: 13.82,
    //src: '/images/cards/india.png'
  },
  {
    value: '4.13k',
    color: 'warning',
    percentage: 12.72,
    country: 'Australia',
    //src: '/images/cards/australia.png'
  },
  {
    color: 'error',
    value: '2.21k',
    country: 'China',
    percentage: 7.11,
    //src: '/images/cards/china.png'
  },
  {
    color: 'info',
    value: '1.56k',
    country: 'France',
    percentage: 6.59,
    //src: '/images/cards/france.png'
  }
]

const activeTabData: { [key: string]: DataType[] } = {
  os: osData,
  transactionType: transactionType,
  country: countryData
}

// Styled TabList component
const TabList = styled(MuiTabList)<TabListProps>(({ theme }) => ({
  minHeight: 40,
  '& .MuiTabs-indicator': {
    display: 'none'
  },
  '& .MuiTab-root': {
    minHeight: 40,
    paddingTop: theme.spacing(2.5),
    paddingBottom: theme.spacing(2.5),
    borderRadius: theme.shape.borderRadius,
    '&.Mui-selected': {
      color: theme.palette.common.white,
      backgroundColor: theme.palette.primary.main
    }
  }
}))

const AnalyticsTabsWithTable = () => {
  // ** State
  const [value, setValue] = useState<string>('transactionType')

  const handleChange = (event: SyntheticEvent, newValue: string) => {
    setValue(newValue)
  }

  return (
    <Card>
      <TabContext value={value}>
        <CardContent sx={{ borderBottom: theme => `1px solid ${theme.palette.divider}` }}>
          <TabList
            variant='scrollable'
            scrollButtons='auto'
            onChange={handleChange}
            aria-label='customized tabs example'
          >
            <Tab value='transactionType' label='transactionType' />
            {/* <Tab value='os' label='Operating System' /> */}
            {/* <Tab value='country' label='Country' /> */}
          </TabList>
        </CardContent>
        <TabPanel
          value={value}
          sx={{
            border: 0,
            boxShadow: 0,
            backgroundColor: 'transparent',
            p: theme => `${theme.spacing(0, 0, 3)} !important`
          }}
        >
          <TableContainer>
            <Table sx={{ '& th, & td': { border: 0 } }}>
              <TableHead sx={{ '& .MuiTableCell-root': { pt: 6.5, pb: 5.5 } }}>
                <TableRow>
                  <TableCell>
                    <Typography variant='body2' sx={{ fontWeight: 500 }}>
                      No.
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant='body2' sx={{ fontWeight: 500 }}>
                      Loại giao dịch
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant='body2' sx={{ fontWeight: 500 }}>
                      Số lượng
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography noWrap variant='body2' sx={{ fontWeight: 500 }}>
                      Phần trăm lượng giao dịch
                    </Typography>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {activeTabData[value].map((row: DataType, index: number) => (
                  <TableRow
                    key={index}
                    sx={{
                      '& .MuiTableCell-root': {
                        py: theme => [
                          `${theme.spacing(3.75)} !important`,
                          `${theme.spacing(3.75)} !important`,
                          `${theme.spacing(3.25)} !important`
                        ]
                      }
                    }}
                  >
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        {/* <img
                          width={24}
                          height={24}
                          src={row.src}
                          alt={
                            value === 'transactionType'
                              ? row.transactionType
                              : value === 'os'
                              ? row.system
                              : row.country
                          }
                        /> */}
                        <Typography sx={{ ml: 3, color: 'text.secondary' }}>
                          {value === 'transactionType'
                            ? row.transactionType
                            : value === 'os'
                            ? row.system
                            : row.country}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography sx={{ fontWeight: 600, color: 'text.secondary' }}>{row.value}</Typography>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <LinearProgress
                          color={row.color}
                          variant='determinate'
                          value={row.percentage + 20}
                          sx={{ mr: 4, height: 9, width: '100%' }}
                        />
                        <Typography variant='body2' sx={{ fontWeight: 500 }}>
                          {`${row.percentage}%`}
                        </Typography>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>
      </TabContext>
    </Card>
  )
}

export default AnalyticsTabsWithTable
