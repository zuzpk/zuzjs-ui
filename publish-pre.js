import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const versionPath = path.resolve(__dirname, "..", "ui", "src", "version.ts");
/** 
 * 1. Backup Package.json 
*/
const packageJsonPath = path.resolve(__dirname, "..", "ui", "package.json");
const backupPath = path.resolve(__dirname, "..", "ui", "package.json.bak");

const packages = [
    {
        id: "core",
        name: "@zuzjs/core"
    },
    {
        id: "hooks",
        name: "@zuzjs/hooks"
    },
    {
        id: "logger",
        name: "@zuzjs/logger"
    }
]

/**Backup Package.json to backupPath */
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"))
fs.writeFileSync(backupPath, JSON.stringify(packageJson, null, 2))

for(const pack of packages) {
    const packPath = path.resolve(__dirname, "..", pack.id, "package.json")
    const packJson = JSON.parse(fs.readFileSync(packPath, "utf8"))
    packageJson.dependencies[pack.name] = `^${packJson.version}`
}

delete packageJson.scripts
delete packageJson.devDependencies

const [ _major, _minor, _patch ] = packageJson.version.split(`.`)

let major = +_major
let minor = +_minor
let patch = +_patch

if ( patch < 99 ) {
    patch += 1
} else {
    patch = 0
    if ( minor < 99 ) {
        minor += 1
    } else {
        minor = 0
        major += 1
    }
}   

packageJson.version = `${major}.${minor}.${patch}`

fs.writeFileSync(versionPath, `const VERSION = "${packageJson.version}";export default VERSION;`)

fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2))
