// ** Type import
import type { VerticalNavItemsType } from "src/@core/layouts/types"

const navigation = (): VerticalNavItemsType => {
  return [

    {
      icon: 'bx:home-circle',
      title: 'Report and statistic',
      children: [
        {
          title: 'Báo cáo giao dịch và dòng tiền',
          icon: 'bx:envelope',
          path: '/report-and-statistic/transaction-flow'
        },
        {
          title: 'Báo cáo rủi ro và bảo mật',
          icon: 'bx:envelope',
          path: '/report-and-statistic/risk-and-security'
        }
        ,
        {
          title: 'Báo cáo khách hàng và tiếp thị',
          icon: 'bx:envelope',
          path: '/report-and-statistic/customer-and-promotion'
        }
      ]
    },
    {
      icon: "bx:home-circle",
      title: "Management",
      children: [
        {
          title: "Asset management and custody",
          icon: "bx:envelope",
          path: "/asset-management",
        },
        {
          title: "Customer Management",
          icon: "bx:envelope",
          path: "/customer-management",
        },
        {
          title: "Transaction Management",
          icon: "bx:envelope",
          path: "/transactions-management",
        },
        {
          title: "Employee Management",
          icon: "bx:envelope",
          path: "/employee-management",
        },
        {
          title: "Role Management",
          icon: "bx:envelope",
          path: "/role-management",
        },
        {
          title: "Savings Management",
          icon: "bx:envelope",
          path: "/savings-management",
        },
        {
          title: "Term Management",
          icon: "bx:envelope",
          path: "/term-management",
        },
        {
          title: "USDC Orders Management",
          icon: "bx:envelope",
          children: [
            {
              title: "Buy Orders",
              path: "/usdc-orders-management/buy-orders",
            },
            {
              title: "Sell Orders",
              path: "/usdc-orders-management/sell-orders",
            },
          ],
        },
      ],
    },
    {
      icon: "bx:grid-alt",
      title: "Profile",
      children: [
        {
          title: "Security",
          path: "/user-profile/security",
        },
        {
          title: "Saved Categories",
          path: "/user-profile/account",
        },
        // {
        //   title: 'Lịch sử giao dịch',
        //   path: '/user-profile/billing-plan/'
        // },
        {
          title: "Information",
          path: "/user-profile/notification/",
        },
      ],
    },
  ]
}

export default navigation
