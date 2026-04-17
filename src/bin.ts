#!/usr/bin/env node

import { colors } from "@zuzjs/logger";
import chokidar from 'chokidar';
import { program } from "commander";
import fs from "fs";
import path, { basename } from "path";
import { fileURLToPath } from "url";
import builder from "./builder";
import styleGenerator from "./builder/style-generator";
import { cssDirect, cssProps } from "./builder/stylesheet";
import componentSnippets from "./snippets";
import { dynamic } from "./types/shared";

const options = program.opts();
const cwd = process.cwd();

let isReady = false

const cssPath = path.join(cwd, `src`, `app`, `css`)
const zuzcssPath = path.join(cssPath, `zuz.scss`)
const zuzmapPath = path.join(cssPath, `zuzmap.ts`)

const writeFiles = () => {
    styleGenerator.writeToDisk(zuzcssPath);
    builder.saveManifest(zuzmapPath);
}

const checkUpdate = async () => {
    try {

        const __dirname = path.dirname(fileURLToPath(import.meta.url))
        const pkgPath = path.resolve(__dirname, `../package.json`)

        const pkg = JSON.parse(fs.readFileSync(pkgPath, `utf8`))

        const response = await fetch(`https://registry.npmjs.org/@zuzjs/ui/latest`);
        const data = await response.json();
        const latest = data.version.trim();

        if (latest !== pkg.version.trim()) {

            const line1 = `  Update available! ${colors.dim(pkg.version)} → ${colors.green(latest)}  `;
            const line2 = `  Run: ${colors.cyan(`npm i ${pkg.name}@latest`)}  `;

            const getVisibleLength = (str: string) => 
                str.replace(/\u001b\[[0-9;]*m/g, '').length;

            const len1 = getVisibleLength(line1);
            const len2 = getVisibleLength(line2);
            const contentLen = Math.max(len1, len2);

            const top = colors.yellow(`┌${"─".repeat(contentLen + 2)}┐`);
            const bottom = colors.yellow(`└${"─".repeat(contentLen + 2)}┘`);
            
            const padLine = (line: string, len: number) => {
                const padding = " ".repeat(contentLen - len);
                return `${colors.yellow("│")} ${line}${padding} ${colors.yellow("│")}`;
            };

            console.log(`\n${top}`);
            console.log(padLine(line1, len1));
            console.log(padLine(line2, len2));
            console.log(`${bottom}\n`);

        }
    } catch (e) {}

}

// program
//     .option(`-d, --debug`)
//     .option(`-v, --version`)
//     .option(`-r, --root <char>`)
//     .option(`-f, --file <char>`)
//     .option(`-l, --lexer`)
//     .option(`-c, --classes`)
//     .option(`-h, --cache`)
//     .option(`-e, --cleaned`)
//     .option(`-t, --sheet`)
//     .option(`-m, --media`)
//     .option(`-s, --dark`)

// --- Command: Init ---
program
    .command('init')
    .description('Initialize Zuz snippets and configuration')
    .action(() => {
        const vscodePath = path.join(cwd, '.vscode');
        const snippetPath = path.join(vscodePath, 'zuz.code-snippets');
        const settingsPath = path.join(vscodePath, 'settings.json');

        // 1. Prepare Snippet Content
        const propChoices = Object.keys(cssProps).join(',');
        const directChoices = Object.keys(cssDirect).join(',');

        const snippetContent = {
            "Zuz Property": {
                "prefix": "zp",
                "body": [`as="\${1|${propChoices}|}:\$0"`],
                "description": "Zuz Property (adds colon)"
            },
            "Zuz Shortcut": {
                "prefix": "zs",
                "body": [`as="\${1|${directChoices}|}\$0"`],
                "description": "Zuz Direct Shortcut"
            },
            ...componentSnippets
        };

        // 2. Prepare Settings Content
        let settings : dynamic = {};
        if (fs.existsSync(settingsPath)) {
            try {
                settings = JSON.parse(fs.readFileSync(settingsPath, 'utf-8'));
            } catch (e) {
                settings = {};
            }
        }

        settings["editor.suggest.snippetsPreventQuickSuggestions"] = false;
        settings["editor.quickSuggestions"] = {
            ...(typeof settings["editor.quickSuggestions"] === 'object' ? settings["editor.quickSuggestions"] : {}),
            "strings": true
        };

        // 3. Write Files
        if (!fs.existsSync(vscodePath)) {
            fs.mkdirSync(vscodePath, { recursive: true });
        }
        
        fs.writeFileSync(snippetPath, JSON.stringify(snippetContent, null, 2));
        fs.writeFileSync(settingsPath, JSON.stringify(settings, null, 2));

        const componentCount = Object.keys(componentSnippets).length;
        console.log(colors.green('✔ Zuz VS Code configuration initialized!'));
        console.log(colors.cyan('  - .vscode/zuz.code-snippets (zp/zs + ' + componentCount + ' component snippets)'));
        console.log(colors.cyan('  - .vscode/settings.json (QuickSuggestions enabled)'));
        console.log(colors.dim('\n  Usage: type ui-<component> in a .tsx/.jsx file'));
        
    });

// --- Default Action (The Watcher) ---
program
    .command('watch')
    .alias('w')
    .description('Start ZuzJS watcher')
    .action(() => {
        
        checkUpdate()

        const watcher = chokidar.watch(`.`, {
            cwd,
            ignored: [
                /node_modules/,
                /dist/,
                /\.next/,
                /\.git/
            ],
            persistent: true,
            usePolling: true,
            followSymlinks: false,
            ignoreInitial: false
        });

        watcher.on('add', filePath => {
            if ( builder.isSupportedFile(filePath) ) {
                builder.processFile(path.resolve(cwd, filePath));
            }
            if ( isReady ) console.log(colors.gray(`○ File added: ${filePath}`));
        });

        watcher.on('change', filePath => {
            if ( builder.isSupportedFile(filePath) ) {
                console.log(colors.gray(`○ File changed: ${filePath}`));

                const fullPath = path.resolve(cwd, filePath);
                styleGenerator.clearFileCache(fullPath)

                builder.processFile(fullPath);

                writeFiles()

                console.log(colors.blue('⚡ Zuz CSS updated.'));
            }
        });

        watcher.on('ready', () => {

            isReady = true
            
            writeFiles()

            console.log(colors.green(`\n✓ Initial Build Complete.`));
            console.log(colors.cyan(`○ Watching: ${basename(cwd)}\n`));

            // console.log(colors.yellow(`○ Total unique utility classes identified: ${builder.getStyleCount()}`));

        });

        watcher.on('error', error => console.error(colors.red(`Watcher Error: ${error}`)));
    });

program.parse(process.argv)