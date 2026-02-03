declare class StyleGenerator {
    private propMap;
    private directMap;
    private colorProps;
    private animationCurves;
    private delimeter;
    private hashids;
    private mediaQueries;
    private __SALT;
    private fileMap;
    private cache;
    private ruleTracker;
    constructor();
    /**
     * Entry point: Converts "w:100 &hover(bg:red)" into class names
     */
    parseAndGenerate(rawString: string, filePath: string): string[];
    private tokenize;
    private pushToken;
    private generateAtomicClass;
    private resolveComplexTemplate;
    private processValue;
    private addUnitsToComplexValue;
    private parseGradient;
    private stringToPositionalSum;
    getStyleSheet(): string;
    getCache(): Map<string, string>;
    clearFileCache(filePath: string): void;
    writeToDisk(outPath: string): void;
}
declare const _default: StyleGenerator;
export default _default;
