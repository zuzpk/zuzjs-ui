import { DetailedHTMLProps, FormEvent, FormEventHandler, HTMLAttributes } from "react"

export type dynamicObject = { 
    [x: string] : any 
}

export type stringObject = { 
    [x: string] : string
}

declare global {
    interface Object { 
        is( v: any ): boolean
        typeof( v: any ): boolean
        equals( v: any ): boolean
        isNull(): boolean
        isString(): boolean
        isNumber(): boolean
        isObject(): boolean
        isArray(): boolean
        isEmpty(): boolean
        isNotEmpty( v: any ): boolean
        isEmail( v: any ): boolean
        isUrl( v: any ): boolean
    }
}

export type FormSubmitHandler = (formData: FormData) => void;

export type FormInputs = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement

export type zuzProps = `as` | `css` | `hover` | `before` | `after`