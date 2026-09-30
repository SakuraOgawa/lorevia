import type { VercelRequest, VercelResponse } from "@vercel/node";
import OpenAI from "openai";
import { createClient } from "@supabase/supabase-js"


const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

export default async function handler(
  request: VercelRequest,
  response: VercelResponse
) {

  // POST以外は禁止.
  if (request.method !== "POST") {
    return response.status(405).json({
      error: "Method not allowed",
    });
  }

  try {
    /* supabase認証 */
    const authHeader = request.headers.authorization;

    if(!authHeader) {
      return response.status(401).json({
        error: "Unauthorized",
      });
    }

    const token = authHeader.replace("Bearer ", "");

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return response.status(401).json({
        error: "Unauthorized",
      });
    }

    /* openAI */
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