# System Patterns - Feature Flag UI

## Architecture Overview
The application follows a modern React SPA architecture with clear separation of concerns:

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Presentation  │    │   State Mgmt     │    │   Data Layer    │
│   (Components)  │◄──►│   (Context)      │◄──►│   (API Client)  │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

## Key Design Patterns

### 1. Context-Based State Management
**Pattern**: Centralized application state using React Context API
**Implementation**: `AppContext.tsx` provides global state for:
- Navigation state (active tab, sidebar collapse)
- Data loading states (loading, error)
- API data (environments, feature flags, API keys)
- Data fetching functions

**Benefits**:
- Single source of truth for application state
- Eliminates prop drilling
- Centralized error handling
- Consistent loading states

### 2. Protected Route Pattern
**Pattern**: Route-level authentication guards
**Implementation**: `ProtectedRoute` component wraps authenticated routes
- Checks authentication status via `useAuth` hook
- Shows loading spinner during auth check
- Redirects to login if not authenticated
- Renders protected content if authenticated

### 3. API Client Pattern
**Pattern**: Centralized HTTP client with user context
**Implementation**: `apiClient` in `/src/api/client.ts`
- Singleton pattern for consistent API communication
- User context injection for authenticated requests
- Standardized response format (`ApiResponse<T>`)
- Error handling and response transformation

### 4. Modular API Structure
**Pattern**: Feature-based API organization
```
/src/api/
├── index.ts          # Public API exports
├── client.ts         # Base HTTP client
├── models/           # TypeScript interfaces
│   └── environment.ts
└── endpoints/        # Feature-specific endpoints
    └── environment.ts
```

### 5. Component Composition Pattern
**Pattern**: Layout composition with slot-based content
**Implementation**: `Layout` component provides structure:
- `Sidebar` for navigation
- `Header` for top-level actions
- `Content` area for dynamic content
- Optional children override for custom layouts

### 6. Modal Management Pattern
**Pattern**: Declarative modal state management
**Implementation**: Modal components are conditionally rendered based on state
- State-driven visibility (`showModal` boolean)
- Callback props for actions (onSave, onCancel)
- Form state isolated within modal components

## Data Flow Patterns

### 1. Environment-Centric Data Loading
```
User selects environment → Context updates selectedEnvironment → 
Triggers useEffect → Loads environment-specific data → Updates state
```

### 2. Optimistic UI Updates
- Immediate UI feedback for user actions
- Background API calls with error handling
- State rollback on API failures

### 3. Lazy Data Loading
- Data loaded only when needed (tab activation)
- Force refresh capability for stale data
- Loading states prevent multiple concurrent requests

## Component Patterns

### 1. Container/Presentation Separation
- **Container Components**: Handle state and business logic
- **Presentation Components**: Pure UI rendering
- **Example**: `Content.tsx` (container) renders specific content components

### 2. Custom Hook Pattern
- `useAppContext()`: Provides type-safe access to app state
- `useAuth()`: Handles authentication state (from react-oidc-context)
- Encapsulates complex state logic

### 3. Conditional Rendering Pattern
```typescript
{isLoading && <LoadingSpinner />}
{error && <ErrorMessage error={error} />}
{data && <DataComponent data={data} />}
```

## Error Handling Patterns

### 1. Centralized Error State
- Errors stored in context state
- Consistent error display across components
- Error clearing on successful operations

### 2. API Error Standardization
```typescript
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}
```

### 3. User-Friendly Error Messages
- Technical errors transformed to user-friendly messages
- Contextual error information (which operation failed)
- Clear recovery actions when possible

## Security Patterns

### 1. Authentication-First Architecture
- All routes protected by default
- Authentication check on app initialization
- User context available throughout application

### 2. API Security
- User token automatically included in API requests
- Centralized token management via apiClient
- Automatic token refresh handling (via react-oidc-context)

## Performance Patterns

### 1. Conditional Data Loading
- Data fetched only when tabs are active
- Prevents unnecessary API calls
- Reduces initial load time

### 2. State Optimization
- Minimal re-renders through careful state structure
- Loading states prevent duplicate requests
- Efficient context value memoization

## Future Extensibility Patterns

### 1. Plugin Architecture Ready
- Modular API structure supports new endpoints
- Component composition allows new content types
- Context pattern scales to additional state domains

### 2. Multi-Tenant Ready
- User context can be extended for tenant information
- API client supports tenant-scoped requests
- Environment model can include tenant isolation
