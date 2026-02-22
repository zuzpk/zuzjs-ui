import { useCarousel } from "@zuzjs/hooks";
import { forwardRef, useEffect, useRef } from "react";
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
        showDots = false, 
        autoPlay = false,
        autoPlaySpeed = 3,
        onChange, ...pops 
    } = props;

    const { className, style } = useBase(pops);
    
    const paginationController = useRef<PaginationController>(null)

    const controller = useCarousel({
        total: items.length,
        initialIndex: startIndex, //
        loop: loop,
        useKeys,   
        useWheel,  
        onChange: (index) => {
            paginationController.current?.setPage(index)
            onChange?.(index)
        }
    });

    useEffect(() => {
        if (!autoPlay) return;

        const interval = setInterval(() => {
            controller.next();
        }, autoPlaySpeed * (autoPlaySpeed >= 1000 ? 1 : 1000));

        return () => clearInterval(interval);
    }, [autoPlay, autoPlaySpeed, controller]);

    const dynamicStyle = {
        ...style,
        "--carousel-spacing": `${spacing}px`,
        "--carousel-rotation": `${rotation}deg`,
        "--carousel-scale-step": scaleStep,
        "--active-index": controller.index,
    } as React.CSSProperties;

    return (
        <Box ref={ref} className={`--carousel --effect-${effect} --loop-${loopMode} flex cols aic jcc ${className}`.trim()} style={dynamicStyle}>
            <Box className="--carousel-stage rel fill flex aic jcc">
                {items.map((item, i) => {
                    let offset = i - controller.index;

                    // Handle Infinite Wrapping
                    if (loopMode === 'infinite') {
                        const half = Math.floor(items.length / 2);
                        if (offset > half) offset -= items.length;
                        if (offset < -half) offset += items.length;
                    }

                    const isActive = i === controller.index;

                    return (
                        <Box 
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
                    startPage={controller.index + 1}
                    paginationStyle={PaginationStyle.Gooey}
                    onPageChange={(page) => controller.goTo(+page.label - 1)}
                    asDots={true}
                />
            )}
        </Box>
    );
}

export const Carousel = forwardRef(CarouselInner) as <T>(
    props: CarouselProps<T> & { ref?: React.ForwardedRef<HTMLDivElement> }
) => ReturnType<typeof CarouselInner>;

export default Carousel