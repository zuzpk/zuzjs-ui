#!/usr/bin/env node

import fs, { readdirSync, statSync, watch } from "fs"
import { program } from "commander";
import chokidar from 'chokidar';
import path from "path";
import CSS from "./funs/css.js"
import pc from "picocolors"
import { FIELNAME_KEY } from "./funs/index.js";
import { dynamicObject, zuzProps } from "./types/index.js";

program
    .option(`-d, --debug`)
    .option(`-v, --version`)
    .option(`-r, --root <char>`)
    .option(`-f, --file <char>`)
    .option(`-l, --lexer`)
    .option(`-c, --classes`)
    .option(`-h, --cache`)
    .option(`-e, --cleaned`)
    .option(`-t, --sheet`)
    .option(`-m, --media`)
    .option(`-s, --dark`)

program.parse()

const options = program.opts();

// extendGlobals()

const getAllFiles = (dir: any, extn: any, files?: string | any[], result?: any[], regex?: RegExp) : string[] => {
    files = files || readdirSync(dir);
    result = result || [];
    regex = regex || new RegExp(`^(?!.*[/\\\\]node_modules[/\\\\]).*\\${extn}$`);

    for (let i = 0; i < files!.length; i++) {
        let file = path.join(dir, files![i]);
        if (statSync(file).isDirectory()) {
            try {
                result = getAllFiles(file, extn, readdirSync(file), result, regex);
            } catch (error) {
                continue;
            }
        } else {
            if (regex.test(file)) {
                result!.push(file);
            }
        }
    }
    return result;
}

const rebuild = (f: string): string[] | null => {
    
    const raw = fs.readFileSync(f, `utf8`);

    let _filePath = path.relative( process.cwd(), f )
    if ( !_filePath.startsWith(`/`) ) _filePath = `/${_filePath}`

    const list : string[] = [`${FIELNAME_KEY}:${_filePath}`]

    const processMatch = (matches: RegExpMatchArray | null, type: zuzProps) => {

        const makeV2 = (v1: string) => {
            let v2 = v1
                .trim()
                .slice(1, -1)
            if ( v2.includes(`\n`) ){
                v2 = v2.split(`\n`).reduce((arr: string[], v: string) => {
                    if ( v.trim() != `` ){
                        v = v.trim().endsWith(`,`) ? v.slice(0, -1) : v
                        arr.push(v.trim())
                    }
                    return arr
                }, []).join(` `)
                // 
                
            }

            if ( v2.startsWith(`[`) && v2.endsWith(`]`) )
                v2 = v2.slice(1, -1)
                
            return v2.trim()
        }

        if( matches && matches.length > 0 ){
            matches.map((m : string) => {
                let v2
                // m = m.replace(/\s+|\n/gm, ` `)
                if ( type == `as` ){
                    const [ x, v1 ] = m.split(/as\s*=/)
                    v2 = makeV2(v1)
                }
                else if ( type == `css` ){
                    const v1 = m.split(/css\s*\(/)[1].slice(0, -1)
                    // console.log(v1)
                    v2 = makeV2(v1.trim())
                }
                // console.log(`v2 ->`, `"${v2}"`)
                list.push(v2!)
            })
        }
    }

    /**
     * match as={?}
     */
    // processMatch(raw.match(/as\s*=\s*\{([^{}]|{([^{}]|{[^{}]*})*})*\}/g), `as`)
    processMatch(raw.match(/as\s*=\s*(?:\{([^{}]|{([^{}]|{[^{}]*})*})*\}|'([^']*)'|"([^"]*)")/g), `as`)

    /**
     * match css()
     */
    processMatch(raw.match(/css\(\s*(?:\[\s*([\s\S]*?)\s*\]|\s*`([\s\S]*?)`)\s*\)/g), `css`)


    return list

}

const rebuildAll = () => {

    console.log( pc.gray( `○ Building Zuz CSS`) )

    const cssBuilder = new CSS({}, options)
    const files = getAllFiles( process.cwd(), `.(jsx|tsx)` )

    if ( files.length > 0 ){

        const as : string[] = []

        if ( options.file ){
            const r = rebuild(files.filter(f => f.endsWith(options.file.replace(path.resolve(`./`), ``)))[0])
            if ( r && r.length > 0 ){

                
                
                // console.log(r)

                as.push(cssBuilder.Build([r], true, options.file).sheet)
                // as.push(r)
            }
        }
        else{

            const mediaQueries : dynamicObject =  {}
            let darkQueries : dynamicObject = {}

            files.map(f => {
                // if ( f.endsWith(`header.jsx`) ){
                    const r = rebuild(f)!
                    if ( r && r.length > 0 ){
                        // as.push(cssBuilder.Build([r], true).sheet)
                        // as.push( f.endsWith(`header.jsx`) ?
                        //  `.header{${cssBuilder.Build([r], true).sheet}}`
                        //  : cssBuilder.Build([r], true).sheet)
                        const _built = cssBuilder.Build([r], true, f.replace(path.resolve(`./`), ``))
                        as.push(_built.sheet)
                        darkQueries = { ...darkQueries, ..._built.darkQueries }
                        Object.keys(_built.mediaQuery).map(mq => {
                            if ( !mediaQueries[mq] ) mediaQueries[mq] = []
                            mediaQueries[mq] = [
                                ...mediaQueries[mq],
                                ..._built.mediaQuery[mq]
                            ]
                        })
                        // as.push(new CSS().Build([[r]], true).sheet)
                    }
                // }
                    // as.push(r)
            })

            as.push(cssBuilder.buildMediaQueries(mediaQueries))
            as.push(cssBuilder.buildDarkModeQueries(darkQueries))


        }

        // console.log(as)

        // const { sheet } = new CSS().Build(as, true)

        // console.log(cache)
        const sheet = as.join(`\n`)

        if ( !fs.existsSync( path.join(process.cwd(), `src`, `app`, `css` ) ) ){
            fs.mkdirSync( path.join(process.cwd(), `src`, `app`, `css` ))
        }

        // console.log(sheet)

        fs.writeFileSync( 
            path.join(process.cwd(), `src`, `app`, `css`, `zuz.scss`), 
            sheet,
            {
                encoding: `utf8`,
                flag: `w+`
            }
        )

        console.log( pc.green( `✓ Zuz CSS Generated`) )

    }
    else{
        console.log(pc.red (`⨯ No tsx | jsx file found`))
    }
}

const watchPaths = [
    `${path.resolve(`./`)}/**/*.jsx`,
    `${path.resolve(`./`)}/**/*.tsx`,
]

const watcher = chokidar.watch(watchPaths, {
    ignored: (p: string | string[]) => p.includes(`/dist`) || p.includes('node_modules'),
    persistent: true,
    usePolling: true
})

if ( options.file ) 
    console.log( pc.gray( `○ Watching ${options.file}`) )

watcher.on(`change`, rebuildAll)