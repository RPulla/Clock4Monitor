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
    // Atualiza a cada segundo, mas sem piscar
    const timer = setInterval(updateTime, 1000);

    return () => clearInterval(timer);
  }, [gmtOffset]);

  // Determine width based on size or autoWidth
  let widthClass = 'w-full';
  if (!autoWidth) {
    switch (size) {
      case ClockSize.FULLSCREEN:
        // Occupy 98% of screen width directly (Maximized size)
        widthClass = 'w-[98vw]';
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

  // Common font style
  const fontStyle = {
    textShadow: textShadowStyle,
    fontFamily: fontFamily,
    fontSize: '300px',
    fontWeight: 'bold'
  };

  return (
    <div className={`flex items-center justify-center transition-all duration-500 ease-in-out mx-auto ${widthClass}`}>
      <svg 
        width="100%" 
        height="100%" 
        // ViewBox aumentado para 1100 para evitar cortes laterais em fontes largas (Orbitron)
        viewBox="0 0 1100 300" 
        preserveAspectRatio="xMidYMid meet"
        className="overflow-visible w-full h-full"
        aria-label={`Hora atual: ${timeStr.hours}:${timeStr.minutes}`}
      >
        {/* Renderização em 3 partes independentes para garantir alinhamento absoluto */}
        
        {/* 1. HORAS: Deslocado para esquerda (44%) */}
        <text 
          x="44%" 
          y="52%" 
          dominantBaseline="central" 
          textAnchor="end"
          fill={color}
          style={fontStyle}
          className="select-none"
        >
          {timeStr.hours}
        </text>

        {/* 2. DOIS PONTOS: Deslocado para esquerda (48%) */}
        <text 
          x="48%" 
          y="49%" 
          dominantBaseline="central" 
          textAnchor="middle"
          fill={color}
          style={fontStyle}
          className="select-none"
        >
          :
        </text>

        {/* 3. MINUTOS: Deslocado para esquerda (52%) */}
        <text 
          x="52%" 
          y="52%" 
          dominantBaseline="central" 
          textAnchor="start"
          fill={color}
          style={fontStyle}
          className="select-none"
        >
          {timeStr.minutes}
        </text>

      </svg>
    </div>
  );
};