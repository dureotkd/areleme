"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const express_middleware_1 = require("@useoptic/express-middleware");
const config_1 = __importDefault(require("../config"));
const routes_1 = __importDefault(require("../api/routes"));
exports.default = async ({ app }) => {
    app.use((0, cors_1.default)({
        origin: process.env.NODE_ENV === 'production' ? 'https://www.areleme.com' : '*',
        credentials: true,
    }));
    app.use(express_1.default.json());
    app.use(express_1.default.urlencoded({ extended: true }));
    // Useful if you're behind a reverse proxy (Heroku, Bluemix, AWS ELB, Nginx, etc)
    // It shows the real origin IP in the heroku or Cloudwatch logs
    app.enable('trust proxy');
    app.use((0, helmet_1.default)());
    // Some sauce that always add since 2014
    // "Lets you use HTTP verbs such as PUT or DELETE in places where the client doesn't support it."
    // Maybe not needed anymore ?
    app.use(require('method-override')());
    app.use((0, express_middleware_1.OpticMiddleware)({
        enabled: process.env.NODE_ENV !== 'production', // 개발 환경에서만 활성화
    }));
    // Load API routes
    app.use(config_1.default.api.prefix, (0, routes_1.default)());
    /// catch 404 and forward to error handler
    app.use((req, res, next) => {
        const err = new Error('Not Found');
        err['status'] = 404;
        next(err);
    });
    return app;
};
//# sourceMappingURL=express.js.map