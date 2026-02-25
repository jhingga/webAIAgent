# Setup dan Development Guide

## Prerequisites

- Node.js 18.x atau lebih tinggi
- npm 9.x atau yarn 4.x
- Git
- Code editor (VS Code recommended)

## Installation

### 1. Install Dependencies

```bash
cd c:\Users\jhing\Downloads\coba\a
npm install
# atau
yarn install
```

### 2. Setup Environment Variables

```bash
# Copy template environment
cp .env.example .env.local

# Edit .env.local dengan konfigurasi Anda
```

### 3. Run Development Server

```bash
npm run dev
# Server akan berjalan di http://localhost:3000
```

## Project Structure Explanation

### `/app` - Next.js App Router
- `page.tsx` - Main entry point
- `layout.tsx` - Root layout component
- `globals.css` - Global styling
- `/api` - API routes

### `/components` - React Components
- `Sidebar.tsx` - Left navigation sidebar
- `Workspace.tsx` - Main editor area
- `AIChat.tsx` - Chat and results panel
- `Button.tsx` - Reusable button component
- `UI.tsx` - Reusable UI components (Card, Badge, etc.)

### `/lib` - Utility Libraries
- `agentClient.ts` - Functions untuk call AI agents
- `workspaceClient.ts` - Functions untuk workspace management

### `/types` - TypeScript Definitions
- `index.ts` - All type definitions

### `/api` - Backend API Routes
- `/agents/agent-1/route.ts` - Semantic Q&A API
- `/agents/agent-2/route.ts` - KAK Generator API
- `/workspaces/route.ts` - Workspace management
- `/documents/route.ts` - Document management
- `/messages/route.ts` - Chat messages

## Development Workflow

### 1. Creating New Components

```typescript
// components/MyComponent.tsx
"use client"; // jika menggunakan hooks

import React from 'react';

export default function MyComponent() {
  return (
    <div className="p-4 bg-slate-900 rounded-lg">
      <h1>My Component</h1>
    </div>
  );
}
```

### 2. Adding New API Routes

```typescript
// app/api/my-endpoint/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    // Process request
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

### 3. Using Client Libraries

```typescript
// In any component
"use client";

import { callAgent1 } from '@/lib/agentClient';
import { getDocuments } from '@/lib/workspaceClient';

export default function MyComponent() {
  const handleQuery = async () => {
    const result = await callAgent1({
      query: 'What is KAK?'
    });
    console.log(result);
  };

  return <button onClick={handleQuery}>Ask AI</button>;
}
```

## Integration Guide

### Integrating OpenAI untuk Agent 1

1. Install langchain:
```bash
npm install langchain openai
```

2. Update environment:
```
OPENAI_API_KEY=sk-...
```

3. Update API route:
```typescript
// app/api/agents/agent-1/route.ts
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import { MemoryVectorStore } from 'langchain/vectorstores/memory';

export async function POST(request: NextRequest) {
  const embeddings = new OpenAIEmbeddings();
  // Implement semantic search
  // ...
}
```

### Integrating OpenAI untuk Agent 2

1. Install OpenAI library:
```bash
npm install openai
```

2. Update API route:
```typescript
// app/api/agents/agent-2/route.ts
import { OpenAI } from 'openai';

export async function POST(request: NextRequest) {
  const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  // Generate KAK using GPT-4
  const completion = await client.chat.completions.create({
    model: 'gpt-4',
    messages: [
      {
        role: 'user',
        content: `Generate KAK for: ${title}...`
      }
    ],
  });

  return NextResponse.json({
    generatedKAK: completion.choices[0].message.content,
  });
}
```

### Adding Database (PostgreSQL with Prisma)

1. Install dependencies:
```bash
npm install @prisma/client
npm install -D prisma
```

2. Initialize Prisma:
```bash
npx prisma init
```

3. Update `.env.local`:
```
DATABASE_URL="postgresql://user:password@localhost:5432/trae_db"
```

4. Create schema (`prisma/schema.prisma`):
```prisma
model Document {
  id        String   @id @default(cuid())
  title     String
  content   String   @db.Text
  workspaceId String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

5. Run migrations:
```bash
npx prisma migrate dev --name init
```

## Testing

### Running Type Check
```bash
npm run type-check
```

### Running Linter
```bash
npm run lint
```

### Manual Testing
1. Open http://localhost:3000
2. Test workspace creation
3. Test document editing
4. Test agent API calls

## Deployment

### Vercel (Recommended for Next.js)

1. Push to GitHub
2. Connect repository to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy!

### Docker

Create `Dockerfile`:
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

Build and run:
```bash
docker build -t trae .
docker run -p 3000:3000 trae
```

## Troubleshooting

### Port 3000 already in use
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Mac/Linux
lsof -i :3000
kill -9 <PID>
```

### Module not found errors
```bash
rm -rf node_modules package-lock.json
npm install
```

### Build errors
```bash
npm run type-check  # Check TypeScript errors
npm run lint        # Check linting errors
```

## Performance Tips

1. **Code Splitting**: Use dynamic imports for heavy components
```typescript
const HeavyComponent = dynamic(() => import('./Heavy'), {
  loading: () => <p>Loading...</p>,
});
```

2. **Image Optimization**: Use Next.js Image component
```typescript
import Image from 'next/image';
```

3. **API Caching**: Use SWR or React Query
```bash
npm install swr
```

## Security Considerations

1. **Never commit secrets** - Use `.env.local` and `.env.example`
2. **Validate input** - Always validate user input server-side
3. **CSRF Protection** - Implement CSRF tokens for forms
4. **Rate Limiting** - Add rate limiting to API routes
5. **Authentication** - Add user authentication (NextAuth.js recommended)

## Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

---

**Last Updated:** February 20, 2024
