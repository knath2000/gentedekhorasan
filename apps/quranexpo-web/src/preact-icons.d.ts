declare module 'preact-icons/io' {
  import { ComponentType, JSX } from 'preact';
  interface IconProps extends JSX.SVGAttributes<SVGSVGElement> {
    color?: string;
    size?: string | number;
    width?: string | number;
    height?: string | number;
  }
  export const IoShareSocialOutline: ComponentType<IconProps>;
  // Add other icons from 'preact-icons/io' that you might use here
}