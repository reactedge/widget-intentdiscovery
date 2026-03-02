"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IntentHandler = void 0;
const context_intent_handler_1 = require("../model/context-intent-handler");
const scoring_1 = require("../model/context-intent-handler/scoring");
class IntentHandler {
    buildContextSuggestion = async (req, res) => {
        try {
            const payload = req.body;
            if (!payload?.products?.length) {
                res.json([]);
            }
            const candidates = (0, scoring_1.preScoreProducts)(payload, 12);
            const modelInput = {
                intent: payload.intent.signals,
                products: candidates.map(p => ({
                    title: p.title,
                    attributes: p.attributes,
                    shortDescription: p.shortDescription ? p.shortDescription.slice(0, 240) : undefined
                }))
            };
            const IntentHandler = new context_intent_handler_1.ContextIntentHandler();
            const suggestions = await IntentHandler.getIntentSuggestions(modelInput);
            res.json(suggestions);
        }
        catch (err) {
            console.error(err);
            res.status(500).json({ error: "Server error" });
        }
    };
}
exports.IntentHandler = IntentHandler;
//# sourceMappingURL=intent-handler.js.map