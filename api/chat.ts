import type { VercelRequest, VercelResponse } from "@vercel/node";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(
  request: VercelRequest,
  response: VercelResponse
) {
  if (request.method !== "POST") {
    return response.status(405).json({
      error: "Method not allowed",
    });
  }

  try {
    const body = request.body;

    const openaiResponse = await openai.responses.create({
      model: "gpt-5-mini",
      input: body.messages,
      max_output_tokens: 500,
    });

    return response.status(200).json({
      reply: openaiResponse.output_text,
    });

  } catch (error) {
    console.error("OpenAI API error:", error);

    return response.status(500).json({
      error: "OpenAI API request failed",
    });
  }
}