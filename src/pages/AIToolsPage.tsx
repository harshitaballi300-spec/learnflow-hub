import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Sparkles, MessageSquare, BarChart3, Send, Loader2, Trash2,
  Bot, User as UserIcon, Copy, CheckCircle2,
} from 'lucide-react';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

/* ─── Types ─── */
interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface HistoryEntry {
  id: string;
  type: 'text' | 'qa' | 'sentiment';
  input: string;
  output: string;
  timestamp: string;
}

/* ─── Hugging Face API helper ─── */
const HF_STORAGE_KEY = 'lms-hf-api-key';
const HISTORY_KEY = 'lms-ai-history';

const getApiKey = () => localStorage.getItem(HF_STORAGE_KEY) || '';

async function hfInference(model: string, body: object) {
  const key = getApiKey();
  if (!key) throw new Error('Please set your Hugging Face API key in Settings.');

  const res = await fetch(`https://api-inference.huggingface.co/models/${model}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.text();
    if (res.status === 503) throw new Error('Model is loading, please try again in a few seconds.');
    if (res.status === 401) throw new Error('Invalid API key. Check your Hugging Face token.');
    throw new Error(`API error (${res.status}): ${err}`);
  }
  return res.json();
}

function saveHistory(entry: Omit<HistoryEntry, 'id' | 'timestamp'>) {
  const stored = JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]') as HistoryEntry[];
  stored.unshift({ ...entry, id: crypto.randomUUID(), timestamp: new Date().toISOString() });
  localStorage.setItem(HISTORY_KEY, JSON.stringify(stored.slice(0, 50)));
}

/* ─── Sub-components ─── */

const TextGenerationTab = () => {
  const [prompt, setPrompt] = useState('');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const generate = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setOutput('');
    try {
      const data = await hfInference('gpt2', { inputs: prompt, parameters: { max_new_tokens: 200 } });
      const text = data?.[0]?.generated_text || 'No output generated.';
      setOutput(text);
      saveHistory({ type: 'text', input: prompt, output: text });
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  };

  const copy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-5">
      <div>
        <Label className="mb-1.5 block font-medium">Enter your prompt</Label>
        <Textarea
          placeholder="e.g. Once upon a time in a land far away..."
          value={prompt}
          onChange={e => setPrompt(e.target.value)}
          rows={4}
          className="resize-none"
        />
      </div>
      <Button onClick={generate} disabled={loading || !prompt.trim()} className="gap-2">
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
        {loading ? 'Generating…' : 'Generate Text'}
      </Button>
      {output && (
        <div className="relative rounded-xl border border-border bg-muted/40 p-5">
          <div className="mb-2 flex items-center justify-between">
            <Badge variant="secondary" className="gap-1"><Sparkles className="h-3 w-3" />AI Output</Badge>
            <Button variant="ghost" size="sm" onClick={copy} className="gap-1.5 text-xs">
              {copied ? <CheckCircle2 className="h-3.5 w-3.5 text-green-500" /> : <Copy className="h-3.5 w-3.5" />}
              {copied ? 'Copied' : 'Copy'}
            </Button>
          </div>
          <p className="whitespace-pre-wrap text-sm leading-relaxed">{output}</p>
        </div>
      )}
    </div>
  );
};

const QAChatbotTab = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  const defaultContext = `LearnHub is an online learning management system offering courses in Python, React, Machine Learning, Data Science, Web Development, and more. Students can enroll in courses, watch video lessons, complete quizzes, earn certificates, and track progress. The platform features AI-powered tools for text generation, question answering, and sentiment analysis. Courses are taught by expert instructors and include hands-on projects.`;

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const ask = async () => {
    if (!input.trim()) return;
    const userMsg: ChatMessage = { id: crypto.randomUUID(), role: 'user', content: input, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);
    try {
      const data = await hfInference('deepset/roberta-base-squad2', {
        inputs: { question: input, context: defaultContext },
      });
      const answer = data?.answer || "I couldn't find an answer. Try rephrasing your question.";
      const botMsg: ChatMessage = { id: crypto.randomUUID(), role: 'assistant', content: answer, timestamp: new Date() };
      setMessages(prev => [...prev, botMsg]);
      saveHistory({ type: 'qa', input, output: answer });
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col">
      <div className="mb-4 h-[350px] overflow-y-auto rounded-xl border border-border bg-muted/20 p-4 space-y-3">
        {messages.length === 0 && (
          <div className="flex h-full flex-col items-center justify-center text-center text-muted-foreground">
            <Bot className="mb-3 h-10 w-10" />
            <p className="font-medium">Ask me anything about LearnHub!</p>
            <p className="text-xs mt-1">I can answer questions about courses, features, and more.</p>
          </div>
        )}
        {messages.map(m => (
          <div key={m.id} className={`flex gap-2.5 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {m.role === 'assistant' && (
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10">
                <Bot className="h-4 w-4 text-primary" />
              </div>
            )}
            <div className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm ${
              m.role === 'user'
                ? 'bg-primary text-primary-foreground rounded-br-md'
                : 'bg-card border border-border rounded-bl-md'
            }`}>
              {m.content}
            </div>
            {m.role === 'user' && (
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-secondary">
                <UserIcon className="h-4 w-4 text-secondary-foreground" />
              </div>
            )}
          </div>
        ))}
        {loading && (
          <div className="flex gap-2.5">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10">
              <Bot className="h-4 w-4 text-primary" />
            </div>
            <div className="rounded-2xl rounded-bl-md bg-card border border-border px-4 py-2.5">
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>
      <form onSubmit={e => { e.preventDefault(); ask(); }} className="flex gap-2">
        <Input
          placeholder="Type your question…"
          value={input}
          onChange={e => setInput(e.target.value)}
          disabled={loading}
          className="flex-1"
        />
        <Button type="submit" disabled={loading || !input.trim()} size="icon">
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );
};

const SentimentTab = () => {
  const [text, setText] = useState('');
  const [result, setResult] = useState<{ label: string; score: number }[] | null>(null);
  const [loading, setLoading] = useState(false);

  const analyze = async () => {
    if (!text.trim()) return;
    setLoading(true);
    setResult(null);
    try {
      const data = await hfInference('distilbert-base-uncased-finetuned-sst-2-english', { inputs: text });
      const labels = data?.[0] || data;
      setResult(Array.isArray(labels) ? labels : [labels]);
      const top = Array.isArray(labels) ? labels[0] : labels;
      saveHistory({ type: 'sentiment', input: text, output: `${top.label} (${(top.score * 100).toFixed(1)}%)` });
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  };

  const sentimentColor = (label: string) =>
    label === 'POSITIVE' ? 'text-green-600 bg-green-500/10' : 'text-red-600 bg-red-500/10';

  return (
    <div className="space-y-5">
      <div>
        <Label className="mb-1.5 block font-medium">Enter text to analyze</Label>
        <Textarea
          placeholder="e.g. I really loved this course! The instructor was amazing."
          value={text}
          onChange={e => setText(e.target.value)}
          rows={4}
          className="resize-none"
        />
      </div>
      <Button onClick={analyze} disabled={loading || !text.trim()} className="gap-2">
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <BarChart3 className="h-4 w-4" />}
        {loading ? 'Analyzing…' : 'Analyze Sentiment'}
      </Button>
      {result && (
        <div className="rounded-xl border border-border bg-muted/40 p-5 space-y-3">
          <Badge variant="secondary" className="gap-1"><BarChart3 className="h-3 w-3" />Sentiment Result</Badge>
          <div className="flex flex-wrap gap-3">
            {result.map((r, i) => (
              <div key={i} className={`rounded-lg px-4 py-3 font-medium ${sentimentColor(r.label)}`}>
                <span className="text-lg font-bold">{r.label}</span>
                <span className="ml-2 text-sm opacity-80">{(r.score * 100).toFixed(1)}%</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

/* ─── Main Page ─── */
const AIToolsPage = () => {
  const { user } = useAuth();
  const [apiKey, setApiKey] = useState(getApiKey());
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [history, setHistory] = useState<HistoryEntry[]>([]);

  useEffect(() => {
    setHistory(JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]'));
  }, []);

  if (!user) return <Navigate to="/login" replace />;

  const hasKey = !!getApiKey();

  const saveKey = () => {
    localStorage.setItem(HF_STORAGE_KEY, apiKey);
    toast.success('API key saved!');
    setSettingsOpen(false);
  };

  const clearHistory = () => {
    localStorage.removeItem(HISTORY_KEY);
    setHistory([]);
    toast.success('History cleared');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-sidebar text-sidebar-foreground">
        <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="font-display text-2xl font-bold sm:text-3xl flex items-center gap-2">
                <Sparkles className="h-7 w-7 text-primary" />AI Tools
              </h1>
              <p className="mt-1 text-sidebar-foreground/60">Explore AI-powered features powered by Hugging Face</p>
            </div>
            <div className="flex gap-2">
              <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-1.5 border-sidebar-border text-sidebar-foreground hover:bg-sidebar-accent">
                    <Settings2 className="h-4 w-4" />
                    {hasKey ? 'API Key Set' : 'Set API Key'}
                    {!hasKey && <AlertCircle className="h-3.5 w-3.5 text-destructive" />}
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Hugging Face API Key</DialogTitle>
                    <DialogDescription>
                      Enter your Hugging Face API token. Get one free at{' '}
                      <a href="https://huggingface.co/settings/tokens" target="_blank" rel="noreferrer" className="text-primary underline">
                        huggingface.co/settings/tokens
                      </a>
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 pt-2">
                    <Input
                      type="password"
                      placeholder="hf_xxxxxxxxxxxx"
                      value={apiKey}
                      onChange={e => setApiKey(e.target.value)}
                    />
                    <Button onClick={saveKey} className="w-full">Save Key</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        {!hasKey && (
          <div className="mb-6 flex items-center gap-3 rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm">
            <AlertCircle className="h-5 w-5 shrink-0 text-destructive" />
            <p>
              You need to set your Hugging Face API key before using AI tools.{' '}
              <button onClick={() => setSettingsOpen(true)} className="font-medium text-primary underline">Set it now</button>
            </p>
          </div>
        )}

        <Tabs defaultValue="text" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="text" className="gap-1.5">
              <Sparkles className="h-4 w-4" />Text Gen
            </TabsTrigger>
            <TabsTrigger value="qa" className="gap-1.5">
              <MessageSquare className="h-4 w-4" />Q&A Chat
            </TabsTrigger>
            <TabsTrigger value="sentiment" className="gap-1.5">
              <BarChart3 className="h-4 w-4" />Sentiment
            </TabsTrigger>
          </TabsList>

          <TabsContent value="text">
            <div className="rounded-xl border border-border bg-card p-6">
              <h2 className="mb-1 font-display text-lg font-bold flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />Text Generation
              </h2>
              <p className="mb-5 text-sm text-muted-foreground">Generate text using GPT-2. Enter a prompt and let AI continue writing.</p>
              <TextGenerationTab />
            </div>
          </TabsContent>

          <TabsContent value="qa">
            <div className="rounded-xl border border-border bg-card p-6">
              <h2 className="mb-1 font-display text-lg font-bold flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-primary" />AI Q&A Chatbot
              </h2>
              <p className="mb-5 text-sm text-muted-foreground">Ask questions about LearnHub and get AI-powered answers.</p>
              <QAChatbotTab />
            </div>
          </TabsContent>

          <TabsContent value="sentiment">
            <div className="rounded-xl border border-border bg-card p-6">
              <h2 className="mb-1 font-display text-lg font-bold flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-primary" />Sentiment Analysis
              </h2>
              <p className="mb-5 text-sm text-muted-foreground">Analyze the sentiment of any text — positive or negative.</p>
              <SentimentTab />
            </div>
          </TabsContent>
        </Tabs>

        {/* History */}
        {history.length > 0 && (
          <div className="mt-8">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="font-display font-bold text-lg">Recent Queries</h3>
              <Button variant="ghost" size="sm" onClick={clearHistory} className="gap-1.5 text-muted-foreground">
                <Trash2 className="h-3.5 w-3.5" />Clear
              </Button>
            </div>
            <div className="space-y-2">
              {history.slice(0, 10).map(h => (
                <div key={h.id} className="flex items-start gap-3 rounded-lg border border-border bg-card p-3 text-sm">
                  <Badge variant="outline" className="shrink-0 capitalize">{h.type}</Badge>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium">{h.input}</p>
                    <p className="truncate text-muted-foreground">{h.output}</p>
                  </div>
                  <span className="shrink-0 text-xs text-muted-foreground">
                    {new Date(h.timestamp).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIToolsPage;
