export enum FILTER {
    Gooey = "gooey"
}

const useFilters = () => {

    const filters = {
        [FILTER.Gooey]: [
            `<filter id="gooey">`,
            `<feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />`,
            `<feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7" result="gooey" />`,
            `<feBlend in="SourceGraphic" in2="goo" />`,
            `</filter>`
        ]
    }

    return [
        `<svg xmlns="http://www.w3.org/2000/svg" version="1.1">`,
        `<defs>`,
            
        `</defs>`,
    `</svg>`
    ].join(``)

}

export default useFilters