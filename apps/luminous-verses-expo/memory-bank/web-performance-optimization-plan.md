# Web Performance Optimization Plan: Quran Expo App

**Version:** 1.0.0
**Date:** 2025-05-16
**Related Brief:** `memory-bank/projectbrief.md`

## 1. Current Performance Audit Results

Based on the Lighthouse report from May 16, 2025, the Quran Expo web app shows significant opportunities for improvement:

| Metric | Current Value | Target Value | Status |
|--------|--------------|-------------|--------|
| Performance | Low (not specified) | 90+ | Poor |
| Accessibility | 91 | 95+ | Good |
| SEO | 82 | 95+ | Needs Improvement |
| LCP (Largest Contentful Paint) | 9.6s | < 2.5s | Critical |
| FCP (First Contentful Paint) | 4.9s | < 1.8s | Critical |
| Total Blocking Time | 130ms | < 100ms | Needs Improvement |
| CLS (Cumulative Layout Shift) | 0.067 | < 0.1 | Good |
| Speed Index | 6.3s | < 3.4s | Poor |

## 2. Critical Issues & Solutions

### 2.1 JavaScript Optimization (Priority: HIGH)

**Issues:**
- Unused JavaScript (252 KiB potential savings)
- Excessive JavaScript execution time
- Legacy JavaScript being delivered to modern browsers

**Solutions:**

1. **Code Splitting & Lazy Loading:**
   - Implement dynamic imports for non-critical components using Next.js's built-in dynamic imports
   - Based on MDN and web.dev research, we can significantly reduce initial bundle size
   ```jsx
   // Example implementation for non-critical components
   import dynamic from 'next/dynamic';
   
   // Instead of static import
   // import AudioControlBar from '../src/components/AudioControlBar';
   
   // Use dynamic import with loading indicator
   const AudioControlBar = dynamic(
     () => import('../src/components/AudioControlBar'),
     {
       loading: () => <p>Loading audio controls...</p>,
       ssr: true // Enable server-side rendering
     }
   );
   ```

2. **Modern JavaScript for Modern Browsers:**
   - Configure Babel to avoid unnecessary transpilation for modern browsers
   - Add the following to webpack.config.js:
   ```js
   // Update in webpack.config.js
   module.exports = async function(env, argv) {
     const config = await createExpoWebpackConfigAsync({
       ...env,
       babel: {
         dangerouslyAddModulePathsToTranspile: [],
         // Target modern browsers to avoid unnecessary transpilation
         targets: {
           browsers: [
             'last 2 Chrome versions',
             'last 2 Firefox versions',
             'last 2 Safari versions',
             'last 2 Edge versions'
           ]
         }
       }
     });
     return config;
   };
   ```

3. **Tree Shaking Enhancement:**
   - Ensure all imports use ES modules syntax
   - Enable tree shaking optimization in webpack config
   - Add `"sideEffects": false` to package.json for applicable packages

### 2.2 Font Loading Optimization (Priority: HIGH)

**Issues:**
- Text invisible during font loading despite having proper `font-display: swap` settings
- Multiple web fonts causing performance issues

**Current Implementation:**
- The app already uses `font-display: swap` in web/global.css
- Preload directives exist in web/index.html, but may not be working correctly

**Solutions:**

1. **Improve Font Loading Strategy:**
   - Verify correct implementation of `font-display: swap` in production build
   - Add `<link rel="preconnect">` for faster font loading
   ```html
   <!-- Add to web/index.html head -->
   <link rel="preconnect" href="/assets/fonts" crossorigin>
   ```

2. **Font Format Optimization:**
   - Convert TTF fonts to WOFF2 format for better compression (30-50% smaller)
   - Use font subsetting to include only needed characters
   - Implement format fallbacks:
   ```css
   @font-face {
     font-family: 'NotoNaskhArabic-Regular';
     src: url('/assets/fonts/NotoNaskhArabic-Regular.woff2') format('woff2'),
          url('/assets/fonts/NotoNaskhArabic-Regular.ttf') format('truetype');
     font-display: swap;
   }
   ```

3. **Prioritize Critical Fonts:**
   - Only preload fonts used in above-the-fold content
   - Defer loading of fonts used in lower parts of the page

