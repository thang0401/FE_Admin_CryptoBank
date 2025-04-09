import { Grid } from '@mui/material'
import React from 'react'
import AnalyticsOrderStatistics from 'src/views/dashboards/analytics/AnalyticsOrderStatistics'
import AnalyticsProfitReport from 'src/views/dashboards/analytics/AnalyticsProfitReport'
import AnalyticsTabsWithTable from 'src/views/dashboards/analytics/AnalyticsTabsWithTable'
import EcommerceProfit from 'src/views/dashboards/ecommerce/EcommerceProfit'


export default function index() {
  return (

      <Grid container gap={3}>
       <AnalyticsTabsWithTable />
      <AnalyticsOrderStatistics/>
      <AnalyticsProfitReport/>
      <EcommerceProfit/>
      </Grid>

  )
}
