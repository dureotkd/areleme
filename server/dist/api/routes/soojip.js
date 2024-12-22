"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const route = (0, express_1.Router)();
exports.default = (app) => {
    app.use("/soojip", route);
    route.get("/local", (req, res) => {
        const { type } = req.query;
        return res.status(200).json({ message: "Success" });
    });
};
//# sourceMappingURL=soojip.js.map