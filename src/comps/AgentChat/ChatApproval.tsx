import { useEffect, useState } from 'react';
import type { AgentPermissionRequest } from '@zuzjs/hooks';
import Button from '../Button';
import Flex from '../Flex';
import Input from '../Input';
import Text from '../Text';
import type { ValueOf, Variant } from '../../types';
import type { AgentApprovalOptions } from './types';

type ChatApprovalProps = {
  approval: AgentApprovalOptions;
  variant?: ValueOf<typeof Variant>;
};

const ChatApproval = ({ approval, variant }: ChatApprovalProps) => {
  const { request } = approval;
  const [response, setResponse] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const requiresResponse = Boolean(request.requiredPhrase);
  const responseMatches = !requiresResponse || response === request.requiredPhrase;

  useEffect(() => {
    setResponse('');
    setSubmitting(false);
  }, [request.id]);

  const submit = async (approved: boolean) => {
    if (submitting || (approved && !responseMatches)) return;
    setSubmitting(true);
    try {
      await approval.onRespond({
        request,
        approved,
        response: response || undefined,
      });
    } finally {
      setSubmitting(false);
    }
  };

  return <Flex cols gap={8} as="--za-approval">
    <Flex cols gap={2}>
      <Text as="--za-approval-title">Approval required</Text>
      <Text as="--za-approval-description">{request.description || `Allow ${request.tool}?`}</Text>
    </Flex>
    <Flex cols as="--za-approval-command">
      <Text as="--za-approval-tool">{request.tool}</Text>
      <pre>{request.command}</pre>
    </Flex>
    {request.riskTier && <Text as="--za-approval-risk">Risk: {request.riskTier}</Text>}
    {requiresResponse && <Flex cols gap={4}>
      <Text as="--za-approval-prompt">Type “{request.requiredPhrase}” to approve.</Text>
      <Input
        aria-label="Approval response"
        autoComplete="off"
        disabled={submitting}
        value={response}
        variant={variant}
        onChange={(event) => setResponse(event.currentTarget.value)}
      />
    </Flex>}
    <Flex gap={8} as="--za-approval-actions">
      <Button
        kind="ghost"
        disabled={submitting}
        variant={variant}
        onClick={() => void submit(false)}
      >Reject</Button>
      <Button
        disabled={submitting || !responseMatches}
        variant={variant}
        onClick={() => void submit(true)}
      >Approve</Button>
    </Flex>
  </Flex>;
};

export default ChatApproval;
