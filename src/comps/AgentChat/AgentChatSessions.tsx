import { Box, Button, Flex, ScrollView, Text } from '../..';
import type { AgentChatSummary, AgentController } from '@zuzjs/hooks';

export function AgentChatSessions({
  chats,
  activeChatId,
  onSelect,
  onNew,
  onArchive,
  canArchive,
}: {
  chats: AgentChatSummary[];
  activeChatId: string | null;
  onSelect: AgentController['selectChat'];
  onNew: () => void;
  onArchive: (chatId: string) => void;
  canArchive: boolean;
}) {
  return <Flex className="--agent-chat-sidebar">
    <Flex className="--agent-chat-sidebar-header">
      <Text className="--agent-chat-sidebar-title">Chats</Text>
      <Button kind="ghost" variant="xs" icon="add" onClick={onNew} aria-label="New chat">New</Button>
    </Flex>
    <ScrollView className="--agent-chat-sessions-scroll">
      <Flex className="--agent-chat-sessions">
        {chats.length === 0 && <Text className="--agent-chat-no-sessions">No chats yet</Text>}
        {chats.map((chat) => {
          const active = chat.id === activeChatId;
          return <Box
            key={chat.id}
            role="button"
            tabIndex={0}
            onClick={() => void onSelect(chat.id)}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                void onSelect(chat.id);
              }
            }}
            className={`--agent-chat-session${active ? ' --agent-chat-session-active' : ''}`}
          >
            <Flex className="--agent-chat-session-row">
              <Text className="--agent-chat-session-title">{chat.title || 'New chat'}</Text>
              {canArchive && <Button
                kind="ghost"
                variant="xs"
                icon="delete"
                aria-label={`Archive ${chat.title}`}
                onClick={(event) => {
                  event.stopPropagation();
                  onArchive(chat.id);
                }}
              />}
            </Flex>
            <Flex className="--agent-chat-session-meta">
              {chat.contextMode && <Text className="--agent-chat-session-context">{chat.contextMode}</Text>}
              <Text className="--agent-chat-session-date">{new Date(chat.updatedAt).toLocaleDateString()}</Text>
            </Flex>
          </Box>;
        })}
      </Flex>
    </ScrollView>
  </Flex>;
}
