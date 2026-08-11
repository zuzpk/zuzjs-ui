import { useMemo, useRef, useState } from "react";
import Flex from "../Flex";
import Grid from "../Grid";
import TextArea from "../TextArea";
import { useDebounce, AgentThinkingLevel } from "@zuzjs/hooks";
import { AgentComposerControls } from "./types";
import { Option } from "../Select/types";
import { ValueOf, Variant } from "../../types";
import Button from "../Button";
import Select from "../Select";
import SVGIcons from "../svgicons";

const defaultModels: Option[] = [
  { value: 'auto', label: 'Auto', icon: '3dcube' },
];

const thinkingOptions: Record<AgentThinkingLevel, Option> = {
  low: { value: 'low', label: 'Fast', icon: 'flash' },
  medium: { value: 'medium', label: 'Balanced', icon: 'cpu' },
  high: { value: 'high', label: 'Deep', icon: 'cpu-charge' },
};

const ChatComposer = ({
  busy,
  canCancel,
  controls,
  onSend,
  onCancel,
  variant = Variant.Medium,
} : {
  busy: boolean;
  canCancel: boolean;
  controls?: AgentComposerControls;
  onSend: (message: string, options?: { 
    model?: string; 
    thinkingLevel?: AgentThinkingLevel
  }) => Promise<void>;
  onCancel: () => Promise<void>;
  variant?: ValueOf<typeof Variant>;
}) => {

  const models = useMemo<Option[]>(() => {
    const configured = controls?.models ?? [];
    const withoutAuto = configured.filter((model) => model.value !== 'auto');
    return [
      defaultModels[0],
      ...withoutAuto.map((model) => ({ value: model.value, label: model.label, icon: '3dcube' })),
    ];
  }, [controls?.models]);
  const thinkingLevels = controls?.thinkingLevels ?? ['low', 'medium', 'high'];
  const [model, setModel] = useState(controls?.defaultModel ?? String(models[0]?.value ?? 'auto'));
  const [thinkingLevel, setThinkingLevel] = useState<AgentThinkingLevel>(controls?.defaultThinkingLevel ?? thinkingLevels[0] ?? 'low');
  const textArea = useRef<HTMLTextAreaElement>(null);
  const query = useRef<string>('');
  const canSend = Boolean(query.current.trim()) && !busy;
  // const setMessageDebounced = useDebounce((v: string) => dispatch({ task: v.trim() }), 100);

  const submit = async () => {
    const message = query.current.trim();
    if (!message || busy) return;
    
    query.current = ``
    
    if ( textArea.current ) textArea.current.value = ``

    await onSend(message, { model, thinkingLevel });
  };

  return <Flex cols as={`rel`}>
      <Button  
        as={`--abs --center-x top`}>
          {SVGIcons.arrowDown}
        </Button>
      <Flex 
        cols 
        as={`--za-composer --${variant} rel`}>


          {/* Composer */}
          <Flex
            as={[`rel no-overflow p:2 r:30 ${busy ? `--agent-running` : ``}`]}>
              
            <Grid
              rows={`minmax(1fr, 80px) 30px`}
                as={[
                    `w:full flex:1 r:30 border:$border-primary no-overflow`,
                    `bg:$surface rel zIndex:2`,
                ]}>

                  <Flex as={`w:full h:full rel zIndex:1 no-overflow`}>
                                    
                    <TextArea
                        ref={textArea}
                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                            query.current = e.currentTarget.value;
                            // setMessageDebounced(e.currentTarget.value);
                        }}
                        onKeyDown={(e: React.KeyboardEvent<HTMLTextAreaElement>) => {
                            if (e.key === `Escape`) {
                                e.preventDefault();
                                void onCancel()
                                return;
                            }
                            if (e.key === `Enter` && !e.shiftKey) {
                                e.preventDefault();
                                void submit()
                            }
                        }}
                        variant={variant}
                        autoResize
                        maxHeight={140}
                        as={`--za-composer-input`}
                        placeholder={`Describe what to build — or attach files`}
                    />
                </Flex>

                {/* Actions */}
                <Flex aic gap={10} 
                  as={`--za-composer-actions`}>

                    <Flex 
                      aic as={`--za-ca-l`}>
                      <Button
                          as={`w:20! maxW:20! h:25! maxH:20! s:sm!`}
                          kind={`ghost`}
                          icon={`add`}
                          variant={variant}
                          // disabled={running || pending.length >= MAX_ATTACH_COUNT}
                          disabled={busy}
                          // onClick={() => fileInput.current?.click()}
                          title="Attach files"
                      />

                      <Select
                        label="Model"
                        selected={model}
                        options={models}
                        variant={variant}
                        onChange={(option) => {
                          if (typeof option === 'object' && !Array.isArray(option)) setModel(String(option.value));
                        }}
                        className="--agent-chat-model-select"
                      />

                      <Select
                        label="Think"
                        selected={thinkingLevel}
                        options={thinkingLevels.map((level) => thinkingOptions[level])}
                        variant={variant}
                        onChange={(option) => {
                          if (typeof option === 'object' && !Array.isArray(option)) setThinkingLevel(option.value as AgentThinkingLevel);
                        }}
                        className="--agent-chat-thinking-select"
                      />
                    </Flex>

                    <Flex as={`--za-ca-r`}>
                        <Button
                            onClick={submit}
                            variant={variant}
                            // disabled={running || (!task.trim() && pending.length === 0)}
                            disabled={busy || !query.current.trim()}
                            as={`w:20! maxW:20! h:25! maxH:20! s:sm!`}
                            icon={`subdirectory-arrow-left`}
                        />
                    </Flex>

                </Flex>

            </Grid>

          </Flex>

      </Flex>
    </Flex>

}

export default ChatComposer