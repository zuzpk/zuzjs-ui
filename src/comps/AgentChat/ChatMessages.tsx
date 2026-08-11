import { AgentMessage } from "@zuzjs/hooks";
import { ValueOf, Variant } from "../../types";
import Flex from "../Flex";
import { ReactNode, useEffect, useRef } from "react";
import Spinner from "../Spinner";
import Text from "../Text";
import { AgentMarkdown } from "./AgentMarkdown";
import { ChatBubble, ScrollView } from "..";
import { Box } from "../..";

const ChatMessages : React.FC<{
  variant?: ValueOf<typeof Variant>;
  messages: AgentMessage[];
  loading: boolean;
  renderMarkdown?: (content: string, message: AgentMessage) => ReactNode;
  /** Icon displayed by the return-to-latest button. */
  scrollToLatestIcon?: string;
  /** Icon displayed by the button while the latest assistant message streams. */
  scrollToLatestBusyIcon?: string;
}> = ({
  variant = Variant.Medium,
  messages,
  loading,
  renderMarkdown,
  scrollToLatestIcon = 'chevronDown',
  scrollToLatestBusyIcon,
}) => {

  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ block: 'end' });
  }, [
    loading,
    messages, 
    // liveBlocks, 
    // fileChanges.length
  ]);

  return <Flex 
    cols
    as={`--za-messages`}>
    

      {/* Loading and messages = 0 */}
      {loading && messages.length === 0 && 
        <Flex aic jcc gap={6} cols as="--za-chat-loading --abs --abc">
          <Spinner type={`SIMPLE`} />
          <Text>wait</Text>
        </Flex>}
      
      {/* Not loading and messages = 0 */}
      {!loading && messages.length === 0 && 
        <Flex aic jcc gap={6} cols as="--za-chat-empty --abs --abc">
          <Text as={`--za-ce-title`}>Start a conversation</Text>
          <Text as={`--za-ce-msg`}>Ask Eccho anything.</Text>
        </Flex>}
      
      {messages.map((message) => {
        
        const assistant = message.role === 'assistant';
        const content = renderMarkdown
          ? renderMarkdown(message.content, message)
          : <AgentMarkdown content={message.content} />;

        return <Flex 
            key={message.id} 
            className={`--za-msg ${assistant ? ' --za-msg-assistant' : ' --za-msg-user --jce'}`}>
              {assistant ? 
                content 
                : <Flex
                  as={`--za-bubble`}>
                    {content}
                  </Flex>}
          </Flex>

      })}

      <Box as={`--za-bottom-ref`} ref={bottomRef} />
      
  </Flex>
}

export default ChatMessages