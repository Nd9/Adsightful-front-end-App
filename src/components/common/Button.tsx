import React, { ReactNode, ButtonHTMLAttributes } from 'react';
import { colors, transitions } from '../../styles/theme';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'text';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  isLoading?: boolean;
  loadingText?: string;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  leftIcon,
  rightIcon,
  isLoading = false,
  loadingText,
  className = '',
  disabled = false,
  ...rest
}) => {
  // Base classes
  let buttonClasses = `inline-flex items-center justify-center font-medium rounded focus:outline-none focus:ring-2 focus:ring-offset-2 ${transitions.DEFAULT} `;
  
  // Size classes
  switch (size) {
    case 'sm':
      buttonClasses += 'px-2.5 py-1.5 text-xs ';
      break;
    case 'lg':
      buttonClasses += 'px-6 py-3 text-base ';
      break;
    case 'md':
    default:
      buttonClasses += 'px-4 py-2 text-sm ';
  }
  
  // Variant classes
  switch (variant) {
    case 'secondary':
      buttonClasses += `bg-secondary-500 text-white hover:bg-secondary-600 focus:ring-secondary-500 `;
      break;
    case 'outline':
      buttonClasses += `border border-primary-500 text-primary-500 bg-transparent hover:bg-primary-50 focus:ring-primary-500 `;
      break;
    case 'text':
      buttonClasses += `text-primary-500 bg-transparent hover:bg-primary-50 focus:ring-primary-500 `;
      break;
    case 'primary':
    default:
      buttonClasses += `bg-primary-500 text-white hover:bg-primary-600 focus:ring-primary-500 shadow-md hover:shadow-lg transition-all duration-200 `;
  }
  
  // Width, disabled, and additional classes
  buttonClasses += fullWidth ? 'w-full ' : '';
  buttonClasses += disabled || isLoading ? 'opacity-60 cursor-not-allowed ' : '';
  buttonClasses += className;

  return (
    <button
      className={buttonClasses}
      disabled={disabled || isLoading}
      {...rest}
    >
      {isLoading ? (
        <>
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          {loadingText || children}
        </>
      ) : (
        <>
          {leftIcon && <span className="mr-2">{leftIcon}</span>}
          {children}
          {rightIcon && <span className="ml-2">{rightIcon}</span>}
        </>
      )}
    </button>
  );
};

export default Button; 