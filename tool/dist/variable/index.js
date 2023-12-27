"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
class Variable {
    static path = './data/db';
    static tagPath = path.resolve(process.cwd(), this.path, 'tag.json');
    static varPath = path.resolve(process.cwd(), this.path, 'var.json');
    // 查询变量
    static getVars() {
        try {
            // 读取 var.json 文件内容
            const configFileContent = fs.readFileSync(this.varPath, 'utf-8');
            return JSON.parse(configFileContent) || [];
        }
        catch (error) {
            console.error('读取变量数据失败:', error);
            return [];
        }
    }
    // 查询标签
    static getTags() {
        try {
            // 读取 var.json 文件内容
            const configFileContent = fs.readFileSync(this.tagPath, 'utf-8');
            return JSON.parse(configFileContent) || [];
        }
        catch (error) {
            console.error('读取变量数据失败:', error);
            return [];
        }
    }
    // 根据变量名查询
    static getByName(name) {
        const vars = this.getVars();
        return vars.find((item) => item.name === name);
    }
    // 根据标签名查询
    static getByTagName(tagName) {
        const vars = this.getVars();
        const tags = this.getTags();
        const tag = tags.find((item) => item.name === tagName);
        if (!tag)
            return [];
        return vars
            .filter((item) => item.tagId === tag.id)
            .sort((a, b) => (b.weight || 0) - (a.weight || 0));
    }
    // 查询所有数据
    static getList() {
        return this.getVars().sort((a, b) => (b.weight || 0) - (a.weight || 0));
    }
}
exports.default = Variable;
