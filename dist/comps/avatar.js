import { jsx as _jsx } from "react/jsx-runtime";
import { forwardRef } from "react";
import { AVATAR } from "../types/enums";
import With from "./base";
import { useImage } from "../hooks";
const Avatar = forwardRef((props, ref) => {
    const { src, size, type, crossOrigin, referrerPolicy, ...rest } = props;
    const [img, imgStatus, imgError] = useImage(src, crossOrigin, referrerPolicy);
    return _jsx(With, { tag: `img`, src: img, style: size ? { width: size, height: size } : {}, crossOrigin: crossOrigin, referrerPolicy: referrerPolicy, className: `--avatar --${(type || AVATAR.Circle).toLowerCase()}`, ...rest });
});
export default Avatar;
