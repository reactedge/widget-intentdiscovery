import {AiRecommendationResponse, ModelInput, SuggestionResponse} from "../types/intent-context";
import {OpenaiAgent} from "./openai-handler/ai-agent";


export class ContextIntentHandler {
    getIntentSuggestions = async (modelInput: ModelInput): Promise<AiRecommendationResponse> => {
        const openaiAgent = new OpenaiAgent()
        return await openaiAgent.getSuggestion(modelInput);
    }
}