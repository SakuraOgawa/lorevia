import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(request: Request) {
  if (request.method !== "POST") {
    return new Response(
      JSON.stringify({ error: "Method not allowed " }),
      {
        status: 405,
        headers: {
          "Content-Type": "application/json",
        }
      }
    );
  }
  const body = await request.json();

  const response = await openai.responses.create({
    model: "gpt-5-mini",
    input: body.messages,
    max_output_tokens: 500,

  });

  return new Response(
    JSON.stringify({
      reply: response.output_text,
    }),
    {
      headers: {
        "Content-Type": "application/json"
      }
    }
  )
}