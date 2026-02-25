# Trae Project - Quick Reference

Panduan cepat untuk memulai dengan Trae.

## 📁 File Structure Overview

```
a/
├── app/
│   ├── page.tsx              # Homepage
│   ├── layout.tsx            # Root layout
│   ├── globals.css           # Global styles
│   └── api/                  # API routes
│       ├── agents/
│       │   ├── agent-1/route.ts  (Semantic Q&A)
│       │   └── agent-2/route.ts  (KAK Generator)
│       ├── workspaces/route.ts
│       ├── documents/route.ts
│       └── messages/route.ts
├── components/
│   ├── Sidebar.tsx           # Navigation
│   ├── Workspace.tsx         # Editor
│   ├── AIChat.tsx            # Chat & Results
│   ├── Button.tsx            # Button component
│   └── UI.tsx                # UI utilities
├── lib/
│   ├── agentClient.ts        # AI agent functions
│   └── workspaceClient.ts    # Workspace functions
├── types/
│   └── index.ts              # Type definitions
├── public/                   # Static files
└── styles/                   # Additional styles
```

## 🚀 Getting Started

### 1. Installation
```bash
cd c:\Users\jhing\Downloads\coba\a
npm install
```

### 2. Run Development
```bash
npm run dev
# Open: http://localhost:3000
```

### 3. Build for Production
```bash
npm run build
npm start
```

## 📚 Key Components

### Sidebar (`Sidebar.tsx`)
- Workspace navigation
- Tool shortcuts
- User profile

**Usage:**
```tsx
import Sidebar from '@/components/Sidebar';
<Sidebar />
```

### Workspace (`Workspace.tsx`)
- Document editor
- Multiple tabs support
- Edit/save functionality

**Usage:**
```tsx
import Workspace from '@/components/Workspace';
<Workspace />
```

### AIChat (`AIChat.tsx`)
- Agent 1 chat interface
- Agent 2 results table
- Real-time updates

**Usage:**
```tsx
import AIChat from '@/components/AIChat';
<AIChat />
```

## 🤖 AI Agents

### Agent 1: Semantic Q&A

**Endpoint:** `POST /api/agents/agent-1`

**Usage:**
```typescript
import { callAgent1 } from '@/lib/agentClient';

const response = await callAgent1({
  query: 'Apa syarat pengadaan di atas 100 juta?'
});
```

**Response:**
```json
{
  "agentId": "agent-1",
  "query": "...",
  "results": [
    {
      "id": "1",
      "title": "Regulation Title",
      "content": "...",
      "source": "Government",
      "relevance": 0.95
    }
  ]
}
```

### Agent 2: KAK Generator

**Endpoint:** `POST /api/agents/agent-2`

**Usage:**
```typescript
import { callAgent2 } from '@/lib/agentClient';

const response = await callAgent2({
  title: 'Konsultasi Sistem Informasi',
  department: 'IT',
  budget: 'Rp 500 juta',
  objectives: 'Mengembangkan SIM',
  scope: 'Phase 1,2,3'
});
```

**Response:**
```json
{
  "agentId": "agent-2",
  "title": "...",
  "generatedKAK": "full document...",
  "sections": [
    { "title": "Pendahuluan", "completed": true }
  ],
  "status": "completed",
  "suggestions": [...]
}
```

## 📱 Common Tasks

### Creating a New Component

```typescript
// components/MyComponent.tsx
"use client";

import React from 'react';

export default function MyComponent() {
  return (
    <div className="p-4 bg-slate-900 rounded-lg">
      <h1>My Component</h1>
    </div>
  );
}
```

### Adding a New API Route

```typescript
// app/api/my-endpoint/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Error' }, { status: 500 });
  }
}
```

### Calling APIs from Component

```typescript
"use client";

import { useEffect, useState } from 'react';
import { callAgent1 } from '@/lib/agentClient';

export default function MyComponent() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleQuery = async () => {
    setLoading(true);
    try {
      const result = await callAgent1({ query: 'My question' });
      setData(result);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button onClick={handleQuery} disabled={loading}>
      {loading ? 'Loading...' : 'Ask AI'}
    </button>
  );
}
```

## 🎨 Styling with Tailwind

### Common Utility Classes

