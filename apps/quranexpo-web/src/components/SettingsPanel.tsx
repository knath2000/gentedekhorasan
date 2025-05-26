import { useStore } from '@nanostores/preact';
import { autoplayEnabled, showTranslation } from '../stores/settingsStore';
import ClientOnlySettingsToggle from './ClientOnlySettingsToggle';

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
            <ClientOnlySettingsToggle label="Auto-play next verse" settingKey="autoplay" />
          </div>
          
          <div className="flex justify-between items-center py-4 mt-1">
            <span className="text-textPrimary font-englishMedium text-lg">Show translation</span>
            <ClientOnlySettingsToggle label="Show translation" settingKey="translation" />
          </div>
        </div>
        
        {/* Extra padding at the bottom to ensure last item is fully visible */}
        <div className="h-4"></div>
      </div>
    </div>
  );
}
