import fs from "fs";
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { message } = req.body;

    // 📂 Scenario laden
    const scenario = JSON.parse(
      fs.readFileSync("./scenarios/checkin_barcelona_en.json", "utf-8")
    );

    // 📂 Prompt laden
    const prompt = fs.readFileSync(
      "./prompts/checkin_prompt.txt",
      "utf-8"
    );

    // 🤖 AI call
    const response = await client.chat.completions.create({
      model: "gpt-4.1",
      messages: [
        { role: "system", content: prompt },
        { role: "user", content: message }
      ]
    });

    res.status(200).json({
      reply: response.choices[0].message.content
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
}
