# AI Agents Integration Guide

Panduan lengkap untuk mengintegrasikan AI Agents ke dalam aplikasi Trae.

## Overview

Aplikasi Trae memiliki 2 AI Agents:

1. **Agent 1: Semantic Q&A** - Menjawab pertanyaan tentang procurement government
2. **Agent 2: KAK Generator** - Generate Kerangka Acuan Kerja (KAK)

## Agent 1: Semantic Q&A Procurement

### Purpose
Menjawab pertanyaan tentang procurement pemerintah Indonesia dengan akurat berdasarkan knowledge base regulasi.

### Current Implementation
- Mock implementation di `app/api/agents/agent-1/route.ts`
- Returns dummy search results

### Integration Options

#### Option A: OpenAI + Vector Database

**Setup:**
```bash
npm install openai langchain pinecone-client
```

**Implementation:**
```typescript
// app/api/agents/agent-1/route.ts
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import { PineconeStore } from 'langchain/vectorstores/pinecone';
import { Pinecone } from '@pinecone-database/pinecone';

const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY,
  environment: process.env.PINECONE_ENVIRONMENT,
});

export async function POST(request: NextRequest) {
  const { query } = await request.json();
  
  const embeddings = new OpenAIEmbeddings({
    openAIApiKey: process.env.OPENAI_API_KEY,
  });

  const vectorStore = await PineconeStore.fromExistingIndex(
    embeddings,
    { pineconeIndex: pinecone.Index(process.env.PINECONE_INDEX) }
  );

  // Semantic search
  const results = await vectorStore.similaritySearch(query, 5);

  return NextResponse.json({
    agentId: 'agent-1',
    query,
    results: results.map(doc => ({
      id: doc.metadata.id,
      title: doc.metadata.title,
      content: doc.pageContent,
      source: doc.metadata.source,
      relevance: 0.95,
    })),
    timestamp: new Date().toISOString(),
  });
}
```

**Environment Setup:**
```bash
# .env.local
OPENAI_API_KEY=sk-...
PINECONE_API_KEY=...
PINECONE_ENVIRONMENT=us-east-1
PINECONE_INDEX=procurement-documents
```

#### Option B: Hugging Face Models

**Setup:**
```bash
npm install @xenova/transformers
```

**Implementation:**
```typescript
import { env, pipeline } from '@xenova/transformers';

export async function POST(request: NextRequest) {
  const { query } = await request.json();

  env.allowLocalModels = false;
  
  // Use multi-qa model for semantic search
  const extractor = await pipeline(
    'feature-extraction',
    'Xenova/multi-qa-MiniLM-L6-cos-v1'
  );

  const queryEmbedding = await extractor(query, {
    pooling: 'mean',
    normalize: true,
  });

  // Compare dengan knowledge base embeddings
  // (Pre-computed embeddings for government regulations)
  
  return NextResponse.json({
    agentId: 'agent-1',
    query,
    results: [...], // Top matches dari knowledge base
    timestamp: new Date().toISOString(),
  });
}
```

#### Option C: Local LLM with Ollama

