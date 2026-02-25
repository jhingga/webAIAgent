import { NextRequest, NextResponse } from 'next/server';
import { Document, Workspace } from '@/types';

// In-memory storage (replace with database)
let workspaces: Workspace[] = [
  {
    id: 'ws-1',
    name: 'KAK - Procurement 2026',
    description: 'Workspace untuk membuat Kerangka Acuan Kerja pengadaan tahun 2026',
    documents: [],
    createdAt: new Date(),
    updatedAt: new Date(),
    owner: 'user-1',
  },
];

// GET: List all workspaces
export async function GET(request: NextRequest) {
  try {
    return NextResponse.json({ workspaces });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST: Create new workspace
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, description, owner } = body;

    if (!name) {
      return NextResponse.json({ error: 'Name required' }, { status: 400 });
    }

    const newWorkspace: Workspace = {
      id: `ws-${Date.now()}`,
      name,
      description: description || '',
      documents: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      owner: owner || 'user-1',
    };

    workspaces.push(newWorkspace);
    return NextResponse.json(newWorkspace, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
