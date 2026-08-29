import fs from "fs";
import path from "path";
import {
    Project,
    ScriptKind,
    SyntaxKind,
} from "ts-morph";
import { buildScrollScenesModel, ScrollScenesConfig } from "../funs/scroll-scenes";
import { splitAtoms } from "../funs";
import styleGenerator from "./style-generator";

class Builder {

    project: Project;
    stylesToGenerate: Set<string>;
    private manifest: Record<string, string> = {};
    private readonly supportedExtensions = ['.tsx', '.jsx', '.mdx', '.md'];

    private readLiteralNode(node: any): any {
        if (!node) return undefined;

        if (
            node.asKind(SyntaxKind.StringLiteral) ||
            node.asKind(SyntaxKind.NoSubstitutionTemplateLiteral)
        ) {
            return node.getLiteralValue();
        }

        if (node.asKind(SyntaxKind.NumericLiteral)) {
            return Number(node.getText());
        }

        if (node.getKind() === SyntaxKind.TrueKeyword) return true;
        if (node.getKind() === SyntaxKind.FalseKeyword) return false;

        if (node.asKind(SyntaxKind.ArrayLiteralExpression)) {
            return node.getElements().map((el: any) => this.readLiteralNode(el));
        }

        if (node.asKind(SyntaxKind.ObjectLiteralExpression)) {
            const out: Record<string, any> = {};
            node.getProperties().forEach((prop: any) => {
                if (prop.asKind(SyntaxKind.PropertyAssignment)) {
                    const nameNode = prop.getNameNode();
                    const key = nameNode?.getText().replace(/^['"]|['"]$/g, "");
                    if (!key) return;
                    out[key] = this.readLiteralNode(prop.getInitializer());
                }
            });
            return out;
        }

        return undefined;
    }

    private extractScrollScenes(sourceFile: any, filePath: string) {
        const calls = sourceFile.getDescendantsOfKind(SyntaxKind.CallExpression)
            .filter((call: any) => call.getExpression().getText() === "useScrollScenes");

        calls.forEach((call: any) => {
            const firstArg = call.getArguments()[0];
            const config = this.readLiteralNode(firstArg) as ScrollScenesConfig | undefined;

            if (!config || !config.id || !config.scenes || typeof config.scenes !== "object") {
                return;
            }

            const model = buildScrollScenesModel(config);
            if (model.cssText.trim()) {
                styleGenerator.registerRawRule(filePath, model.cssText);
            }
        });
    }

    constructor(){
        
        this.project = new Project({
            compilerOptions: { 
                allowJs: true, 
                jsx: 1 
            } // 1 = Preserve, for JSX analysis
        });

        this.stylesToGenerate = new Set();
        
    }

    private extractStyles(node: any, prefix = "") {

        // 1. If it's a JsxExpression, we need to dig into the expression inside the { }
        if (node.asKind(SyntaxKind.JsxExpression)) {
            const expr = node.getExpression();
            if (expr) this.extractStyles(expr, prefix);
            return;
        }

        // 2. Base Case: Strings or Numbers (Leaf nodes)
        // We add NumericLiteral here to catch the 50 and 60 inside the ternary
        if (
            node.asKind(SyntaxKind.StringLiteral) || 
            node.asKind(SyntaxKind.NoSubstitutionTemplateLiteral) ||
            node.asKind(SyntaxKind.NumericLiteral)
        ) {
            this.stylesToGenerate.add(prefix + node.getLiteralValue().toString());
        }

        // 3. Template Literals: `w:${...}`
        else if (node.asKind(SyntaxKind.TemplateExpression)) {
            const head = node.getHead().getLiteralText(); // e.g., "w:"
            node.getTemplateSpans()
                .forEach((span: any) => {
                this.extractStyles(span.getExpression(), prefix + head);
            });
        }

        // 4. Ternary: t ? 50 : 60
        else if (node.asKind(SyntaxKind.ConditionalExpression)) {
            this.extractStyles(node.getWhenTrue(), prefix);
            this.extractStyles(node.getWhenFalse(), prefix);
        }

        // 5. Arrays: [`w:100`, `h:100`]
        else if (node.asKind(SyntaxKind.ArrayLiteralExpression)) {
            node.getElements().forEach((el: any) => this.extractStyles(el, prefix));
        }

        // 6. Binary Expressions: 18 * i
        else if (node.asKind(SyntaxKind.BinaryExpression)) {
            // We look at both sides. 
            // Usually, one side is our static value (18) and the other is the variable (i)
            this.extractStyles(node.getLeft(), prefix);
            this.extractStyles(node.getRight(), prefix);
        }

    };

    public processFile(filePath: string){

        // // 1. Clear previous local file state so we only process what's in THIS file
        this.stylesToGenerate.clear();

        const isMdx = filePath.endsWith('.mdx') || filePath.endsWith('.md');
        let sourceFile;

        try {
            if (isMdx) {
                const fileContent = fs.readFileSync(filePath, "utf-8");
                sourceFile = this.project.createSourceFile(filePath, fileContent, {
                    overwrite: true,
                    scriptKind: ScriptKind.TSX
                });
            } else {
                sourceFile = this.project.addSourceFileAtPath(filePath);
                sourceFile.refreshFromFileSystemSync();
            }
        } catch (error: any) {
            // A watcher can observe inaccessible documentation or transient editor
            // files. Skip that file without taking down CSS generation for the app.
            if (error?.code === "EACCES" || error?.code === "ENOENT") {
                return;
            }
            throw error;
        }

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

        })

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

        // --- Handle useScrollScenes({...}) CSS generation ---
        this.extractScrollScenes(sourceFile, filePath);

        // 2. Generate hashes for everything found (from both as and css)
        this.stylesToGenerate.forEach(rawStyle => {

            // Split strings like "w:99 h:102" into ["w:99", "h:102"]
            // const individualTokens = rawStyle.split(/\s+/).filter(Boolean);
            const individualTokens = splitAtoms(rawStyle).filter(Boolean)
            // console.log(`indT`, individualTokens)
            individualTokens.forEach(token => {

                const groupMatch = token.match(/^([&@][\w-]+)\((.*)\)$/);

                if (groupMatch) {
                    const [fullMatch, prefix, innerContent] = groupMatch;
                    const innerAtoms = splitAtoms(innerContent).filter(Boolean);
                    innerAtoms.forEach(innerAtom => {
                        const fullToken = `${prefix}(${innerAtom})`;
                        const hashes = styleGenerator.parseAndGenerate(fullToken, filePath);
                        if (hashes.length > 0) {
                            this.manifest[fullToken] = hashes.join(' ');
                        }
                    });
                    // Also map the full original group token just in case
                    const hashes = styleGenerator.parseAndGenerate(token, filePath);
                    if (hashes.length > 0) {
                        this.manifest[token] = hashes.join(' ');
                    }
                }
                else{
                    const hashes = styleGenerator.parseAndGenerate(token, filePath);
                    if (hashes.length > 0) {
                        // Map the individual token, NOT the whole combined string
                        this.manifest[token] = hashes.join(' ');
                    }
                }
            });

        })

        if (isMdx) {
            this.project.removeSourceFile(sourceFile);
        }
        // console.log(`cache`, styleGenerator.getCache())

        // console.log(pc.green(`✔ Processed ${filePath}`));

    }

