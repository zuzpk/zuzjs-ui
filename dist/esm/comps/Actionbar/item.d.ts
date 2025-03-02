import { ActionBarItem } from './types';
declare const ActionItem: ({ label, icon, onClick, idx, selected }: ActionBarItem & {
    idx: number;
    selected?: boolean;
}) => import("react/jsx-runtime").JSX.Element;
export default ActionItem;
