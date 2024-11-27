import React from 'react';

interface StatusIconProps {
  color?: string;
  size?: string;
}

export const StatusIcon: React.FC<StatusIconProps> = ({ color = "#000000", size = "136px" }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      xmlns="http://www.w3.org/2000/svg"
      fill={color}
      stroke={color}
      strokeWidth="0.1"
      transform="rotate(45)"
    >
      <g id="SVGRepo_iconCarrier">
        <g fill={color} fillRule="evenodd" clipRule="evenodd">
          <path d="M8 1.5a6.48 6.48 0 00-4.707 2.017.75.75 0 11-1.086-1.034A7.98 7.98 0 018 0a7.98 7.98 0 015.793 2.483.75.75 0 11-1.086 1.034A6.48 6.48 0 008 1.5zM1.236 5.279a.75.75 0 01.514.927 6.503 6.503 0 004.727 8.115.75.75 0 11-.349 1.459 8.003 8.003 0 01-5.82-9.986.75.75 0 01.928-.515zm13.528 0a.75.75 0 01.928.515 8.003 8.003 0 01-5.82 9.986.75.75 0 01-.35-1.459 6.503 6.503 0 004.728-8.115.75.75 0 01.514-.927z"></path>
          <path
            d="M8 4.5a3.5 3.5 0 100 7 3.5 3.5 0 000-7zM3 8a5 5 0 1110 0A5 5 0 013 8z"
            fill={color}
            opacity="1"
          ></path>
        </g>
      </g>
    </svg>

  );
};
