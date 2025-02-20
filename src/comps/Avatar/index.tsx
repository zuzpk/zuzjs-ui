"use client"
import { forwardRef, useEffect } from "react";
import { AVATAR, Size } from "../../types/enums";
import { Props } from "../../types";
import { useBase, useImage } from "../../hooks";
import Image from "../Image";
import Box, { BoxProps } from "../Box";

export type AvatarProps = Props<"img"> & {
    type?: AVATAR,
    size?: number,
    src: string,
    crossOrigin?: 'anonymous' | 'use-credentials', 
    referrerPolicy?: 'no-referrer' | 'no-referrer-when-downgrade' | 'origin' | 'origin-when-cross-origin' | 'same-origin' | 'strict-origin' | 'strict-origin-when-cross-origin' | 'unsafe-url' 
}

export interface AvatarHandler {}

const Avatar = forwardRef<AvatarHandler, AvatarProps>((props, ref) => {
    
    const { 
        src, size, type, crossOrigin, referrerPolicy, 
        animate, as,
        ...pops 
    } = props;

    const [ img, imgStatus, imgError ] = useImage(src, crossOrigin, referrerPolicy);

    const {
        className,
        style,
        rest
    } = useBase({ animate, as })

    useEffect(() => {
        if (type == AVATAR.Square && !document.getElementById('squareRadiusClipPath')) {
            const svgNS = "http://www.w3.org/2000/svg";
            const svg = document.createElementNS(svgNS, "svg");
            svg.setAttribute("width", "0");
            svg.setAttribute("height", "0");

            const defs = document.createElementNS(svgNS, "defs");
            const clipPath = document.createElementNS(svgNS, "clipPath");
            clipPath.setAttribute("id", "squareRadiusClipPath");
            clipPath.setAttribute("clipPathUnits", "objectBoundingBox");

            const path = document.createElementNS(svgNS, "path");
            path.setAttribute("d", "M0.986 0.347C0.951 0.11 0.777 -0.002 0.5 0C0.223 -0.002 0.049 0.11 0.014 0.347C0.005 0.404 0 0.452 0 0.5C0 0.548 0.005 0.596 0.014 0.653C0.049 0.89 0.223 1.002 0.5 1C0.777 1.002 0.951 0.89 0.986 0.653C0.995 0.596 1 0.548 1 0.5C1 0.452 0.995 0.404 0.986 0.347Z");

            clipPath.appendChild(path);
            defs.appendChild(clipPath);
            svg.appendChild(defs);
            document.body.appendChild(svg);
        }
    }, [])

    return <Box
            className={`--avatar --${(type || AVATAR.Circle).toLowerCase()} rel ${className}`.trim()}
            style={{
                width: size || `auto`, 
                height: size || `auto`,
                ...style,
            }}
            {...rest as BoxProps}>
        <Image   
            src={img}
            crossOrigin={crossOrigin} 
            referrerPolicy={referrerPolicy}
            {...pops } />
    </Box>
})

export default Avatar