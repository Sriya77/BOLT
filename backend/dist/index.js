"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
require("dotenv").config();
//console.log(process.env.API_KEY);
const { GoogleGenerativeAI } = require("@google/generative-ai");
// const genAI = new GoogleGenerativeAI("YOUR_API_KEY");
// const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
// const userPrompt = "Explain how AI works";
// const result = await model.generateContent(prompt);
// console.log(result.response.text());
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const apiKey = process.env.API_KEY;
        if (!apiKey) {
            console.error("API_KEY is missing. Please check your .env file.");
            return;
        }
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const userPrompt = "Explain how AI works"; // Renamed from 'prompt' to 'userPrompt'
        try {
            const result = yield model.generateContent({ prompt: userPrompt });
            console.log(result.response.text); // Adjust this based on the actual library docs
        }
        catch (error) {
            console.error("Error generating content:", error);
        }
    });
}
main();
