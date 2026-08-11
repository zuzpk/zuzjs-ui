import { Variant } from "../../types";
import Flex from "../Flex";
import ScrollView from "../ScrollView";
import ChatComposer from "./ChatComposer";
import ChatMessages from "./ChatMessages";
import { AgentChatProvider, useAgentChat } from "./context";
import { AgentChatProps } from "./types";

const Chat = ({
  agent,
  capabilities,
  composerControls,
  variant,
  renderMarkdown,
  scrollToLatestBusyIcon,
  scrollToLatestIcon
} : Required<Pick<AgentChatProps, 'agent' | 'capabilities' | 'brand' | 'variant' | 'renderSidebar'>>
  & Pick<AgentChatProps, 'composerControls' | 'renderMarkdown' | 'scrollToLatestIcon' | 'scrollToLatestBusyIcon'>
) => {

  const { agent: _agent } = useAgentChat()
  const create = async () => {
    await agent.createChat();
  };
  
  return <Flex
      cols
      as={`--zuz-agent --${variant}`}
      // onDragOver={handleDragOver}
      // onDragLeave={handleDragLeave}
      // onDrop={handleDrop}
      >

      <Flex
        cols
        as={`--za-chat`}>

          <ScrollView>
            <ChatMessages 
              variant={variant}
              messages={agent.messages}
              loading={agent.loading}
              renderMarkdown={renderMarkdown}
              scrollToLatestIcon={scrollToLatestIcon}
              scrollToLatestBusyIcon={scrollToLatestBusyIcon}
              />
          </ScrollView>

          <ChatComposer 
            variant={variant}
            busy={agent.running}
            canCancel={capabilities.cancel}
            controls={composerControls}
            onSend={agent.send}
            onCancel={agent.cancel} />
      </Flex>

  </Flex>
}

const AgentChat = ({
  agent,
  capabilities,
  composerControls,
  brand = { name: 'Agent' },
  variant = Variant.Medium,
  renderSidebar = true,
  renderMarkdown,
  scrollToLatestIcon,
  scrollToLatestBusyIcon,
} : AgentChatProps) => {

  return <AgentChatProvider
    agent={agent}
    capabilities={capabilities}
    composerControls={composerControls}
    brand={brand}
    renderMarkdown={renderMarkdown}>

    <Chat 
      agent={agent}
      capabilities={capabilities}
      composerControls={composerControls}
      brand={brand}
      variant={variant}
      renderSidebar={renderSidebar}
      scrollToLatestIcon={scrollToLatestIcon}
      renderMarkdown={renderMarkdown}
      scrollToLatestBusyIcon={scrollToLatestBusyIcon} />

  </AgentChatProvider>

}

export default AgentChat

export { AgentChatProvider, useAgentChat } from './context';
export type {
    AgentChatContextValue,
    AgentChatProviderProps
} from './context';
export type {
    AgentChatBrand,
    AgentChatProps,
    AgentComposerControls,
    AgentComposerModel
} from './types';
