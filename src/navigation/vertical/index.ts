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
      ]
    },
    {
      icon: 'bx:customize',
      title: 'Giao dịch ngay',
      children: [
        {
          title: 'Danh mục lưu trữ',
          icon: 'bx:envelope',
          path: '/trade-now/portfolio/personal-portfolio'
        },
        {
          title: 'Nạp tài sản',
          icon: 'bx:send',
          path: '/trade-now/deposit-asset'
        },
        {
          title: 'Chuyển tài sản ',
          icon: 'bx:transfer',
          path: '/trade-now/transfer-asset'
        },
        {
          title: 'Rút tài sản',
          icon: 'bx:asset',
          path: '/trade-now/withdraw-asset'
        }
      ]
    },
    {
      icon: 'bx:collection',
      title: 'Lịch sử giao dịch',
      path: '/transaction-history'
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
    },
    {
      title: 'Blog',
      icon: 'bx:bar-chart-square',
      path: '/blog'
    },
    {
      icon: 'bx:palette',
      title: 'Về chúng tôi',
      path: '/about-us'
    },
    {
      title: 'Khác ',
      icon: 'bx:dots-horizontal-rounded',
      path: '/test-ui'
    }
  ]
}

export default navigation
