import dotenv from "dotenv";
dotenv.config();
import { GoogleGenerativeAI } from "@google/generative-ai";
import express from "express";
import {BASE_PROMPT, getSystemPrompt } from "./prompts.js";
import { basePrompt as nodeBasePrompt } from "./defaults/node.js";
import { basePrompt as reactBasePrompt } from "./defaults/react.js";
import bodyParser from 'body-parser';
import { text } from "node:stream/consumers";


const app = express();
app.use(express.json());

app.post("/template", async (req, res) => {
 // const prompt2 = "Create a react todo application";
  const prompt = req.body.prompt;
  const API_KEY = process.env.API_KEY;

  if (!API_KEY) {
    console.error("API_KEY is missing. Please check your .env file.");
    return res.status(500).json({ message: "API_KEY is missing." });
  }

  try {
    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash", 
    });


    const result = await model.generateContent(
      `${prompt}\n\nReturn only 1 word either 'node' or 'react'.`,
      {
        temperature: 0.7,
        maxOutputTokens: 200,
      }
    );

    console.log("Full result object:", result);

    // Extract candidates
    const candidates = result?.response?.candidates;
    if (!candidates || candidates.length === 0) {
      throw new Error("No content generated by the API.");
    }

    // Extract the content from the first candidate
    const parts = candidates[0]?.content?.parts;
    if (!parts || parts.length === 0) {
      throw new Error("No valid parts in the response.");
    }

    const answer = parts[0]?.text?.trim();; // Assuming the first part contains the desired response
    if (!answer) {
      throw new Error("No valid content in the parts.");
    }

    console.log("Generated Answer:", answer);

    if (answer === "react") {
      res.json({
        prompts: [BASE_PROMPT,
          `Here is an artifact that contains all files of the project visible to you.\nConsider the contents of ALL files in the project.\n\n${JSON.stringify(reactBasePrompt)}\n\nHere is a list of files that exist on the file system but are not being shown to you:\n\n  - .gitignore\n  - package-lock.json\n`,
        ],
        uiPrompts: [reactBasePrompt],
      });
    } else if (answer === "node") {
      res.json({
        prompts: [
          `Here is an artifact that contains all files of the project visible to you.\nConsider the contents of ALL files in the project.\n\n${JSON.stringify(nodeBasePrompt)}\n\nHere is a list of files that exist on the file system but are not being shown to you:\n\n  - .gitignore\n  - package-lock.json\n`,
        ],
        uiPrompts: [nodeBasePrompt],
      });
    } else {
      res
        .status(403)
        .json({ message: "Invalid response, expected 'node' or 'react'" });
    }
  } catch (error) {
    console.error(
      "Error generating content:",
      error.response?.data || error.message || error
    );
    res.status(500).json({ message: "Error generating content" });
  }
});


/*app.post("/chat", async (req, res) => {
  const messages = req.body.messages;
  const API_KEY = process.env.API_KEY;

  console.log(messages, "messages");

  if (!API_KEY) {
    console.error("API_KEY is missing. Please check your .env file.");
    return res.status(500).json({ message: "API_KEY is missing." });
  }

  // if (!messages || !Array.isArray(messages)) {
  //   return res.status(400).json({ message: "Invalid or missing 'messages' in request body" });
  // }

  const genAI = new GoogleGenerativeAI(API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  const systemPrompt =getSystemPrompt;

  try {
    const result = await model.generateContent({
      contents: [
        {
          parts: [
            { text: systemPrompt },
            ...messages.map((msg) => ({ text: msg.content })),
          ],
        },
      ],
      generationConfig: {
        candidateCount: 1,
        maxOutputTokens: 8000,
        temperature: 0.7,
        topP: 0.8,
        topK: 50,
      },
    });

    console.log(result);

    const responseText =
      result.contents[0].parts[result.contents[0].parts.length - 1].text.trim();

    res.json({ response: responseText });
  } catch (error) {
    console.error("Error generating content:", error);
    res.status(500).json({ message: "Error generating content" });
  }
});
*/


/*app.post("/chat", async (req, res) => {
  const messages = req.body.messages;
  const API_KEY = process.env.API_KEY;

  if (!API_KEY) {
    console.error("API_KEY is missing. Please check your .env file.");
    return res.status(500).json({ message: "API_KEY is missing." });
  }

  const genAI = new GoogleGenerativeAI(API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  const systemPrompt = getSystemPrompt; // Replace with your actual system prompt

  try {
    // Build the `contents` array for the API call
    const contents = [
      {
        parts: [
          { text: systemPrompt },
          { text: messages.map((msg) => msg.contents).join("\n\n") }, // Combine all message contents
        ],
      },
    ];

    const result = await model.generateContent({
      contents: contents,
      generationConfig: {
        candidateCount: 1,
        maxOutputTokens: 8000,
        temperature: 0.7,
        topP: 0.8,
        topK: 50,
      },
    });

    console.log(result);

    // Extract the last part of the response
    const responseText =
      result.contents[0].parts[result.contents[0].parts.length - 1].text.trim();

    res.json({ response: responseText });
  } catch (error) {
    console.error("Error generating content:", error);

    // Detailed error response for debugging
    const errorMessage =
      error.response?.data?.message || error.message || "Unknown error occurred.";
    res.status(500).json({ message: "Error generating content", error: errorMessage });
  }
});
*/