```html
<!-- Spacing -->
<div class="p-4">Padding</div>
<div class="m-2">Margin</div>

<!-- Colors -->
<div class="bg-blue-600">Blue background</div>
<div class="text-slate-100">Light text</div>

<!-- Flexbox -->
<div class="flex gap-2">Flex container</div>
<div class="flex-1">Flex item</div>

<!-- Grid -->
<div class="grid grid-cols-3">3 columns</div>

<!-- Responsive -->
<div class="md:p-8 sm:p-4">Responsive padding</div>

<!-- Hover/Active -->
<button class="hover:bg-blue-500 active:bg-blue-700">Button</button>
```

### Custom Component Colors

```typescript
// Use slate theme colors
bg-slate-900    // Dark background
bg-slate-800    // Darker
bg-slate-700    // Dark borders
text-slate-100  // Light text
text-slate-400  // Dimmer text
```

## 🔌 API Routes

### Workspaces
- `GET /api/workspaces` - List all
- `POST /api/workspaces` - Create new

### Documents
- `GET /api/documents?workspaceId=...` - List by workspace
- `POST /api/documents` - Create/update

### Messages
- `GET /api/messages?agentId=...` - Get messages
- `POST /api/messages` - Save message

### Agents
- `POST /api/agents/agent-1` - Semantic search
- `POST /api/agents/agent-2` - KAK generation

## 📋 Type Definitions

```typescript
// Document
interface Document {
  id: string;
  title: string;
  content: string;
  workspaceId: string;
  createdAt: Date;
  updatedAt: Date;
  version: number;
}

// Workspace
interface Workspace {
  id: string;
  name: string;
  documents: Document[];
  createdAt: Date;
}

// ChatMessage
interface ChatMessage {
  id: string;
  agentId: 'agent-1' | 'agent-2';
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
}
```

See `types/index.ts` for all type definitions.

## 🧪 Testing

### Test in Browser
1. Open http://localhost:3000
2. Try editing a document
3. Send a message to Agent 1
4. Generate a KAK with Agent 2

### Test API with cURL

```bash
# Test Agent 1
curl -X POST http://localhost:3000/api/agents/agent-1 \
  -H "Content-Type: application/json" \
  -d '{"query":"test"}'

# Test Agent 2
curl -X POST http://localhost:3000/api/agents/agent-2 \
  -H "Content-Type: application/json" \
  -d '{"title":"test","department":"IT","budget":"1M"}'
```

## 🐛 Debugging

### VS Code Debugging

Add to `.vscode/launch.json`:
```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Next.js",
      "type": "node",
      "request": "launch",
      "program": "${workspaceFolder}/node_modules/.bin/next",
      "args": ["dev"],
      "cwd": "${workspaceFolder}"
    }
  ]
}
```

### Browser DevTools
- F12 to open DevTools
- Check Network tab for API calls
- Console tab for errors

## 📚 Documentation Files

- `README.md` - Project overview
- `SETUP_GUIDE.md` - Installation & setup
- `AI_AGENTS_INTEGRATION.md` - AI integration details
- `MOCKUP_DESIGN.html` - UI mockup (open in browser)

## 🔐 Environment Variables

Create `.env.local`:

```
# API
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000

# AI Services (optional)
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=...
HUGGINGFACE_API_KEY=...

# Database (optional)
DATABASE_URL=postgresql://...

# Environment
NODE_ENV=development
```

## 📦 Dependencies

### Core
- next@latest
- react@latest
- typescript@latest
- tailwindcss@latest

### Optional (for AI integration)
- openai
- @anthropic-ai/sdk
- langchain
- pinecone-client
- prisma (database)

## 🚀 Deployment

### Vercel (Easy)
1. Push to GitHub
2. Connect to Vercel
3. Set environment variables
4. Deploy!

### Docker
```bash
docker build -t trae .
docker run -p 3000:3000 trae
```

### Node.js Server
```bash
npm run build
npm start
```

## 🆘 Troubleshooting

| Issue | Solution |
|-------|----------|
| Port already in use | Kill process on port 3000 |
| Module not found | `rm -rf node_modules && npm install` |
| Type errors | Run `npm run type-check` |
| Styling not working | Check Tailwind CSS setup |
| API not responding | Check terminal for errors |

## 📞 Support Resources

- Next.js: https://nextjs.org/docs
- React: https://react.dev
- Tailwind: https://tailwindcss.com/docs
- TypeScript: https://typescriptlang.org/docs

## ✅ Checklist Before Deployment

- [ ] All API endpoints working
- [ ] AI agents integrated
- [ ] Database configured
- [ ] Environment variables set
- [ ] Type checking passes
- [ ] No console errors
- [ ] Responsive design tested
- [ ] Performance optimized

---

**Version:** 1.0.0  
**Last Updated:** February 20, 2024
