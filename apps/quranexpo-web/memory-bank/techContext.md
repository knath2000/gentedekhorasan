# Technical Context: Quran Expo Web App

## Technology Stack

### Core Technologies
| Technology | Purpose | Version |
|------------|---------|---------|
| Astro | Web framework for content-focused websites | Latest |
| Preact | Lightweight React alternative for interactive components | Latest |
| TypeScript | Type-safe JavaScript superset | Latest |
| TailwindCSS | Utility-first CSS framework | Latest |
| PostCSS | Tool for transforming CSS with JavaScript | Latest |

### External Services
| Service | Purpose | Details |
|---------|---------|---------|
| Quran API (quran-api-data) | Provides Quranic text and metadata from monorepo | Deployed at https://gentedekhorasan.vercel.app/api/v1 |
| Audio CDN | Hosts verse recitations | Audio files by verse |

## Development Environment

### Prerequisites
- Node.js (LTS version recommended)
- npm or yarn package manager
- Git for version control

### Local Setup
```bash
# Clone the repository
git clone <repository-url>

# Navigate to project directory
cd quranexpo-web

# Install dependencies
npm install

# Start development server
npm run dev
```

### Key Commands
| Command | Purpose |
|---------|---------|
| `npm run dev` | Starts local development server |
| `npm run build` | Builds production version |
| `npm run preview` | Preview production build locally |

## Project Structure

```
quranexpo-web/
├── public/             # Static assets
├── src/
│   ├── components/     # Reusable UI components
│   ├── hooks/          # Custom React hooks
│   ├── pages/          # Astro page components (routing)
│   ├── services/       # API and data services
│   ├── styles/         # Global styles and variables
│   ├── types/          # TypeScript type definitions
│   └── utils/          # Utility functions
├── astro.config.mjs    # Astro configuration
├── package.json        # Dependencies and scripts
├── tailwind.config.mjs # TailwindCSS configuration
└── tsconfig.json       # TypeScript configuration
```

## Dependencies & Tooling

### Core Dependencies
- `astro`: Core framework
- `preact`: UI library for interactive components
- `tailwindcss`: Utility CSS framework
- `typescript`: Type checking
- `turborepo`: Monorepo build system (note: uses "tasks" field in turbo.json for pipeline configuration)

### Development Dependencies
- `postcss`: CSS transformation tool
- `autoprefixer`: Adds vendor prefixes to CSS
- `eslint`: Code linting
- `prettier`: Code formatting

## Technical Constraints & Considerations

### Browser Compatibility
- The application targets modern browsers with ES6 support
- Progressive enhancement may be implemented for older browsers
- Mobile browser optimization is a priority

### Performance Requirements
- First contentful paint under 1.2 seconds
- Time to interactive under 2.5 seconds
- Minimal bundle size (target < 200KB initial JS)
- Efficient image loading and optimization

### API Integration
- The application uses the same API endpoints as the native app
- API responses should be cached appropriately
- Error handling for API failures must be graceful

### Audio Requirements
- Audio playback must work across all modern browsers
- Audio files are streamed, not pre-loaded
- Playback state should be visually indicated
- Audio elements should be properly managed to prevent memory leaks

## Build & Deployment Process

### Build Steps
1. TypeScript and ESLint validation
2. Astro static site generation
3. CSS processing with PostCSS
4. Asset optimization

### Deployment Targets
- Static file hosting (e.g., Netlify, Vercel, or GitHub Pages)
- No server-side runtime requirements
- CDN deployment for optimal global performance

## Codebase Guidelines

### Styling Conventions
- TailwindCSS for component styling
- Global styles limited to typography and base elements
- CSS variables for theming
- Mobile-first responsive design

### Component Standards
- Functional components with TypeScript types
- Props interface for each component
- Explicit return types
- JSDoc comments for complex functions

### Performance Guidelines
- Lazy-loading for below-the-fold content
- Web Vitals monitoring and optimization
- Minimizing client-side JavaScript
- Using Astro's partial hydration for interactive components