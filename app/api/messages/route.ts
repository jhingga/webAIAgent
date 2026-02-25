import { NextRequest, NextResponse } from 'next/server';
import { ChatMessage } from '@/types';

// In-memory storage (replace with database)
let messages: ChatMessage[] = [];

// POST: Save chat message
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { agentId, type, content, metadata } = body;

    if (!agentId || !type || !content) {
      return NextResponse.json(
        { error: 'agentId, type, and content required' },
        { status: 400 }
      );
    }

    const newMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      agentId,
      type,
      content,
      timestamp: new Date(),
      metadata: metadata || {},
    };

    messages.push(newMessage);
    return NextResponse.json(newMessage, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// GET: Retrieve chat messages
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const agentId = searchParams.get('agentId');

    if (!agentId) {
      return NextResponse.json(messages);
    }

    const filtered = messages.filter((m) => m.agentId === agentId);
    return NextResponse.json(filtered);
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
