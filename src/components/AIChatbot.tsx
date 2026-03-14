import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { mockSubjects, mockInstructors } from '@/data/mockData';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const SUGGESTIONS = [
  'What courses do you offer?',
  'Recommend a beginner course',
  'Tell me about Python course',
  'Who are the instructors?',
];

function generateResponse(input: string): string {
  const lower = input.toLowerCase();

  if (lower.includes('hello') || lower.includes('hi') || lower.includes('hey')) {
    return "Hello! 👋 Welcome to LearnHub! I'm your AI learning assistant. I can help you find courses, recommend learning paths, and answer questions about our platform. What would you like to know?";
  }

  if (lower.includes('course') && (lower.includes('what') || lower.includes('list') || lower.includes('offer') || lower.includes('available'))) {
    const courseList = mockSubjects.map(s => `• **${s.title}** — ₹${s.price} (${s.rating}⭐)`).join('\n');
    return `We currently offer ${mockSubjects.length} courses:\n\n${courseList}\n\nWould you like details about any specific course?`;
  }

  if (lower.includes('python')) {
    const python = mockSubjects.find(s => s.id === 's1');
    if (python) {
      return `🐍 **${python.title}**\n\n${python.description}\n\n• **Rating:** ${python.rating}⭐ (${python.reviewCount.toLocaleString()} reviews)\n• **Duration:** ${python.totalDuration}\n• **Level:** ${python.level}\n• **Price:** ₹${python.price} ~~₹${python.originalPrice}~~\n• **Instructor:** ${python.instructor}\n\nThis is one of our bestselling courses! Would you like to enroll?`;
    }
  }

  if (lower.includes('react') || lower.includes('web dev')) {
    const react = mockSubjects.find(s => s.id === 's2');
    if (react) {
      return `⚛️ **${react.title}**\n\n${react.description}\n\n• **Rating:** ${react.rating}⭐\n• **Duration:** ${react.totalDuration}\n• **Price:** ₹${react.price}\n• **Instructor:** ${react.instructor}\n\nPerfect for aspiring web developers!`;
    }
  }

  if (lower.includes('machine learning') || lower.includes('ml') || lower.includes('ai course')) {
    const ml = mockSubjects.find(s => s.id === 's4');
    if (ml) {
      return `🤖 **${ml.title}**\n\n${ml.description}\n\n• **Rating:** ${ml.rating}⭐\n• **Duration:** ${ml.totalDuration}\n• **Price:** ₹${ml.price}\n\nGreat choice if you want to get into AI!`;
    }
  }

  if (lower.includes('instructor') || lower.includes('teacher') || lower.includes('mentor')) {
    const list = mockInstructors.map(i => `• **${i.name}** — ${i.expertise} (${i.rating}⭐, ${i.studentCount?.toLocaleString()} students)`).join('\n');
    return `Our expert instructors:\n\n${list}\n\nAll instructors are industry professionals with real-world experience!`;
  }

  if (lower.includes('beginner') || lower.includes('start') || lower.includes('new')) {
    const beginner = mockSubjects.filter(s => s.level === 'Beginner');
    const list = beginner.map(s => `• **${s.title}** — ₹${s.price}`).join('\n');
    return `Great! Here are our beginner-friendly courses:\n\n${list}\n\nI'd especially recommend the **Python Programming Masterclass** — it's our most popular beginner course with ${mockSubjects[0].reviewCount.toLocaleString()} reviews!`;
  }

  if (lower.includes('price') || lower.includes('cost') || lower.includes('free') || lower.includes('discount')) {
    return `Our courses range from **₹449 to ₹899**, with discounts of up to 85% off! 🎉\n\nWe also offer:\n• 30-day money-back guarantee\n• Lifetime access to all purchased courses\n• Certificate of completion\n\nCheck out our courses page for the latest deals!`;
  }

  if (lower.includes('certificate')) {
    return "Yes! 🎓 All our courses come with a **Certificate of Completion** that you can add to your LinkedIn profile or resume. Complete all the lessons and quizzes to earn yours!";
  }

  if (lower.includes('thank')) {
    return "You're welcome! 😊 Happy learning! Feel free to ask me anything else anytime.";
  }

  return `I'd be happy to help! Here are some things I can assist with:\n\n• 📚 **Browse courses** — Ask about specific topics\n• 🎯 **Get recommendations** — Tell me your skill level\n• 👨‍🏫 **Learn about instructors** — Know your teachers\n• 💰 **Pricing info** — Discounts and offers\n• 🎓 **Certificates** — Completion credentials\n\nWhat would you like to know?`;
}

const AIChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Hi there! 👋 I'm your LearnHub AI assistant. I can help you find the perfect course, answer questions, and guide your learning journey. How can I help you today?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (isOpen) inputRef.current?.focus();
  }, [isOpen]);

  const sendMessage = (text: string) => {
    if (!text.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const response = generateResponse(text);
      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, botMsg]);
      setIsTyping(false);
    }, 800 + Math.random() * 700);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  return (
    <>
      {/* Floating button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full gradient-primary shadow-lg hover:shadow-xl transition-all hover:scale-105"
          aria-label="Open AI Chat"
        >
          <MessageCircle className="h-6 w-6 text-primary-foreground" />
        </button>
      )}

      {/* Chat window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 flex h-[520px] w-[380px] flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between gradient-primary px-4 py-3">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-foreground/20">
                <Bot className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-primary-foreground">LearnHub AI</h3>
                <p className="text-[10px] text-primary-foreground/70">Always here to help</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="rounded-full p-1 hover:bg-primary-foreground/20 transition-colors">
              <X className="h-5 w-5 text-primary-foreground" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map(msg => (
              <div key={msg.id} className={`flex gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full ${
                  msg.role === 'assistant' ? 'gradient-primary' : 'bg-muted'
                }`}>
                  {msg.role === 'assistant' ? (
                    <Bot className="h-4 w-4 text-primary-foreground" />
                  ) : (
                    <User className="h-4 w-4 text-muted-foreground" />
                  )}
                </div>
                <div className={`max-w-[75%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-primary text-primary-foreground rounded-tr-sm'
                    : 'bg-muted text-foreground rounded-tl-sm'
                }`}>
                  {msg.content.split('\n').map((line, i) => (
                    <p key={i} className={i > 0 ? 'mt-1' : ''}>
                      {line.split(/(\*\*.*?\*\*)/).map((part, j) => {
                        if (part.startsWith('**') && part.endsWith('**')) {
                          return <strong key={j}>{part.slice(2, -2)}</strong>;
                        }
                        if (part.startsWith('~~') && part.endsWith('~~')) {
                          return <del key={j}>{part.slice(2, -2)}</del>;
                        }
                        return part;
                      })}
                    </p>
                  ))}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex gap-2">
                <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full gradient-primary">
                  <Bot className="h-4 w-4 text-primary-foreground" />
                </div>
                <div className="rounded-2xl rounded-tl-sm bg-muted px-4 py-3">
                  <div className="flex gap-1">
                    <span className="h-2 w-2 rounded-full bg-muted-foreground/40 animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="h-2 w-2 rounded-full bg-muted-foreground/40 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="h-2 w-2 rounded-full bg-muted-foreground/40 animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Suggestions */}
          {messages.length <= 2 && (
            <div className="flex gap-2 overflow-x-auto px-4 pb-2">
              {SUGGESTIONS.map(s => (
                <button
                  key={s}
                  onClick={() => sendMessage(s)}
                  className="whitespace-nowrap rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <form onSubmit={handleSubmit} className="flex items-center gap-2 border-t border-border p-3">
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me anything..."
              className="flex-1 rounded-full border border-input bg-background px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <Button
              type="submit"
              size="icon"
              disabled={!input.trim() || isTyping}
              className="h-9 w-9 rounded-full gradient-primary border-0 text-primary-foreground"
            >
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      )}
    </>
  );
};

export default AIChatbot;
