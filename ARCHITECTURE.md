# Trae Architecture Document

Dokumentasi arsitektur lengkap aplikasi Trae.

## System Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                     BROWSER / CLIENT                        │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Next.js Frontend (React Components + Tailwind CSS)  │  │
│  │  - Sidebar (Navigation)                             │  │
│  │  - Workspace (Document Editor)                      │  │
│  │  - AIChat (Chat + Results Interface)                │  │
│  │  - UI Components (Button, Card, Badge, etc)         │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ HTTP/WebSocket
                            │
┌─────────────────────────────────────────────────────────────┐
│              Next.js Server (Backend API)                   │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ API Routes (app/api)                                │  │
│  │  - /agents/agent-1         (Semantic Q&A)          │  │
│  │  - /agents/agent-2         (KAK Generator)         │  │
│  │  - /workspaces             (CRUD)                  │  │
│  │  - /documents              (CRUD)                  │  │
│  │  - /messages               (CRUD)                  │  │
│  └──────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ Libraries (lib/)                                     │  │
│  │  - agentClient.ts          (Agent API wrapper)      │  │
│  │  - workspaceClient.ts      (Workspace API wrapper)  │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
         │                      │                    │
         │                      │                    │
    ┌────▼──────┐     ┌────────▼──────┐    ┌──────▼──────┐
    │   Agent   │     │   Database    │    │  External   │
    │ Services  │     │   (Optional)  │    │   AI APIs   │
    │(OpenAI/   │     │               │    │             │
    │Anthropic) │     │PostgreSQL /   │    │OpenAI GPT-4 │
    │           │     │  MongoDB      │    │Anthropic    │
    └───────────┘     └───────────────┘    │Hugging Face │
                                            └─────────────┘
```

## Component Hierarchy

```
App (Home)
├── Sidebar
│   ├── Logo
│   ├── Nav Sections
│   │   ├── Workspace Items
│   │   ├── Tools
│   │   └── Settings
│   └── User Profile
├── Workspace
│   ├── Header
│   │   ├── Title
│   │   └── Action Buttons
│   ├── Editor Tabs
│   ├── Editor Content
│   │   └── Document / Comments / Revisions
│   └── Editor Controls
└── AIChat
    ├── Panel Tabs
    ├── Chat Container (Agent 1)
    │   ├── Messages
    │   └── Input Area
    └── Results Table (Agent 2)
        └── Results with Actions
```

## Data Flow

### Document Editing Flow

```
User Types → Workspace Component
                    │
                    ▼
         Update local state
                    │
                    ▼
         Debounce save (2s)
                    │
                    ▼
         Save to /api/documents
                    │
                    ▼
         Store in DB (or memory)
                    │
                    ▼
         Return updated Document
                    │
                    ▼
         Update component state
```

### Agent 1 (Semantic Q&A) Flow

```
User Question → AIChat Component
                    │
                    ▼
         callAgent1() from agentClient.ts
                    │
                    ▼
         POST /api/agents/agent-1
                    │
         ┌──────────┴──────────┐
         │                     │
    (Mock Mode)         (Real Integration)
         │                     │
         ▼                     ▼
    Return Mock          Call OpenAI/Vector
    Results             Search API
                             │
                             ▼
                    Parse & Format Results
                             │
                             ▼
    ┌────────────────────────┘
    │
    ▼
Return Agent1Response
    │
    ▼
Display in Chat Messages
    │
    ▼
Save to /api/messages
    │
    ▼
Store Message in DB
```

### Agent 2 (KAK Generator) Flow

```
User Clicks Generate → AIChat Component
         │
         ▼
    Get Form Input
    (title, dept, budget, etc)
         │
         ▼
    callAgent2() from agentClient.ts
         │
         ▼
    POST /api/agents/agent-2
         │
    ┌────┴──────────┐
    │               │
(Mock)           (Real)
    │               │
    ▼               ▼
