import { useStore } from '@nanostores/preact';
import { aiTranslationsEnabled, setAiTranslationsEnabled } from '../stores/settingsStore';

interface AiTranslationsToggleProps {
  // No se necesitan props específicas por ahora, ya que interactúa con el store global
}

const AiTranslationsToggle = ({}: AiTranslationsToggleProps) => {
  const $aiTranslationsEnabled = useStore(aiTranslationsEnabled);

  const handleToggle = () => {
    setAiTranslationsEnabled($aiTranslationsEnabled === 'true' ? false : true);
  };

  return (
    <div className="flex items-center justify-between py-3 px-4 bg-cardBackground rounded-lg shadow-sm border border-white/10">
      <span className="text-textPrimary font-medium">Traducciones con IA</span>
      <label htmlFor="ai-translations-toggle" className="relative inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          id="ai-translations-toggle"
          className="sr-only peer"
          checked={$aiTranslationsEnabled === 'true'}
          onChange={handleToggle}
        />
        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-skyDeepBlue/40 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-desertHighlightGold"></div>
      </label>
    </div>
  );
};

export default AiTranslationsToggle;
