// ** MUI Imports
import Card from '@mui/material/Card'
import { useTheme } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import React, { useState, useEffect } from "react"
// ** Third Party Imports
import { ApexOptions } from 'apexcharts'

// ** Custom Components Imports
import ReactApexcharts from 'src/@core/components/react-apexcharts'

// ** Util Import
import { hexToRGBA } from 'src/@core/utils/hex-to-rgba'
import { by } from '@fullcalendar/core/internal-common'


// const series = [{ data: [11, 7, 11, 20,11, 7, 11, 20,11, 7, 11, 20] }, { data: [9, 5, 15, 18,9, 5, 15, 18,9, 5, 15, 18] }]

const FALLBACK_BUY_RATIOS = [11, 7, 11, 20, 11, 7, 11, 20, 11, 7, 11, 20];
const FALLBACK_SELL_RATIOS = [9, 5, 15, 18, 9, 5, 15, 18, 9, 5, 15, 18];

interface USDCData {
  totalTransaction: number
  buyRatios: number[];
  sellRatios: number[];
}


const SellUSDCrate = () => {
  // ** Hook
  const theme = useTheme()
  const [buyUSDCRatio, setBuyUSDCRatio] = useState<number[]>([]);
  const [sellUSDCRatio, setSellUSDCRatio] = useState<number[]>([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const currentYear = new Date().getFullYear();
        const response = await fetch(`https://be-crypto-depot.name.vn/report-and-statistic/transaction-flow/usdc-buy-sell-ratio?targetYear=${currentYear}`);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data: USDCData = await response.json();
        console.log(data)
        // Update state with fetched data or fallback
        setBuyUSDCRatio(data.buyRatios);
        setSellUSDCRatio(data.sellRatios);
        console.log(buyUSDCRatio)
        console.log(sellUSDCRatio)
      } catch (error) {
        console.error('Error fetching USDC ratios:', error);
        // Fallback to static data
        setBuyUSDCRatio(FALLBACK_BUY_RATIOS);
        setSellUSDCRatio(FALLBACK_SELL_RATIOS);
      }
    };
  
    fetchData();
  }, []);
  const series: ApexAxisChartSeries = [
    { data: buyUSDCRatio },
    { data: sellUSDCRatio }
  ];

  console.log(series)
  const options: ApexOptions = {
    chart: {
      parentHeightOffset: 0,
      toolbar: { show: false }
    },
    grid: {
      padding: {
        top: -22,
        left: -1,
        right: 10,
        bottom: -3
      },
      yaxis: {
        lines: { show: false }
      }
    },
    legend: { show: false },
    tooltip: { enabled: false },
    dataLabels: { enabled: false },
    colors: [hexToRGBA(theme.palette.success.main, 1), hexToRGBA(theme.palette.success.main, 0.2)],
    plotOptions: {
      bar: {
        borderRadius: 5,
        columnWidth: '52%',
        endingShape: 'rounded',
        startingShape: 'rounded'
      }
    },
    stroke: {
      width: 1,
      colors: [theme.palette.background.paper]
    },
    states: {
      hover: {
        filter: { type: 'none' }
      },
      active: {
        filter: { type: 'none' }
      }
    },
    xaxis: {
      axisTicks: { show: false },
      axisBorder: { show: false },
      categories: ['Jan', 'Feb', 'Mar', 'Apri', 'May', 'Jun', 'Jul', 'Agu', 'Sep', 'Oct', 'Nov', 'Dec'],
      labels: {
        style: {
          fontSize: '14px',
          colors: theme.palette.text.disabled,
          fontFamily: theme.typography.fontFamily
        }
      }
    },
    yaxis: {
      labels: { show: false }
    },
    responsive: [
      {
        breakpoint: 1300,
        options: {
          plotOptions: {
            bar: { columnWidth: '65%' }
          }
        }
      },
      {
        breakpoint: theme.breakpoints.values.lg,
        options: {
          plotOptions: {
            bar: { columnWidth: '45%' }
          }
        }
      },
      {
        breakpoint: theme.breakpoints.values.md,
        options: {
          plotOptions: {
            bar: { columnWidth: '30%' }
          }
        }
      },
      {
        breakpoint: theme.breakpoints.values.sm,
        options: {
          plotOptions: {
            bar: { columnWidth: '50%' }
          }
        }
      }
    ]
  }

  return (
    <Card>
      <CardContent sx={{ p: theme => `${theme.spacing(3.5, 5, 0)} !important` }}>
        <Typography sx={{ fontWeight: 600, color: 'text.secondary' }}>Tỷ lệ mua/bán USDC </Typography>
        <Typography variant='h5'>624k</Typography>
      </CardContent>
      <ReactApexcharts type='bar' width={450} height={250} options={options} series={series} />
    </Card>
  )
}

export default SellUSDCrate
