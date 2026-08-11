import { createContext, useContext, useMemo } from 'react';
import type { ReactNode } from 'react';
import type {
  AgentCapabilities,
  AgentController,
  AgentMessage,
} from '@zuzjs/hooks';
import type {
  AgentChatBrand,
  AgentComposerControls,
} from './types';

/** Values shared by an AgentChat and any host-provided chat UI. */
export type AgentChatContextValue = {
  agent: AgentController;
  capabilities: AgentCapabilities;
  composerControls?: AgentComposerControls;
  brand: AgentChatBrand;
  renderMarkdown?: (content: string, message: AgentMessage) => ReactNode;
};

export type AgentChatProviderProps = Omit<AgentChatContextValue, 'brand'> & {
  children: ReactNode;
  brand?: AgentChatBrand;
};

const AgentChatContext = createContext<AgentChatContextValue | null>(null);

/**
 * Shares an agent controller with custom AgentChat-adjacent UI such as a
 * host-owned sessions sidebar.
 */
export function AgentChatProvider({
  agent,
  capabilities,
  composerControls,
  brand = { name: 'Agent' },
  renderMarkdown,
  children,
}: AgentChatProviderProps) {
  const value = useMemo<AgentChatContextValue>(() => ({
    agent,
    capabilities,
    composerControls,
    brand,
    renderMarkdown,
  }), [agent, capabilities, composerControls, brand, renderMarkdown]);

  return <AgentChatContext.Provider value={value}>{children}</AgentChatContext.Provider>;
}

/**
 * Returns the raw agent controller and AgentChat configuration from the
 * nearest AgentChatProvider.
 */
export function useAgentChat(): AgentChatContextValue {
  const context = useContext(AgentChatContext);
  if (!context) {
    throw new Error('useAgentChat must be used within an <AgentChatProvider>.');
  }
  return context;
}
