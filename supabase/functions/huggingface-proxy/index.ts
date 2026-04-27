const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

const AI_GATEWAY_URL = 'https://ai.gateway.lovable.dev/v1/chat/completions';
const DEFAULT_MODEL = 'google/gemini-2.5-flash';

const jsonResponse = (payload: unknown, status = 200) =>
  new Response(JSON.stringify(payload), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });

type Task = 'text' | 'qa' | 'sentiment';

function detectTask(model: string, inputs: unknown): Task {
  if (inputs && typeof inputs === 'object' && 'question' in (inputs as object)) return 'qa';
  if (/sentiment|sst|distilbert/i.test(model)) return 'sentiment';
  return 'text';
}

function buildMessages(task: Task, inputs: unknown) {
  if (task === 'qa') {
    const { question, context } = inputs as { question: string; context?: string };
    return [
      { role: 'system', content: 'You are a helpful Q&A assistant. Answer the user question concisely using ONLY the provided context. If the answer is not in the context, say so briefly.' },
      { role: 'user', content: `Context:\n${context ?? ''}\n\nQuestion: ${question}` },
    ];
  }

  if (task === 'sentiment') {
    return [
      { role: 'system', content: 'You are a sentiment classifier. Respond ONLY with a JSON object: {"label":"POSITIVE"|"NEGATIVE","score":<0-1 confidence as number>}. No prose, no markdown.' },
      { role: 'user', content: `Classify the sentiment of this text:\n"""${String(inputs)}"""` },
    ];
  }

  return [
    { role: 'system', content: 'You are a creative writing assistant. Continue the user prompt naturally and engagingly.' },
    { role: 'user', content: String(inputs) },
  ];
}

function shapeResponse(task: Task, content: string, originalInput: unknown) {
  if (task === 'qa') {
    return { answer: content.trim(), score: 1 };
  }

  if (task === 'sentiment') {
    try {
      const match = content.match(/\{[\s\S]*\}/);
      const parsed = match ? JSON.parse(match[0]) : null;
      const labelRaw = String(parsed?.label ?? '').toUpperCase();
      const label = labelRaw.includes('POS') ? 'POSITIVE' : labelRaw.includes('NEG') ? 'NEGATIVE' : 'NEUTRAL';
      const score = typeof parsed?.score === 'number' ? parsed.score : 0.9;
      return [[{ label, score }]];
    } catch {
      return [[{ label: 'NEUTRAL', score: 0.5 }]];
    }
  }

  // text generation — return HF-compatible shape
  return [{ generated_text: content.trim() }];
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const apiKey = Deno.env.get('LOVABLE_API_KEY');
  if (!apiKey) {
    return jsonResponse({ error: 'LOVABLE_API_KEY not configured' }, 500);
  }

  try {
    const { model, inputs } = await req.json();

    if (inputs === undefined || inputs === null) {
      return jsonResponse({ error: "Missing 'inputs'" }, 400);
    }

    const task = detectTask(typeof model === 'string' ? model : '', inputs);
    const messages = buildMessages(task, inputs);

    console.log(`[ai-proxy] task=${task} model=${DEFAULT_MODEL}`);

    const response = await fetch(AI_GATEWAY_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: DEFAULT_MODEL,
        messages,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error(`[ai-proxy] upstream error ${response.status}: ${errText}`);
      if (response.status === 429) {
        return jsonResponse({ error: 'Rate limit reached. Please try again shortly.' }, 429);
      }
      if (response.status === 402) {
        return jsonResponse({ error: 'AI credits exhausted. Please add credits to your Lovable workspace.' }, 402);
      }
      return jsonResponse({ error: 'AI request failed', details: errText }, response.status);
    }

    const data = await response.json();
    const content = data?.choices?.[0]?.message?.content ?? '';
    return jsonResponse(shapeResponse(task, content, inputs));
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown server error';
    console.error(`[ai-proxy] runtime error: ${message}`);
    return jsonResponse({ error: message }, 500);
  }
});
