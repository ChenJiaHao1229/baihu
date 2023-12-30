"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Http = exports.Variable = void 0;
const index_1 = __importDefault(require("./variable/index"));
exports.Variable = index_1.default;
const index_2 = __importDefault(require("./http/index"));
exports.Http = index_2.default;
