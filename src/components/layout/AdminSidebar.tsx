'use client';
import React, { useMemo, useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { usePermissions } from '@/hooks/usePermission';
import { getMenuItems, filterMenuByPermissions } from '@/config/sidebarConfig';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const AdminSidebar: React.FC<SidebarProps> = ({ 
  isOpen, 
  onToggle, 
  activeSection 
}) => {
  const pathname = usePathname();
  const { permissions, loading: permissionsLoading } = usePermissions();
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);

  
  const visibleMenuItems = useMemo(() => {
    const allMenuItems = getMenuItems();
    
    if (permissionsLoading) {
      return allMenuItems.filter(item => item.alwaysShow);
    }

    
    const userPermissionSlugs = permissions?.map(p => p?.slug).filter(Boolean) || [];
    return filterMenuByPermissions(allMenuItems, userPermissionSlugs);
  }, [permissions, permissionsLoading]);

 
  useEffect(() => {
    visibleMenuItems.forEach(item => {
      if (item.submenu) {
      
        const isActive = item.submenu.some(sub => {
          
          if (pathname === sub.href) return true;
          
          if (sub.href !== '/admin' && pathname.startsWith(sub.href + '/')) return true;
          return false;
        });
        
        if (isActive) {
          setOpenSubmenu(item.id);
        }
      }
    });
  }, [pathname, visibleMenuItems]);

  const toggleSubmenu = (itemId: string) => {
    setOpenSubmenu(prev => prev === itemId ? null : itemId);
  };

  
  const isPathActive = (itemHref: string | undefined): boolean => {
    if (!itemHref) return false;
    
    
    if (itemHref === '/admin') {
      return pathname === '/admin';
    }
    
   
    return pathname === itemHref || pathname.startsWith(itemHref + '/');
  };

  const icons = {
    dashboard: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
        <polyline points="9,22 9,12 15,12 15,22"/>
      </svg>
    ),
    products: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="3" width="7" height="7"/>
        <rect x="14" y="3" width="7" height="7"/>
        <rect x="14" y="14" width="7" height="7"/>
        <rect x="3" y="14" width="7" height="7"/>
      </svg>
    ),
    inventory: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M3 9h18v12H3z"/>
        <path d="M3 6h18V3H3z"/>
        <path d="M12 9V3"/>
      </svg>
    ),
    orders: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
        <line x1="3" y1="6" x2="21" y2="6"/>
        <path d="M16 10a4 4 0 0 1-8 0"/>
      </svg>
    ),
    users: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    ),
    promotions: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/>
        <line x1="7" y1="7" x2="7.01" y2="7"/>
      </svg>
    ),
    settings: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="3"/>
        <path d="M12 1v6m0 6v6m8.66-15l-5.2 3m-2.92 6l-5.2 3m13.12 0l-5.2-3m-2.92-6l-5.2-3"/>
      </svg>
    ),
    posts: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
        <polyline points="14,2 14,8 20,8"/>
        <line x1="16" y1="13" x2="8" y2="13"/>
        <line x1="16" y1="17" x2="8" y2="17"/>
        <polyline points="10,9 9,9 8,9"/>
      </svg>
    ),
    reports: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <line x1="18" y1="20" x2="18" y2="10"/>
        <line x1="12" y1="20" x2="12" y2="4"/>
        <line x1="6" y1="20" x2="6" y2="14"/>
      </svg>
    ),
  };

  const ChevronIcon = ({ isOpen }: { isOpen: boolean }) => (
    <svg 
      width="16" 
      height="16" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2"
      className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
    >
      <polyline points="6 9 12 15 18 9"/>
    </svg>
  );

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={onToggle}
        />
      )}
      
      <div className={`fixed left-0 top-0 h-full bg-white shadow-lg transition-all duration-300 z-30 overflow-y-auto ${
        isOpen ? 'w-64' : 'w-0 overflow-hidden'
      } lg:w-64 lg:relative lg:shadow-none border-r border-gray-200`}>
        <div className="p-6">
          <div className="flex items-center space-x-3 mb-8">
            <div className="w-10 h-10 bg-teal-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">Z</span>
            </div>
            <span className="text-xl font-bold text-gray-800">ZARVIS</span>
          </div>
          
          {permissionsLoading && (
            <div className="flex items-center justify-center py-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-teal-500"></div>
            </div>
          )}
          
          <nav className="space-y-1">
            {visibleMenuItems.map((item) => {
              const hasSubmenu = item.submenu && item.submenu.length > 0;
              const isSubmenuOpen = openSubmenu === item.id;
                        const isParentActive = hasSubmenu && item.submenu?.some(sub => 
                isPathActive(sub.href)
              );
              

              const isActive = !hasSubmenu && isPathActive(item.href);

              return (
                <div key={item.id}>
                  {hasSubmenu ? (
                    
                    <button
                      onClick={() => toggleSubmenu(item.id)}
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-left transition-all duration-200 group ${
                        isParentActive
                          ? 'bg-teal-50 text-teal-600'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`${isParentActive ? 'text-teal-600' : 'text-gray-400'} group-hover:text-gray-600`}>
                          {icons[item.id as keyof typeof icons]}
                        </div>
                        <span className="font-medium text-sm">{item.label}</span>
                      </div>
                      <ChevronIcon isOpen={isSubmenuOpen} />
                    </button>
                  ) : (
                    // Menu không có submenu - hiển thị link
                    <Link
                      href={item.href || '#'}
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-left transition-all duration-200 group ${
                        isActive
                          ? 'bg-teal-50 text-teal-600 border-r-3 border-teal-500'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`${isActive ? 'text-teal-600' : 'text-gray-400'} group-hover:text-gray-600`}>
                          {icons[item.id as keyof typeof icons]}
                        </div>
                        <span className="font-medium text-sm">{item.label}</span>
                      </div>
                    </Link>
                  )}

                  {/* Hiển thị submenu khi được mở */}
                  {hasSubmenu && isSubmenuOpen && (
                    <div className="ml-4 mt-1 space-y-1 border-l-2 border-gray-200 pl-4">
                      {item.submenu?.map((subItem) => {
                        // ===== FIX 7: Kiểm tra submenu active chính xác =====
                        const isSubActive = isPathActive(subItem.href);
                        
                        return (
                          <Link
                            key={subItem.id}
                            href={subItem.href}
                            className={`block px-4 py-2 rounded-lg text-sm transition-all duration-200 ${
                              isSubActive
                                ? 'bg-teal-50 text-teal-600 font-medium'
                                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                            }`}
                          >
                            {subItem.label}
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>
        </div>
      </div>
    </>
  );
};

export default AdminSidebar;