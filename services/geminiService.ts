
import { GoogleGenAI, Type } from '@google/genai';

if (!process.env.API_KEY) {
  // This is a fallback for development. In a real environment, the key should be set.
  console.warn("API_KEY environment variable not set. Using a placeholder. Gemini features will fail.");
  process.env.API_KEY = "YOUR_API_KEY_HERE";
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const evaluationSchema = {
  type: Type.OBJECT,
  properties: {
    isCorrect: {
      type: Type.BOOLEAN,
      description: "Whether the user's SQL query is correct."
    },
    explanation: {
      type: Type.STRING,
      description: "A brief, friendly explanation for the user about why their query is correct or incorrect. Provide a correct query if theirs is wrong."
    },
  },
  required: ['isCorrect', 'explanation'],
};

const feedbackSchema = {
    type: Type.OBJECT,
    properties: {
        feedback: {
            type: Type.STRING,
            description: "A brief, friendly, and constructive evaluation of the user's explanation. Compare it to the model answer and highlight their understanding."
        }
    },
    required: ['feedback'],
}

export const evaluateSqlQuery = async (query: string, task: string, schema: string): Promise<{ isCorrect: boolean; explanation: string }> => {
  try {
    const prompt = `${schema}\n\nTask: ${task}\n\nUser's SQL Query: \`${query}\`\n\nEvaluate the user's query. Is it functionally correct for the given task? Respond ONLY with the requested JSON object.`;
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: evaluationSchema,
        temperature: 0.2,
      },
    });

    const jsonText = response.text.trim();
    const result = JSON.parse(jsonText);
    return {
        isCorrect: result.isCorrect,
        explanation: result.explanation
    };

  } catch (error) {
    console.error("Error evaluating SQL query with Gemini:", error);
    return {
      isCorrect: false,
      explanation: "Sorry, I couldn't evaluate the query. The API might be unavailable or the API key is missing.",
    };
  }
};

export const evaluateExplanation = async (userExplanation: string, modelAnswer: string, question: string): Promise<{ feedback: string }> => {
    try {
        const prompt = `Question: "${question}"\n\nModel Answer: "${modelAnswer}"\n\nUser's Answer: "${userExplanation}"\n\nBriefly evaluate the user's understanding based on their answer and provide one or two sentences of friendly, constructive feedback. Respond ONLY with the requested JSON object.`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: feedbackSchema,
                temperature: 0.5,
            },
        });

        const jsonText = response.text.trim();
        const result = JSON.parse(jsonText);
        return {
            feedback: result.feedback
        };

    } catch (error) {
        console.error("Error evaluating explanation with Gemini:", error);
        return {
            feedback: "Sorry, I couldn't provide feedback at this time. The API might be unavailable or the API key is missing.",
        };
    }
}
