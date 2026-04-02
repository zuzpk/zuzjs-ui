"use client"
import { useEffect } from "react"
import { FILTER } from "../../types/enums"
import { ValueOf } from "../../types"

export type FilterProps = {
    names?: ValueOf<typeof FILTER>[],
    strength?: number,
}

/**
 * Filters component.
 *
 * @example
 * // Basic usage
 * ```tsx
 * <Filters filters={[{ label: "Category", values: ["All", "New", "Sale"] }]} onApply={(selected) => console.log(selected)} />
 * ```
 *
 * @example
 * // Advanced usage with additional props
 * ```tsx
 * <Filters filters={[{ label: "Price", type: "range", min: 0, max: 1000 }, { label: "Brand", values: ["Nike", "Adidas"] }]} onApply={(selected) => {}} />
 * ```
 * @param filters - filters prop
 * @param onApply - Callback function triggered on filter apply
 */
const Filters = (props : FilterProps) => {

    const { names, strength } = props

    const filters = {
        [FILTER.Gooey] : (force?: number) => <filter id="gooey" key={`filter-${FILTER.Gooey}`}>
            <feGaussianBlur in="SourceGraphic" stdDeviation={force || 10} result="blur" />
            <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7" result="goo" />
            <feBlend in="SourceGraphic" in2="goo" />
        </filter>
    }

    useEffect(() => {}, [names])

    return <svg xmlns="http://www.w3.org/2000/svg" version="1.1">
        <defs>
            {(names || [FILTER.Gooey]).map(name => filters[name](strength))}
        </defs>
    </svg>

}

Filters.displayName = `Zuz.Filters`

export default Filters