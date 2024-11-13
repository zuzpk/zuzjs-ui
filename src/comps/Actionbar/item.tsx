import { ActionBarItem } from './types';
import Button from '../Button';
import Icon from '../Icon';

const ActionItem = ({ label, icon, onClick, idx, selected } : ActionBarItem & { idx: number, selected?: boolean }) => {
    return <Button
        onClick={onClick}
        onMouseMove={e => document.documentElement.style.setProperty(`--tip-m`, `${idx}`)}
        className={`--action ${selected ? `--selected` : ``} aic jcc rel`.trim()}>
        {typeof icon == `string` ? <Icon name={icon} /> : icon}
    </Button>
}

export default ActionItem;