// const fs = require("fs")
// const path = require("path")
// const { execSync } = require("child_process")

import fs from "fs"
import path from "path"
import { execSync } from "child_process"

/** Package.json 
 * Replace @zuzjs/paper version to latest from workspace
*/
const packageJsonPath = path.join("./", "package.json")
const backupPath = path.join("./", "package.json.bak")

const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"))
fs.writeFileSync(backupPath, JSON.stringify(packageJson, null, 2))

/** @zuzjs/ui package.json */
const paperPack = JSON.parse(fs.readFileSync(path.join(import.meta.url, "..", "..", "packages", "paper", "package.json")))

// packageJson.dependencies["@zuzjs/paper"] = `^${paperPack.version}`
delete packageJson.dependencies["@zuzjs/paper"]

fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2))

execSync("git add package.json", { stdio: "inherit" })