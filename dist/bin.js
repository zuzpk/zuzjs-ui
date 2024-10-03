#!/usr/bin/env node
import fs, { readdirSync, statSync } from "fs";
import { program } from "commander";
import chokidar from 'chokidar';
import path from "path";
import CSS from "./funs/css.js";
import pc from "picocolors";
import { FIELNAME_KEY } from "./funs/index.js";
program
    .option(`-d, --debug`)
    .option(`-v, --version`)
    .option(`-root, --root <char>`)
    .option(`-f, --file <char>`);
program.parse();
const options = program.opts();
const getAllFiles = (dir, extn, files, result, regex) => {
    files = files || readdirSync(dir);
    result = result || [];
    regex = regex || new RegExp(`\\${extn}$`);
    for (let i = 0; i < files.length; i++) {
        let file = path.join(dir, files[i]);
        if (statSync(file).isDirectory()) {
            try {
                result = getAllFiles(file, extn, readdirSync(file), result, regex);
            }
            catch (error) {
                continue;
            }
        }
        else {
            if (regex.test(file)) {
                result.push(file);
            }
        }
    }
    return result;
};
const rebuild = (f) => {
    const raw = fs.readFileSync(f, `utf8`);
    let _filePath = path.relative(process.cwd(), f);
    if (!_filePath.startsWith(`/`))
        _filePath = `/${_filePath}`;
    const list = [`${FIELNAME_KEY}:${_filePath}`];
    const processMatch = (matches, type) => {
        const makeV2 = (v1) => {
            let v2 = v1
                .trim()
                .slice(1, -1);
            if (v2.includes(`\n`)) {
                v2 = v2.split(`\n`).reduce((arr, v) => {
                    if (v.trim() != ``) {
                        v = v.trim().endsWith(`,`) ? v.slice(0, -1) : v;
                        arr.push(v.trim());
                    }
                    return arr;
                }, []).join(` `);
            }
            if (v2.startsWith(`[`) && v2.endsWith(`]`))
                v2 = v2.slice(1, -1);
            return v2.trim();
        };
        if (matches && matches.length > 0) {
            matches.map((m) => {
                let v2;
                if (type == `as`) {
                    const [x, v1] = m.split(/as\s*=/);
                    v2 = makeV2(v1);
                }
                else if (type == `css`) {
                    const v1 = m.split(/css\s*\(/)[1].slice(0, -1);
                    v2 = makeV2(v1.trim());
                }
                list.push(v2);
            });
        }
    };
    processMatch(raw.match(/as\s*=\s*(?:\{([^{}]|{([^{}]|{[^{}]*})*})*\}|'([^']*)'|"([^"]*)")/g), `as`);
    processMatch(raw.match(/css\(\s*(?:\[\s*([\s\S]*?)\s*\]|\s*`([\s\S]*?)`)\s*\)/g), `css`);
    return list;
};
const rebuildAll = () => {
    console.log(pc.gray(`○ Building Zuz CSS`));
    const cssBuilder = new CSS();
    const files = getAllFiles(process.cwd(), `.jsx`);
    if (files.length > 0) {
        const as = [];
        if (options.file) {
            const r = rebuild(files.filter(f => f.endsWith(options.file))[0]);
            if (r && r.length > 0) {
                as.push(cssBuilder.Build([r], true).sheet);
            }
        }
        else {
            const mediaQueries = {};
            files.map(f => {
                const r = rebuild(f);
                if (r && r.length > 0) {
                    const _built = cssBuilder.Build([r], true);
                    as.push(_built.sheet);
                    Object.keys(_built.mediaQuery).map(mq => {
                        if (!mediaQueries[mq])
                            mediaQueries[mq] = [];
                        mediaQueries[mq] = [
                            ...mediaQueries[mq],
                            ..._built.mediaQuery[mq]
                        ];
                    });
                }
            });
            as.push(cssBuilder.buildMediaQueries(mediaQueries));
        }
        const sheet = as.join(`\n`);
        if (!fs.existsSync(path.join(process.cwd(), `src`, `app`, `css`))) {
            fs.mkdirSync(path.join(process.cwd(), `src`, `app`, `css`));
        }
        fs.writeFileSync(path.join(process.cwd(), `src`, `app`, `css`, `zuz.scss`), sheet, {
            encoding: `utf8`,
            flag: `w+`
        });
        console.log(pc.green(`✓ Zuz CSS Generated`));
    }
};
const watcher = chokidar.watch([
    `${path.resolve(`./`)}/**/*.jsx`
], {
    ignored: (p) => p.includes(`/dist`) || p.includes('node_modules'),
    persistent: true
});
if (options.file)
    console.log(pc.gray(`○ Watching ${options.file}`));
watcher.on(`change`, rebuildAll);
