import { useCarousel, useTimer } from "@zuzjs/hooks";
import { forwardRef, useRef } from "react";
import { useBase } from "../../hooks";
import Box from "../Box";
import Pagination from "../Pagination";
import { PaginationController, PaginationStyle } from "../Pagination/types";
import { CarouselProps } from "./types";

function CarouselInner<T>(props: CarouselProps<T>, ref: React.ForwardedRef<HTMLDivElement>) {
    const { 
        items, renderItem, effect = 'slide', loop = true, loopMode = 'infinite',
        startIndex = 0, useKeys = true, useWheel = true,
        spacing = 160, rotation = 20, scaleStep = 0.15,
        blur = 4, 
        animation = "power",
        showDots = false, 
        autoPlay = false,
        autoPlaySpeed = 3,
        onChange, ...pops 
    } = props;

    const { className, style } = useBase(pops);
    const paginationController = useRef<PaginationController>(null)
    const speed = autoPlaySpeed / ( autoPlaySpeed >= 1000 ? 1000 : 1);

    const controller = useCarousel({
        total: items.length,
        initialIndex: startIndex, //
        loop: loop,
        useKeys,   
        useWheel,  
        onChange: (index) => {
            // paginationController.current?.setPage(index);
            paginationController.current?.setPage({ 
                id: index + 1, 
                label: index + 1 
            });
            paginationController.current?.setProgress(0);
            onChange?.(index);
        }
    });

    const { pause, resume, reset } = useTimer({
        duration: speed,
        autoStart: autoPlay === true,
        onProgress: (p) => {
            if ( autoPlay === true ) paginationController.current?.setProgress(1 - p); 
        },
        onExpired: () => {
            if ( autoPlay === true ) controller.next();
            reset();
        }
    });

    const dynamicStyle = {
        ...style,
        "--carousel-spacing": `${spacing}px`,
        "--carousel-rotation": `${rotation}deg`,
        "--carousel-blur": `${blur}px`,
        "--carousel-scale-step": scaleStep,
        "--active-index": controller.index,
        "--carousel-transition": `var(--${animation})`,
    } as React.CSSProperties;

    return (
        <Box ref={ref} className={`--carousel --effect-${effect} --loop-${loopMode} flex cols aic jcc ${className}`.trim()} style={dynamicStyle}>
            <Box className="--carousel-stage rel fill flex aic jcc">
                {items.map((item, i) => {
                    let offset = i - controller.index;

                    // Handle Infinite Wrapping
                    if (loopMode === 'infinite') {
                        const total = items.length
                        offset = ((offset + total / 2) % total + total) % total - total / 2;
                        // const half = Math.floor(items.length / 2);
                        // if (offset > half) offset -= items.length;
                        // if (offset < -half) offset += items.length;
                    }

                    const isActive = i === controller.index;

                    return (
                        <Box 
                            onMouseEnter={() => isActive && pause()} 
                            onMouseLeave={() => isActive && resume()}
                            key={i} 
                            className={`--carousel-item-wrapper abs ${isActive ? '--is-active' : ''}`}
                            style={{ 
                                "--offset": offset, 
                                zIndex: isActive ? 100 : 100 - Math.abs(offset),
                                // Ensure visibility only for items in range to prevent "fly-across" glitches
                                display: Math.abs(offset) > 5 ? 'none' : 'flex' 
                            } as any}
                        >
                            {renderItem(item, i, controller.index)}
                        </Box>
                    );
                })}
            </Box>

            {showDots && (
                <Pagination 
                    ref={paginationController}
                    itemCount={items.length}
                    itemsPerPage={1}
                    startPage={startIndex + 1}
                    pageRange={items.length}
                    paginationStyle={PaginationStyle.Gooey}
                    onPageChange={(page) => controller.goTo(+page.label - 1)}
                    asDots={true}
                    progressBar={true}
                />
            )}
        </Box>
    );
}

/**
 * Carousel component.
 *
 * @example
 * // Basic usage
 * ```tsx
 * <Carousel><div>Slide 1</div><div>Slide 2</div><div>Slide 3</div></Carousel>
 * ```
 *
 * @example
 * // Advanced usage with additional props
 * ```tsx
 * <Carousel autoplay interval={5000} onSlideChange={(index) => console.log(index)} controls="dots"><div>Slide 1</div><div>Slide 2</div></Carousel>
 * ```
 * @param autoplay - Whether carousel autoplays
 * @param interval - Autoplay interval in milliseconds
 * @param onSlideChange - Callback function triggered on slide change
 * @param controls - controls prop
 */
export const Carousel = forwardRef(CarouselInner) as <T>(
    props: CarouselProps<T> & { ref?: React.ForwardedRef<HTMLDivElement> }
) => ReturnType<typeof CarouselInner>;

export default Carousel