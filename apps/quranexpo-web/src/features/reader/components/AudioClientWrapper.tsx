import type { FunctionalComponent } from 'preact';
import { AudioProvider } from '../context/AudioContext';

interface AudioClientWrapperProps {
  children: preact.ComponentChildren;
}

const AudioClientWrapper: FunctionalComponent<AudioClientWrapperProps> = ({ children }) => {
  return (
    <AudioProvider>
      {children}
    </AudioProvider>
  );
};

export default AudioClientWrapper;