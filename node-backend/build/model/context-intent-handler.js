"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContextIntentHandler = void 0;
const ai_agent_1 = require("./openai-handler/ai-agent");
class ContextIntentHandler {
    getIntentSuggestions = async (modelInput) => {
        const openaiAgent = new ai_agent_1.OpenaiAgent();
        return await openaiAgent.getSuggestion(modelInput);
    };
}
exports.ContextIntentHandler = ContextIntentHandler;
//# sourceMappingURL=context-intent-handler.js.map