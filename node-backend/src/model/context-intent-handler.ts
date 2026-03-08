import {AiRecommendationResponse, ModelInput} from "../types/intent-recommendations-context";
import {AiInterpretationResponse, Attribute, Intent} from "../types/intent-interpretation-context";
import {OpenaiRecommendationAgent} from "./openai-handler/ai-recommendation-agent";
import {OpenaiInterpreterAgent} from "./openai-handler/ai-interpreter-agent";


export class ContextIntentHandler {
    getIntentSuggestions = async (modelInput: ModelInput): Promise<AiRecommendationResponse> => {
        const openaiAgent = new OpenaiRecommendationAgent()
        return await openaiAgent.getSuggestion(modelInput);
    }

    getFiltersFromIIntent = async (intent: Intent , attributes: Attribute[]): Promise<AiInterpretationResponse> => {
        const openaiAgent = new OpenaiInterpreterAgent()
        return await openaiAgent.getIntentFilters(intent, attributes);
    }
}