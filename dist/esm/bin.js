#!/usr/bin/env node
import { program } from "commander";
import chokidar from 'chokidar';
import path, { basename } from "path";
import pc from "picocolors";
import fs from "fs";
import builder from "./builder/index.js";
import styleGenerator from "./builder/style-generator.js";
import { cssDirect, cssProps } from "./builder/stylesheet.js";
const options = program.opts();
const cwd = process.cwd();
let isReady = false;
const cssPath = path.join(cwd, `src`, `app`, `css`);
const zuzcssPath = path.join(cssPath, `zuz.scss`);
const zuzmapPath = path.join(cssPath, `zuzmap.ts`);
const writeFiles = () => {
    styleGenerator.writeToDisk(zuzcssPath);
    builder.saveManifest(zuzmapPath);
};
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
        }
    };
    // 2. Prepare Settings Content
    let settings = {};
    if (fs.existsSync(settingsPath)) {
        try {
            settings = JSON.parse(fs.readFileSync(settingsPath, 'utf-8'));
        }
        catch (e) {
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
    console.log(pc.green('✔ Zuz VS Code configuration initialized!'));
    console.log(pc.cyan('  - .vscode/zuz.code-snippets (Splitted zp/zs)'));
    console.log(pc.cyan('  - .vscode/settings.json (QuickSuggestions enabled)'));
});
// --- Default Action (The Watcher) ---
// This handles when you run "zjs"
program
    .command('watch')
    .alias('w')
    .description('Start ZuzJS watcher')
    .action(() => {
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
        if (filePath.endsWith('.tsx') || filePath.endsWith('.jsx')) {
            builder.processFile(path.resolve(cwd, filePath));
        }
        if (isReady)
            console.log(pc.gray(`○ File added: ${filePath}`));
    });
    watcher.on('change', filePath => {
        if (filePath.endsWith('.tsx') || filePath.endsWith('.jsx')) {
            console.log(pc.gray(`○ File changed: ${filePath}`));
            const fullPath = path.resolve(cwd, filePath);
            styleGenerator.clearFileCache(fullPath);
            builder.processFile(fullPath);
            writeFiles();
            console.log(pc.blue('⚡ Zuz CSS updated.'));
        }
    });
    watcher.on('ready', () => {
        isReady = true;
        writeFiles();
        console.log(pc.green(`\n✓ Initial Build Complete.`));
        console.log(pc.cyan(`○ Watching: ${basename(cwd)}\n`));
        // console.log(pc.yellow(`○ Total unique utility classes identified: ${builder.getStyleCount()}`));
    });
    watcher.on('error', error => console.error(pc.red(`Watcher Error: ${error}`)));
});
program.parse(process.argv);
