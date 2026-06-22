export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const {
    type, yourName, yourRole, yourCompany,
    prospectName, prospectRole, prospectCompany,
    goal, tone, context,
  } = req.body;

  if (!yourName || !prospectName || !goal) {
    return res.status(400).json({ error: "Missing required fields." });
  }

  const isEmail = type === "email";

  const systemPrompt = isEmail
    ? `You are an expert cold email copywriter who writes high-converting, personalized cold emails. 
Your emails are concise (under 150 words), human, and never sound salesy or templated.
Always write in the requested tone. Output ONLY the email — subject line first labeled "Subject:", then the body. No preamble.`
    : `You are an expert LinkedIn outreach specialist who writes short, genuine connection messages.
LinkedIn DMs must be under 300 characters ideally, maximum 500 characters. They feel personal, not like a pitch.
Output ONLY the DM message. No preamble, no labels.`;

  const userPrompt = isEmail
    ? `Write a cold email with these details:
- Sender: ${yourName}${yourRole ? `, ${yourRole}` : ""}${yourCompany ? ` at ${yourCompany}` : ""}
- Prospect: ${prospectName}${prospectRole ? `, ${prospectRole}` : ""}${prospectCompany ? ` at ${prospectCompany}` : ""}
- Goal: ${goal}
- Tone: ${tone || "professional yet friendly"}
${context ? `- Extra context: ${context}` : ""}

Write a compelling cold email that feels personal and gets a reply.`
    : `Write a LinkedIn connection message / DM with these details:
- Sender: ${yourName}${yourRole ? `, ${yourRole}` : ""}${yourCompany ? ` at ${yourCompany}` : ""}
- Prospect: ${prospectName}${prospectRole ? `, ${prospectRole}` : ""}${prospectCompany ? ` at ${prospectCompany}` : ""}
- Goal: ${goal}
- Tone: ${tone || "casual and genuine"}
${context ? `- Extra context: ${context}` : ""}

Write a short LinkedIn DM that doesn't sound like a pitch. Keep it under 400 characters.`;

  const fullPrompt = `${systemPrompt}\n\n${userPrompt}`;
  try {
   const response = await fetch(
  "https://openrouter.ai/api/v1/chat/completions",
  {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "openrouter/free",
      messages: [
        {
          role: "user",
          content: fullPrompt
        }
      ],
      temperature: 0.8,
      max_tokens: 800
    })
  }
);

    if (!response.ok) {
      const err = await response.json();
      return res.status(500).json({ error: err.error?.message || "API error" });
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
    return res.status(200).json({ result: text });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to generate content." });
  }
}
