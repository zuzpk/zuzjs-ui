import { forwardRef, useImperativeHandle } from "react";
import { CropHandler, CropShape, Slider, useBase, useImageCropper } from "../..";
import Box, { BoxProps } from "../Box";
import { CropperProps } from "./types";

const Cropper = forwardRef<CropHandler, CropperProps>((props, ref) => {

    const { src, shape, size, ...pops } = props
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
        shape || CropShape.Circle
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
                min={0} max={1} step={0.01} value={1} />
        </Box>
    </Box>
    
})

Cropper.displayName = `Zuz.Cropper`

export default Cropper