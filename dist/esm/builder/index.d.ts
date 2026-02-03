import { Project } from "ts-morph";
declare class Builder {
    project: Project;
    stylesToGenerate: Set<string>;
    private manifest;
    constructor();
    private extractStyles;
    processFile(filePath: string): void;
    getStyleCount(): number;
    /**
     * Generates the physical manifest file that useBase will import.
     */
    saveManifest(outPath: string): void;
}
declare const _default: Builder;
export default _default;
