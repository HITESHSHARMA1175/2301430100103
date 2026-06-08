"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Log = Log;
function Log(stack, level, packageName, message) {
    return __awaiter(this, void 0, void 0, function* () {
        let token = '';
        // Try to get token from process.env (Node.js or injected by Vite/Webpack)
        try {
            if (typeof process !== 'undefined' && process.env) {
                token = process.env.ACCESS_TOKEN || process.env.VITE_ACCESS_TOKEN || '';
            }
        }
        catch (e) {
            // Ignore error if process is undefined
        }
        // Try to get token from import.meta.env (Vite natively)
        if (!token) {
            try {
                // @ts-ignore
                if (typeof import.meta !== 'undefined' && import.meta.env) {
                    // @ts-ignore
                    token = import.meta.env.VITE_ACCESS_TOKEN || '';
                }
            }
            catch (e) { }
        }
        try {
            const response = yield fetch('http://4.224.186.213/evaluation-service/logs', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    stack,
                    level,
                    packageName,
                    message
                })
            });
            if (!response.ok) {
                console.error(`[logging_middleware] Failed to send log. Status: ${response.status}`);
            }
        }
        catch (error) {
            console.error(`[logging_middleware] Error sending log:`, error);
        }
    });
}
