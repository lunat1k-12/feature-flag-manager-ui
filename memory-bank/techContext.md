# Technical Context - Feature Flag UI

## Technology Stack

### Core Framework
- **React 19**: Latest React with concurrent features and improved TypeScript support
- **TypeScript**: Full type safety throughout the application
- **Vite**: Fast build tool with HMR (Hot Module Replacement)

### Styling & UI
- **Tailwind CSS 3**: Utility-first CSS framework
- **PostCSS**: CSS processing with autoprefixer
- **Responsive Design**: Mobile-first approach with Tailwind breakpoints

### Routing & Navigation
- **React Router DOM v6**: Client-side routing with modern API
- **Protected Routes**: Authentication-based route guards
- **Programmatic Navigation**: Context-aware navigation

### Authentication
- **OIDC Client TS**: OpenID Connect client implementation
- **React OIDC Context**: React integration for OIDC authentication
- **OAuth 2.0/OIDC**: Industry standard authentication protocols

### State Management
- **React Context API**: Global state management
- **Custom Hooks**: Encapsulated state logic
- **Local Component State**: For UI-specific state

### HTTP Client & API
- **Fetch API**: Native browser HTTP client
- **Custom API Client**: Wrapper with authentication and error handling
- **TypeScript Interfaces**: Strongly typed API contracts

### Date Handling
- **date-fns**: Lightweight date utility library
- **Timezone Support**: Proper date formatting and manipulation

### Development Tools
- **ESLint**: Code linting with React-specific rules
- **TypeScript Compiler**: Type checking and compilation
- **Vite Dev Server**: Development server with HMR

## Project Structure

```
feature-flag-ui/
├── public/                 # Static assets
│   ├── ff_icon_32.svg     # Favicon
│   ├── ff_icon.svg        # App icon
│   ├── flag.svg           # Flag icon
│   └── vite.svg           # Vite logo
├── src/
│   ├── api/               # API layer
│   │   ├── client.ts      # HTTP client
│   │   ├── index.ts       # API exports
│   │   ├── endpoints/     # API endpoints
│   │   │   └── environment.ts
│   │   └── models/        # TypeScript interfaces
│   │       └── environment.ts
│   ├── assets/            # App assets
│   │   └── react.svg
│   ├── components/        # React components
│   │   ├── Layout.tsx     # Main layout
│   │   ├── Header.tsx     # Top header
│   │   ├── Sidebar.tsx    # Navigation sidebar
│   │   ├── Content.tsx    # Main content area
│   │   ├── LoginPage.tsx  # Authentication
│   │   ├── CallbackPage.tsx # OAuth callback
│   │   ├── LogoutPage.tsx # Logout handling
│   │   ├── EnvironmentContent.tsx # Environment management
│   │   ├── ApiKeysContent.tsx # API key management
│   │   ├── AddEnvironmentModal.tsx # Environment creation
│   │   ├── AddFeatureFlagModal.tsx # Flag creation
│   │   └── DeleteFeatureFlagModal.tsx # Flag deletion
│   ├── context/           # React Context
│   │   └── AppContext.tsx # Global app state
│   ├── App.tsx           # Root component
│   ├── main.tsx          # App entry point
│   ├── index.css         # Global styles
│   ├── App.css           # App-specific styles
│   └── vite-env.d.ts     # Vite type definitions
├── memory-bank/          # Project documentation
├── index.html            # HTML template
├── package.json          # Dependencies and scripts
├── tsconfig.json         # TypeScript configuration
├── tsconfig.app.json     # App-specific TS config
├── tsconfig.node.json    # Node-specific TS config
├── vite.config.ts        # Vite configuration
├── tailwind.config.js    # Tailwind configuration
├── postcss.config.js     # PostCSS configuration
├── eslint.config.js      # ESLint configuration
└── README.md             # Project documentation
```

## Configuration Files

### TypeScript Configuration
- **tsconfig.json**: Base TypeScript configuration
- **tsconfig.app.json**: Application-specific settings
- **tsconfig.node.json**: Node.js environment settings

### Build Configuration
- **vite.config.ts**: Vite build and dev server configuration
- **package.json**: Dependencies, scripts, and project metadata

### Code Quality
- **eslint.config.js**: ESLint rules and React-specific linting
- Modern ESLint flat config format

### Styling
- **tailwind.config.js**: Tailwind CSS customization
- **postcss.config.js**: PostCSS plugins (Tailwind + Autoprefixer)

## Development Workflow

### Available Scripts
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run lint     # Run ESLint
npm run preview  # Preview production build
```

### Development Server
- **Port**: Default Vite port (usually 5173)
- **HMR**: Hot Module Replacement enabled
- **TypeScript**: Real-time type checking

### Build Process
1. TypeScript compilation (`tsc -b`)
2. Vite bundling and optimization
3. Asset processing and optimization
4. Production-ready output in `dist/`

## API Integration

### Authentication Flow
1. User redirected to OIDC provider
2. OAuth callback handled by `/callback` route
3. User token stored in OIDC context
4. Token automatically included in API requests

### API Client Architecture
```typescript
// Centralized client with user context
apiClient.setUser(user);

// Standardized response format
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}
```

### Environment-Specific Endpoints
- `GET /environments` - List environments
- `POST /environments` - Create environment
- `GET /environments/{env}/flags` - List feature flags
- `POST /environments/{env}/flags` - Create feature flag
- `DELETE /environments/{env}/flags/{id}` - Delete feature flag
- `GET /environments/{env}/keys` - List API keys
- `POST /environments/{env}/keys` - Generate API key
- `DELETE /environments/{env}/keys/{id}` - Delete API key

## Performance Considerations

### Bundle Optimization
- **Tree Shaking**: Unused code elimination
- **Code Splitting**: Dynamic imports for route-based splitting
- **Asset Optimization**: Image and SVG optimization

### Runtime Performance
- **Lazy Loading**: Data loaded only when needed
- **Memoization**: Prevent unnecessary re-renders
- **Efficient State Updates**: Minimal context re-renders

### Network Optimization
- **Request Deduplication**: Prevent duplicate API calls
- **Loading States**: Prevent multiple concurrent requests
- **Error Handling**: Graceful degradation

## Security Considerations

### Authentication Security
- **OIDC/OAuth 2.0**: Industry standard protocols
- **Token Management**: Automatic refresh and secure storage
- **Route Protection**: All routes require authentication

### API Security
- **Bearer Tokens**: Automatic token inclusion
- **HTTPS Only**: Secure communication
- **CORS Handling**: Proper cross-origin configuration

## Browser Compatibility
- **Modern Browsers**: ES2020+ features
- **TypeScript**: Compiled to compatible JavaScript
- **CSS**: Autoprefixer for vendor prefixes
- **Responsive**: Mobile-first design approach

## Deployment Considerations
- **Static Site**: Can be deployed to any static hosting
- **Environment Variables**: Build-time configuration
- **Asset Optimization**: Production builds are optimized
- **HTTPS Required**: For OAuth/OIDC authentication
