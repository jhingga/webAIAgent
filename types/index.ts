// Type definitions for the application

export interface Document {
  id: string;
  title: string;
  content: string;
  workspaceId: string;
  createdAt: Date;
  updatedAt: Date;
  version: number;
  lastEditedBy: string;
}

export interface Workspace {
  id: string;
  name: string;
  description?: string;
  documents: Document[];
  createdAt: Date;
  updatedAt: Date;
  owner: string;
}

export interface ChatMessage {
  id: string;
  agentId: 'agent-1' | 'agent-2';
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  metadata?: Record<string, any>;
}

export interface AgentResult {
  id: string;
  agentId: 'agent-1' | 'agent-2';
  type: 'search_result' | 'kak_generation' | 'analysis';
  title: string;
  data: any;
  status: 'pending' | 'completed' | 'error';
  createdAt: Date;
  updatedAt: Date;
}

export interface Agent {
  id: 'agent-1' | 'agent-2';
  name: string;
  description: string;
  type: 'semantic-qa' | 'kak-generator';
  status: 'active' | 'inactive';
}

export interface TableRow {
  id: string;
  name: string;
  description?: string;
  status: 'pending' | 'completed' | 'error';
  createdAt: string;
  updatedAt: string;
  metadata?: Record<string, any>;
}

export interface ChatContextType {
  messages: ChatMessage[];
  addMessage: (message: ChatMessage) => void;
  clearMessages: () => void;
}

export interface WorkspaceContextType {
  currentWorkspace: Workspace | null;
  documents: Document[];
  addDocument: (doc: Document) => void;
  updateDocument: (docId: string, content: string) => void;
  deleteDocument: (docId: string) => void;
}
