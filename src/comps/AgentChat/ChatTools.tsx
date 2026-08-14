import { useState } from 'react';
import type { AgentToolInvocation } from '@zuzjs/hooks';
import Flex from '../Flex';
import Icon from '../Icon';
import Text from '../Text';

const formatValue = (value: unknown) => {
  if (typeof value === 'string') return value;
  try {
    const formatted = JSON.stringify(value, null, 2);
    return formatted === undefined ? String(value) : formatted;
  } catch {
    return String(value);
  }
};

const ToolValue = ({ label, value }: { label: string; value: unknown }) => {
  if (value === undefined) return null;
  return <Flex cols gap={3} as="--za-tool-value">
    <Text as="--za-tool-value-label">{label}</Text>
    <pre>{formatValue(value)}</pre>
  </Flex>;
};

const ChatTool = ({ tool }: { tool: AgentToolInvocation }) => {
  const [expanded, setExpanded] = useState(false);
  const hasDetails = tool.input !== undefined || tool.output !== undefined || tool.error !== undefined;
  const state = tool.state === 'completed' ? 'Completed' : tool.state === 'failed' ? 'Failed' : tool.state === 'running' ? 'Running' : 'Pending';

  return <Flex cols as={`--za-tool --${tool.state}`}>
    <button
      type="button"
      className="--za-tool-summary"
      aria-expanded={expanded}
      disabled={!hasDetails}
      onClick={() => setExpanded((value) => !value)}
    >
      <Icon name={tool.state === 'failed' ? 'warning' : 'layers'} />
      <Text as="--za-tool-name">{tool.tool || 'Tool invocation'}</Text>
      <Text as="--za-tool-state">{state}</Text>
      {hasDetails && <Icon name={expanded ? 'arrow-up' : 'arrow-down'} />}
    </button>
    {expanded && <Flex cols gap={8} as="--za-tool-details">
      <ToolValue label="Input" value={tool.input} />
      <ToolValue label="Output" value={tool.output} />
      <ToolValue label="Error" value={tool.error} />
    </Flex>}
  </Flex>;
};

const ChatTools = ({ tools }: { tools?: AgentToolInvocation[] }) => {
  if (!tools?.length) return null;
  return <Flex cols gap={6} as="--za-tools">
    {tools.map((tool) => <ChatTool key={tool.id} tool={tool} />)}
  </Flex>;
};

export { formatValue };
export default ChatTools;
