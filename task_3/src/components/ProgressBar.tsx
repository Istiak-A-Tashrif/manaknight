import React from 'react';
import { Check } from 'lucide-react';
import { useLocation } from 'react-router-dom';

const steps = [
  { path: '/upload', label: 'Upload' },
  { path: '/recipients', label: 'Recipients' },
  { path: '/editor', label: 'Editor' },
  { path: '/summary', label: 'Summary' },
];

export const ProgressBar: React.FC = () => {
  const location = useLocation();
  const currentStepIndex = steps.findIndex((step) => step.path === location.pathname);

  return (
    <div className="w-full max-w-3xl mx-auto mb-8">
      <div className="flex justify-between relative">
        {steps.map((step, index) => (
          <div
            key={step.path}
            className="flex flex-col items-center relative flex-1"
          >
            {/* Connection line positioned behind the circle */}
            {index < steps.length - 1 && (
              <div
                className={`absolute top-4 left-1/2 h-0.5 w-full z-0 ${
                  index < currentStepIndex ? 'bg-blue-600' : 'bg-gray-200'
                }`}
                style={{ transform: 'translateY(-50%)' }}
              />
            )}
            {/* Circle positioned above the line */}
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center relative z-10 ${
                index <= currentStepIndex
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-500'
              }`}
            >
              {index < currentStepIndex ? (
                <Check className="w-5 h-5" />
              ) : (
                index + 1
              )}
            </div>
            <div className="text-sm mt-2">{step.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
};