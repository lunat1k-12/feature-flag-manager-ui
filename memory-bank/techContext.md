# Technical Context

## Core Technologies

### Frontend Framework
- **React 19**: Latest version of React with improved performance and features
- **TypeScript**: For type safety and improved developer experience
- **React Context API**: For state management across components

### Styling
- **Tailwind CSS 3**: Utility-first CSS framework for rapid UI development
- **PostCSS**: For processing Tailwind CSS and other style transformations

### Build Tools
- **Vite 6**: Modern build tool for faster development and optimized production builds
- **TypeScript Compiler**: For type checking and transpilation

### Development Tools
- **ESLint 9**: For code linting and enforcing coding standards
- **React Hooks Linting**: Ensures proper usage of React hooks

## Project Structure
```
/
├── public/               # Static assets
├── src/                  # Source code
│   ├── assets/           # Project assets (images, etc.)
│   ├── components/       # React components
│   ├── context/          # React context providers
│   ├── App.tsx           # Main App component
│   ├── main.tsx          # Application entry point
│   └── index.css         # Global styles
├── index.html            # HTML entry point
├── package.json          # Project dependencies and scripts
├── tsconfig.json         # TypeScript configuration
├── vite.config.ts        # Vite configuration
├── tailwind.config.js    # Tailwind CSS configuration
└── postcss.config.js     # PostCSS configuration
```

## Dependencies

### Production Dependencies
- **react**: Core React library
- **react-dom**: React rendering for web

### Development Dependencies
- **@vitejs/plugin-react**: Vite plugin for React
- **@types/react**: TypeScript definitions for React
- **@types/react-dom**: TypeScript definitions for React DOM
- **typescript**: TypeScript language support
- **eslint**: Code linting
- **tailwindcss**: Utility CSS framework
- **postcss**: CSS transformation tool
- **autoprefixer**: Adds vendor prefixes to CSS

## Development Environment
- **Node.js**: Runtime environment for development tools
- **npm/yarn**: Package management
- **VSCode**: Recommended editor with extensions for React, TypeScript, and Tailwind

## Build & Deployment

### Development Workflow
1. `npm run dev`: Starts development server with hot module replacement
2. Edit code and see changes instantly in the browser
3. TypeScript errors and ESLint warnings appear in real-time

### Production Build
1. `npm run build`: Compiles TypeScript and builds optimized assets
2. `npm run preview`: Preview the production build locally

## Technical Constraints

### Browser Support
- Modern evergreen browsers (Chrome, Firefox, Safari, Edge)
- No explicit support for legacy browsers like IE

### Performance Targets
- Initial load under 2 seconds on broadband connections
- Time to interactive under 3 seconds
- Smooth animations and transitions (60fps)

### Accessibility
- WCAG 2.1 AA compliance target
- Keyboard navigation support
- Screen reader compatibility

## Future Technical Considerations
1. **State Management**: Potential migration to Redux or Zustand for more complex state
2. **API Integration**: Adding Axios or React Query for data fetching
3. **Testing**: Implementation of Jest and React Testing Library
4. **Authentication**: Integration with auth providers (Auth0, Firebase, etc.)
5. **Internationalization**: Adding i18n support for multiple languages
