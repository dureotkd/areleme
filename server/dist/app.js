"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const loaders_1 = __importDefault(require("./loaders"));
(async () => {
    const app = (0, express_1.default)();
    await (0, loaders_1.default)({ app });
    app
        .listen(4000, () => {
        console.log("Your Server is Ready !!");
    })
        .on("error", (err) => {
        console.log(err);
    });
})();
//# sourceMappingURL=app.js.map