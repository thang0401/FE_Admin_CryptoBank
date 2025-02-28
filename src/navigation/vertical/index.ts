// ** Type import
import { VerticalNavItemsType } from 'src/@core/layouts/types'

const navigation = (): VerticalNavItemsType => {
  return [
    {
      icon: 'bx:home-circle',
      title: 'Home',
      path: '/home'
    },
    {
      icon: 'bx:home-circle',
      title: 'Management',
      children: [
        {
          title: 'Wallet Management',
          icon: 'bx:envelope',
          path: '/crypto-management'
        },
        {
          title: 'Customer Management',
          icon: 'bx:envelope',
          path: '/customer-management'
        },
        {
          title: 'Transaction Management',
          icon: 'bx:envelope',
          path: '/transactions-management'
        }
        ,
        {
          title: 'Employee Management',
          icon: 'bx:envelope',
          path: '/employee-management'
        }
        ,
        {
          title: 'Role Management',
          icon: 'bx:envelope',
          path: '/role-management'
        },
        {
          title: 'Savings Management',
          icon: 'bx:envelope',
          path: '/savings-management'
        }
      ]
    },

    {
      icon: 'bx:grid-alt',
      title: 'Profile',
      children: [
        {
          title: 'Security',
          path: '/user-profile/security'
        },

        {
          title: 'Saved Categories',
          path: '/user-profile/account'

        },
        // {
        //   title: 'Lịch sử giao dịch',
        //   path: '/user-profile/billing-plan/'
        // },
        {
          title: 'Information',
          path: '/user-profile/notification/'
        }
      ]
    }
  ]
}

export default navigation
