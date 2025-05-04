import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { transitions } from '../../styles/theme';

export interface Step {
  id: string;
  label: string;
  icon?: React.ReactNode;
  description?: string;
}

interface StepIndicatorProps {
  steps: Step[];
  currentStep: number;
  onChange?: (step: number) => void;
  clickable?: boolean;
  vertical?: boolean;
}

const StepIndicator: React.FC<StepIndicatorProps> = ({
  steps,
  currentStep,
  onChange,
  clickable = false,
  vertical = false
}) => {
  const handleStepClick = (index: number) => {
    if (clickable && onChange) {
      onChange(index);
    }
  };

  if (vertical) {
    return (
      <div className="flex flex-col space-y-2">
        {steps.map((step, index) => {
          const isCompleted = index < currentStep;
          const isActive = index === currentStep;
          
          return (
            <div 
              key={step.id} 
              className={`flex items-start ${index !== steps.length - 1 ? 'pb-8' : ''} relative`}
            >
              {/* Connector line */}
              {index !== steps.length - 1 && (
                <div 
                  className={`absolute left-3.5 top-8 w-0.5 h-full ${
                    isCompleted ? 'bg-[#2563eb]' : 'bg-gray-200'
                  }`}
                />
              )}
              
              {/* Step circle */}
              <div 
                className={`
                  flex-shrink-0 h-7 w-7 rounded-full flex items-center justify-center 
                  ${isCompleted ? 'bg-[#2563eb]' : isActive ? 'border-2 border-[#2563eb]' : 'border-2 border-gray-200'} 
                  ${clickable ? 'cursor-pointer' : ''}
                  transition-all ${transitions.DEFAULT}
                `}
                onClick={() => handleStepClick(index)}
              >
                {isCompleted ? (
                  <FontAwesomeIcon icon={faCheck} className="h-3 w-3 text-white" />
                ) : (
                  <span className={`text-xs font-medium ${isActive ? 'text-[#2563eb]' : 'text-gray-400'}`}>
                    {index + 1}
                  </span>
                )}
              </div>
              
              {/* Step content */}
              <div className="ml-3 flex flex-col">
                <span 
                  className={`text-sm font-medium ${
                    isActive ? 'text-[#2563eb]' : isCompleted ? 'text-gray-900' : 'text-gray-500'
                  }`}
                >
                  {step.label}
                </span>
                {step.description && (
                  <span className="text-xs text-gray-500 mt-0.5">
                    {step.description}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Background progress line */}
      <div 
        className="absolute top-1/2 left-0 right-0 h-1 -translate-y-1/2 bg-gray-200 rounded-full"
        style={{
          width: `calc(100% - ${10 * 2}px)`,
          left: '10px',
          right: '10px'
        }}
        aria-hidden="true"
      />
      
      {/* Filled progress line */}
      <div 
        className="absolute top-1/2 left-0 h-1 -translate-y-1/2 bg-[#2563eb] rounded-full transition-all duration-500 ease-in-out"
        style={{ 
          width: `calc(${(currentStep / (steps.length - 1)) * 100}% - ${currentStep > 0 ? '10px' : '0px'})`,
          left: '10px'
        }}
        aria-hidden="true"
      />
      
      {/* Grid layout for equal spacing */}
      <div 
        className="relative grid" 
        style={{ gridTemplateColumns: `repeat(${steps.length}, 1fr)` }}
      >
        {steps.map((step, index) => {
          const isCompleted = index < currentStep;
          const isActive = index === currentStep;
          
          return (
            <div 
              key={step.id} 
              className={`flex flex-col items-center ${clickable ? 'cursor-pointer group' : ''}`}
              onClick={() => handleStepClick(index)}
            >
              {/* Step circle with animation and shadow */}
              <div 
                className={`
                  flex items-center justify-center h-10 w-10 rounded-full 
                  ${isCompleted 
                    ? 'bg-[#2563eb] text-white shadow-md' 
                    : isActive 
                      ? 'bg-white border-4 border-[#2563eb] shadow-lg'
                      : 'bg-white border-4 border-gray-300'
                  }
                  transition-all duration-300 ease-in-out
                  ${clickable && !isActive && !isCompleted ? 'group-hover:border-[#93c5fd] group-hover:scale-110' : ''}
                  ${isActive ? 'scale-110' : ''}
                `}
              >
                {isCompleted ? (
                  <FontAwesomeIcon icon={faCheck} className="h-5 w-5 text-white" />
                ) : (
                  <span 
                    className={`text-sm font-bold ${
                      isActive ? 'text-[#2563eb]' : 'text-gray-400'
                    }`}
                  >
                    {index + 1}
                  </span>
                )}
              </div>
              
              {/* Step label */}
              <span 
                className={`mt-3 text-sm font-medium transition-colors duration-300 text-center truncate w-full max-w-[120px] px-2
                  ${isActive ? 'text-[#2563eb]' : isCompleted ? 'text-gray-700' : 'text-gray-500'}
                  ${clickable && !isActive && !isCompleted ? 'group-hover:text-[#93c5fd]' : ''}
                `}
                title={step.label}
              >
                {step.label}
              </span>
              
              {/* Description (only shown for active step) */}
              {step.description && (isActive || isCompleted) && (
                <span className={`text-xs transition-opacity duration-300 text-center truncate w-full max-w-[120px] px-2
                  ${isActive ? 'opacity-100 text-gray-600' : 'opacity-70 text-gray-500'}`}
                  title={step.description}
                >
                  {step.description}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StepIndicator; 