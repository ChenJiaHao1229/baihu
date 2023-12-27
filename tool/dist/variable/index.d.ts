interface VarType {
    name?: string;
    tagId?: string;
    value?: string;
    weight?: number;
}
declare class Variable {
    private static path;
    private static tagPath;
    private static varPath;
    private static getVars;
    private static getTags;
    static getByName(name: string): VarType | undefined;
    static getByTagName(tagName: string): VarType[];
    static getList(): VarType[];
}
export default Variable;
