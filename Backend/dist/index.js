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
const ws_1 = __importStar(require("ws"));
const uuid_1 = require("uuid");
const wss = new ws_1.Server({ port: 8080 });
wss.on("connection", (ws) => {
    ws.on("message", (message) => {
        let data;
        try {
            data = JSON.parse(message);
        }
        catch (error) {
            console.error("Invalid JSON:", error);
            return;
        }
        switch (data.type) {
            case "upload":
                const fileId = (0, uuid_1.v4)();
                ws.send(JSON.stringify({ type: "file-id", fileId }));
                break;
            case "signal":
                wss.clients.forEach((client) => {
                    if (client !== ws && client.readyState === ws_1.default.OPEN) {
                        client.send(message);
                    }
                });
                break;
            default:
                console.error("Unknown message type:", data.type);
        }
    });
});
console.log("Signaling server is running on ws://localhost:8080");
