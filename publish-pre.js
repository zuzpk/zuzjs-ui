// const fs = require("fs")
// const path = require("path")
// const { execSync } = require("child_process")

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** Package.json 
 * Replace @zuzjs/paper version to latest from workspace
*/
const packageJsonPath = path.resolve(__dirname, "..", "ui", "package.json");
const backupPath = path.resolve(__dirname, "..", "ui", "package.json.bak");

/** @zuzjs/core package.json */
const corePackageJsonPath = path.resolve(__dirname, "..", "core", "package.json");
const corePack = JSON.parse(fs.readFileSync(corePackageJsonPath, "utf8"));

const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"))
fs.writeFileSync(backupPath, JSON.stringify(packageJson, null, 2))


packageJson.dependencies["@zuzjs/core"] = `^${corePack.version}`

delete packageJson.scripts
delete packageJson.devDependencies

const [ _major, _minor, _patch ] = packageJson.version.split(`.`)

let major = +_major
let minor = +_minor
let patch = +_patch

if ( patch < 9 ) {
    patch += 1
} else {
    patch = 0
    if ( minor < 9 ) {
        minor += 1
    } else {
        minor = 0
        major += 1
    }
}   

packageJson.version = `${major}.${minor}.${patch}`

fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2))