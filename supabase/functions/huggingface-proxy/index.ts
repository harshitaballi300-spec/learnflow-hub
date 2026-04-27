const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

const HF_API_URL = 'https://router.huggingface.co/hf-inference/models';

type HFCallResult = {
  ok: boolean;
  status: number;
  data: unknown;
  model: string;
  url: string;
};

const jsonResponse = (payload: unknown, status = 200) =>
  new Response(JSON.stringify(payload), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });

const extractErrorMessage = (data: unknown) => {
  if (typeof data === 'string' && data.trim()) return data;
  if (typeof data === 'object' && data !== null) {
    const record = data as Record<string, unknown>;
    if (typeof record.error === 'string' && record.error.trim()) return record.error;
    if (typeof record.message === 'string' && record.message.trim()) return record.message;
  }
  return 'Hugging Face request failed';
};

const toGeneratedText = (data: unknown) => {
  if (Array.isArray(data) && typeof data[0] === 'object' && data[0] !== null) {
    const first = data[0] as Record<string, unknown>;
    if (typeof first.generated_text === 'string') return first.generated_text;
    if (typeof first.summary_text === 'string') return first.summary_text;
  }

  if (typeof data === 'string') return data;
  return null;
};

async function callHF(model: string, payload: Record<string, unknown>, apiKey: string): Promise<HFCallResult> {
  const normalizedModel = model.trim();
  const url = `${HF_API_URL}/${normalizedModel}`;

  console.log(`[huggingface-proxy] model=${normalizedModel}`);
  console.log(`[huggingface-proxy] url=${url}`);

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const raw = await response.text();
  let parsed: unknown = raw;

  try {
    parsed = raw ? JSON.parse(raw) : null;
  } catch {
    parsed = raw;
  }

  return {
    ok: response.ok,
    status: response.status,
    data: parsed,
    model: normalizedModel,
    url,
  };
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const apiKey = Deno.env.get('HUGGINGFACE_API_KEY');
  if (!apiKey) {
    return jsonResponse({ error: 'HUGGINGFACE_API_KEY not configured' }, 500);
  }

  try {
    const { model, inputs, parameters } = await req.json();

    if (typeof model !== 'string' || !model.trim() || inputs === undefined) {
      return jsonResponse({ error: "Missing or invalid 'model' or 'inputs'" }, 400);
    }

    const body: Record<string, unknown> = { inputs };
    if (parameters && typeof parameters === 'object') {
      body.parameters = parameters;
    }

    let result = await callHF(model, body, apiKey);

    if (!result.ok) {
      const message = extractErrorMessage(result.data);
      console.error(`[huggingface-proxy] upstream error status=${result.status} model=${result.model} message=${message}`);
      return jsonResponse(
        {
          error: message,
          status: result.status,
          model: result.model,
          url: result.url,
        },
        result.status,
      );
    }

    return jsonResponse(result.data, result.status);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown server error';
    console.error(`[huggingface-proxy] runtime error: ${message}`);
    return jsonResponse({ error: message }, 500);
  }
});
