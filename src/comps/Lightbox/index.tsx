import { useEffect, useState } from "react";
import Box from "../Box";
import Carousel from "../Carousel";
import Flex from "../Flex";
import { LightboxProps } from "./types";

const Lightbox = ({ images = [], startIndex = 0, isOpen = true, onClose, renderItem, ...pops }: LightboxProps) => {
    const [open, setOpen] = useState<boolean>(isOpen);

    useEffect(() => setOpen(isOpen), [isOpen]);

    if (!open || !images || images.length === 0) return null;

    return (
        <Flex as={`--lightbox fixed`} className="--lightbox-overlay" {...pops}>
            <Box className="--lightbox-close" onClick={() => { setOpen(false); onClose?.(); }}>
                ×
            </Box>

            <Carousel
                items={images}
                startIndex={startIndex}
                renderItem={(src: string, i: number) => (
                    <img src={src} className="--lightbox-img" alt={`lightbox-${i}`} />
                )}
                showDots={true}
                autoPlay={false}
            />
        </Flex>
    );
};

export default Lightbox;