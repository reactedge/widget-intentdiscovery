import { Request, Response } from "express";
import {ContextIntentHandler} from "../model/context-intent-handler";
import {preScoreProducts} from "../model/context-intent-handler/scoring";
import {AiRecommendationRequest} from "../types/intent-recommendations-context";
import {AiInterpretationRequest} from "../types/intent-interpretation-context";

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

    validateIntentInput = async (
        req: Request,
        res: Response
    ): Promise<void> => {
        try {
            const body = req.body

            if (!this.isValidIntentRequest(body)) {
                res.status(400).json({
                    error: "Invalid interpretation request payload"
                })
                return
            }

            const { intent, attributes } = body

            const IntentHandler = new ContextIntentHandler()
            const filters = await IntentHandler.getFiltersFromIIntent(intent, attributes);

            res.json(filters);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: "Server error" });
        }
    }

    isValidIntentRequest = (body: any): body is AiInterpretationRequest => {
        return (
            body &&
            typeof body === "object" &&
            body.intent &&
            typeof body.intent.text === "string" &&
            Array.isArray(body.attributes)
        )
    }

}