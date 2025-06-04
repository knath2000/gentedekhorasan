import { useStore } from '@nanostores/react';
import { autoplayEnabled, showTranslation } from '../stores/settingsStore.ts';

interface ToggleSwitchProps {
  label: string;
  description: string; // Add description prop
  settingKey: 'autoplay' | 'translation' | 'autoplayEnabled' | 'showTranslation'; // Update settingKey to match new storeKeys
  storeKey: 'autoplayEnabled' | 'showTranslation'; // Add storeKey prop
  class?: string;
}

const SettingsToggle = ({ label, description, settingKey, storeKey, class: className }: ToggleSwitchProps) => {
  let store;
  if (storeKey === 'autoplayEnabled') {
    store = autoplayEnabled;
  } else if (storeKey === 'showTranslation') {
    store = showTranslation;
  } else {
    console.error(`Unknown storeKey: ${storeKey}`);
    return null;
  }

  const checked = useStore(store);

  const toggleSetting = () => {
    store.set(!checked);
  };

  return (
    <div className={`flex items-center justify-between w-full py-3 border-b border-white/10 last:border-b-0 ${className || ''}`}>
      <div className="flex flex-col">
        <span className="text-textPrimary text-lg font-englishMedium">{label}</span>
        <span className="text-textSecondary text-sm">{description}</span>
      </div>
      <label className="relative inline-flex items-center cursor-pointer">
        <input type="checkbox" value="" className="sr-only peer" checked={checked} onInput={toggleSetting} />
        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
      </label>
    </div>
  );
};

export default SettingsToggle;
