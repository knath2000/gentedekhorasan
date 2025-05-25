import { h } from 'preact';

const Star = ({ top, left, delay, size }: { top: string; left: string; delay: string; size: string }) => (
  <div
    class={`absolute rounded-full bg-desertHighlightGold animate-twinkle ${size}`}
    style={{
      top,
      left,
      animationDelay: delay,
    }}
  />
);

const Background = () => {
  const stars = [
    { top: '10%', left: '20%', delay: '0s', size: 'w-1 h-1' },
    { top: '15%', left: '80%', delay: '0.5s', size: 'w-0.5 h-0.5' },
    { top: '25%', left: '50%', delay: '1s', size: 'w-1 h-1' },
    { top: '30%', left: '10%', delay: '1.5s', size: 'w-0.5 h-0.5' },
    { top: '40%', left: '90%', delay: '2s', size: 'w-1 h-1' },
    { top: '5%', left: '5%', delay: '2.5s', size: 'w-0.5 h-0.5' },
    { top: '60%', left: '60%', delay: '3s', size: 'w-1 h-1' },
    { top: '50%', left: '30%', delay: '3.5s', size: 'w-0.5 h-0.5' },
    { top: '70%', left: '15%', delay: '0.2s', size: 'w-1 h-1' },
    { top: '85%', left: '75%', delay: '0.7s', size: 'w-0.5 h-0.5' },
    { top: '55%', left: '45%', delay: '1.2s', size: 'w-1 h-1' },
    { top: '20%', left: '70%', delay: '1.8s', size: 'w-0.5 h-0.5' },
    { top: '35%', left: '85%', delay: '2.2s', size: 'w-1 h-1' },
    { top: '45%', left: '15%', delay: '2.8s', size: 'w-0.5 h-0.5' },
    { top: '65%', left: '35%', delay: '3.2s', size: 'w-1 h-1' },
    { top: '75%', left: '55%', delay: '3.8s', size: 'w-0.5 h-0.5' },
    { top: '12%', left: '35%', delay: '0.3s', size: 'w-0.5 h-0.5' },
    { top: '22%', left: '90%', delay: '0.8s', size: 'w-1 h-1' },
    { top: '38%', left: '5%', delay: '1.3s', size: 'w-0.5 h-0.5' },
    { top: '48%', left: '65%', delay: '1.9s', size: 'w-1 h-1' },
  ];

  return (
    <div class="absolute inset-0 -z-10 overflow-hidden">
      {/* Improved Gradient Background */}
      <div class="absolute inset-0 bg-gradient-to-b from-skyDeepBlue via-skyPurple to-skyIndigo opacity-95" />

      {/* Twinkling Stars */}
      <div class="stars">
        {stars.map((star, i) => (
          <Star key={i} {...star} />
        ))}
      </div>

      {/* Desert Landscape Silhouette - SVG Implementation */}
      <div class="absolute bottom-0 left-0 right-0 w-full h-auto pointer-events-none">
        <svg
          viewBox="0 0 1440 320"
          class="w-full h-auto block"
          preserveAspectRatio="none"
        >
          {/* Dune Layer 1 (Back) - More subtle, darker */}
          <path
            fill="#4A3F8E" // skyIndigo - darker shade for depth
            fill-opacity="0.6"
            d="M0,224L60,213.3C120,203,240,181,360,186.7C480,192,600,224,720,240C840,256,960,256,1080,234.7C1200,213,1320,171,1380,149.3L1440,128L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"
          ></path>
          {/* Dune Layer 2 (Middle) - Matches screenshot's pink/purple dune */}
          <path
            fill="#713550" // A custom pink/purple, adjust as needed
            fill-opacity="0.7" // Slightly more opaque
            d="M0,256L48,245.3C96,235,192,213,288,202.7C384,192,480,192,576,208C672,224,768,256,864,261.3C960,267,1056,245,1152,224C1248,203,1344,181,1392,170.7L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          ></path>
          {/* Dune Layer 3 (Front) - Matches screenshot's orange/red dune */}
          <path
            fill="#9C4E68" // A custom orange/red, adjust as needed
            fill-opacity="0.8"
            d="M0,288L40,277.3C80,267,160,245,240,229.3C320,213,400,203,480,208C560,213,640,235,720,245.3C800,256,880,256,960,240C1040,224,1120,192,1200,181.3C1280,171,1360,181,1400,186.7L1440,192L1440,320L1400,320C1360,320,1280,320,1200,320C1120,320,1040,320,960,320C880,320,800,320,720,320C640,320,560,320,480,320C400,320,320,320,240,320C160,320,80,320,40,320L0,320Z"
          ></path>
        </svg>
      </div>
    </div>
  );
};

export default Background;