import { Settings } from 'lucide-react';

interface SettingsButtonProps {
  className?: string;
}

const SettingsButton = ({ className }: SettingsButtonProps) => {
  const handleClick = () => {
    window.location.href = '/settings';
  };

  return (
    <button
      onClick={handleClick}
      className={`p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors duration-200 active:scale-90 ${className}`}
      aria-label="Settings"
    >
      <Settings size={24} />
    </button>
  );
};

export default SettingsButton;