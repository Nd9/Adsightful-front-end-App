import React, { ReactNode } from 'react';
import { borderRadius, shadows } from '../../styles/theme';

interface CardProps {
  children: ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
  titleIcon?: ReactNode;
  actionButton?: ReactNode;
  noPadding?: boolean;
  onClick?: () => void;
}

const Card: React.FC<CardProps> = ({
  children,
  className = '',
  title,
  subtitle,
  titleIcon,
  actionButton,
  noPadding = false,
  onClick
}) => {
  return (
    <div 
      className={`bg-white border border-gray-100 rounded-lg ${shadows.md} hover:shadow-lg transition-shadow duration-200 ${className} ${onClick ? 'cursor-pointer' : ''}`}
      onClick={onClick}
    >
      {(title || subtitle) && (
        <div className="px-5 py-4 border-b border-gray-100 flex justify-between items-center">
          <div className="flex items-center">
            {titleIcon && (
              <div className="mr-3 text-primary-500">
                {titleIcon}
              </div>
            )}
            <div>
              {title && <h3 className="text-base font-medium text-gray-800">{title}</h3>}
              {subtitle && <p className="text-sm text-gray-500 mt-0.5">{subtitle}</p>}
            </div>
          </div>
          {actionButton && (
            <div>
              {actionButton}
            </div>
          )}
        </div>
      )}
      <div className={noPadding ? '' : 'p-5'}>
        {children}
      </div>
    </div>
  );
};

export default Card; 