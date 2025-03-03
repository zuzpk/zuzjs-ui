"use client"
import { useEffect } from "react"
import { FILTER } from "../../types/enums"

export type FilterProps = {
    names?: FILTER[],
    strength?: number,
}

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

export default Filters