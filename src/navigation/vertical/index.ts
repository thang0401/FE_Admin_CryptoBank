// navigation/vertical/index.tsx
import type { VerticalNavItemsType } from "src/@core/layouts/types";
import { UserDataType } from "src/context/types";

// Hàm kiểm tra xem một item có phải là NavLink không
const isNavLink = (item: any): item is { path?: string } => {
  return !('children' in item) && !('sectionTitle' in item);
};

// Hàm kiểm tra xem một item có phải là NavGroup không
const isNavGroup = (item: any): item is { children: any[] } => {
  return 'children' in item;
};

// Hàm lọc menu
const navigation = (user: UserDataType | null): VerticalNavItemsType => {
  const allowedUrls = user?.url || [];

  const fullMenu: VerticalNavItemsType = [
    {
      icon: "bx:bar-chart-alt",
      title: "Report and statistic",
      children: [
        {
          title: "Báo cáo giao dịch và dòng tiền",
          icon: "bx:transfer",
          path: "/report-and-statistic/transaction-flow",
        },
        {
          title: "Báo cáo rủi ro và bảo mật",
          icon: "bx:shield-alt",
          path: "/report-and-statistic/risk-and-security",
        },
        {
          title: "Báo cáo khách hàng và tiếp thị",
          icon: "bx:group",
          path: "/report-and-statistic/customer-and-promotion",
        },
      ],
    },
    {
      icon: "bx:briefcase",
      title: "Management",
      children: [
        {
          title: "Asset management and custody",
          icon: "bx:box",
          path: "/asset-management",
        },
        {
          title: "Customer Management",
          icon: "bx:group",
          path: "/customer-management",
        },
        {
          title: "Transaction Management",
          icon: "bx:transfer",
          path: "/transactions-management",
        },
        {
          title: "Employee Management",
          icon: "bx:users",
          path: "/employee-management",
        },
        {
          title: "Role Management",
          icon: "bx:key",
          path: "/role-management",
        },
        {
          title: "Savings Management",
          icon: "bx:coin-stack",
          path: "/savings-management",
        },
        {
          title: "Term Management",
          icon: "bx:calendar",
          path: "/term-management",
        },
        {
          icon: "bx:link",
          title: "Quản lý mã giới thiệu",
          path: "/referrals",
        },
        {
          title: "USDC Orders Management",
          icon: "bx:cart",
          children: [
            {
              title: "Buy Orders",
              icon: "bx:purchase-tag",
              path: "/usdc-orders-management/buy-orders",
            },
            {
              title: "Sell Orders",
              icon: "bx:purchase-tag-alt",
              path: "/usdc-orders-management/sell-orders",
            },
          ],
        },
      ],
    },
    {
      icon: "bx:user",
      title: "Profile",
      children: [
        {
          title: "Security",
          icon: "bx:lock",
          path: "/user-profile/security",
        },
        {
          title: "Saved Categories",
          icon: "bx:bookmark",
          path: "/user-profile/account",
        },
        {
          title: "Information",
          icon: "bx:info-circle",
          path: "/user-profile/notification/",
        },
      ],
    },
  ];

  const filterMenu = (menuItems: VerticalNavItemsType, allowedUrls: string[]): VerticalNavItemsType => {
    return menuItems
      .map((item) => {
        if (isNavGroup(item)) {
          // Xử lý NavGroup (có children)
          const filteredChildren = item.children
            .map((child) => {
              if (isNavGroup(child)) {
                // Xử lý NavGroup lồng nhau (submenu cấp 2)
                const filteredSubChildren = child.children.filter((subChild) =>
                  isNavLink(subChild) && allowedUrls.includes(subChild.path || '')
                );
                if (filteredSubChildren.length > 0) {
                  return { ...child, children: filteredSubChildren };
                }
                return null;
              }
              // Xử lý NavLink trong children
              return isNavLink(child) && allowedUrls.includes(child.path || '') ? child : null;
            })
            .filter((child) => child !== null);

          if (filteredChildren.length > 0) {
            return { ...item, children: filteredChildren };
          }
          return null;
        }
        // Xử lý NavLink hoặc NavSectionTitle
        return isNavLink(item) && allowedUrls.includes(item.path || '') ? item : null;
      })
      .filter((item) => item !== null) as VerticalNavItemsType;
  };

  return filterMenu(fullMenu, allowedUrls);
};

export default navigation;
