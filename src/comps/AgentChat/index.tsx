import { Variant } from "../../types";
import Flex from "../Flex";
import ScrollView from "../ScrollView";
import Text from "../Text";
import ChatApproval from "./ChatApproval";
import ChatComposer from "./ChatComposer";
import ChatMessages from "./ChatMessages";
import { AgentChatProvider } from "./context";
import { useEffect, useRef } from "react";
import { AgentChatProps } from "./types";

const Chat = ({
  agent,
  capabilities,
  composerControls,
  approval,
  variant,
  renderMarkdown,
  activityBlocks,
  activity,
  tools,
  connection,
  renderAboveMessages,
  onAdd,
  addButtonTitle,
  renderComposerHeader,
  scrollToLatestBusyIcon,
  scrollToLatestIcon,
}: Required<
  Pick<
    AgentChatProps,
    "agent" | "capabilities" | "brand" | "variant" | "renderSidebar"
  >
> &
  Pick<
    AgentChatProps,
    | "composerControls"
    | "approval"
    | "renderMarkdown"
    | "activityBlocks"
    | "activity"
    | "tools"
    | "connection"
    | "renderAboveMessages"
    | "onAdd"
    | "addButtonTitle"
    | "renderComposerHeader"
    | "scrollToLatestIcon"
    | "scrollToLatestBusyIcon"
  >) => {
  const previousConnectionState = useRef(connection?.state);
  useEffect(() => {
    const restored = previousConnectionState.current === 'reconnecting' && connection?.state === 'connected';
    previousConnectionState.current = connection?.state;
    if (restored) void connection?.onReconnect?.();
  }, [connection?.state, connection?.onReconnect]);

  return (
    <Flex cols as={`--zuz-agent --${variant}`}>
      <Flex cols as="--za-chat">
        {connection?.state === 'reconnecting' && <Flex aic gap={6} as="--za-connection-banner" role="status">
          <Text>Connection lost. Reconnecting…</Text>
        </Flex>}
        <ScrollView>
          <ChatMessages
            variant={variant}
            messages={agent.messages}
            loading={agent.loading}
            activityBlocks={activityBlocks}
            activity={activity}
            tools={tools}
            renderAboveMessages={renderAboveMessages}
            renderMarkdown={renderMarkdown}
            scrollToLatestIcon={scrollToLatestIcon}
            scrollToLatestBusyIcon={scrollToLatestBusyIcon}
          />
        </ScrollView>
        {approval ? <ChatApproval approval={approval} variant={variant} /> : <ChatComposer
          variant={variant}
          busy={agent.running}
          canCancel={capabilities.cancel}
          controls={composerControls}
          onSend={agent.send}
          onCancel={agent.cancel}
          onAdd={onAdd}
          addButtonTitle={addButtonTitle}
          header={renderComposerHeader}
        />}
      </Flex>
    </Flex>
  );
};

const AgentChat = ({
  agent,
  capabilities,
  composerControls,
  approval,
  brand = { name: "Agent" },
  variant = Variant.Medium,
  renderSidebar = true,
  renderMarkdown,
  activityBlocks,
  activity,
  tools,
  connection,
  renderAboveMessages,
  onAdd,
  addButtonTitle,
  renderComposerHeader,
  scrollToLatestIcon,
  scrollToLatestBusyIcon,
}: AgentChatProps) => {
  const pendingApproval = approval ?? (agent.permission ? {
    request: agent.permission,
    onRespond: ({ request, approved, response }) => agent.respondToPermission({
      permissionId: request.id,
      approved,
      response,
    }),
  } : undefined);

  return (
    <AgentChatProvider
      agent={agent}
      capabilities={capabilities}
      composerControls={composerControls}
      brand={brand}
      renderMarkdown={renderMarkdown}
    >
      <Chat
        agent={agent}
        capabilities={capabilities}
        composerControls={composerControls}
        approval={pendingApproval}
        brand={brand}
        variant={variant}
        renderSidebar={renderSidebar}
        renderMarkdown={renderMarkdown}
        activityBlocks={activityBlocks}
        activity={activity}
        tools={tools}
        connection={connection}
        renderAboveMessages={renderAboveMessages}
        onAdd={onAdd}
        addButtonTitle={addButtonTitle}
        renderComposerHeader={renderComposerHeader}
        scrollToLatestIcon={scrollToLatestIcon}
        scrollToLatestBusyIcon={scrollToLatestBusyIcon}
      />
    </AgentChatProvider>
  );
};

export default AgentChat;
export { AgentChatProvider, useAgentChat } from "./context";
export type { AgentChatContextValue, AgentChatProviderProps } from "./context";
export type {
  AgentActivityBlock,
  AgentActivityOptions,
  AgentApprovalOptions,
  AgentChatBrand,
  AgentToolInvocation,
  AgentConnectionOptions,
  AgentChatProps,
  AgentComposerControls,
  AgentComposerModel,
} from "./types";