**Setup:**
1. Install [Ollama](https://ollama.ai)
2. Pull model: `ollama pull mistral`
3. Run: `ollama serve`

**Implementation:**
```typescript
export async function POST(request: NextRequest) {
  const { query } = await request.json();

  const response = await fetch('http://localhost:11434/api/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'mistral',
      prompt: `Answer this procurement question: ${query}`,
      stream: false,
    }),
  });

  const data = await response.json();

  return NextResponse.json({
    agentId: 'agent-1',
    query,
    results: [{
      id: '1',
      title: 'AI Response',
      content: data.response,
      source: 'Local LLM',
      relevance: 0.95,
    }],
    timestamp: new Date().toISOString(),
  });
}
```

### Preparing Knowledge Base

Anda perlu menyiapkan knowledge base regulasi procurement:

1. **Collect Documents:**
   - Perpres No. 12 Tahun 2021
   - Instruksi Presiden tentang Pengadaan Barang/Jasa
   - Panduan LPSE
   - Regulasi lokal (jika ada)

2. **Process Documents:**
```typescript
// scripts/prepare-knowledge-base.ts
import { DocumentLoader } from 'langchain/document_loaders';
import { PDFLoader } from 'langchain/document_loaders/fs/pdf';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import { PineconeStore } from 'langchain/vectorstores/pinecone';

async function prepareKnowledgeBase() {
  // Load PDFs
  const loader = new PDFLoader('./regulations/perpres-12-2021.pdf');
  const docs = await loader.load();

  // Split into chunks
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200,
  });

  const splits = await splitter.splitDocuments(docs);

  // Embed and store in Pinecone
  const embeddings = new OpenAIEmbeddings();
  await PineconeStore.fromDocuments(splits, embeddings, {
    pineconeIndex: 'procurement-documents',
  });
}
```

## Agent 2: KAK Generator

### Purpose
Automatically generate Kerangka Acuan Kerja (KAK) documents dengan struktur lengkap dan konten yang relevan.

### Current Implementation
- Mock implementation di `app/api/agents/agent-2/route.ts`
- Returns template-based KAK

### Integration Options

#### Option A: OpenAI GPT-4 (Recommended)

**Setup:**
```bash
npm install openai
```

**Implementation:**
```typescript
// app/api/agents/agent-2/route.ts
import { OpenAI } from 'openai';

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  const { title, department, budget, objectives, scope } = await request.json();

  // System prompt untuk KAK generation
  const systemPrompt = `Anda adalah expert dalam membuat Kerangka Acuan Kerja (KAK) untuk 
  pengadaan barang dan jasa pemerintah Indonesia. Buatkan KAK yang lengkap, detail, 
  dan sesuai dengan regulasi terbaru.`;

  const userPrompt = `Buatkan KAK untuk proyek berikut:
  - Judul: ${title}
  - Departemen: ${department}
  - Budget: ${budget}
  - Objectives: ${objectives}
  - Scope: ${scope}
  
  Berikan KAK yang lengkap dengan semua section yang diperlukan.`;

  const response = await client.chat.completions.create({
    model: 'gpt-4',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ],
    temperature: 0.7,
    max_tokens: 4000,
  });

  const generatedKAK = response.choices[0].message.content || '';

  // Parse sections dari generated KAK
  const sections = [
    'Pendahuluan',
    'Latar Belakang',
    'Tujuan dan Manfaat',
    'Ruang Lingkup',
    'Sumber Dana',
    'Jadwal Pelaksanaan',
    'Penutup',
  ].map(title => ({
    title,
    completed: generatedKAK.includes(title),
  }));

  return NextResponse.json({
    agentId: 'agent-2',
    title,
    department,
    budget,
    generatedKAK,
    sections,
    status: 'completed',
    timestamp: new Date().toISOString(),
    suggestions: [
      'Tambahkan kriteria kualifikasi penyedia',
      'Tentukan output dan deliverables yang spesifik',
      'Sertakan metode evaluasi proposal',
    ],
  });
}
```

#### Option B: Anthropic Claude

**Setup:**
```bash
npm install @anthropic-ai/sdk
```

**Implementation:**
```typescript
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(request: NextRequest) {
  const { title, department, budget, objectives, scope } = await request.json();

  const message = await client.messages.create({
    model: 'claude-3-opus-20240229',
    max_tokens: 4000,
    messages: [
      {
        role: 'user',
        content: `Buatkan KAK lengkap untuk:
        Judul: ${title}
        Departemen: ${department}
        Budget: ${budget}`,
      },
    ],
  });

  const generatedKAK = message.content[0].type === 'text' 
    ? message.content[0].text 
    : '';

  return NextResponse.json({
    agentId: 'agent-2',
    generatedKAK,
    status: 'completed',
  });
}
```

#### Option C: Local LLM with Ollama

**Implementation:**
```typescript
export async function POST(request: NextRequest) {
  const { title, department, budget, objectives, scope } = await request.json();

  const prompt = `Generate a complete Kerangka Acuan Kerja (KAK) for:
  Title: ${title}
  Department: ${department}
  Budget: ${budget}
  Objectives: ${objectives}
  Scope: ${scope}`;

  const response = await fetch('http://localhost:11434/api/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'neural-chat', // atau mistral, llama2, dll
      prompt: prompt,
      stream: false,
    }),
  });

  const data = await response.json();

  return NextResponse.json({
    agentId: 'agent-2',
    title,
    generatedKAK: data.response,
    status: 'completed',
  });
}
```

### KAK Template Structure

Pastikan generated KAK mengikuti struktur:

```markdown
KERANGKA ACUAN KERJA (KAK)
Tahun: [TAHUN]

I. PENDAHULUAN
[Pengenalan singkat tentang proyek]

II. LATAR BELAKANG
[Konteks dan alasan pengadaan]

III. TUJUAN DAN MANFAAT
[Tujuan dan manfaat proyek]

IV. RUANG LINGKUP PEKERJAAN
[Daftar aktivitas dan deliverables]

V. SUMBER DANA
[Informasi funding]

VI. JADWAL PELAKSANAAN
[Timeline proyek]

VII. SISTEM PEMBAYARAN
[Metode dan kondisi pembayaran]

VIII. KRITERIA KUALIFIKASI PENYEDIA
[Persyaratan vendor/supplier]

IX. METODE EVALUASI PROPOSAL
[Cara mengevaluasi proposal yang masuk]

X. PENUTUP
[Closing statement]
```

## Integration Checklist

- [ ] Pilih provider AI (OpenAI/Anthropic/Local)
- [ ] Setup API keys di `.env.local`
- [ ] Update Agent 1 implementation
- [ ] Update Agent 2 implementation
- [ ] Prepare knowledge base untuk Agent 1
- [ ] Test both agents
- [ ] Add error handling
- [ ] Add logging
- [ ] Deploy to production

## Testing Agents

### Test Agent 1

```bash
# Terminal
curl -X POST http://localhost:3000/api/agents/agent-1 \
  -H "Content-Type: application/json" \
  -d '{"query":"Apa syarat pengadaan di atas 100 juta?"}'
```

### Test Agent 2

```bash
# Terminal
curl -X POST http://localhost:3000/api/agents/agent-2 \
  -H "Content-Type: application/json" \
  -d '{
    "title":"Konsultasi Sistem Informasi",
    "department":"IT",
    "budget":"Rp 500 juta"
  }'
```

## Cost Estimation

### OpenAI Pricing (as of Feb 2024)

- **GPT-4 Input:** $0.03 per 1K tokens
- **GPT-4 Output:** $0.06 per 1K tokens
- **Embeddings:** $0.0001 per 1K tokens

Estimasi untuk 100 queries/hari:
- 50 Agent 1 calls: ~$1-2/bulan
- 50 Agent 2 calls: ~$10-20/bulan
- **Total:** ~$12-22/bulan

### Self-Hosted (Ollama)
- **Cost:** Server infrastructure only
- **Benefit:** Privacy, no API calls

## Best Practices

1. **Caching**: Cache frequently asked questions
2. **Rate Limiting**: Implement rate limiting untuk API
3. **Error Handling**: Handle API failures gracefully
4. **Logging**: Log all agent calls untuk monitoring
5. **Versioning**: Version your prompts dan knowledge base
6. **Testing**: Thoroughly test dengan berbagai inputs
7. **Monitoring**: Monitor API usage dan costs

---

**Last Updated:** February 20, 2024
