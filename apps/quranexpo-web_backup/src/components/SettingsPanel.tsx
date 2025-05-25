import { h } from 'preact';
import { useStore } from '@nanostores/preact';
import { autoplayEnabled, toggleAutoplay, showTranslation, toggleTranslation } from '../stores/settingsStore';
import SettingsToggle from './SettingsToggle';

export default function SettingsPanel() {
  const isAutoplayEnabled = useStore(autoplayEnabled);
  const isShowTranslation = useStore(showTranslation);
  
  return (
    <div className="w-full flex flex-col flex-1 overflow-y-auto">
      
      {/* Simple scrollable container with padding to ensure content stops above the red line */}
      <div className="pb-[100px]">
        <div className="bg-skyPurple/20 backdrop-blur-md rounded-xl p-5 mb-4 shadow-lg border border-white/10">
          <div className="flex justify-between items-center py-4 border-b border-white/20">
            <span className="text-textPrimary font-englishMedium text-lg">Auto-play next verse</span>
            <SettingsToggle setting={autoplayEnabled} onToggle={toggleAutoplay} />
          </div>
          
          <div className="flex justify-between items-center py-4 mt-1">
            <span className="text-textPrimary font-englishMedium text-lg">Show translation</span>
            <SettingsToggle setting={showTranslation} onToggle={toggleTranslation} />
          </div>
        </div>
        
        {/* Extra padding at the bottom to ensure last item is fully visible */}
        <div className="h-4"></div>
      </div>
    </div>
  );
}
