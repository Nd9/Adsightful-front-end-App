import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  color?: 'blue' | 'green' | 'yellow' | 'red';
  className?: string;
}

const Badge: React.FC<BadgeProps> = ({ 
  children, 
  color = 'blue',
  className = '' 
}) => {
  // Define Tailwind classes for different colors
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-800',
    green: 'bg-green-100 text-green-800',
    yellow: 'bg-yellow-100 text-yellow-800',
    red: 'bg-red-100 text-red-800'
  };
  
  const badgeClass = `inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colorClasses[color]} ${className}`;
  
  return (
    <span className={badgeClass}>
      {children}
    </span>
  );
};

export default Badge; 