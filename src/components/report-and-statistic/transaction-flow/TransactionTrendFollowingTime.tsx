// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import { useTheme } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import React, { useState, useEffect } from "react"

// ** Icon Import
import Icon from 'src/@core/components/icon'

// ** Third Party Imports
import { ApexOptions } from 'apexcharts'

// ** Custom Component Imports
import CustomChip from 'src/@core/components/mui/chip'
import ReactApexcharts from 'src/@core/components/react-apexcharts'

// ** Util Import
import { hexToRGBA } from 'src/@core/utils/hex-to-rgba'

const mockseries = [30, 58, 35, 53, 50, 68]

interface TransactionTrendData {
  month: number
  totalAmount: number
  growthPercentage: number
  trendData: number[]
}

const TransactionTrendFollowingTime = () => {
  // ** Hook
  const theme = useTheme()
  const [trendData, setTrendData] = useState<number[]>([]);
    useEffect(() => {
      const fetchData = async () => {
        try {
          const response = await fetch('https://be-crypto-depot.name.vn/report-and-statistic/transaction-flow/usdc-buy-sell-ratio');
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          const data: TransactionTrendData = await response.json();
          console.log(data)
          // Update state with fetched data or fallback
          setTrendData(data.trendData);
          console.log("trendData:",trendData)
        } catch (error) {
          console.error('Error fetching USDC ratios:', error);
          // Fallback to static data
          setTrendData(mockseries);
        }
      };
    
      fetchData();
    }, []);
    const series: ApexAxisChartSeries = [
      { data: trendData }
    ];
  const options: ApexOptions = {
    chart: {
      parentHeightOffset: 0,
      toolbar: { show: false },
      dropShadow: {
        top: 12,
        blur: 4,
        left: 0,
        enabled: true,
        opacity: 0.12,
        color: theme.palette.warning.main
      }
    },
    tooltip: { enabled: false },
    colors: [hexToRGBA(theme.palette.warning.main, 1)],
    stroke: {
      width: 4,
      curve: 'smooth',
      lineCap: 'round'
    },
    grid: {
      show: false,
      padding: {
        top: -21,
        left: -5,
        bottom: -8
      }
    },
    xaxis: {
      labels: { show: false },
      axisTicks: { show: false },
      axisBorder: { show: false }
    },
    yaxis: {
      labels: { show: false }
    },
    responsive: [
      {
        breakpoint: theme.breakpoints.values.lg,
        options: {
          chart: {
            height: 151,
            width: '100%'
          }
        }
      },
      {
        breakpoint: theme.breakpoints.values.md,
        options: {
          chart: {
            height: 131,
            width: '100%'
          }
        }
      }
    ]
  }

  return (
    <Card>
      <CardContent
        sx={{
          display: 'flex',
          alignItems: 'stretch',
          justifyContent: 'space-between',
          flexDirection: ['column', 'row'],
          p: `${theme.spacing(4, 5, 3.25)} !important`
        }}
      >
        <Box sx={{ gap: 1, display: 'flex', justifyContent: 'space-between', flexDirection: ['row', 'column'] }}>
          <div>
            <Typography noWrap variant='h6' sx={{ mb: 1 }}>
              Xu hướng giao dịch
            </Typography>
            <CustomChip
              rounded
              skin='light'
              color='warning'
              sx={{ fontWeight: 500 }}
              label={`Month ${new Date().getMonth()}`}
            />
          </div>
          <div>
            <Box sx={{ display: 'flex', alignItems: 'center', color: 'success.main' }}>
              <Icon icon='bx:chevron-up' />
              <Typography variant='body2' sx={{ fontWeight: 500, color: 'success.main' }}>
                68.2%
              </Typography>
            </Box>
            <Typography variant='h5'>$84,686k</Typography>
          </div>
        </Box>
        <ReactApexcharts type='line' height={131} width='90%' options={options} series={series} />
      </CardContent>
    </Card>
  )
}

export default TransactionTrendFollowingTime
