import type {
  AgentCapabilities,
  AgentController,
  AgentMessage,
  AgentThinkingLevel,
} from '@zuzjs/hooks';
import type { ValueOf, Variant } from '../../types';
import type { ReactNode } from 'react';

export type AgentChatBrand = {
  name: string;
};

export type AgentComposerModel = {
  value: string;
  label: string;
};

export type AgentComposerControls = {
  models?: AgentComposerModel[];
  defaultModel?: string;
  thinkingLevels?: AgentThinkingLevel[];
  defaultThinkingLevel?: AgentThinkingLevel;
};

export type AgentChatProps = {
  /** Controls the component density and maps to Zuz's standard size tokens. */
  variant?: ValueOf<typeof Variant>;
  agent: AgentController;
  capabilities: AgentCapabilities;
  /** Optional model and thinking controls displayed in the SendBox toolbar. */
  composerControls?: AgentComposerControls;
  brand?: AgentChatBrand;
  /** Render the built-in sessions sidebar. Disable it to render a host-owned sidebar with useAgentChat(). */
  renderSidebar?: boolean;
  /** Override the built-in AgentMarkdown renderer for host-specific needs. */
  renderMarkdown?: (content: string, message: AgentMessage) => ReactNode;
  /** Icon displayed by the return-to-latest button after scrolling away from the newest message. */
  scrollToLatestIcon?: string;
  /** Optional icon displayed by that button while an assistant message is streaming. */
  scrollToLatestBusyIcon?: string;
};
