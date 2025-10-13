export interface MenuItem {
  id: string;
  label: string;
  href: string;
  icon: React.ReactNode;
  requiredPermissions?: string[];
  requireAll?: boolean;
  alwaysShow?: boolean;
}

export const getMenuItems = (): MenuItem[] => [
  {
    id: 'dashboard',
    label: 'Dashboard',
    href: '/admin',
    icon: null,
    alwaysShow: true,
  },
  {
    id: 'products',
    label: 'Quản lý sản phẩm',
    href: '/admin/products',
    icon: null,
    requiredPermissions: ['manage-products', 'view-products'],
    requireAll: false,
  },
  {
    id: 'categories',
    label: 'Quản lý danh mục',
    href: '/admin/categories',
    icon: null,
    requiredPermissions: ['manage-products'],
  },
  {
    id: 'customers',
    label: 'Quản lý khách hàng',
    href: '/admin/customers',
    icon: null,
    requiredPermissions: ['manage-customers'],
  },
  {
    id: 'banners',
    label: 'Quản lý banner',
    href: '/admin/banners',
    icon: null,
    requiredPermissions: ['manage-banners'],
  },
  {
    id: 'orders',
    label: 'Quản lý đơn hàng',
    href: '/admin/orders',
    icon: null,
    requiredPermissions: ['manage-orders', 'view-orders'],
    requireAll: false,
  },
  {
    id: 'reports',
    label: 'Báo cáo thống kê',
    href: '/admin/reports',
    icon: null,
    requiredPermissions: ['view-dashboard'],
  },
  {
    id: 'roles',
    label: 'Quản lý vai trò',
    href: '/admin/roles',
    icon: null,
    requiredPermissions: ['manage-roles'],
  },
  {
    id: 'permissions',
    label: 'Quản lý quyền hạn',
    href: '/admin/permissions',
    icon: null,
    requiredPermissions: ['manage-permissions'],
  },
  {
    id: 'inventory',
    label: 'Quản lý kho',
    href: '/admin/inventory',
    icon: null,
    requiredPermissions: ['manage-inventory'],
  },
];

export const filterMenuByPermissions = (
  menuItems: MenuItem[],
  userPermissions: string[]
): MenuItem[] => {
  return menuItems.filter(item => {
    if (item.alwaysShow) {
      return true;
    }

    if (!item.requiredPermissions || item.requiredPermissions.length === 0) {
      return true;
    }

    if (item.requireAll) {
      return item.requiredPermissions.every(perm => 
        userPermissions.includes(perm)
      );
    }

    return item.requiredPermissions.some(perm => 
      userPermissions.includes(perm)
    );
  });
};