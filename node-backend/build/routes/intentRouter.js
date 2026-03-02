"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupIntentRoutes = void 0;
const express_1 = __importDefault(require("express"));
const config_1 = require("../config");
const cors_setup_1 = require("../lib/cors-setup");
const url_1 = require("../lib/url");
const intent_handler_1 = require("../controller/intent-handler");
const setupIntentRoutes = (app) => {
    const router = express_1.default.Router();
    const options = (0, cors_setup_1.corsOptions)();
    router.use(options);
    const intentHandlerController = new intent_handler_1.IntentHandler();
    router.use('/', (req, res, next) => {
        console.log(`intent request: ${(0, url_1.sanitiseUrl)(req.url)}`);
        next();
    });
    router.post("/suggest", intentHandlerController.buildContextSuggestion);
    router.options('*', options);
    app.use(config_1.config.route.intentPrefix, router);
};
exports.setupIntentRoutes = setupIntentRoutes;
//# sourceMappingURL=intentRouter.js.map