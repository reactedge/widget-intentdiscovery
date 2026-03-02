"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildSuggestions = buildSuggestions;
async function buildSuggestions(context) {
    async function suggestIntent(req, res) {
        const payload = req.body;
        if (!payload?.products?.length) {
            return res.json({ suggestions: [] });
        }
        const candidates = preScore(payload, 12);
        // Keep the model input tight
        const modelInput = {
            intent: payload.intent.signals,
            products: candidates.map(p => ({
                title: p.title,
                attributes: p.attributes,
                shortDescription: p.shortDescription ? p.shortDescription.slice(0, 240) : undefined
            }))
        };
        try {
            const completion = await openai.chat.completions.create({
                model: "gpt-4o-mini", // cheap + fast; swap later if needed
                temperature: 0.2,
                response_format: {
                    type: "json_schema",
                    json_schema: SuggestionSchema
                },
                messages: [
                    {
                        role: "system",
                        content: "You are a product recommendation engine. " +
                            "Choose up to 5 products that best match the weighted intent signals. " +
                            "Prefer exact label matches. Return concise 1-sentence reasons."
                    },
                    {
                        role: "user",
                        content: JSON.stringify(modelInput)
                    }
                ]
            });
            const content = completion.choices[0]?.message?.content ?? "{}";
            const parsed = JSON.parse(content);
            // Defensive: ensure max 5
            parsed.suggestions = (parsed.suggestions ?? []).slice(0, 5);
            return res.json(parsed);
        }
        catch (e) {
            // Fallback: deterministic top 5 if AI fails (keeps UX stable)
            const fallback = candidates.slice(0, 5).map(p => ({
                title: p.title,
                confidence: Math.max(0, Math.min(1, p._preScore || 0)),
                reason: "Matches your current intent signals."
            }));
            return res.status(200).json({ suggestions: fallback });
        }
    }
}
//# sourceMappingURL=buildSuggestions.js.map