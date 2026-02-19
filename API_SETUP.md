# API Integration Setup

Complete API integration setup with reusable hooks for the Alle project.

## 📁 Files Created

1. **`lib/api-client.ts`** - Core API client with fetch wrapper
2. **`hooks/useApi.ts`** - Reusable React hooks for API calls
3. **`services/api-services.ts`** - API service functions for all endpoints
4. **`examples/api-usage-examples.tsx`** - Usage examples

## 🚀 Setup

### 1. Environment Variables

Create a `.env.local` file in the `alle_frontend` directory:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api
```

### 2. Install Dependencies (if needed)

No additional dependencies required! Uses native `fetch` API.

## 📖 Usage

### Basic Usage with `useApi` Hook

```tsx
import { useApi } from '@/hooks/useApi';

function MyComponent() {
  const { data, loading, error, execute } = useApi({
    onSuccess: (data) => console.log('Success:', data),
    onError: (error) => console.error('Error:', error)
  });

  const fetchData = async () => {
    await execute('/endpoint', {
      method: 'POST',
      body: { key: 'value' }
    });
  };

  return (
    <div>
      <button onClick={fetchData} disabled={loading}>
        {loading ? 'Loading...' : 'Fetch Data'}
      </button>
      {error && <p>{error}</p>}
      {data && <pre>{JSON.stringify(data, null, 2)}</pre>}
    </div>
  );
}
```

### Specialized Hooks

```tsx
import { useApiGet, useApiPost } from '@/hooks/useApi';

// GET requests
const { data, loading, get } = useApiGet();
await get('/users');

// POST requests
const { data, loading, post } = useApiPost();
await post('/users', { name: 'John' });
```

### Using API Services

```tsx
import { authApi, studentApi } from '@/services/api-services';
import { useApi } from '@/hooks/useApi';

function LoginComponent() {
  const { loading, error, execute } = useApi();

  const handleLogin = async () => {
    const result = await execute('/auth/login', {
      method: 'POST',
      body: { email, password }
    });
    
    if (result) {
      localStorage.setItem('auth_token', result.token);
    }
  };

  return (/* UI */);
}
```

### Direct API Calls (without hook)

```tsx
import { api } from '@/lib/api-client';

// GET
const users = await api.get('/users');

// POST
const newUser = await api.post('/users', { name: 'John' });

// PUT
const updated = await api.put('/users/1', { name: 'Jane' });

// DELETE
await api.delete('/users/1');
```

## 🎯 Features

### ✅ API Client (`lib/api-client.ts`)

- Centralized API configuration
- Automatic authentication token handling
- Error handling with custom `ApiError` class
- Request/response interceptors
- TypeScript support

### ✅ React Hooks (`hooks/useApi.ts`)

- `useApi` - Generic API hook
- `useApiGet` - Specialized GET hook
- `useApiPost` - Specialized POST hook
- `useApiPut` - Specialized PUT hook
- `useApiDelete` - Specialized DELETE hook

**Features:**
- Loading states
- Error handling
- Data caching
- Success/error callbacks
- TypeScript generics for type safety

### ✅ API Services (`services/api-services.ts`)

Pre-built service functions for:
- Authentication (login, register, logout)
- Student profile management
- Courses
- Lessons
- Progress tracking
- Leaderboard

## 🔒 Authentication

The system automatically handles authentication tokens:

1. Token is stored in `localStorage` after login
2. Token is automatically added to request headers
3. Token can be manually passed to hooks/functions

```tsx
// Automatic token from localStorage
const { get } = useApiGet();
await get('/protected-route');

// Manual token
const { get } = useApiGet({ token: 'custom-token' });
await get('/protected-route');
```

## 🛠️ Error Handling

```tsx
const { error, execute } = useApi({
  onError: (error) => {
    if (error.statusCode === 401) {
      // Redirect to login
    } else if (error.statusCode === 404) {
      // Show not found message
    }
  }
});
```

## 📝 TypeScript Support

Full TypeScript support with generics:

```tsx
interface User {
  id: string;
  name: string;
  email: string;
}

const { data } = useApiGet<User>();
await get('/users/1');

// data is typed as User | null
console.log(data?.name);
```

## 🔗 API Endpoints

All endpoints are defined in `services/api-services.ts`. Update the base URL in your environment variables.

## 📚 Examples

See `examples/api-usage-examples.tsx` for complete working examples including:
- Login/Register
- Profile management
- Mascot updates
- Multiple API calls
- Protected resources

## 🎨 Integration with Existing Components

To integrate with your signup page:

```tsx
import { useApiPost } from '@/hooks/useApi';
import { authApi } from '@/services/api-services';

export default function StudentSignupPage() {
  const { loading, error, post } = useApiPost({
    onSuccess: (data) => {
      localStorage.setItem('auth_token', data.token);
      router.push('/student/dashboard');
    }
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await post('/auth/register', {
      email,
      password,
      name,
      role: 'student',
      mascot: mascotParts
    });
  };

  // Rest of component...
}
```

## 🐛 Debugging

Enable console logs in `api-client.ts` to debug requests:

```typescript
console.log('API Request:', url, requestConfig);
console.log('API Response:', data);
```

