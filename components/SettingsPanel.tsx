import { FC } from 'react';
import { AVAILABLE_COLORS, BackgroundTheme, ClockConfig, ClockSize, GMT_OFFSETS } from '../types';

interface SettingsPanelProps {
  config: ClockConfig;
  onConfigChange: (newConfig: Partial<ClockConfig>) => void;
  onViewModeRequest: (size: ClockSize) => void;
}

export const SettingsPanel: FC<SettingsPanelProps> = ({ config, onConfigChange, onViewModeRequest }) => {
  
  const handleSizeClick = (size: ClockSize) => {
    onConfigChange({ size });
    onViewModeRequest(size);
  };

  const getBackgroundName = (theme: BackgroundTheme) => {
    switch (theme) {
      case BackgroundTheme.BLACK: return 'Preto';
      case BackgroundTheme.WHITE: return 'Branco';
      case BackgroundTheme.NEBULA: return 'Nebula';
      default: return theme;
    }
  };

  const getSizeName = (size: ClockSize) => {
    switch(size) {
      case ClockSize.SMALL: return 'Pequeno';
      case ClockSize.MEDIUM: return 'Médio';
      case ClockSize.FULLSCREEN: return 'Tela Cheia';
    }
  };

  return (
    <div className="w-full max-w-md p-6 bg-neutral-900/80 backdrop-blur-md rounded-2xl border border-white/10 shadow-xl space-y-6 z-10 text-white">
      
      {/* Header */}
      <div className="border-b border-white/10 pb-4">
        <h2 className="text-xl font-bold mb-1">Configuração</h2>
        <p className="text-sm text-neutral-400">Personalize seu relógio</p>
      </div>

      {/* Color Selection */}
      <div className="space-y-3">
        <label className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
          Cor dos Caracteres
        </label>
        <div className="flex flex-wrap gap-3">
          {AVAILABLE_COLORS.map((c) => (
            <button
              key={c.name}
              onClick={() => onConfigChange({ color: c.value })}
              className={`w-10 h-10 rounded-full border-2 transition-transform hover:scale-110 focus:outline-none ${
                config.color === c.value ? 'border-white scale-110 shadow-lg' : 'border-transparent'
              }`}
              style={{ backgroundColor: c.value }}
              title={c.name}
              aria-label={`Selecionar cor ${c.name}`}
            />
          ))}
        </div>
      </div>

      {/* Background Selection */}
      <div className="space-y-3">
        <label className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
          Fundo do Relógio
        </label>
        <div className="grid grid-cols-3 gap-3">
          {[BackgroundTheme.BLACK, BackgroundTheme.WHITE, BackgroundTheme.NEBULA].map((theme) => (
             <button
             key={theme}
             onClick={() => onConfigChange({ background: theme })}
             className={`py-2 px-2 rounded-lg text-sm font-medium transition-all border border-white/10 ${
               config.background === theme
                 ? 'bg-neutral-100 text-black shadow-lg'
                 : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
             }`}
           >
             {getBackgroundName(theme)}
           </button>
          ))}
        </div>
      </div>

      {/* Size Selection */}
      <div className="space-y-3">
        <label className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
          Tamanho
        </label>
        <div className="grid grid-cols-3 gap-3">
          {[ClockSize.SMALL, ClockSize.MEDIUM, ClockSize.FULLSCREEN].map((size) => (
            <button
              key={size}
              onClick={() => handleSizeClick(size)}
              className={`py-3 px-2 rounded-lg text-sm font-medium transition-all ${
                config.size === size 
                  ? 'bg-white text-black shadow-lg'
                  : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
              }`}
            >
              {getSizeName(size)}
            </button>
          ))}
        </div>
        <p className="text-[10px] text-neutral-500 mt-1">
          * Todas as opções abrem o modo de visualização. Pressione ESC para sair.
        </p>
      </div>

      {/* Timezone Selection */}
      <div className="space-y-3">
        <label className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
          Fuso Horário (GMT)
        </label>
        <div className="relative">
          <select
            value={config.gmtOffset}
            onChange={(e) => onConfigChange({ gmtOffset: Number(e.target.value) })}
            className="w-full bg-neutral-800 text-white rounded-lg px-4 py-3 appearance-none border border-neutral-700 focus:border-white focus:outline-none transition-colors cursor-pointer"
          >
            {GMT_OFFSETS.map((offset) => {
              const sign = offset >= 0 ? '+' : '';
              return (
                <option key={offset} value={offset}>
                  GMT {sign}{offset}:00
                </option>
              );
            })}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-white">
            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};