    public isSupportedFile(filePath: string): boolean {
        return this.supportedExtensions.some(ext => filePath.endsWith(ext));
    }

    public getStyleCount(): number {
        return this.stylesToGenerate.size;
    }

    public getManifestPath = () => {
        
        const root = process.cwd();
        
        // Check for common Next.js structures
        const paths = [
            path.join(root, "src/app/css"),
            path.join(root, "app/css"),
            path.join(root, "src/css"),
            path.join(root, "css")
        ];

        const targetDir = paths.find(p => fs.existsSync(p)) || paths[0];

        // Ensure the directory exists
        if (!fs.existsSync(targetDir)) {
            fs.mkdirSync(targetDir, { recursive: true });
        }

        return path.join(targetDir, "zuzmap.ts");
        
    };

    /**
     * Generates the physical manifest file that useBase will import.
     */
    public saveManifest(outPath: string) {
        
        const dir = path.dirname(outPath);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }

        // Clean the manifest: only keep entries that exist in the generator's active cache
        const activeCache = styleGenerator.getCache();
        const cleanManifest: Record<string, string> = {};

        for (const [token, hashes] of Object.entries(this.manifest)) {
            // A grouped utility can map to multiple atomic hashes. Retain it only
            // when every generated rule is still available in the active cache.
            const isActive = hashes
                .split(/\s+/)
                .filter(Boolean)
                .every(hash => activeCache.has(hash));

            if (isActive) {
                cleanManifest[token] = hashes;
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

export default new Builder()