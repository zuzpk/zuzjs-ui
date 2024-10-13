import { dynamicObject } from "../types"

const Lexer = (line: string) => {
        
    let word = ``
    let hasBracket = false
    let classes : dynamicObject = {}

    const processWord = () => {

        word = word.trim()
        if ( !word.includes(`[`)) word = word.replace(/\s+/g, ``)

        if ( word == ``) return 

        const [ key, value ] = word.split(`:`)

        classes[key] = value

        word = ``
    }

    line
        .replace(/\`|\}|\{/g, ``)
        .trim()
        .replace(/\s+/g, ` `)
        .split(``)
        .map((char, i, arr) => {
        
            const nextChar = arr[i + 1]   

            if ( char == ` ` && word != `` ) {
                processWord()
            }
            else{ 
                word += char
                if ( char == `[` ) hasBracket = true
                if ( char == `]` && hasBracket ) hasBracket = false                        
            }
        })

    if ( word != `` ) processWord()

    return classes
}

export default Lexer