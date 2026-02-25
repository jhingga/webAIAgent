// Library untuk berinteraksi dengan AI Agents

export interface Agent1Request {
  query: string;
  context?: string;
}

export interface Agent1Response {
  agentId: string;
  query: string;
  results: Array<{
    id: string;
    title: string;
    content: string;
    source: string;
    relevance: number;
  }>;
  timestamp: string;
}

export interface Agent2Request {
  title: string;
  department: string;
  budget?: string;
  objectives?: string;
  scope?: string;
}

export interface Agent2Response {
  agentId: string;
  title: string;
  department: string;
  budget?: string;
  generatedKAK: string;
  sections: Array<{
    title: string;
    completed: boolean;
  }>;
  status: 'completed' | 'pending' | 'error';
  timestamp: string;
  suggestions: string[];
}

/**
 * Agent 1: Semantic/QA Procurement
 * Mengirim query tentang procurement government dan mendapat jawaban dari semantic search
 */
export async function callAgent1(request: Agent1Request): Promise<Agent1Response> {
  try {
    const response = await fetch('/api/agents/agent-1', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: request.query,
        context: request.context,
        agentId: 'agent-1',
      }),
    });

    if (!response.ok) {
      throw new Error(`Agent 1 error: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Agent 1 call failed:', error);
    throw error;
  }
}

/**
 * Agent 2: KAK Generator
 * Generate Kerangka Acuan Kerja (KAK) berdasarkan input parameter
 */
export async function callAgent2(request: Agent2Request): Promise<Agent2Response> {
  try {
    const response = await fetch('/api/agents/agent-2', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...request,
        agentId: 'agent-2',
      }),
    });

    if (!response.ok) {
      throw new Error(`Agent 2 error: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Agent 2 call failed:', error);
    throw error;
  }
}

/**
 * Batch call kedua agents
 */
export async function callBothAgents(
  agent1Request: Agent1Request,
  agent2Request: Agent2Request
) {
  try {
    const results = await Promise.all([
      callAgent1(agent1Request),
      callAgent2(agent2Request),
    ]);

    return {
      agent1: results[0],
      agent2: results[1],
    };
  } catch (error) {
    console.error('Batch call failed:', error);
    throw error;
  }
}
