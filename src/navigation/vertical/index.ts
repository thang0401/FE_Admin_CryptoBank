// ** Type import
import { VerticalNavItemsType } from 'src/@core/layouts/types'

const navigation = (): VerticalNavItemsType => {
  return [
    {
      icon: 'bx:home-circle',
      title: 'Trang chủ',
      path: '/home'
    },
    {
      icon: 'bx:home-circle',
      title: 'Quản lý',
      children: [
        {
          title: 'Quản lý ví tổng',
          icon: 'bx:envelope',
          path: '/crypto-management'
        },
        {
          title: 'Quản lý khách hàng',
          icon: 'bx:envelope',
          path: '/customer-management'
        },
        {
          title: 'Quản lý giao dịch',
          icon: 'bx:envelope',
          path: '/transactions-management'
        }
        ,
        {
          title: 'Quản lý nhân viên',
          icon: 'bx:envelope',
          path: '/user-management'
        }
        ,
        {
          title: 'Quản lý role',
          icon: 'bx:envelope',
          path: '/role-management'
        }
      ]
    },

    {
      icon: 'bx:grid-alt',
      title: 'Trang cá nhân',
      children: [
        {
          title: 'Bảo mật',
          path: '/user-profile/security'
        },

        {
          title: 'Danh mục lưu trữ',
          path: '/user-profile/account'

        },
        {
          title: 'Lịch sử giao dịch',
          path: '/user-profile/billing-plan/'
        },
        {
          title: 'Thông tin',
          path: '/user-profile/notification/'
        }
      ]
    }
  ]
}

export default navigation