### 2.3 HTML Document Optimization (Priority: HIGH)

**Issues:**
- Missing `<title>` element in production (despite having it in template)
- Missing meta description

**Solutions:**

1. **Fix Title & Meta Tags:**
   - The app's `web/index.html` has a proper title, but it may be getting stripped in production
   - Investigate if Next.js/Expo configuration is removing the title
   - Ensure proper use of next/head for document title

2. **Add SEO Meta Tags:**
   - Add structured data for rich search results
   - Add Open Graph and Twitter meta tags
   ```html
   <!-- Add to web/index.html -->
   <meta name="description" content="Explore the Quran with Luminous Verses. Read, listen, and discover the divine message.">
   <meta property="og:title" content="Luminous Verses - Quran Explorer">
   <meta property="og:description" content="Explore the Quran with Luminous Verses. Read, listen, and discover the divine message.">
   <meta property="og:type" content="website">
   <meta property="og:image" content="/assets/images/og-image.jpg">
   <meta name="twitter:card" content="summary_large_image">
   ```

### 2.4 Image Optimization (Priority: MEDIUM)

**Issues:**
- Images with incorrect aspect ratio
- Large image files

**Solutions:**

1. **Next.js Image Component:**
   - Replace standard `<img>` tags with Next.js `<Image>` component
   - This will automatically optimize images and fix aspect ratio issues
   ```jsx
   import Image from 'next/image';
   
   // Replace
   // <img src="/assets/images/webtest.webp" className="css-9pa8cd" />
   
   // With
   <Image 
     src="/assets/images/webtest.webp"
     alt="Background image"
     width={1332}
     height={850}
     priority={true} // For above-the-fold images
   />
   ```

2. **Image Format Optimization:**
   - Convert large images to WebP format
   - Optimize image quality-to-size ratio
   - For background images, consider using CSS gradients when possible

3. **Responsive Images:**
   - Use the `srcset` attribute for responsive images
   - Provide multiple image sizes for different screen resolutions

### 2.5 Contrast and Accessibility (Priority: MEDIUM)

**Issues:**
- Low contrast text

**Solutions:**

1. **Color Adjustments:**
   - Increase contrast between text and background colors
   - Check color contrast against WCAG AA standards
   - Update theme.ts color definitions as needed

2. **Accessibility Improvements:**
   - Add proper ARIA labels to interactive elements
   - Ensure keyboard navigation works correctly

## 3. Implementation Plan

### Phase 1: JavaScript & Font Optimization (1-2 days)

1. **JavaScript Optimization:**
   - Implement dynamic imports for large components
   - Update webpack config for modern browsers
   - Implement tree shaking optimizations

2. **Font Optimization:**
   - Convert TTF to WOFF2 format
   - Update font loading strategy
   - Fix font-display implementation

### Phase 2: HTML & Metadata Fixes (1 day)

1. **Fix Document Structure:**
   - Ensure title and meta tags are present in production
   - Add Open Graph and social media tags
   - Implement structured data

### Phase 3: Image & UI Improvements (2-3 days)

1. **Image Optimization:**
   - Replace img tags with Next.js Image component
   - Optimize image formats and sizes
   - Fix aspect ratio issues

2. **Contrast & Accessibility:**
   - Update color scheme for better contrast
   - Improve ARIA support

## 4. Performance Monitoring Plan

1. **Ongoing Lighthouse Testing:**
   - Run Lighthouse tests after each major change
   - Track progress against target metrics

2. **Real User Monitoring:**
   - Implement analytics to track Core Web Vitals in production
   - Set up alerts for performance regressions

3. **A/B Testing:**
   - Test performance improvements with real users
   - Measure impact on user engagement and conversion

## 5. Long-Term Performance Roadmap

1. **Advanced Optimizations:**
   - Implement server-side rendering for critical components
   - Consider static generation for frequently accessed pages
   - Explore edge caching strategies

2. **Performance Culture:**
   - Establish performance budgets for new features
   - Include performance testing in CI/CD pipeline
   - Document best practices for frontend developers

This performance optimization plan addresses the most critical issues identified in the Lighthouse report while providing a structured approach to implementation. Once completed, we expect significant improvements in load times, user experience, and SEO rankings.