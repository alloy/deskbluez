"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const LinakDesk_1 = require("./desks/LinakDesk");
const REGISTRY = [
    {
        name: "linak",
        cls: LinakDesk_1.LinakDesk,
        services: [
            "99fa0020-338a-1024-8a49-009c0215f78a",
            "99fa0001-338a-1024-8a49-009c0215f78a",
        ]
    }
];
exports.default = REGISTRY;
