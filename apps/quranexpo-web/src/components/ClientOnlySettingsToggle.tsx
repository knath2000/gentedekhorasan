import { h } from 'preact';
import { useEffect, useState } from 'preact/hooks';
import SettingsToggle from './SettingsToggle';

interface ClientOnlySettingsToggleProps {
  label: string;
  settingKey: 'autoplay' | 'translation';
  class?: string;
}

const ClientOnlySettingsToggle = (props: ClientOnlySettingsToggleProps) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(typeof window !== 'undefined');
  }, []);

  if (!isClient) {
    // Renderiza un esqueleto o un placeholder en el servidor
    return (
      <div className={`flex items-center justify-between w-full py-3 border-b border-white/10 last:border-b-0 ${props.class || ''}`}>
        <span className="text-textPrimary text-lg font-englishMedium">{props.label}</span>
        <div className="w-11 h-6 bg-gray-200 rounded-full animate-pulse"></div>
      </div>
    );
  }

  return h(SettingsToggle, props);
};

export default ClientOnlySettingsToggle;