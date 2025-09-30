import React from 'react';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: (string | BreadcrumbItem)[];
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ items }) => {
  return (
    <nav className="flex items-center space-x-2 text-sm mb-6" aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          const itemLabel = typeof item === 'string' ? item : item.label;
          const itemHref = typeof item === 'object' ? item.href : undefined;
          
          return (
            <li key={index} className="flex items-center">
              {index > 0 && (
                <svg 
                  width="16" 
                  height="16" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  className="mx-2 text-gray-400"
                >
                  <polyline points="9,18 15,12 9,6"/>
                </svg>
              )}
              
              {itemHref && !isLast ? (
                <a
                  href={itemHref}
                  className="text-gray-500 hover:text-gray-700 transition-colors"
                >
                  {itemLabel}
                </a>
              ) : (
                <span 
                  className={
                    isLast 
                      ? 'text-gray-900 font-medium' 
                      : 'text-gray-500'
                  }
                  aria-current={isLast ? 'page' : undefined}
                >
                  {itemLabel}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumb;