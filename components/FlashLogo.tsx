import React from 'react';

interface FlashLogoProps {
  className?: string;
  fillColor?: string;
}

export const FlashLogo: React.FC<FlashLogoProps> = ({ className = "w-6 h-6", fillColor = "text-indigo-400" }) => {
  return (
    <svg 
      viewBox="0 0 24 24" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      {/* Card Shape Background */}
      <path 
        d="M19 5H5C3.89543 5 3 5.89543 3 7V17C3 18.1046 3.89543 19 5 19H19C20.1046 19 21 18.1046 21 17V7C21 5.89543 20.1046 5 19 5Z" 
        className="text-gray-400 opacity-30"
        strokeWidth="1.5"
      />
      
      {/* Lightning Flash - Centered and overlaying */}
      <path 
        d="M13 2L4.5 13.5H11.5L10.5 22L19.5 9.5H12.5L13 2Z" 
        className={fillColor}
        fill="currentColor"
        stroke="currentColor" 
        strokeWidth="1.5"
      />
    </svg>
  );
};