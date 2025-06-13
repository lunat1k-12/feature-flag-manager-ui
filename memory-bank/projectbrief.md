# Feature Flag UI - Project Brief

## Project Overview
A React-based web application for managing feature flags across different environments. This is a frontend UI that connects to a backend API for feature flag management, providing a user-friendly interface for developers and product teams.

## Core Requirements

### Authentication & Security
- OAuth/OIDC authentication integration using `react-oidc-context`
- Protected routes requiring authentication
- User context management throughout the application

### Environment Management
- Create and manage multiple environments (dev, staging, prod, etc.)
- Environment-specific feature flag configurations
- Environment selection and switching

### Feature Flag Management
- Create, read, update, and delete feature flags
- Environment-specific flag configurations
- Flag state management (enabled/disabled)

### API Key Management
- Generate API keys for programmatic access
- Environment-specific API key management
- Key lifecycle management (create, view, delete)

### User Interface
- Responsive design using Tailwind CSS
- Sidebar navigation with collapsible functionality
- Tab-based content organization
- Modal dialogs for create/edit operations
- Loading states and error handling

## Technical Stack
- **Frontend**: React 19 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM v6
- **Authentication**: OIDC Client TS + React OIDC Context
- **State Management**: React Context API
- **Date Handling**: date-fns

## Key Features
1. **Multi-environment support** - Manage flags across different deployment environments
2. **Secure authentication** - OAuth/OIDC integration for enterprise security
3. **API key generation** - Programmatic access for CI/CD and applications
4. **Intuitive UI** - Clean, responsive interface for non-technical users
5. **Real-time updates** - Dynamic loading and refreshing of data

## Success Criteria
- Users can authenticate securely via OAuth/OIDC
- Users can create and manage multiple environments
- Users can create, configure, and manage feature flags per environment
- Users can generate and manage API keys for programmatic access
- Application provides clear feedback for all operations (loading, success, errors)
- Interface is responsive and works across different screen sizes
