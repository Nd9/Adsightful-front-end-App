import React, { InputHTMLAttributes, ReactNode } from 'react';
import { colors } from '../../styles/theme';

interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  isRequired?: boolean;
  isFullWidth?: boolean;
  inputClassName?: string;
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  error,
  hint,
  leftIcon,
  rightIcon,
  isRequired = false,
  isFullWidth = true,
  className = '',
  inputClassName = '',
  disabled = false,
  ...rest
}) => {
  const id = rest.id || `input-${Math.random().toString(36).substr(2, 9)}`;
  
  return (
    <div className={`mb-4 ${isFullWidth ? 'w-full' : ''} ${className}`}>
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
          {label}
          {isRequired && <span className="ml-1 text-red-500">*</span>}
        </label>
      )}
      
      <div className="relative">
        {leftIcon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-gray-500">{leftIcon}</span>
          </div>
        )}
        
        <input
          id={id}
          className={`
            block rounded-md shadow-sm 
            ${leftIcon ? 'pl-10' : ''} 
            ${rightIcon ? 'pr-10' : ''} 
            ${error 
              ? 'border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500' 
              : 'border-gray-300 focus:ring-primary-500 focus:border-primary-500'
            }
            ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''}
            ${isFullWidth ? 'w-full' : ''}
            ${inputClassName}
          `}
          disabled={disabled}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
          {...rest}
        />
        
        {rightIcon && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <span className="text-gray-500">{rightIcon}</span>
          </div>
        )}
      </div>
      
      {error && (
        <p className="mt-1 text-sm text-red-600" id={`${id}-error`}>
          {error}
        </p>
      )}
      
      {!error && hint && (
        <p className="mt-1 text-sm text-gray-500" id={`${id}-hint`}>
          {hint}
        </p>
      )}
    </div>
  );
};

export default InputField; 