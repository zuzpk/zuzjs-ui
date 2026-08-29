import type {
  AgentActivity,
  AgentCapabilities,
  AgentPermissionRequest,
  AgentConnectionState,
  AgentController,
  AgentMessage,
  AgentThinkingLevel,
} from '@zuzjs/hooks';
import type { ValueOf, Variant } from '../../types';
import type { ReactNode } from 'react';

export type AgentChatBrand = {
  name: string;
};

export type AgentConnectionOptions = {
  state: AgentConnectionState;
  /** A callback used to obtain an authoritative snapshot after reconnection. */
  onReconnect?: () => void | Promise<void>;
};

/** Presentation options for a live thinking/tool timeline. */
export type AgentActivityOptions = {
  /** Render one compact current-status row while a turn is running. */
  compactLive?: boolean;
};

export type AgentApprovalOptions = {
  request: AgentPermissionRequest;
  onRespond: (input: { request: AgentPermissionRequest; approved: boolean; response?: string }) => void | Promise<void>;
};

/** A generic tool invocation with optional structured input and output. */
export type AgentToolInvocation = {
  id: string;
  tool: string;
  input?: unknown;
  output?: unknown;
  state: 'pending' | 'running' | 'completed' | 'failed';
  error?: string;
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

/** A chronological execution block positioned around an agent message. */
export type AgentActivityBlock = {
  id: string;
  activity: AgentActivity[];
  placement: 'before' | 'after';
  /** Omit to render before the first message (or after the last for `after`). */
  messageId?: string;
  /** Explicitly seals a live block, even if its last activity has not updated yet. */
  done?: boolean;
};

export type AgentIcons = {
  send?: string;
  stop?: string;
  model?: string;
  thinking?: string;
  add?: string;
  list?: string;
  todo?: string;
  document?: string;
  search?: string;
  terminal?: string;
  write?: string;
  read?: string;
  magic?: string;
  copy?: string;
  branch?: string;
  done?: string;
}

export type AgentChatProps = {
  /** Controls the component density and maps to Zuz's standard size tokens. */
  variant?: ValueOf<typeof Variant>;
  agent: AgentController;
  capabilities: AgentCapabilities;
  /** Optional model and thinking controls displayed in the SendBox toolbar. */
  composerControls?: AgentComposerControls;
  /** Replaces the standard composer with a response form for a pending tool approval. */
  approval?: AgentApprovalOptions;
  brand?: AgentChatBrand;
  /** Render the built-in sessions sidebar. Disable it to render a host-owned sidebar with useAgentChat(). */
  renderSidebar?: boolean;
  /** Override the built-in AgentMarkdown renderer for host-specific needs. */
  renderMarkdown?: (content: string, message: AgentMessage) => ReactNode;
  /** Chronological thinking/tool blocks. Legacy `message.activity` remains supported as a block before that message. */
  activityBlocks?: AgentActivityBlock[];
  /** Presentation options for thinking and tool activity. */
  activity?: AgentActivityOptions;
  /** Generic tool calls rendered below assistant messages. */
  tools?: AgentToolInvocation[];
  /** Coarse transport state; reconnecting is shown without discarding local drafts. */
  connection?: AgentConnectionOptions;
  /** Host content rendered before the durable message/timeline list, e.g. file markers. */
  renderAboveMessages?: ReactNode;
  /** Native SendBox + action. Omit it to hide the action. */
  onAdd?: () => void | Promise<void>;
  addButtonTitle?: string;
  /** Host content rendered above the standard SendBox, e.g. a workspace chip. */
  renderComposerHeader?: ReactNode;
  /** Icon displayed by the return-to-latest button after scrolling away from the newest message. */
  scrollToLatestIcon?: string;
  /** Optional icon displayed by that button while an assistant message is streaming. */
  scrollToLatestBusyIcon?: string;
  icons?: AgentIcons
};
