const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

const AI_GATEWAY_URL = 'https://ai.gateway.lovable.dev/v1/chat/completions';
const MODEL = 'google/gemini-2.5-flash';

const SYSTEM_PROMPT = `You are LearnHub AI, the friendly support assistant for the LearnHub online learning platform.

About LearnHub:
- An online LMS offering courses across Programming, Web Development, Data Science, Machine Learning, and more.
- Courses include video lessons, quizzes, and certificates of completion.
- Pricing: ₹449–₹899 per course with frequent discounts up to 85% off.
- Features: lifetime access, 30-day money-back guarantee, expert instructors, certificates.

Your role:
- Help users discover courses, recommend learning paths, explain features, answer pricing/account/learning questions.
- Be warm, concise, and use light markdown (**bold**, bullet lists, emojis sparingly).
- If unsure about a specific course detail, give general guidance and suggest they browse the Courses page.
- Never refuse general learning questions — answer helpfully.`;

const json = (payload: unknown, status = 200) =>
  new Response(JSON.stringify(payload), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });

  const apiKey = Deno.env.get('LOVABLE_API_KEY');
  if (!apiKey) return json({ error: 'LOVABLE_API_KEY not configured' }, 500);

  try {
    const { messages } = await req.json();
    if (!Array.isArray(messages)) return json({ error: "Missing 'messages' array" }, 400);

    const response = await fetch(AI_GATEWAY_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [{ role: 'system', content: SYSTEM_PROMPT }, ...messages],
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error(`[chatbot] upstream ${response.status}: ${errText}`);
      if (response.status === 429) return json({ error: 'Too many requests. Please try again shortly.' }, 429);
      if (response.status === 402) return json({ error: 'AI credits exhausted. Please add credits to your Lovable workspace.' }, 402);
      return json({ error: 'AI request failed' }, response.status);
    }

    const data = await response.json();
    const content = data?.choices?.[0]?.message?.content ?? '';
    return json({ reply: content.trim() });
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Unknown error';
    console.error(`[chatbot] runtime: ${msg}`);
    return json({ error: msg }, 500);
  }
});
