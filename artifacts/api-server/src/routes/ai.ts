import { Router } from "express";
import { db } from "@workspace/db";
import { projectsTable, servicesTable, siteContentTable } from "@workspace/db/schema";
import { eq } from "drizzle-orm";
import { Groq } from "groq-sdk";

const router = Router();

// Initialize Groq client
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

router.post("/chat", async (req, res) => {
  try {
    const { message, messages: history = [] } = req.body;

    if (!message) {
      res.status(400).json({ error: "Message is required" });
      return;
    }

    // 1. Fetch DB Context
    const projects = await db.select().from(projectsTable);
    const services = await db.select().from(servicesTable);
    const aiKnowledgeRows = await db
      .select()
      .from(siteContentTable)
      .where(eq(siteContentTable.key, "aiKnowledgeBase"))
      .limit(1);

    const aiKnowledge = aiKnowledgeRows[0]?.value || "";

    const systemPrompt = `You are "ZMC AI", the official virtual assistant for Zain Manzoor & Co. Construction and Engineering PVT LTD (ZMCO). You are professional, concise, and helpful.

YOUR KNOWLEDGE BASE:
COMPANY: Pakistan's premier construction and engineering firm, founded in 2013 by Mr. Muneer Ahmed Khoso. Over 12 years of industry excellence. 11 major landmark projects. Specializes in civil engineering, structural design, project management, and MEP services.
LOCATION: Operates nationwide across Pakistan (Sindh, Punjab, Islamabad, Balochistan).
CONTACT: Phone: 0315 2185221, Email: zmco2025@gmail.com

PROJECTS PORTFOLIO:
${projects.map(p => `- ${p.title} (${p.location}): ${p.category} project. Status: ${p.status}. ${p.description}`).join("\n")}

SERVICES OFFERED:
${services.map(s => `- ${s.title}: ${s.description}`).join("\n")}

ADDITIONAL ADMIN KNOWLEDGE:
${aiKnowledge ? aiKnowledge : "No additional knowledge provided."}

RULES:
- Answer ONLY based on the knowledge provided above.
- If asked about pricing or exact timeframes not in the knowledge base, politely tell them to contact the team for an estimate.
- Use simple markdown (bolding, bullets) for readability.
- Be concise! Do not dump all the info at once. Directly answer the user's question.`;

    // 3. Format messages for Groq
    const chatMessages = [
      { role: "system", content: systemPrompt },
      ...history.map((m: any) => ({
        role: m.role === "bot" ? "assistant" : "user",
        content: m.content
      })),
      { role: "user", content: message }
    ];

    // 4. Set Headers for SSE (Server-Sent Events) streaming
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    // 5. Call Groq
    const stream = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile", // Or llama3-8b-8192
      messages: chatMessages as any,
      stream: true,
      max_tokens: 1024,
      temperature: 0.3,
    });

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content || "";
      if (content) {
        // We write the JSON string matching what the frontend expects
        res.write(`data: ${JSON.stringify({ content })}\n\n`);
      }
    }

    res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
    res.end();
  } catch (error) {
    console.error("[AI Chat Error]", error);
    res.write(`data: ${JSON.stringify({ error: "Failed to process message" })}\n\n`);
    res.end();
  }
});

export default router;
