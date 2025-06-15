import { useState } from 'react';

interface TooltipProps {
  children: React.ReactNode;
  content: string;
  x?: number;
  y?: number;
}

export default function Tooltip({ children, content, x = 0, y = 0 }: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseEnter = (event: React.MouseEvent) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setPosition({
      x: event.clientX - rect.left + x,
      y: event.clientY - rect.top + y
    });
    setIsVisible(true);
  };

  const handleMouseLeave = () => {
    setIsVisible(false);
  };

  const handleMouseMove = (event: React.MouseEvent) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setPosition({
      x: event.clientX - rect.left + x,
      y: event.clientY - rect.top + y
    });
  };

  return (
    <div 
      className="relative inline-block"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
    >
      {children}
      {isVisible && (
        <div
          className="absolute z-50 px-3 py-2 text-sm text-white bg-gray-900 rounded-lg shadow-lg pointer-events-none whitespace-nowrap"
          style={{
            left: position.x + 10,
            top: position.y - 40,
            transform: 'translateX(-50%)'
          }}
        >
          {content}
          {/* Arrow */}
          <div
            className="absolute w-2 h-2 bg-gray-900 transform rotate-45"
            style={{
              left: '50%',
              bottom: '-4px',
              marginLeft: '-4px'
            }}
          />
        </div>
      )}
    </div>
  );
}
