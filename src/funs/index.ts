import { cssProps } from "../builder/stylesheet";
import { dynamic, Skeleton, type ZuzStyleString } from "../types";
import pkgJson from "../../package.json"

export const PACKAGE_NAME = pkgJson.name

export const cleanProps = <T extends dynamic>( 
    props: T, 
    withProps: string[] = [] 
) : T => {

    let _extras = [ `as`, ...withProps ]
    let _props = { ...props }
    
    Object.keys(_props).map(k => {
        if(k in cssProps){
            delete _props[k]
        }
    });

    if ( `skeleton` in _extras && (_extras.skeleton as Skeleton).enabled == true ){
        delete _props[`children`]
    }
    
    _extras.map(x => x in _props && delete _props[x])

    return _props

}

export const splitAtoms = (input: string): string[] => {
    const atoms: string[] = [];
    let current = "";
    let depth = 0;

    for (let i = 0; i < input.length; i++) {
        const char = input[i];

        // Increment depth for any opening bracket/paren
        if (char === '[' || char === '(') {
            depth++;
        }
        // Decrement depth for any closing bracket/paren
        if (char === ']' || char === ')') {
            depth--;
        }

        // Only split on whitespace if we are at the top level (depth 0)
        if (/\s/.test(char) && depth === 0) {
            if (current.trim()) {
                atoms.push(current.trim());
            }
            current = "";
        } else {
            current += char;
        }
    }

    // Push the final remaining atom
    if (current.trim()) {
        atoms.push(current.trim());
    }

    return atoms;
}