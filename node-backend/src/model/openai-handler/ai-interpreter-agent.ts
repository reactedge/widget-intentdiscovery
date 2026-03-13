import {OpenAI} from "openai";
import {config} from "../../config";
import {
    AiInterpretationResponse,
    Attribute,
    Intent
} from "../../types/intent-interpretation-context";
import {Stores} from "../../types/intent-accepted-store";

const openai = new OpenAI({ apiKey: config.openai.apiKey });

const InterpretationSchema = {
    name: "interpretation_response",
    schema: {
        type: "object",
        properties: {
            filters: {
                type: "object",
                description: "Selected attribute filters derived from the intent",
                additionalProperties: {
                    type: "array",
                    items: {
                        type: "string"
                    }
                }
            }
        },
        required: ["filters"],
        additionalProperties: false
    }
} as const;

export class OpenaiInterpreterAgent {
    createPrompt = (store: Stores) => {
        return `You are a product interpretation engine for an e-commerce platform.

                Your task is to translate a shopper's intent into product filters.
                
                You receive:
                - an intent text
                - weighted intent signals
                - a list of attributes and their possible options
                
                Determine which attribute options best match the intent.
                
                Interpret semantic meaning, not just exact words.
                For example:
                - "winter", "cold", "outdoor conditions" may relate to climate attributes.
                - "red", "blue", "black" relate to color attributes.
                
                Rules:
                - Only use attributes and option values present in the input.
                - Do not invent attributes or option values.
                - Multiple attributes may apply.
                - If nothing matches, return an empty filters object.
                
                Important:
                Each option contains a "label" and a "value".
                You must return the VALUE of the option, not the label.
                Respond in ${store === 'fr' ? 'French' : 'English'}.`
    }

    async getIntentFilters(intent: Intent, attributes: Attribute[], store: Stores) {
        try {

            const completion = await openai.chat.completions.create({
                model: "gpt-4o-mini",
                temperature: 0.2,
                response_format: {
                    type: "json_schema",
                    json_schema: InterpretationSchema
                },
                messages: [
                    {
                        role: "system",
                        content: this.createPrompt(store)
                    },
                    {
                        role: "user",
                        content: JSON.stringify({
                            intent,
                            attributes
                        })
                    }
                ]
            })

            const content = completion.choices[0]?.message?.content ?? "{}"

            let parsed: AiInterpretationResponse

            try {
                parsed = JSON.parse(content)
            } catch {
                parsed = { filters: {} }
            }

            return parsed

        } catch (e) {

            console.error("AI interpretation failed:", e)

            return {
                filters: {}
            }
        }
    }
}