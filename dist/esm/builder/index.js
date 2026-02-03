import { Project, SyntaxKind, } from "ts-morph";
import styleGenerator from "./style-generator.js";
import path from "path";
import fs from "fs";
class Builder {
    project;
    stylesToGenerate;
    manifest = {};
    constructor() {
        this.project = new Project({
            compilerOptions: {
                allowJs: true,
                jsx: 1
            } // 1 = Preserve, for JSX analysis
        });
        this.stylesToGenerate = new Set();
    }
    extractStyles(node, prefix = "") {
        // 1. If it's a JsxExpression, we need to dig into the expression inside the { }
        if (node.asKind(SyntaxKind.JsxExpression)) {
            const expr = node.getExpression();
            if (expr)
                this.extractStyles(expr, prefix);
            return;
        }
        // 2. Base Case: Strings or Numbers (Leaf nodes)
        // We add NumericLiteral here to catch the 50 and 60 inside the ternary
        if (node.asKind(SyntaxKind.StringLiteral) ||
            node.asKind(SyntaxKind.NoSubstitutionTemplateLiteral) ||
            node.asKind(SyntaxKind.NumericLiteral)) {
            this.stylesToGenerate.add(prefix + node.getLiteralValue().toString());
        }
        // 3. Template Literals: `w:${...}`
        else if (node.asKind(SyntaxKind.TemplateExpression)) {
            const head = node.getHead().getLiteralText(); // e.g., "w:"
            const spans = node.getTemplateSpans();
            spans.forEach((span) => {
                const expression = span.getExpression();
                // Recurse into the expression inside ${}, passing the head as a prefix
                this.extractStyles(expression, prefix + head);
            });
        }
        // 4. Ternary: t ? 50 : 60
        else if (node.asKind(SyntaxKind.ConditionalExpression)) {
            this.extractStyles(node.getWhenTrue(), prefix);
            this.extractStyles(node.getWhenFalse(), prefix);
        }
        // 5. Arrays: [`w:100`, `h:100`]
        else if (node.asKind(SyntaxKind.ArrayLiteralExpression)) {
            node.getElements().forEach((el) => this.extractStyles(el, prefix));
        }
    }
    ;
    processFile(filePath) {
        // // 1. Clear previous local file state so we only process what's in THIS file
        this.stylesToGenerate.clear();
        const sourceFile = this.project.addSourceFileAtPath(filePath);
        sourceFile.refreshFromFileSystemSync();
        // Use a broader filter to catch BOTH <Box>...</Box> and <Box />
        const elements = [
            ...sourceFile.getDescendantsOfKind(SyntaxKind.JsxOpeningElement),
            ...sourceFile.getDescendantsOfKind(SyntaxKind.JsxSelfClosingElement)
        ];
        elements.forEach(node => {
            const asAttribute = node.getAttribute("as")?.asKind(SyntaxKind.JsxAttribute);
            const initializer = asAttribute?.getInitializer();
            if (initializer) {
                this.extractStyles(initializer);
            }
        });
        // --- Handle css("...") function calls ---
        // This finds every instance of the css() function being called
        const cssCalls = sourceFile.getDescendantsOfKind(SyntaxKind.CallExpression)
            .filter(call => call.getExpression().getText() === "css");
        cssCalls.forEach(call => {
            const args = call.getArguments();
            if (args.length > 0) {
                // We pass the first argument of css() to your existing extraction logic
                this.extractStyles(args[0]);
            }
        });
        // 2. Generate hashes for everything found (from both as and css)
        this.stylesToGenerate.forEach(rawStyle => {
            // Split strings like "w:99 h:102" into ["w:99", "h:102"]
            const individualTokens = rawStyle.split(/\s+/).filter(Boolean);
            individualTokens.forEach(token => {
                const hashes = styleGenerator.parseAndGenerate(token, filePath);
                if (hashes.length > 0) {
                    // Map the individual token, NOT the whole combined string
                    this.manifest[token] = hashes.join(' ');
                }
            });
            // const hashes = styleGenerator.parseAndGenerate(rawStyle, filePath)
            // if ( hashes.length > 0 ){
            //     this.manifest[rawStyle] = hashes.join(` `)
            // }
        });
        // console.log(`cache`, styleGenerator.getCache())
        // console.log(pc.green(`✔ Processed ${filePath}`));
    }
    getStyleCount() {
        return this.stylesToGenerate.size;
    }
    /**
     * Generates the physical manifest file that useBase will import.
     */
    saveManifest(outPath) {
        const dir = path.dirname(outPath);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        // Clean the manifest: only keep entries that exist in the generator's active cache
        const activeCache = styleGenerator.getCache();
        const cleanManifest = {};
        for (const [token, hash] of Object.entries(this.manifest)) {
            // Only keep if the hash produced is currently in the active CSS generator
            if (activeCache.has(hash)) {
                cleanManifest[token] = hash;
            }
        }
        // Replace the global manifest with the cleaned one to prevent ghosting
        this.manifest = cleanManifest;
        // We export as a constant so it's easily importable in the UI package
        const content = `/* Zuz Generated Manifest - Do not edit */\nexport const zuzMap: Record<string, string> = ${JSON.stringify(this.manifest, null, 2)};`;
        fs.writeFileSync(outPath, content);
        // console.log(pc.blue(`\n📦 Manifest saved to ${outPath}`));
    }
}
export default new Builder();
