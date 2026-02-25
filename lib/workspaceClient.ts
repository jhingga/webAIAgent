// Utility functions untuk workspace management

export async function createWorkspace(name: string, description?: string) {
  try {
    const response = await fetch('/api/workspaces', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, description }),
    });

    if (!response.ok) throw new Error('Failed to create workspace');
    return await response.json();
  } catch (error) {
    console.error('Create workspace error:', error);
    throw error;
  }
}

export async function getWorkspaces() {
  try {
    const response = await fetch('/api/workspaces');
    if (!response.ok) throw new Error('Failed to fetch workspaces');
    const data = await response.json();
    return data.workspaces || [];
  } catch (error) {
    console.error('Get workspaces error:', error);
    throw error;
  }
}

export async function createOrUpdateDocument(
  title: string,
  content: string,
  workspaceId: string,
  id?: string
) {
  try {
    const response = await fetch('/api/documents', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id,
        title,
        content,
        workspaceId,
        lastEditedBy: 'user-1',
      }),
    });

    if (!response.ok) throw new Error('Failed to save document');
    return await response.json();
  } catch (error) {
    console.error('Save document error:', error);
    throw error;
  }
}

export async function getDocuments(workspaceId: string) {
  try {
    const response = await fetch(`/api/documents?workspaceId=${workspaceId}`);
    if (!response.ok) throw new Error('Failed to fetch documents');
    return await response.json();
  } catch (error) {
    console.error('Get documents error:', error);
    throw error;
  }
}

export async function saveChatMessage(
  agentId: 'agent-1' | 'agent-2',
  type: 'user' | 'ai',
  content: string,
  metadata?: Record<string, any>
) {
  try {
    const response = await fetch('/api/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        agentId,
        type,
        content,
        metadata,
      }),
    });

    if (!response.ok) throw new Error('Failed to save message');
    return await response.json();
  } catch (error) {
    console.error('Save message error:', error);
    throw error;
  }
}

export async function getChatMessages(agentId?: 'agent-1' | 'agent-2') {
  try {
    const url = agentId ? `/api/messages?agentId=${agentId}` : '/api/messages';
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch messages');
    return await response.json();
  } catch (error) {
    console.error('Get messages error:', error);
    throw error;
  }
}
