"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const loaders_1 = __importDefault(require("./loaders"));
const config_1 = __importDefault(require("./config"));
(async () => {
    const app = (0, express_1.default)();
    await (0, loaders_1.default)({ app });
    app
        .listen(config_1.default.port, () => {
        console.log("Your Server is Ready !!");
    })
        .on("error", (err) => {
        console.log(err);
    });
})();
//# sourceMappingURL=app.js.map