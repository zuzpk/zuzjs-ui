import { cssProps } from "../builder/stylesheet";
export const cleanProps = (props, withProps = []) => {
    let _extras = [`as`, ...withProps];
    let _props = { ...props };
    Object.keys(_props).map(k => {
        if (k in cssProps) {
            delete _props[k];
        }
    });
    if (`skeleton` in _extras && _extras.skeleton.enabled == true) {
        delete _props[`children`];
    }
    _extras.map(x => x in _props && delete _props[x]);
    return _props;
};
