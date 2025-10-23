export interface MenuItem {
  id: string;
  label: string;
  href?: string;
  icon: React.ReactNode;
  requiredPermissions?: string[];
  requireAll?: boolean;
  alwaysShow?: boolean;
  submenu?: SubMenuItem[];
}

export interface SubMenuItem {
  id: string;
  label: string;
  href: string;
  requiredPermissions?: string[];
  requireAll?: boolean;
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
    id: 'inventory',
    label: 'Quản lý kho',
    icon: null,
    requiredPermissions: [],
    requireAll: false,
    submenu: [
      {
        id: 'inventory-show',
        label: 'Hàng tồn kho',
        href: '/admin/branches/inventory',
        requiredPermissions: ['view-inventory'],
        requireAll: false,
      },
      {
        id: 'inventory-check',
        label: 'Kiểm kho',
        href: '/admin/inventory/check',
        requiredPermissions: ['manage-inventory'],
        requireAll: false,
      },
      {
        id: 'inventory-import',
        label: 'Quản lý nhập hàng',
        href: '/admin/inventory/import',
        requiredPermissions: [
          // 'view-inventory',
          'request-import',
          'approve-import',
          'manage-payment',
          'receive-import'
        ],
        requireAll: false,
      },
      {
        id: 'inventory-export',
        label: 'Quản lý xuất hàng',
        href: '/admin/inventory/export',
        requiredPermissions: [
          'view-inventory',
          'manage-inventory',
          'request-transfer',
          'review-branch-transfer',
          'review-warehouse-transfer',
          'ship-transfer',
          'receive-transfer',
          'cancel-transfer',
          'create-disposal'
        ],
        requireAll: false,
      },
    ],
  },
  {
    id: 'orders',
    label: 'Quản lý đơn hàng',
    href: '/admin/orders',
    icon: null,
    requiredPermissions: ['manage-orders'],
    requireAll: false,
  },
  {
    id: 'users',
    label: 'Quản lý người dùng',
    icon: null,
    requiredPermissions: ['manage-customers', 'manage-users', 'manage-roles', 'manage-permissions'],
    requireAll: false,
    submenu: [
      {
        id: 'customers',
        label: 'Quản lý khách hàng',
        href: '/admin/customers',
        requiredPermissions: ['manage-customers'],
      },
      {
        id: 'staffs',
        label: 'Quản lý nhân viên',
        href: '/admin/staffs',
        requiredPermissions: ['manage-users'],
      },
      {
        id: 'roles',
        label: 'Quản lý vai trò',
        href: '/admin/roles',
        requiredPermissions: ['manage-roles'],
      },
      {
        id: 'permissions',
        label: 'Quản lý quyền hạn',
        href: '/admin/permissions',
        requiredPermissions: ['manage-permissions'],
      },
      {
        id: 'logs',
        label: 'Quản lý đăng nhập nhân viên',
        href: '/admin/logs',
        requiredPermissions: ['manage-users'],
      },
    ],
  },
  {
    id: 'content',
    label: 'Quản lý nội dung',
    icon: null,
    requiredPermissions: ['manage-blog'],
    requireAll: false,
    submenu: [
      {
        id: 'post-categories',
        label: 'Quản lý danh mục bài viết',
        href: '/admin/categories/post_category',
        requiredPermissions: ['manage-blog'],
      },
      {
        id: 'tags',
        label: 'Quản lý thẻ',
        href: '/admin/tags',
        requiredPermissions: ['manage-blog'],
      },
      {
        id: 'posts',
        label: 'Quản lý bài viết',
        href: '/admin/posts',
        requiredPermissions: ['manage-blog'],
      },
    ],
  },
  {
    id: 'promotions',
    label: 'Quản lý khuyến mãi',
    href: '/admin/coupons',
    icon: null,
    requiredPermissions: ['manage-coupons'],
  },
  {
    id: 'settings',
    label: 'Cài đặt hệ thống',
    icon: null,
    requiredPermissions: ['manage-branches', 'manage-suppliers', 'manage-categories'],
    requireAll: false,
    submenu: [
      {
        id: 'branches',
        label: 'Quản lý chi nhánh',
        href: '/admin/branches',
        requiredPermissions: ['manage-branches'],
      },
      {
        id: 'suppliers',
        label: 'Quản lý nhà cung cấp',
        href: '/admin/suppliers',
        requiredPermissions: ['manage-suppliers'],
      },
      {
        id: 'categories',
        label: 'Quản lý danh mục sản phẩm',
        href: '/admin/categories',
        requiredPermissions: ['manage-categories'],
      },
    ],
  },
  {
    id: 'reports',
    label: 'Báo cáo & Thống kê',
    href: '/admin/reports',
    icon: null,
    requiredPermissions: ['view-reports', 'view-dashboard'],
    requireAll: false,
  },
];

export const filterMenuByPermissions = (
  menuItems: MenuItem[],
  userPermissions: string[]
): MenuItem[] => {
  return menuItems
    .map(item => {
      if (item.submenu) {
        const filteredSubmenu = item.submenu.filter(subItem => {
          if (!subItem.requiredPermissions || subItem.requiredPermissions.length === 0) {
            return true;
          }

          if (subItem.requireAll) {
            return subItem.requiredPermissions.every(perm => 
              userPermissions.includes(perm)
            );
          }

          return subItem.requiredPermissions.some(perm => 
            userPermissions.includes(perm)
          );
        });

        if (filteredSubmenu.length === 0 && !item.alwaysShow) {
          return null;
        }

        return { ...item, submenu: filteredSubmenu };
      }

      if (item.alwaysShow) {
        return item;
      }

      if (!item.requiredPermissions || item.requiredPermissions.length === 0) {
        return item;
      }

      if (item.requireAll) {
        return item.requiredPermissions.every(perm => 
          userPermissions.includes(perm)
        ) ? item : null;
      }

      return item.requiredPermissions.some(perm => 
        userPermissions.includes(perm)
      ) ? item : null;
    })
    .filter((item): item is MenuItem => item !== null);
};