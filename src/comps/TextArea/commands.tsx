import { FC } from "react";
import { Button, Command, Icon, Text, TRANSITIONS } from "../..";
import Box from "../Box";

const CommandItem : FC<{
    meta: Command
}> = ({ meta }) => {
    return <Button 
        as={`flex aic --command-item`}>
        {/* onClick={() => meta.action?.()}> */}
        {meta.icon && <Icon name={meta.icon} as={`--command-icon`} />}
        <Text>{meta.label}</Text>
    </Button>
}

const CommandBox : FC<{
    position: { top: number, left: number },
    commands: Command[],
    visible: boolean,
    onSelect: (value: string) => void
}> = ({ position, onSelect, commands, visible }) => {

    return <Box 
        aria-hidden={!visible}
        fx={{
            transition: TRANSITIONS.SlideInBottom,
            duration: 0.1,
            when: visible
        }}
        className={`--command-box abs grid`} 
        style={{
            ...position
        }}>
        {commands.map(c => <CommandItem key={`cmd-${c.label.replace(/\s+/, '-')}`} meta={c} />)}
    </Box>

}

export default CommandBox