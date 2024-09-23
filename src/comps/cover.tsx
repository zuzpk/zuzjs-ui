import { ComponentPropsWithoutRef, forwardRef } from "react";
import With, { animationProps } from "./base";
import Spinner, { SpinnerProps } from "./spinner";
import { hexToRgba } from "../funs";

export interface CoverProps extends ComponentPropsWithoutRef<`div`> { 
    tag?: string, 
    message?: string, 
    spinner?: SpinnerProps,
    color?: string,
    as?: string,
    animate?: animationProps
}

const Cover = forwardRef<HTMLDivElement, CoverProps>((props, ref ) => {
    
    const { spinner, message, color, as, ...rest } = props;
    
    return (
        <With 
            className={`zuz-cover flex aic jcc cols abs fill`}
            ref={ref} 
            style={{
                backgroundColor: color ? !color.startsWith(`#`) ? hexToRgba(color, .9) : color : hexToRgba(color || `#ffffff`, .9)
            }}    
            as={as}
            {...rest} 
        >
            {<Spinner {...spinner} />}
            {<With tag={`h1`} className={`label`}>{message || `loading`}</With>}
            {/* {message && <With tag={`h1`} className={`label`}>{message}</With>} */}
        </With>
    );
});

// import { ReactNode } from "react";
// import { css, cleanProps, hexToRgba } from "../funs";
// import { UIProps } from "../types/interfaces";
// import Spinner, { SpinnerProps } from "./spinner";
// import Heading from "./heading";

// export interface CoverProps extends UIProps<HTMLDivElement> {
//     spinner?: SpinnerProps
// }

// const Cover = ( props : CoverProps ) => {

//     const { cx } = css.Build(props.as)
    
//     return <div 
//         ref={props.ref}
//         style={{
//             backgroundColor: hexToRgba(props.color || `#ffffff`, .9)
//         }}
//         className={`zuz-cover flex aic jcc abs fill ${cx.join(` `)}`.trim()}
//         {...(cleanProps(props) as UIProps<HTMLDivElement>)}>
//             {<Spinner {...( props.spinner || {} as SpinnerProps) } />}
//             {/* <span></span> */}
//             {/* {<Heading>{props.message}</Heading>} */}
//             {/* {props.message ? <Heading>{props.message}</Heading> : null} */}
//             {/* { ...({} as HTMLHeadingElement) } */}
//         </div>

// }

export default Cover