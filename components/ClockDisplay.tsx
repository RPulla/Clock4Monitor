import React, { useEffect, useState } from 'react';
import { BackgroundTheme, ClockSize } from '../types';

interface ClockDisplayProps {
  color: string;
  size: ClockSize;
  gmtOffset: number;
  background: BackgroundTheme;
  fontFamily?: string;
  autoWidth?: boolean; // If true, fills parent width instead of using fixed sizing logic
}

export const ClockDisplay: React.FC<ClockDisplayProps> = ({ 
  color, 
  size, 
  gmtOffset, 
  background, 
  fontFamily = "'Orbitron', sans-serif",
  autoWidth = false 
}) => {
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
        viewBox="0 0 400 120" 
        preserveAspectRatio="xMidYMid meet"
        className="overflow-visible w-full h-full"
        aria-label={`Hora atual: ${timeStr.hours} e ${timeStr.minutes}`}
      >
        <g 
          fill={color}
          style={{ 
            textShadow: textShadowStyle,
            fontFamily: fontFamily,
            fontSize: '130px',
            fontWeight: 'bold'
          }}
        >
          {/* Hours - Aligned to the End (Right of the left half) */}
          <text 
            x="46%" 
            y="55%" 
            dominantBaseline="central" 
            textAnchor="end"
            className="select-none"
          >
            {timeStr.hours}
          </text>

          {/* Colon - Centered */}
          <text 
            x="50%" 
            y="52%" 
            dominantBaseline="central" 
            textAnchor="middle"
            className="select-none animate-blink"
          >
            :
          </text>

          {/* Minutes - Aligned to the Start (Left of the right half) */}
          <text 
            x="54%" 
            y="55%" 
            dominantBaseline="central" 
            textAnchor="start"
            className="select-none"
          >
            {timeStr.minutes}
          </text>
        </g>
      </svg>
    </div>
  );
};