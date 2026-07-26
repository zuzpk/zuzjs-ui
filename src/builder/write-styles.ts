import fs from "fs";
import { dirname } from "path";
import styleGenerator from "./style-generator";

/**
 * Writes the in-memory generated CSS out to disk. This is a Node/CLI-only
 * concern — do NOT import this from any module that's reachable from the
 * browser entry point (`src/index.ts`). If you need the generated CSS
 * elsewhere (e.g. in-browser), use `styleGenerator.getOutput()` directly.
 */
export function writeStylesToDisk(outPath: string) {
    const output = styleGenerator.getOutput();
    if (!fs.existsSync(dirname(outPath))) {
        fs.mkdirSync(dirname(outPath));
    }
    fs.writeFileSync(outPath, output);
}