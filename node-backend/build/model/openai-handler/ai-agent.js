"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OpenaiAgent = void 0;
const openai_1 = require("openai");
const config_1 = require("../../config");
const openai = new openai_1.OpenAI({ apiKey: config_1.config.openai.apiKey });
const SuggestionSchema = {
    name: "AiRecommendationResponse",
    strict: true,
    schema: {
        type: "object",
        additionalProperties: false,
        properties: {
            message: { type: "string" },
            suggestions: {
                type: "array",
                maxItems: 5,
                items: {
                    type: "object",
                    additionalProperties: false,
                    properties: {
                        title: { type: "string" },
                        confidence: { type: "number", minimum: 0, maximum: 1 },
                        reason: { type: "string" }
                    },
                    required: ["title", "confidence", "reason"]
                }
            }
        },
        required: ["message", "suggestions"]
    }
};
class OpenaiAgent {
    getSuggestion = async (modelInput) => {
        try {
            const completion = await openai.chat.completions.create({
                model: "gpt-4o-mini",
                temperature: 0.2,
                response_format: {
                    type: "json_schema",
                    json_schema: SuggestionSchema
                },
                messages: [
                    {
                        role: "system",
                        content: "You are a product recommendation engine for an e-commerce platform. " +
                            "Based on weighted intent signals, select up to 5 relevant products. " +
                            "Also generate a short summary sentence explaining how the suggestions relate to the user’s intent."
                    },
                    {
                        role: "user",
                        content: JSON.stringify(modelInput)
                    }
                ]
            });
            const content = completion.choices[0]?.message?.content ?? "{}";
            const parsed = JSON.parse(content);
            parsed.suggestions = (parsed.suggestions ?? []).slice(0, 5);
            return parsed;
        }
        catch (e) {
            return {
                message: "Unable to generate AI recommendations.",
                suggestions: []
            };
        }
    };
}
exports.OpenaiAgent = OpenaiAgent;
//# sourceMappingURL=ai-agent.js.map