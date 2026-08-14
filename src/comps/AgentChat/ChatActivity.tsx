import { useEffect, useMemo, useState } from 'react';
import type { AgentActivity } from '@zuzjs/hooks';
import Box from '../Box';
import Flex from '../Flex';
import Icon from '../Icon';
import Spinner from '../Spinner';
import Text from '../Text';
import SVGIcons from '../svgicons';

type ChatActivityProps = {
  activity: AgentActivity[];
  done?: boolean;
  /** Keep a running turn to its current status; completed turns retain history. */
  compactLive?: boolean;
};

const isComplete = (activity: AgentActivity[], done?: boolean) => done === true || (
  activity.length > 0 && activity.every((step) => step.state === 'completed' || step.state === 'failed')
);

const summaryFor = (activity: AgentActivity[]) => {
  const thinking = activity.filter((step) => step.kind === 'thinking').length;
  const tools = activity.filter((step) => step.kind === 'tool').length;
  const failed = activity.filter((step) => step.state === 'failed').length;
  const parts: string[] = [];
  if (thinking) parts.push(thinking === 1 ? 'Thought through the task' : `Thought through ${thinking} steps`);
  if (tools) parts.push(tools === 1 ? 'used a tool' : `used ${tools} tools`);
  if (failed) parts.push(failed === 1 ? '1 step failed' : `${failed} steps failed`);
  return parts.length ? parts.join(' · ') : 'Completed activity';
};

const iconFor = (step: AgentActivity) => {
  if (step.state === 'failed') return 'warning';
  if (step.kind === 'tool') return 'layers';
  if (step.kind === 'status') return 'pending';
  return 'bezier';
};

/**
 * Reusable activity block. A compact live block shows only the current status;
 * once complete, the standard summary exposes the full chronological history.
 */
const ChatActivity = ({ activity, done, compactLive = true }: ChatActivityProps) => {
  const completed = isComplete(activity, done);
  const [expanded, setExpanded] = useState(!completed);
  const summary = useMemo(() => summaryFor(activity), [activity]);
  const steps = useMemo(() => activity.filter((step, index, all) => {
    const previous = all[index - 1];
    return !previous || previous.title !== step.title || previous.kind !== step.kind;
  }), [activity]);
  const visibleSteps = compactLive && !completed ? steps.slice(-1) : steps;

  useEffect(() => { if (completed) setExpanded(false); }, [completed]);
  if (!visibleSteps.length) return null;

  return <Flex cols as={`--za-activity ${compactLive ? '--za-activity-compact-live' : ''}`}>
    {completed && <Flex as="--za-activity-summary" aria-expanded={expanded}
      onClick={() => setExpanded((value) => !value)}>
      <Text as="--za-activity-summary-text">{summary}</Text>
      <Flex as="--za-activity-toggle">
        {expanded ? SVGIcons.arrowUp : SVGIcons.arrowDown}
      </Flex>
    </Flex>}
    {(!completed || expanded) && <Flex cols as="--za-activity-steps">
      {visibleSteps.map((step, index) => {
        const active = !completed && index === visibleSteps.length - 1 && (step.state === 'running' || step.state === 'pending');
        const failed = step.state === 'failed';
        const isLast = index === visibleSteps.length - 1;
        return <Flex key={step.id} as="--za-activity-step">
          <Flex cols aic as="--za-activity-rail">
            <Flex aic jcc as="--za-activity-marker">
              {active ? <Spinner type="SIMPLE" /> : <Icon name={failed ? 'warning' : iconFor(step)} as={failed ? '--za-activity-failed' : ''} />}
            </Flex>
            {!isLast && <Box as="--za-activity-line" />}
          </Flex>
          <Flex cols as="--za-activity-copy">
            <Text as={`--za-activity-title ${active ? '--za-activity-active' : ''}`}>{step.title.trim() || 'Working…'}</Text>
            {step.detail && <Text as="--za-activity-detail">{step.detail}</Text>}
          </Flex>
        </Flex>;
      })}
    </Flex>}
  </Flex>;
};

export default ChatActivity;
