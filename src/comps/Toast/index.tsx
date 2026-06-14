import { FC, useEffect, useRef, useState } from "react";
import { useFx } from "../../hooks";
import { useTheme } from "../../hooks/useColorScheme";
import { TRANSITION_CURVES, TRANSITIONS, Variant } from "../../types";
import Box from "../Box";
import Button from "../Button";
import Icon from "../Icon";
import ProgressBar from "../ProgressBar";
import { ProgressHandler } from "../ProgressBar/types";
import Spinner from "../Spinner";
import Text from "../Text";
import { ToastDefaultTitle, ToastPosition, ToastProps, ToastStyle, ToastType } from "./types";

// const Toast: FC<ToastProps & { index: number; total: number; isHovered: boolean; forceClose?: boolean }> = (props) => {
/**
 * Toast component.
 *
 * @example
 * // Basic usage
 * ```tsx
 * <Toast message="Operation successful" type="success" />
 * ```
 *
 * @example
 * // Advanced usage with additional props
 * ```tsx
 * <Toast message="Error occurred" type="error" duration={5000} action={{ label: "Retry", onClick: () => {} }} />
 * ```
 * @param message - Message text or element
 * @param type - Component or input type
 * @param duration - duration prop
 * @param action - action prop
 */
const Toast : FC<ToastProps & {
    index: number;
    total: number;
    isHovered: boolean;
    forceClose?: boolean;
}> = (props) => {

    const { 
        index, 
        id, 
        type, 
        icon,
        busy, 
        width,
        title, 
        message, 
        duration, 
        sticky = false, 
        actions = [],
        position,
        style: toastStyle,
        isHovered, 
        total,  
        progress,
        progressValue,
        forceClose, 
        variant,
        onClick, 
        onClose 
    } = props

    const [visible, setVisible] = useState(false);
    const [expired, setExpired] = useState(false);
    const { toast: themeToast } = useTheme(true)!;
    const hasControlledProgress = typeof progressValue === 'number';
    const normalizedProgress = hasControlledProgress ? Math.max(0, Math.min(1, progressValue!)) : undefined;

    const isHiding = expired || forceClose;
    const _position = position ?? themeToast?.position ?? ToastPosition.TopCenter
    const _type = type ?? themeToast?.type ?? ToastType.Default
    const _toastStyle = toastStyle ?? themeToast?.style ?? ToastStyle.Stack
    const _duration = duration ?? themeToast?.duration ?? 4
    const _progress = progress ?? themeToast?.progress ?? false

    const remainingRef = useRef(_duration * 1000);
    const requestRef = useRef<number>(undefined);
    const lastTickRef = useRef<number>(undefined);
    const progressBarRef = useRef<ProgressHandler>(null);

    const toastAnimation = useFx({
        when: visible && !isHiding,
        duration: 0.3,
        transition: themeToast?.transition ||  (
            _position.includes('Top') ? TRANSITIONS.SlideInTop 
                : _position.includes('Bottom') ? TRANSITIONS.SlideInBottom
                    : _position.includes('Left') ? TRANSITIONS.SlideInLeft
                        : TRANSITIONS.SlideInRight
        ),
        curve: themeToast?.curve || TRANSITION_CURVES.EaseInOut,
        watch: ['transform', 'opacity', 'scale', 'filter']
    });

    useEffect(() => {
        setVisible(true);
        
        const animate = (time: number) => {
            if (lastTickRef.current !== undefined) {
                
                const delta = time - lastTickRef.current;
                
                if (!hasControlledProgress && !isHovered && !sticky && !isHiding) {
                    remainingRef.current -= delta;
                    
                    // Update Progress Bar DOM directly (No Re-render!)
                    if (progressBarRef.current) {
                        const percentage = Math.max(0, (remainingRef.current / (_duration * 1000)) * 100);
                        progressBarRef.current?.setProgress?.(percentage/100);
                    }
                }
            }

            lastTickRef.current = time;

            if (remainingRef.current <= 0) {
                setExpired(true);
            } else {
                requestRef.current = requestAnimationFrame(animate);
            }
        };

        requestRef.current = requestAnimationFrame(animate);
        return () => {
            if (requestRef.current) cancelAnimationFrame(requestRef.current);
        };
    }, [isHovered, sticky, isHiding, _duration]);

    // useEffect(() => {
    //     setVisible(true);

    //     if (sticky || isHovered || isHiding) return;

    //     const timer = setTimeout(() => setExpired(true), _duration * 1000);
    //     return () => clearTimeout(timer);

    // }, [_duration, sticky, isHovered, isHiding]);

    // Removal Logic: Wait for the 300ms animation to finish
    useEffect(() => {
        if (isHiding) {
            const timer = setTimeout(() => {
                onClose?.(id!);
            }, 350); // Slightly longer than animation duration
            return () => clearTimeout(timer);
        }
    }, [isHiding, id]);

    const isStack = _toastStyle === ToastStyle.Stack;
    const stackOffset = isHovered ? index * 65 : index * 8;
    const stackScale = isHovered ? 1 : Math.max(0.85, 1 - index * 0.05);
    const stackOpacity = isHovered ? 1 : Math.max(0.4, 1 - index * 0.2);

    const handleContainerClick = (e: any) => {
        if (onClick) onClick(e);
        else if (
            (busy !== true) && 
            (!actions || actions.length === 0)
        ) setExpired(true);
    };

    const baseTransform = toastAnimation.style.transform || 'translate(0, 0)';
    const finalTransform = isHiding 
        ? baseTransform // Use the SlideOut transform from useFx
        : `${baseTransform} translateY(${_position.includes('Top') ? stackOffset : -stackOffset}px) scale(${stackScale})`;
    
    // console.log(`transform`, isHiding, finalTransform)

    return <Box 
        onClick={handleContainerClick}
        // as={`--snack --${type} --snack-${id} ${index > 2 ? `--snacked` : ``} flex aic`}
        as={`--snack --${isHiding ? `hidden` : `visible`} --${variant || themeToast?.variant || Variant.Medium} --${_type} --${(_position).toLowerCase()} abs flex aic`}
        style={{
            ...toastAnimation.style,
            zIndex: 1000 - index,
            pointerEvents: isHiding ? 'none' : 'auto',
            opacity: isHiding ? toastAnimation.style.opacity : stackOpacity,
            transform: finalTransform,
            filter: !isHiding && isStack && !isHovered && index > 0 ? 'blur(1px)' : 'none',
            cursor: (!actions || actions.length === 0) ? 'pointer' : 'default',
            transition: `${toastAnimation.style.transition}, transform 0.3s ease, opacity 0.3s ease`,
        }}>
        <Box as={`--ico flex aic jcc rel`}>
            { icon ? <Icon name={icon} /> : <Box as={`--no-icon`} /> }
            { busy === true && <Spinner as={`abs abc`} /> }
        </Box>
        <Box 
            as={`--meta flex cols`}
            style={width ? { width, minWidth: width, maxWidth: width, } : undefined}>
            <Text as={`--tt`}>{title || ToastDefaultTitle[type]}</Text>
            <Text as={`--tm`}>{message}</Text>
        </Box>
        {actions && actions.length > 0 && (
                <Box as={`--actions flex gap:5`}>
                    {actions.map((action, i) => (
                        <Button 
                            key={i} 
                            disabled={busy === true}
                            as={`--snack-btn --snack-action-${action.tag} bold`} 
                            variant={Variant.XSmall}
                            {...action.buttonProps}
                            onClick={(e) => { e.stopPropagation(); action.onClick(e); }}>
                            {action.label}
                        </Button>
                    ))}
                </Box>
            )}
        {(_progress || hasControlledProgress) && <ProgressBar
            as={`abs`}
            progress={normalizedProgress}
            ref={progressBarRef} />}
    </Box>
}

export default Toast;