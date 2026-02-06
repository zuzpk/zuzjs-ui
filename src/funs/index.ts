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