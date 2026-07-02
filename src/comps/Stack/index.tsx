import React from "react";
import useBase from "../../hooks/useBase";
import Flex from "../Flex";
import { StackProps } from "./types";

const Stack = ({
    ref,
    ...props
} : StackProps) => {

    const {
        gap,
        width = 200,
        height = 200,
        horizontal = false,
        deck = true,
        deckOffset = 4,
        deckOffsetX = 4,
        deckOffsetY = 4,
        deckBlastRadius = 40,
        deckDirection = "right",
        children,
        ...pops
    } = props

    const {
        style: _style,
        className,
        rest
    } = useBase<"div">(pops)
    
    if (deck) {
        const totalChildren = React.Children.count(children);
        const dirMultiplier = deckDirection === 'left' ? 1 : -1;
        return <Flex 
            ref={ref} 
            as={`--stack rel --${horizontal == true ? `h` : `v`} ${className}`.trim()}
            style={{
                width, height,
                maxWidth: width,
                maxHeight: height,
                ..._style,
                [`--hover-trigger` as any]: 0
            }}
            onMouseEnter={(e) => e.currentTarget.style.setProperty('--hover-trigger', `1`)}
            onMouseLeave={(e) => e.currentTarget.style.setProperty('--hover-trigger', '0')}>
            {React.Children.map(children, (child, index) => {
                if (!React.isValidElement(child)) return child;

                // Position index relative to the top card (top-most card factor becomes 0)
                const factor = (index - totalChildren + 1) * dirMultiplier;
                
                // 1. Base Rest Positions (Balanced by the fan direction layout anchor)
                const baseRotate = factor * deckOffset;
                const baseTranslateX = factor * deckOffsetX;
                const baseTranslateY = index * deckOffsetY;
                
                // 2. Hover Lift & Spread Math
                const baseHoverLift = -12; 
                
                // Spreads rotational distribution open wider on hover
                const hoverRotateOffset = factor * (deckOffset * 1.2); 
                
                // Calculates sequential scaling lifts so lower items step up gracefully
                const hoverYOffset = baseHoverLift - ((totalChildren - 1 - index) * (deckBlastRadius * 0.25));
                
                // Pushes items outward symmetrically on X axis depending on direction
                const hoverXOffset = factor * (deckOffsetX * 1.5);


                return React.cloneElement(child, {
                    ...(child as any).props,
                    style: {
                        position: 'absolute',
                        width: '100%',
                        height: '100%',
                        zIndex: index + 1,
                        transform: `
                            rotate(calc(${baseRotate}deg + (var(--hover-trigger) * ${hoverRotateOffset}deg)))
                            translateY(calc(${baseTranslateY}px + (var(--hover-trigger) * ${hoverYOffset}px)))
                            translateX(calc(${baseTranslateX}px + (var(--hover-trigger) * ${hoverXOffset}px)))
                        `.trim(),
                        transformOrigin: 'bottom center',
                        ...((child as any).props.style || {})
                    },
                    as: `${(child as any).props.as || ""} anim:0.2s`
                });

            })}
        </Flex>

    }

    return (
        <Flex 
            ref={ref} 
            as={`--stack --${horizontal == true ? `h` : `v`} ${className}`.trim()}>
            {children}
        </Flex>
    );

}

export default Stack