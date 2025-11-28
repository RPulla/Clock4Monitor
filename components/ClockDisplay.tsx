import React, { useEffect, useState } from 'react';
import { BackgroundTheme, ClockSize } from '../types';

interface ClockDisplayProps {
  color: string;
  size: ClockSize;
  gmtOffset: number;
  background: BackgroundTheme;
  autoWidth?: boolean; // If true, fills parent width instead of using fixed sizing logic
}

export const ClockDisplay: React.FC<ClockDisplayProps> = ({ color, size, gmtOffset, background, autoWidth = false }) => {
  const [timeStr, setTimeStr] = useState<{ hours: string; minutes: string }>({ hours: '--', minutes: '--' });

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      
      // Calculate UTC time in ms
      const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
      
      // Create new Date object for target timezone
      const targetTime = new Date(utc + (3600000 * gmtOffset));
      
      const hours = targetTime.getHours().toString().padStart(2, '0');
      const minutes = targetTime.getMinutes().toString().padStart(2, '0');
      
      setTimeStr({ hours, minutes });
    };

    updateTime();
    const timer = setInterval(updateTime, 1000);

    return () => clearInterval(timer);
  }, [gmtOffset]);

  // Determine width based on size or autoWidth
  let widthClass = 'w-full';
  if (!autoWidth) {
    switch (size) {
      case ClockSize.FULLSCREEN:
        widthClass = 'w-[88vw]';
        break;
      case ClockSize.MEDIUM:
        // Occupy 60% of screen size
        widthClass = 'w-[60vw]';
        break;
      case ClockSize.SMALL:
        widthClass = 'w-[35vw]';
        break;
      default:
        widthClass = 'w-full';
    }
  }

  // Determine text shadow based on background
  // If background is white, no glow. Otherwise, colored glow.
  const textShadowStyle = background === BackgroundTheme.WHITE 
    ? 'none' 
    : `0 0 30px ${color}60`;

  return (
    <div className={`flex items-center justify-center transition-all duration-500 ease-in-out ${widthClass}`}>
      <svg 
        width="100%" 
        height="100%" 
        viewBox="0 0 380 100" 
        preserveAspectRatio="xMidYMid meet"
        className="overflow-visible w-full h-full"
        aria-label={`Hora atual: ${timeStr.hours} e ${timeStr.minutes}`}
      >
        <text 
          x="50%" 
          y="50%" 
          className="font-digital font-bold tracking-widest select-none"
          fill={color}
          style={{ 
            textShadow: textShadowStyle,
            dominantBaseline: 'central',
            textAnchor: 'middle',
            fontSize: '110px',
          }}
        >
          {timeStr.hours}
          {/* Using dx for spacing around the colon */}
          <tspan className="animate-blink" dx="15" dy="-8">:</tspan>
          <tspan dx="15" dy="8">{timeStr.minutes}</tspan>
        </text>
      </svg>
    </div>
  );
};
