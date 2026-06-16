import { CropShape, useImageCropper } from "@zuzjs/hooks";
import { forwardRef, useImperativeHandle } from "react";
import useBase from "../../hooks/useBase";
import { BoxProps } from "../../types";
import Box from "../Box";
import Slider from "../Slider";
import { CropHandler, CropperProps } from "./types";

/**
 * Cropper component.
 *
 * @example
 * // Basic usage
 * ```tsx
 * <Cropper src="https://example.com/image.jpg" onCrop={(data) => console.log(data)} />
 * ```
 *
 * @example
 * // Advanced usage with additional props
 * ```tsx
 * <Cropper src="https://example.com/image.jpg" aspectRatio={16/9} onCrop={(data) => console.log(data)} guides />
 * ```
 * @param src - Source URL
 * @param aspectRatio - aspectRatio prop
 * @param onCrop - Callback function triggered on crop action
 * @param guides - guides prop
 */
const Cropper = forwardRef<CropHandler, CropperProps>((props, ref) => {

    const { src, shape, size, value, ...pops } = props
    const {
        style,
        className,
        rest
    } = useBase<"div">(pops)
    
    const {
        canvasRef,
        crop,
        setScale,
        handleMouseDown,
        handleMouseUp,
        handleMouseMove
    } = useImageCropper(
        src, 
        size || 200,
        shape || CropShape.Circle,
        value || 1
    );

    useImperativeHandle(ref, () => ({
        getCropped(){
            return crop()!
        },
        setScale(scale){
            setScale(scale)
        }
    }))

      
    return <Box 
        as={`--cropper --${shape || CropShape.Circle} ${className}`}
        style={style}
        {...rest as BoxProps}>
        <canvas
            ref={canvasRef}
            width={size || 200}
            height={size || 200}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onMouseMove={handleMouseMove} />
        <Box as={`--cropper-slider`}>
            <Slider
                onChange={num => setScale(num as number)}
                min={1} 
                max={3} 
                step={0.01} 
                value={value || 1} />
        </Box>
    </Box>
    
})

Cropper.displayName = `Zuz.Cropper`

export default Cropper