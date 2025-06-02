// src/components/icons/ShareIcon.tsx

interface ShareIconProps {
  className?: string;
  width?: string;
  height?: string;
}

const ShareIcon = ({ className = '', width = '24px', height = '24px' }: ShareIconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    class={`icon icon-tabler icon-tabler-share ${className}`}
    width={width}
    height={height}
    viewBox="0 0 24 24"
    stroke-width="2"
    stroke="currentColor"
    fill="none"
    stroke-linecap="round"
    stroke-linejoin="round"
  >
    <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
    <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path>
    <polyline points="16 6 12 2 8 6"></polyline>
    <line x1="12" y1="2" x2="12" y2="15"></line>
  </svg>
);

export default ShareIcon;