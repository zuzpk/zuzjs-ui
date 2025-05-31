// const fs = require("fs")
// const path = require("path")
// const { execSync } = require("child_process")

import { execSync } from "child_process"
import fs from "fs"
import path from "path"

/** Package.json 
 * Replace @zuzjs/paper version to latest from workspace
*/
const packageJsonPath = path.join("./", "package.json")
const backupPath = path.join("./", "package.json.bak")

const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"))
fs.writeFileSync(backupPath, JSON.stringify(packageJson, null, 2))

/** @zuzjs/core package.json */
const corePack = JSON.parse(fs.readFileSync(path.join(import.meta.url, "..", "..", "packages", "core", "package.json")))

packageJson.dependencies["@zuzjs/core"] = `^${corePack.version}`

fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2))

execSync("git add package.json", { stdio: "inherit" })