/*app.post("/chat", async (req, res) => {
//  const messages = req.body.messages;  // Expecting a JSON object with message(s)
  const API_KEY = process.env.API_KEY;

  if (!API_KEY) {
    console.error("API_KEY is missing. Please check your .env file.");
    return res.status(500).json({ message: "API_KEY is missing." });
  }

  const client = new GoogleGenerativeAI({
    apiKey: API_KEY
  });

  try {
    const { messages } = req.body;

    if (!messages || typeof messages !== 'object') {
      return res.status(400).json({ error: "Messages should be a valid JSON object." });
    }

    // Prepare the request body for Gemini API
    const requestBody = {
      model: 'gemini-1.5-flash',
      messages: [
        { role: 'system', content: getSystemPrompt() },
        { role: 'user', content: messages.content },
      ],
      maxOutputTokens: 8000,
      temperature: 0.7,
      candidateCount: 1,
    };

    const response = await client.getGenerativeModel(requestBody);
    console.log(response, "response");
    // Extract and return the generated content
    if (response && response.candidates && response.candidates.length > 0) {
      const responseText = response.candidates[0].output || "No response generated.";
      return res.json({ response: responseText });
    } else {
      throw new Error("Invalid response from Gemini API.");
    }
  } catch (error) {
    console.error("Error generating content:", error.message);
    res.status(500).json({ error: "Error generating content", details: error.message });
  }
});*/


/*app.post("/chat", async (req, res) => {
  const { messages } = req.body;
  const API_KEY = process.env.API_KEY;

  console.log("messages", messages);

  if (!API_KEY) {
    console.error("API_KEY is missing. Please check your .env file.");
    return res.status(500).json({ error: "API_KEY is missing." });
  }

  try {
    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
    });

    // Construct the system prompt
    const systemPrompt = getSystemPrompt();
    console.log("hello")
    // Generate content based on the user messages
    const result = await model.generateContent( 
      {
        // prompt: [
        //   { role: "system", content: systemPrompt },
        //   { role: "user", content: messages.content },
        // ],
        content: messages,
        maxOutputTokens: 8000,
        temperature: 0.7,
      }
    );

    console.log("Full result object:", result);

   // Extract candidates
   const candidates = result?.response?.candidates;
    console.log("hello3");
    
    if (!candidates || candidates.length === 0) {
      throw new Error("No content generated by the API.");
    }
    console.log("hello2");
    // Extract the content from the first candidate
    const responseText = candidates;
    if (!responseText) {
      throw new Error("No valid content in the response.");
    }

    console.log("Generated Response:", responseText);

    // Send the response back to the client
    res.json({ response: responseText });
  } catch (error) {
    console.error(
      "Error generating content:",
      error.response?.data || error.message || error
    );
    res.status(500).json({ error: "Error generating content", details: error.message });
  }
});
*/


app.post("/chat", async (req, res) => {
  const { messages } = req.body; // Assuming `messages` is passed in the body as JSON.
  const API_KEY = process.env.API_KEY;

  if (!API_KEY) {
    console.error("API_KEY is missing. Please check your .env file.");
    return res.status(500).json({ error: "API_KEY is missing." });
  }

  try {
    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
    });

     // Convert JSON to string for inclusion in the prompt
     const jsonString = JSON.stringify(messages, null, 2);

 
     // Call the API
     const result = await model.generateContent(
       `System prompt:\n${getSystemPrompt}\n\nUser messages:\n${jsonString}`,

      {
        temperature: 0.7,
        maxOutputTokens: 8000,
        
    });
    // Debugging: Log the result for inspection
    console.log("Full result object:", result);

    // Extracting the response
    const candidates = result?.response?.candidates;
    if (!candidates || candidates.length === 0) {
      throw new Error("No content generated by the API.");
    }
    console.log("Full result can:", candidates);

    const candidateContent = candidates[0]?.content;

    if (!candidateContent || !candidateContent.parts || candidateContent.parts.length === 0) {
      throw new Error("No valid output in the response.");
    }

     const responseText = candidateContent.parts.map(part => part.text).join(" ").trim();
    if (!responseText) {
      throw new Error("No valid output in the response.");
    }

    res.json({ response: responseText });
  } catch (error) {
    console.error(
      "Error generating content:",
      error.response?.data || error.message || error
    );
    res.status(500).json({ error: "Error generating content", details: error.message });
  }
});



// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
