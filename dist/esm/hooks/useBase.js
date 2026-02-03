import { cleanProps } from "../funs";
import { buildClassString } from "../funs/css";
const useBase = (props, ref) => {
    const { as, className, propsToRemove, ...rest } = props || {};
    const _style = {};
    const manifestClasses = buildClassString(as ?? ``);
    return {
        style: {
            ..._style
        },
        className: `${className || ``} ${manifestClasses || ``}`.trim(),
        rest: {
            ...cleanProps(rest, propsToRemove ? [...propsToRemove, `skeleton`] : [`skeleton`])
        }
    };
};
export default useBase;
