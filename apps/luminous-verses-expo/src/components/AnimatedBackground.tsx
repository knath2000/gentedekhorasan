// src/components/AnimatedBackground.tsx
import LottieView from 'lottie-react-native';
import React from 'react'; // Removed useEffect, useRef
// import { Platform } from 'react-native'; // No longer needed
import styled from 'styled-components/native';

const AnimationContainer = styled.View`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: -1; /* Ensure it's behind other content */
  /* background-color: rgba(0, 255, 0, 0.1); */ /* Remove test background */
`;

// Ensure you have 'desertanimation.json' in 'assets/animations/'
// or update the path accordingly.
const animationSource = require('../../assets/animations/desertanimation.json');

const AnimatedBackground: React.FC = () => {
  // Removed animationRef and useEffect

  return (
    <AnimationContainer>
      <LottieView
        // ref removed
        source={animationSource}
        autoPlay // autoPlay should work across platforms if dependencies are correct
        loop={false} // Play once and stop at the last frame
        useNativeLooping // Good to keep for iOS native looping performance/reliability
        style={{ width: '100%', height: '100%' }}
        resizeMode="cover" // Restore resizeMode
      />
    </AnimationContainer>
  );
};

export default AnimatedBackground;