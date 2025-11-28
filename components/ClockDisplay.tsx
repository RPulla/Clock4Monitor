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
        // Occupy 90% of screen width directly
        widthClass = 'w-[90vw]';
        break;
      case ClockSize.MEDIUM:
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
  const textShadowStyle = background === BackgroundTheme.WHITE 
    ? 'none' 
    : `0 0 30px ${color}60`;

  return (
    <div className={`flex items-center justify-center transition-all duration-500 ease-in-out mx-auto ${widthClass}`}>
      <svg 
        width="100%" 
        height="100%" 
        // ViewBox ajustado para "Zoom In" (850x300) para preencher melhor a área de 90%
        viewBox="0 0 850 300" 
        preserveAspectRatio="xMidYMid meet"
        className="overflow-visible w-full h-full"
        aria-label={`Hora atual: ${timeStr.hours} e ${timeStr.minutes}`}
      >
        <text 
          x="50%" 
          y="50%" 
          dominantBaseline="central" 
          textAnchor="middle"
          fill={color}
          style={{ 
            textShadow: textShadowStyle,
            fontFamily: fontFamily,
            fontSize: '300px',
            fontWeight: 'bold'
          }}
          className="select-none"
        >
          {/* Renderização linear para garantir alinhamento de baseline perfeito */}
          {timeStr.hours}<tspan className="animate-blink" dy="-0.125em">:</tspan><tspan dy="0.125em">{timeStr.minutes}</tspan>
        </text>
      </svg>
    </div>
  );
};