Return         Call OpenAI/
Template       Claude API
    │               │
    │               ▼
    │          Generate KAK
    │          with LLM
    │               │
    └───────┬───────┘
            │
            ▼
    Return Agent2Response
    (generated KAK + sections)
            │
            ▼
    Display in Results Table
            │
            ▼
    User can Edit/View/Delete
```

## Database Schema (when integrated)

```sql
-- Workspaces
CREATE TABLE workspaces (
  id VARCHAR PRIMARY KEY,
  name VARCHAR NOT NULL,
  description TEXT,
  owner_id VARCHAR,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);

-- Documents
CREATE TABLE documents (
  id VARCHAR PRIMARY KEY,
  title VARCHAR NOT NULL,
  content TEXT,
  workspace_id VARCHAR REFERENCES workspaces,
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  version INTEGER,
  last_edited_by VARCHAR
);

-- Chat Messages
CREATE TABLE chat_messages (
  id VARCHAR PRIMARY KEY,
  agent_id VARCHAR,
  type VARCHAR (user/ai),
  content TEXT,
  workspace_id VARCHAR,
  created_at TIMESTAMP,
  metadata JSON
);

-- Agent Results
CREATE TABLE agent_results (
  id VARCHAR PRIMARY KEY,
  agent_id VARCHAR,
  type VARCHAR,
  title VARCHAR,
  data JSON,
  status VARCHAR,
  workspace_id VARCHAR,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

## API Design

### RESTful Endpoints

```
Workspaces:
  GET    /api/workspaces              - List all
  POST   /api/workspaces              - Create new
  GET    /api/workspaces/:id          - Get one
  PUT    /api/workspaces/:id          - Update
  DELETE /api/workspaces/:id          - Delete

Documents:
  GET    /api/documents                - List all
  POST   /api/documents                - Create/update
  GET    /api/documents/:id            - Get one
  DELETE /api/documents/:id            - Delete

Messages:
  GET    /api/messages                 - List all
  POST   /api/messages                 - Save new
  DELETE /api/messages/:id             - Delete

Agents:
  POST   /api/agents/agent-1           - Semantic Q&A
  POST   /api/agents/agent-2           - KAK Generation

AI Agents:
  POST   /api/agents/agent-1/stream    - Streaming response
  POST   /api/agents/agent-2/stream    - Streaming response
```

### Request/Response Format

**Standard Success Response:**
```json
{
  "success": true,
  "data": { /* actual data */ },
  "timestamp": "2024-02-20T10:00:00Z"
}
```

**Standard Error Response:**
```json
{
  "success": false,
  "error": "Error message",
  "code": "ERROR_CODE",
  "timestamp": "2024-02-20T10:00:00Z"
}
```

## State Management

### Current Implementation
Using React Hooks (useState) at component level.

### Recommended for Scaling
1. **React Context API** - For shared state
2. **Redux** - For complex state management
3. **Zustand** - Lightweight alternative

### Example with Context API

```typescript
// context/WorkspaceContext.tsx
import { createContext, useContext } from 'react';

interface WorkspaceContextType {
  currentWorkspace: Workspace | null;
  documents: Document[];
  setCurrentWorkspace: (ws: Workspace) => void;
  addDocument: (doc: Document) => void;
  updateDocument: (id: string, content: string) => void;
}

const WorkspaceContext = createContext<WorkspaceContextType>(null);

export function WorkspaceProvider({ children }) {
  const [currentWorkspace, setCurrentWorkspace] = useState(null);
  const [documents, setDocuments] = useState([]);
  
  // ... implementation
  
  return (
    <WorkspaceContext.Provider value={{ ... }}>
      {children}
    </WorkspaceContext.Provider>
  );
}

export function useWorkspace() {
  return useContext(WorkspaceContext);
}
```

## Performance Considerations

### Optimization Strategies

1. **Code Splitting**
   ```typescript
   const HeavyComponent = dynamic(() => import('./Heavy'), {
     loading: () => <Skeleton />,
   });
   ```

2. **Image Optimization**
   ```typescript
   import Image from 'next/image';
   ```

3. **API Caching**
   ```typescript
   const { data } = useSWR('/api/documents', fetcher, {
     revalidateOnFocus: false,
     dedupingInterval: 60000,
   });
   ```

4. **Debouncing**
   ```typescript
   const debouncedSave = useMemo(
     () => debounce(saveDocument, 2000),
     []
   );
   ```

## Security Considerations

### Authentication & Authorization

```typescript
// middleware.ts
import { withAuth } from 'next-auth/middleware';

export const middleware = withAuth({
  callbacks: {
    authorized: ({ token }) => !!token,
  },
});

export const config = {
  matcher: ['/api/:path*'],
};
```

### Input Validation

```typescript
// lib/validators.ts
import { z } from 'zod';

export const DocumentSchema = z.object({
  title: z.string().min(1).max(255),
  content: z.string().max(50000),
  workspaceId: z.string().uuid(),
});

export type DocumentInput = z.infer<typeof DocumentSchema>;
```

### API Security

1. Rate limiting
2. CORS configuration
3. Input sanitization
4. Output encoding
5. HTTPS enforcement

## Deployment Architecture

### Development Environment
```
Local Machine
├── Next.js Dev Server (3000)
├── Database (localhost:5432)
└── Optional: Ollama (11434)
```

### Production Environment
```
CDN (Vercel Edge)
         │
         ▼
    Vercel Deployment
    ├── Next.js App
    ├── API Routes
    └── Static Assets
         │
    ┌────┴────┐
    │          │
    ▼          ▼
Database   External APIs
(Vercel/   (OpenAI,
Managed)   Anthropic)
```

### Docker Deployment

```dockerfile
FROM node:18-alpine

WORKDIR /app

# Dependencies
COPY package*.json ./
RUN npm ci

# Build
COPY . .
RUN npm run build

# Production
EXPOSE 3000
CMD ["npm", "start"]
```

## Monitoring & Logging

### Recommended Tools

1. **Monitoring:** Vercel Analytics, Sentry
2. **Logging:** Winston, Pino
3. **Error Tracking:** Sentry, DataDog
4. **Performance:** Vercel Analytics, New Relic

### Basic Logging Setup

```typescript
// lib/logger.ts
export const logger = {
  info: (msg: string, data?: any) => console.log(`[INFO] ${msg}`, data),
  error: (msg: string, error?: any) => console.error(`[ERROR] ${msg}`, error),
  warn: (msg: string, data?: any) => console.warn(`[WARN] ${msg}`, data),
};

// Usage
logger.info('Document saved', { docId, workspaceId });
logger.error('Failed to generate KAK', error);
```

## Scalability Roadmap

### Phase 1: MVP (Current)
- Single workspace
- Mock AI responses
- In-memory storage

### Phase 2: Production
- Database integration
- Real AI agent integration
- Multi-workspace support
- User authentication

### Phase 3: Enterprise
- Microservices architecture
- Message queue (Redis)
- Advanced caching
- Analytics dashboard
- Multi-tenant support

### Phase 4: Advanced
- Real-time collaboration
- WebSocket support
- Document version control
- Advanced search
- AI-powered recommendations

## Technology Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Frontend | React 18 | UI library |
| Framework | Next.js 14 | React framework |
| Styling | Tailwind CSS | Utility CSS |
| Language | TypeScript | Type safety |
| Backend | Node.js | Runtime |
| Database | PostgreSQL | Data storage |
| Cache | Redis | Caching |
| AI | OpenAI API | Language models |
| Deployment | Vercel | Hosting |
| Storage | AWS S3 | File storage |
| Monitoring | Sentry | Error tracking |

## Development Guidelines

### Code Organization
- Keep components small and focused
- Use TypeScript for type safety
- Follow naming conventions
- Write meaningful comments
- Use utility functions

### Git Workflow
```
main (production)
  └── develop (staging)
      └── feature/feature-name (development)
```

### Commit Conventions
```
feat: Add new feature
fix: Fix bug
docs: Update documentation
style: Format code
refactor: Refactor code
test: Add tests
chore: Maintenance
```

---

**Document Version:** 1.0  
**Last Updated:** February 20, 2024  
**Maintained By:** Development Team
