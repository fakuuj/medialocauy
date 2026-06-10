import React from 'react';

const SmileyFace = ({ className = "" }) => {
  return (
    <svg 
      className={`absolute ${className}`} 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="50" cy="50" r="45" stroke="currentColor" strokeWidth="4" fill="transparent"/>
      {/* Eyes */}
      <line x1="35" y1="35" x2="35" y2="45" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
      <line x1="65" y1="35" x2="65" y2="45" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
      {/* Smile */}
      <path d="M 30 60 Q 50 80 70 60" stroke="currentColor" strokeWidth="4" strokeLinecap="round" fill="transparent" />
    </svg>
  );
};

export default SmileyFace;
