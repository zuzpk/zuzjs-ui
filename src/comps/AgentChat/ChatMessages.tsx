import type { AgentMessage } from '@zuzjs/hooks';
import { ValueOf, Variant } from '../../types';
import Flex from '../Flex';
import { ReactNode, useEffect, useMemo, useRef } from 'react';
import Spinner from '../Spinner';
import Text from '../Text';
import { AgentMarkdown } from './AgentMarkdown';
import { Box } from '../..';
import ChatActivity from './ChatActivity';
import ChatExecution from './ChatExecution';
import ChatTools from './ChatTools';
import type { AgentActivityBlock, AgentActivityOptions, AgentToolInvocation } from './types';

type RenderItem =
  | { key: string; type: 'message'; message: AgentMessage }
  | { key: string; type: 'activity'; block: AgentActivityBlock };

const ChatMessages: React.FC<{
  variant?: ValueOf<typeof Variant>;
  messages: AgentMessage[];
  loading: boolean;
  activityBlocks?: AgentActivityBlock[];
  activity?: AgentActivityOptions;
  tools?: AgentToolInvocation[];
  renderAboveMessages?: ReactNode;
  renderMarkdown?: (content: string, message: AgentMessage) => ReactNode;
  scrollToLatestIcon?: string;
  scrollToLatestBusyIcon?: string;
}> = ({ variant = Variant.Medium, messages, loading, activityBlocks = [], activity, tools = [], renderAboveMessages, renderMarkdown }) => {
  const bottomRef = useRef<HTMLDivElement>(null);
  useEffect(() => { bottomRef.current?.scrollIntoView({ block: 'end' }); }, [loading, messages, activityBlocks]);

  const items = useMemo<RenderItem[]>(() => {
    const before = new Map<string | undefined, AgentActivityBlock[]>();
    const after = new Map<string | undefined, AgentActivityBlock[]>();
    const add = (map: Map<string | undefined, AgentActivityBlock[]>, block: AgentActivityBlock) => {
      const list = map.get(block.messageId) ?? [];
      list.push(block);
      map.set(block.messageId, list);
    };
    activityBlocks.forEach((block) => add(block.placement === 'after' ? after : before, block));

    // The original AgentClient contract attaches activity to an assistant
    // message. Treat that as a backwards-compatible before-message block.
    messages.forEach((message) => {
      if (message.role === 'assistant' && message.activity?.length && !activityBlocks.some((block) => block.id === `legacy-${message.id}`)) {
        add(before, { id: `legacy-${message.id}`, activity: message.activity, placement: 'before', messageId: message.id });
      }
    });

    const result: RenderItem[] = [];
    const append = (blocks: AgentActivityBlock[] | undefined) => blocks?.forEach((block) =>
      result.push({ key: `activity-${block.id}`, type: 'activity', block }),
    );
    append(before.get(undefined));
    messages.forEach((message) => {
      append(before.get(message.id));
      result.push({ key: `message-${message.id}`, type: 'message', message });
      append(after.get(message.id));
    });
    append(after.get(undefined));
    return result;
  }, [activityBlocks, messages]);

  return <Flex cols as={`--za-messages --${variant}`}>
    {renderAboveMessages}
    {loading && messages.length === 0 && <Flex aic jcc gap={6} cols as="--za-chat-loading --abs --abc"><Spinner type="SIMPLE" /><Text>wait</Text></Flex>}
    {!loading && messages.length === 0 && <Flex aic jcc gap={6} cols as="--za-chat-empty --abs --abc"><Text as="--za-ce-title">Start a conversation</Text><Text as="--za-ce-msg">Ask anything.</Text></Flex>}
    {items.map((item) => {
      if (item.type === 'activity') return <ChatActivity
        key={item.key}
        activity={item.block.activity}
        done={item.block.done}
        compactLive={activity?.compactLive}
      />;
      const message = item.message;
      const assistant = message.role === 'assistant';
      const content = renderMarkdown ? renderMarkdown(message.content, message) : <AgentMarkdown content={message.content} />;
      return <Flex cols key={item.key} className={`--za-msg ${assistant ? ' --za-msg-assistant' : ' --za-msg-user --jce'}`}>
        {assistant ? content : <Flex as="--za-bubble">{content}</Flex>}
        {assistant && tools.length > 0 && <ChatTools tools={tools} />}
        {assistant && <ChatExecution terminal={message.terminal} stats={message.stats} />}
      </Flex>;
    })}
    <Box as="--za-bottom-ref" ref={bottomRef} />
  </Flex>;
};

export default ChatMessages;
