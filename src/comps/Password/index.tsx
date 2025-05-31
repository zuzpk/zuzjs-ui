"use client"
import { forwardRef, useEffect, useMemo, useState } from 'react';
import { checkPasswordStrength } from '../../funs';
import { useBase, useDebounce } from '../../hooks';
import Box from '../Box';
import Button from '../Button';
import Input, { InputProps } from '../Input';
import SVGIcons from '../svgicons';
import Text from '../Text';

export type PasswordProps = Omit<InputProps, `type` | `numeric`> & {
    strenthMeter?: boolean
}

const Password = forwardRef<HTMLInputElement, PasswordProps>((props, ref) => {

    const { strenthMeter, onChange, ...pops } = props

    if ( `type` in pops ){
        delete pops[`type`]
    }

    const {
        style,
        className,
        rest
    } = useBase(pops)

    const [ visible, setVisible ] = useState(false)
    const [ passw, setPassw ] = useState("")

    const strenth = useMemo(() => checkPasswordStrength(passw), [passw])
 
    const debounce = useDebounce((ev) => {
        if ( strenthMeter ) setPassw(ev.target.value)
        onChange && onChange(ev)
    }, 100)

    useEffect(() => {}, [])

    return <Box as={`w:100% flex cols`}>
        <Box 
            style={style}
            className={`--password flex aic rel`}>
            <Input 
                ref={ref}
                type={visible ? 'text' : 'password'}
                className={className}
                onChange={debounce}
                {...rest as InputProps} />
            <Button 
                tabIndex={-1}
                onClick={() => setVisible(prev => !prev)}
                className={`--toggle flex aic jcc abs`}>
                {visible ? SVGIcons.eye : SVGIcons.eyeSlash}
            </Button>
        </Box>
        {strenthMeter && <Box as={`flex aic --password-meter --pb-score-${strenth.score}`}>
            <Box as={`--password-bars flex aic`}>
                <Box as={`--pbar ${strenth.score >= 1 ? `--pb-on` : ``}`.trim()} />                                            
                <Box as={`--pbar ${strenth.score >= 2 ? `--pb-on` : ``}`.trim()} />                                            
                <Box as={`--pbar ${strenth.score >= 3 ? `--pb-on` : ``}`.trim()} />                                            
                <Box as={`--pbar ${strenth.score >= 4 ? `--pb-on` : ``}`.trim()} />                                            
                <Box as={`--pbar ${strenth.score >= 5 ? `--pb-on` : ``}`.trim()} />                                            
            </Box>
            <Text as={`--password-meter-label`} aria-hidden={true}>{strenth.result}</Text>
        </Box>}
    </Box>
})

Password.displayName = `Zuz.Password`

export default Password