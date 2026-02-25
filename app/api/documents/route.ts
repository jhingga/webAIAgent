import { NextRequest, NextResponse } from 'next/server';
import { Document } from '@/types';

// In-memory storage (replace with database)
let documents: Document[] = [];

// POST: Create or update document
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, title, content, workspaceId, lastEditedBy } = body;

    if (!title || !workspaceId) {
      return NextResponse.json(
        { error: 'Title and workspaceId required' },
        { status: 400 }
      );
    }

    if (id) {
      // Update existing document
      const docIndex = documents.findIndex((d) => d.id === id);
      if (docIndex !== -1) {
        documents[docIndex] = {
          ...documents[docIndex],
          content: content || documents[docIndex].content,
          title: title || documents[docIndex].title,
          updatedAt: new Date(),
          version: documents[docIndex].version + 1,
          lastEditedBy: lastEditedBy || 'unknown',
        };
        return NextResponse.json(documents[docIndex]);
      }
    }

    // Create new document
    const newDoc: Document = {
      id: `doc-${Date.now()}`,
      title,
      content: content || '',
      workspaceId,
      createdAt: new Date(),
      updatedAt: new Date(),
      version: 1,
      lastEditedBy: lastEditedBy || 'user-1',
    };

    documents.push(newDoc);
    return NextResponse.json(newDoc, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// GET: List documents by workspace
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const workspaceId = searchParams.get('workspaceId');

    if (!workspaceId) {
      return NextResponse.json(documents);
    }

    const filtered = documents.filter((d) => d.workspaceId === workspaceId);
    return NextResponse.json(filtered);
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
