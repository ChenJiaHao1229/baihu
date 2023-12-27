"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
// 创建axios实例
const instance = axios_1.default.create({
    // baseURL: 'https://nxplus.cn', // 替换成你的实际基础URL
    timeout: 5000,
    headers: {
        'Content-Type': 'application/json' // 设置默认请求头为JSON格式
    }
});
// 请求拦截器
instance.interceptors.request.use((config) => {
    return config;
}, (error) => {
    return Promise.reject(error);
});
// 响应拦截器
instance.interceptors.response.use((response) => {
    return response.data;
}, (error) => {
    // 对响应错误做些什么
    return Promise.reject(error);
});
exports.default = instance;
