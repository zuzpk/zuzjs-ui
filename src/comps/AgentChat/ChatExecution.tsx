import type { AgentRunStats, AgentTerminalExecution } from '@zuzjs/hooks';
import { Flex, Text } from '../..';

const ChatExecution: React.FC<{
  terminal?: AgentTerminalExecution[];
  stats?: AgentRunStats;
}> = ({ terminal, stats }) => {
  if (!terminal?.length && !stats) return null;

  return <Flex cols gap={6} as="--za-agent-execution">
    {terminal?.map((execution) => <Flex cols gap={3} key={execution.id} as={`--za-agent-terminal --${execution.state}`}>
      <Text as="--za-agent-terminal-command">$ {execution.command}</Text>
      {execution.output && <pre className="--za-agent-terminal-output">{execution.output}</pre>}
      {execution.state !== 'running' && <Text as="--za-agent-terminal-result">{execution.exitCode === undefined ? execution.state : `exit ${execution.exitCode}`}</Text>}
    </Flex>)}
    {stats && <Flex gap={8} wrap as="--za-agent-stats">
      {stats.tokensIn !== undefined && <Text>{stats.tokensIn} input</Text>}
      {stats.tokensOut !== undefined && <Text>{stats.tokensOut} output</Text>}
      {stats.tokensPerSecond !== undefined && <Text>{stats.tokensPerSecond.toFixed(1)} tok/s</Text>}
      {stats.latencyMs !== undefined && <Text>{(stats.latencyMs / 1000).toFixed(1)}s</Text>}
      {stats.contextTokens !== undefined && <Text>context {stats.contextTokens}{stats.contextLimit ? `/${stats.contextLimit}` : ''}</Text>}
    </Flex>}
  </Flex>;
};

export default ChatExecution;
