import Button from "../Button"
import Icon from "../Icon"
import Text from "../Text"
import { TabProps } from "./types"

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

TabItem.displayName = `TabItem`

export default TabItem