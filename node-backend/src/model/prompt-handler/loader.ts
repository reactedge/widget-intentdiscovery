import fs from "fs";
import path from "path";

import { config } from "../../config";

export async function getIntentPrompt(promptVersion: string) {
    const filePath = path.join(
        process.cwd(),
        config.cdnFolder,
        `intent-prompt.${promptVersion}.json`
    );

    try {
        const file = fs.readFileSync(filePath, "utf-8");
        const prompt = JSON.parse(file);

        return prompt.instructions;
    } catch (err) {
        console.error("[promptLoader] Error:", err);

        return "You are a product recommendation engine for an e-commerce platform. " +
            "Based on weighted intent signals, select up to 5 relevant products. " +
            "Also generate a short summary sentence explaining how the suggestions relate to the user’s intent.";
    }
}