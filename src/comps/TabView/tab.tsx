import Button, { ButtonProps } from "../Button"
import Icon, { IconProps } from "../Icon"
import Text, { TextProps } from "../Text"
import { Tab, TabProps } from "./types"

const TabItem = ({ tab, index, activeTab, onClick }: TabProps) => {

    const { icon, label } = tab

    return <Button 
        onClick={e => onClick(index)}    
        className={`--tab jcc ${index === activeTab ? '--active' : ''}`.trim()}>
            {icon && ( 
                typeof icon === 'string' ? <Icon className={`--icon`} name={icon} /> : icon
            )}
        <Text className={`--label rel`}>{label}</Text>
    </Button>
    
}

export default TabItem