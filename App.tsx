import { useState, useEffect, useCallback } from 'react';
import { ClockDisplay } from './components/ClockDisplay';
import { SettingsPanel } from './components/SettingsPanel';
import { BackgroundTheme, ClockConfig, ClockSize, AVAILABLE_FONTS } from './types';

// Default configuration
const DEFAULT_CONFIG: ClockConfig = {
  color: '#22c55e', // Default green
  size: ClockSize.MEDIUM,
  gmtOffset: -new Date().getTimezoneOffset() / 60, // Default to local system time
  background: BackgroundTheme.BLACK,
  fontFamily: AVAILABLE_FONTS[0].value,
};

export default function App() {
  const [config, setConfig] = useState<ClockConfig>(DEFAULT_CONFIG);
  const [isViewMode, setIsViewMode] = useState(false);
  const [isFullscreenMode, setIsFullscreenMode] = useState(false);

  // Handle configuration updates
  const updateConfig = (newConfig: Partial<ClockConfig>) => {
    setConfig((prev) => ({ ...prev, ...newConfig }));
  };

  // Function to actually trigger browser fullscreen
  const enterFullscreen = useCallback(async () => {
    const elem = document.documentElement;
    if (elem.requestFullscreen) {
      try {
        await elem.requestFullscreen();
      } catch (err) {
        console.error("Error attempting to enable fullscreen:", err);
      }
    }
  }, []);

  // Function to exit browser fullscreen
  const exitFullscreen = useCallback(async () => {
    if (document.fullscreenElement && document.exitFullscreen) {
      try {
        await document.exitFullscreen();
      } catch (err) {
        console.error("Error attempting to exit fullscreen:", err);
      }
    }
  }, []);

  // Handler for requesting view mode (clicking sizes)
  const handleViewModeRequest = (size: ClockSize) => {
    setIsViewMode(true);
    if (size === ClockSize.FULLSCREEN) {
      enterFullscreen();
    } else {
      // For Small/Medium, we just enter view mode, but ensure we aren't in native fullscreen
      if (isFullscreenMode) {
        exitFullscreen();
      }
    }
  };

  // Listener for browser native fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      const isNowFullscreen = !!document.fullscreenElement;
      setIsFullscreenMode(isNowFullscreen);

      if (!isNowFullscreen && config.size === ClockSize.FULLSCREEN) {
        // If we exited native fullscreen and were in Fullscreen size mode,
        // we should exit view mode to show settings again.
        setIsViewMode(false);
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, [config.size]);

  // Listener for Escape key to exit View Mode (for non-native fullscreen states)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isViewMode) {
          setIsViewMode(false);
          // Also try to exit native fullscreen if active
          if (document.fullscreenElement) {
            exitFullscreen();
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isViewMode, exitFullscreen]);


  // Helper to get background class
  const getBackgroundClass = (theme: BackgroundTheme) => {
    switch (theme) {
      case BackgroundTheme.WHITE:
        return 'bg-gray-100';
      case BackgroundTheme.NEBULA:
        return 'bg-gradient-to-br from-indigo-900 via-purple-900 to-black bg-[length:400%_400%] animate-[gradient_15s_ease_infinite]';
      case BackgroundTheme.BLACK:
      default:
        return 'bg-black';
    }
  };

  return (
    <div className={`min-h-screen w-full transition-colors duration-500 relative ${!isViewMode ? 'bg-black p-6 flex flex-col items-center justify-center' : ''}`}>
      
      {/* Settings Mode (Split View) */}
      {!isViewMode && (
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-24 w-full max-w-6xl justify-center animate-fade-in z-10">
          
          <div className="order-2 lg:order-1 w-full max-w-md">
            <SettingsPanel 
              config={config} 
              onConfigChange={updateConfig}
              onViewModeRequest={handleViewModeRequest}
            />
          </div>

          {/* Preview Panel - Always shows a smaller preview that fits the container */}
          <div className="order-1 lg:order-2 flex justify-center w-full lg:w-1/2">
             <div className={`rounded-3xl border-2 border-white/10 shadow-2xl p-8 flex items-center justify-center aspect-video w-full max-w-lg ${getBackgroundClass(config.background)}`}>
                <ClockDisplay 
                  color={config.color} 
                  size={ClockSize.SMALL} // Force small size logic or use autoWidth
                  gmtOffset={config.gmtOffset}
                  background={config.background}
                  fontFamily={config.fontFamily}
                  autoWidth={true} // Use auto width to fit the preview container
                />
             </div>
          </div>
        </div>
      )}

      {/* View Mode (Immersive View) */}
      {isViewMode && (
         <div className={`fixed inset-0 z-50 flex items-center justify-center ${getBackgroundClass(config.background)}`}>
            <ClockDisplay 
              color={config.color} 
              size={config.size} 
              gmtOffset={config.gmtOffset}
              background={config.background}
              fontFamily={config.fontFamily}
            />
         </div>
      )}

    </div>
  );
}