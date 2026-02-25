import { NextRequest, NextResponse } from 'next/server';

// API endpoint untuk Agent 2: KAK Generator
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, department, budget, objectives, scope, agentId } = body;

    if (!title || !department) {
      return NextResponse.json(
        { error: 'Title and department required' },
        { status: 400 }
      );
    }

    // Simulasi response dari AI Agent 2 untuk KAK generation
    // TODO: Integrate dengan actual KAK generation service (e.g., LLM API)
    const mockKAK = `
KERANGKA ACUAN KERJA (KAK)
${new Date().getFullYear()}

I. PENDAHULUAN
${title} merupakan kegiatan yang direncanakan dalam rangka ${objectives || 'meningkatkan kapasitas organisasi'}.

II. LATAR BELAKANG
Pengadaan ini diperlukan untuk mendukung operasional dan peningkatan kualitas layanan di ${department}.

III. TUJUAN DAN MANFAAT
Tujuan: Mencapai target sasaran organisasi melalui ${title}
Manfaat: Meningkatkan efisiensi dan kualitas layanan publik

IV. RUANG LINGKUP PEKERJAAN
${scope || '1. Assessment dan analisis kebutuhan\n2. Perencanaan dan desain solusi\n3. Implementasi\n4. Monitoring dan evaluasi'}

V. SUMBER DANA
Budget: ${budget || 'Sesuai dengan APBN/APBD'}

VI. JADWAL PELAKSANAAN
- Pre-planning: 1 bulan
- Persiapan/Procurement: 2 bulan
- Implementasi: 3 bulan
- Closing: 1 bulan

VII. PENUTUP
Demikian KAK ini dibuat untuk menjadi pedoman pelaksanaan kegiatan ini.
    `.trim();

    const result = {
      agentId: 'agent-2',
      title: title,
      department: department,
      budget: budget,
      generatedKAK: mockKAK,
      sections: [
        { title: 'Pendahuluan', completed: true },
        { title: 'Latar Belakang', completed: true },
        { title: 'Tujuan dan Manfaat', completed: true },
        { title: 'Ruang Lingkup', completed: true },
        { title: 'Sumber Dana', completed: true },
        { title: 'Jadwal', completed: true },
      ],
      status: 'completed',
      timestamp: new Date().toISOString(),
      suggestions: [
        'Tambahkan kriteria kualifikasi penyedia',
        'Tentukan output dan deliverables yang spesifik',
        'Sertakan penjelasan metode evaluasi proposal',
      ],
    };

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  return NextResponse.json({
    message: 'Agent 2 API - KAK Generator',
    endpoint: '/api/agents/agent-2',
    methods: ['POST'],
  });
}
