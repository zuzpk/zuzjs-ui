import { useState } from "react"
import Box from "../Box"
import List from "../List"
import { TableOfContentsProps } from "./types"
import Text from "../Text"

/**
 * TableOfContents component.
 *
 * @example
 * // Basic usage
 * ```tsx
 * <TableOfContents items={[{ id: "intro", label: "Introduction" }, { id: "guide", label: "Guide" }]} />
 * ```
 *
 * @example
 * // Advanced usage with additional props
 * ```tsx
 * <TableOfContents items={[{ id: "intro", label: "Intro" }, { id: "api", label: "API" }]} onSelect={(id) => console.log(id)} />
 * ```
 * @param items - Array of items
 * @param onSelect - Callback function triggered on selection
 */
const TableOfContents = ({
    ref,
    ...props
} : TableOfContentsProps ) => {

    const { title, items } = props

    const [activeIndex, setActiveIndex] = useState(0);

    const handleClick = (e: React.MouseEvent, index: number, tag: string) => {
        e.preventDefault(); // Stop URL from changing to #tag
        setActiveIndex(index);
        
        // Optional: Smooth scroll to the section manually
        const element = document.getElementById(tag);
        element?.scrollIntoView({ behavior: 'smooth' });
    };

    return <Box 
        ref={ref}
        as={`--table-of-contents rel flex cols`}>
        
        <Text as={`--toc-title`}>{title}</Text>
        
        <List 
            items={items.map((item, index) => <a 
                className={activeIndex == index ? `--toc-active` : ``}
                style={{
                    anchorName: activeIndex === index ? '--toc-active' : 'none',
                    color: activeIndex == index ? `var(--table-of-contents-color-active)` : `var(--table-of-contents-color)`
                } as any}
                onClick={(e) => handleClick(e, index, item.tag)}
                href={`#${item.tag}`}>{item.label}</a>)} />
    </Box>

}

export default TableOfContents