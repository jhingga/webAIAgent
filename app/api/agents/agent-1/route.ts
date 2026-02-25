import { NextRequest, NextResponse } from 'next/server';

// API endpoint untuk Agent 1: Semantic/QA Procurement
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { query, agentId } = body;

    if (!query) {
      return NextResponse.json({ error: 'Query required' }, { status: 400 });
    }

    // Simulasi response dari AI Agent 1
    // TODO: Integrate dengan actual semantic search service
    const mockResponse = {
      agentId: 'agent-1',
      query: query,
      results: [
        {
          id: '1',
          title: 'Perpres No. 12 Tahun 2021 - Pengadaan Barang/Jasa Pemerintah',
          content: 'Regulasi utama untuk pengadaan barang dan jasa pemerintah...',
          source: 'Government Regulation',
          relevance: 0.95,
        },
        {
          id: '2',
          title: 'LPSE - Sistem Pengadaan Elektronik',
          content: 'Platform pengadaan barang dan jasa secara elektronik...',
          source: 'Government Platform',
          relevance: 0.87,
        },
      ],
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json(mockResponse);
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  return NextResponse.json({
    message: 'Agent 1 API - Semantic/QA Procurement',
    endpoint: '/api/agents/agent-1',
    methods: ['POST'],
  });
}
