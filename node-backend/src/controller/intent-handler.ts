import { Request, Response } from "express";
import {ContextIntentHandler} from "../model/context-intent-handler";
import {AiRecommendationRequest, AiRecommendationResponse} from "../types/intent-context";
import {preScoreProducts} from "../model/context-intent-handler/scoring";

export class IntentHandler {
    buildContextSuggestion = async (req: Request, res: Response): Promise<void> => {
        try {
            const payload = req.body as AiRecommendationRequest;

            if (!payload?.products?.length) {
                res.json({ suggestions: [], message: "No products to evaluate." });
                return
            }

            const candidates = preScoreProducts(payload, 12)

            const modelInput = {
                intent: payload.intent.signals,
                products: candidates.map(p => ({
                    title: p.title,
                    attributes: p.attributes,
                    shortDescription: p.shortDescription ? p.shortDescription.slice(0, 240) : undefined
                }))
            };

            const IntentHandler = new ContextIntentHandler()
            const suggestions = await IntentHandler.getIntentSuggestions(modelInput);

            res.json(suggestions);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: "Server error" });
        }
    }
}