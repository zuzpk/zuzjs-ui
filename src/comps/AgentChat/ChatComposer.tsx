import { useMemo, useRef, useState } from "react";
import Flex from "../Flex";
import Grid from "../Grid";
import TextArea from "../TextArea";
import { AgentThinkingLevel } from "@zuzjs/hooks";
import { AgentComposerControls, AgentIcons } from "./types";
import { Option } from "../Select/types";
import { ValueOf, Variant } from "../../types";
import Button from "../Button";
import Select from "../Select";
import SVGIcons from "../svgicons";
import Box from "../Box";
import type { ReactNode } from "react";
import { Agent } from "http";

const defaultModels: Option[] = [
  { value: "auto", label: "Auto", icon: "3dcube" },
];
const thinkingOptions: Record<AgentThinkingLevel, Option> = {
  low: { value: "low", label: "Fast", icon: "flash" },
  medium: { value: "medium", label: "Balanced", icon: "cpu" },
  high: { value: "high", label: "Deep", icon: "cpu-charge" },
};

const ChatComposer = ({
  busy,
  canCancel,
  controls,
  onSend,
  onCancel,
  onAdd,
  addButtonTitle = "Add context",
  header,
  variant = Variant.Medium,
  icons
}: {
  busy: boolean;
  canCancel: boolean;
  controls?: AgentComposerControls;
  onSend: (
    message: string,
    options?: { model?: string; thinkingLevel?: AgentThinkingLevel },
  ) => Promise<void>;
  onCancel: () => Promise<void>;
  onAdd?: () => void | Promise<void>;
  addButtonTitle?: string;
  header?: ReactNode;
  variant?: ValueOf<typeof Variant>;
  icons?: AgentIcons;
}) => {
  const models = useMemo<Option[]>(() => {
    const configured = controls?.models ?? [];
    return [
      defaultModels[0],
      ...configured
        .filter((model) => model.value !== "auto")
        .map((model) => ({
          value: model.value,
          label: model.label,
          icon: "3dcube",
        })),
    ];
  }, [controls?.models]);
  const thinkingLevels = controls?.thinkingLevels ?? ["low", "medium", "high"];
  const [model, setModel] = useState(
    controls?.defaultModel ?? String(models[0]?.value ?? "auto"),
  );
  const [thinkingLevel, setThinkingLevel] = useState<AgentThinkingLevel>(
    controls?.defaultThinkingLevel ?? thinkingLevels[0] ?? "low",
  );
  const textArea = useRef<HTMLTextAreaElement>(null);
  const query = useRef("");
  const submit = async () => {
    const message = query.current.trim();
    if (!message || (busy && !canCancel)) return;
    await onSend(message, { model, thinkingLevel });
    // Preserve a draft when the transport rejects the submission so the user
    // can correct or resend it. The controller reports its own error state.
    query.current = "";
    if (textArea.current) textArea.current.value = "";
  };

  return (
    <Flex cols as="rel">
      <Button as="--abs --center-x top">{SVGIcons.arrowDown}</Button>
      <Flex cols as={`--za-composer --${variant} rel`}>
        {header && <Flex as="--za-composer-header">{header}</Flex>}
        <Box as={`--za-border ${busy ? "--agent-running" : ""} --abs`} />
        <Flex as="--za-shell rel no-overflow">
          <Grid
            rows="minmax(1fr, 80px) 30px"
            as={[
              `w:full flex:1 r:30 border:$border-primary no-overflow`,
              "bg:$surface rel zIndex:2",
            ]}
          >
            <Flex as="w:full h:full rel zIndex:1 no-overflow">
              <TextArea
                ref={textArea}
                onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) => {
                  query.current = event.currentTarget.value;
                }}
                onKeyDown={(
                  event: React.KeyboardEvent<HTMLTextAreaElement>,
                ) => {
                  if (event.key === "Escape" && canCancel) {
                    event.preventDefault();
                    void onCancel();
                  }
                  if (event.key === "Enter" && !event.shiftKey) {
                    event.preventDefault();
                    void submit();
                  }
                }}
                variant={variant}
                autoResize
                maxHeight={140}
                as="--za-composer-input"
                placeholder="Describe what to build — or add context"
              />
            </Flex>
            <Flex aic gap={10} as="--za-composer-actions">
              <Flex aic as="--za-ca-l">
                {onAdd && (
                  <Button
                    as="--za-action --za-action-add"
                    kind="ghost"
                    icon={icons?.add}
                    variant={variant}
                    disabled={busy}
                    onClick={() => void onAdd()}
                    title={addButtonTitle}>
                    {(!icons || !icons.add) && SVGIcons.add}
                  </Button>
                )}
                <Select
                  label="Model"
                  selected={model}
                  options={models}
                  variant={variant}
                  onChange={(option) => {
                    if (typeof option === "object" && !Array.isArray(option))
                      setModel(String(option.value));
                  }}
                  className="--agent-chat-model-select"
                />
                <Select
                  label="Think"
                  selected={thinkingLevel}
                  options={thinkingLevels.map(
                    (level) => thinkingOptions[level],
                  )}
                  variant={variant}
                  onChange={(option) => {
                    if (typeof option === "object" && !Array.isArray(option))
                      setThinkingLevel(option.value as AgentThinkingLevel);
                  }}
                  className="--agent-chat-thinking-select"
                />
              </Flex>
              <Flex as="--za-ca-r">
                <Button
                  onClick={() => { if (busy && canCancel) void onCancel(); else void submit(); }}
                  variant={variant}
                  disabled={busy && !canCancel}
                  as="w:20! maxW:20! h:25! maxH:20! s:sm!"
                  icon={busy && canCancel ? "stop" : "subdirectory-arrow-left"}
                  title={busy && canCancel ? "Stop generation" : "Send message"}
                />
              </Flex>
            </Flex>
          </Grid>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default ChatComposer;
