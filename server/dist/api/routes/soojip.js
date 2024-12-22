"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const route = (0, express_1.Router)();
exports.default = (app) => {
    app.use("/soojip", route);
    console.log("hello");
    route.get("/location", (req, res) => {
        const { type } = req.query;
        console.log(type);
        return res.status(200).json({ message: "Success" });
    });
};
//# sourceMappingURL=soojip.js.map