import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, X, Send, Sparkles, ChevronDown } from 'lucide-react';
import { useAdmin } from '@/context/AdminContext';

interface Message {
  role: 'user' | 'bot';
  content: string;
  timestamp?: Date;
}

// ─── Full Site-Wide Knowledge Base ───────────────────────────────────────────
const SITE_KNOWLEDGE = {
  company: {
    name: "Zain Manzoor & Co. (ZMCO)",
    fullName: "Zain Manzoor & Co. Construction and Engineering PVT LTD",
    ceo: "Mr. Muneer Ahmed Khoso",
    founded: "2013",
    experience: "12 years",
    location: "Pakistan",
    phone: "+92 123456789",
    email: "zmc@gmail.com",
    tagline: "Building the Future of Pakistan",
    description: "A premier engineering, construction, and project management firm delivering excellence across Pakistan.",
  },
  stats: {
    projects: 11,
    yearsExperience: 12,
    teamMembers: "100+",
    clientSatisfaction: "100%",
  },
  services: [
    {
      name: "Construction & Contracting",
      description: "End-to-end construction management for commercial, residential, and infrastructure projects. We handle everything from excavation to final finishing.",
    },
    {
      name: "Civil Engineering",
      description: "Expert civil engineering solutions including roads, bridges, canals, drainage systems, and earthwork. Our engineers use modern software and proven methodologies.",
    },
    {
      name: "Structural Design",
      description: "Detailed structural analysis and design for buildings, bridges, and industrial facilities. We ensure structural integrity, safety, and compliance with Pakistan standards.",
    },
    {
      name: "Project Management",
      description: "Comprehensive project management from planning to delivery. We manage timelines, budgets, contractors, and quality control for complex multi-phase projects.",
    },
    {
      name: "MEP Services",
      description: "Full mechanical, electrical, and plumbing services. We design and install HVAC, power systems, fire suppression, and plumbing for commercial and industrial buildings.",
    },
    {
      name: "Interior & Renovation",
      description: "Premium interior design and renovation services for offices, hospitals, hotels, and residential properties. We combine aesthetics with functionality.",
    },
  ],
  projects: [
    {
      name: "Rohri Canal Lining",
      location: "Sindh",
      category: "Infrastructure",
      description: "Large-scale canal lining project improving irrigation efficiency across agricultural regions in Sindh.",
    },
    {
      name: "Indus River Bridge",
      location: "Sindh",
      category: "Infrastructure",
      description: "A major bridge project spanning the Indus River, connecting communities and supporting transport networks.",
    },
    {
      name: "Al-Shifa General Hospital",
      location: "Lahore",
      category: "Healthcare",
      description: "Full construction and fit-out of a multi-floor general hospital with modern medical facilities.",
    },
    {
      name: "Capital Residency Hub",
      location: "Islamabad",
      category: "Residential",
      description: "Premium residential tower development in Islamabad featuring modern apartments and amenities.",
    },
    {
      name: "Gwadar Logistics Park",
      location: "Gwadar",
      category: "Industrial",
      description: "Strategic logistics and warehousing park supporting CPEC trade route activities in Gwadar.",
    },
    {
      name: "Faisalabad Industrial Estate",
      location: "Faisalabad",
      category: "Industrial",
      description: "Large industrial estate construction with manufacturing plants, roads, and utility infrastructure.",
    },
  ],
  equipment: [
    "HOWO Dump Trucks (heavy earthmoving)",
    "CAT 330D Excavators",
    "Road rollers and compactors",
    "Tower cranes and mobile cranes",
    "Concrete batch plants",
    "Surveying and leveling equipment",
  ],
  faqs: [
    {
      q: "How can I get a quote?",
      a: "Contact us at +92 123456789 or email zmc@gmail.com with your project details. Our estimating team will provide a detailed proposal within 48 hours.",
    },
    {
      q: "Do you work outside Pakistan?",
      a: "Currently, ZMCO primarily operates across Pakistan, with projects spanning Sindh, Punjab, Islamabad, Balochistan, and KPK.",
    },
    {
      q: "What types of projects do you take?",
      a: "We handle infrastructure (bridges, canals, roads), commercial buildings, hospitals, residential towers, industrial estates, and renovation projects.",
    },
    {
      q: "Are you licensed and certified?",
      a: "Yes, ZMCO is a fully licensed and registered engineering and construction company operating under Pakistan Engineering Council (PEC) regulations.",
    },
    {
      q: "What is your project timeline process?",
      a: "We follow a structured process: site survey → design & planning → approvals → mobilization → construction → quality control → handover. Timelines are project-specific.",
    },
  ],
};

// ─── Intent-based AI Engine ───────────────────────────────────────────────────
// Removed generateResponse in favor of backend LLM endpoint.

// Format bold markdown to JSX-friendly span
function formatMessage(text: string) {
  const parts = text.split(/\*\*(.*?)\*\*/g);
  return parts.map((part, i) =>
    i % 2 === 1
      ? <strong key={i} className="font-semibold text-white">{part}</strong>
      : <span key={i}>{part}</span>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function ZmcAI() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'bot',
      content: "Hello! 👋 I'm **ZMCO Assistant**, your AI guide for Zain Manzoor & Co. Ask me about our services, projects, CEO, equipment, or how to get a quote!",
      timestamp: new Date(),
    }
  ]);
  const { aiKnowledgeBase } = useAdmin();
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  useEffect(() => {
    if (open && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [open]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg = input.trim();
    
    // Add user message
    const newMessages = [...messages, { role: 'user' as const, content: userMsg, timestamp: new Date() }];
    setMessages(newMessages);
    setInput('');
    setIsTyping(true);

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg, messages: messages.map(m => ({ role: m.role, content: m.content })) }),
      });

      if (!res.ok) throw new Error('Failed to fetch AI response');
      if (!res.body) throw new Error('No body in response');

      // Add empty bot message that we'll stream into
      setMessages(prev => [...prev, { role: 'bot', content: '', timestamp: new Date() }]);
      setIsTyping(false);

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let done = false;
      let fullContent = '';

      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        const chunkValue = decoder.decode(value, { stream: true });
        
        // Split chunk into individual SSE events
        const lines = chunkValue.split('\n');
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const dataStr = line.replace('data: ', '').trim();
            if (dataStr) {
              try {
                const data = JSON.parse(dataStr);
                if (data.error) {
                  fullContent += "\n\n*(Error: " + data.error + ")*";
                  break;
                }
                if (data.done) break;
                if (data.content) {
                  fullContent += data.content;
                  // Update the last message
                  setMessages(prev => {
                    const next = [...prev];
                    next[next.length - 1] = { ...next[next.length - 1], content: fullContent };
                    return next;
                  });
                }
              } catch (e) {
                console.error("Failed to parse SSE JSON chunk:", dataStr);
              }
            }
          }
        }
      }
    } catch (err) {
      console.error(err);
      setIsTyping(false);
      setMessages(prev => [...prev, { role: 'bot', content: 'Sorry, I encountered an error connecting to my servers. Please try again later.', timestamp: new Date() }]);
    }
  };

  const quickQuestions = [
    "Who is the CEO?",
    "What services do you offer?",
    "How many projects completed?",
    "How to get a quote?",
  ];

  return (
    <>
      {/* Floating Button — high z-index so it's always tappable */}
      <AnimatePresence>
        {!open && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            className="fixed bottom-6 right-6 z-[9999] group"
          >
            <div className="absolute right-full mr-4 top-1/2 -translate-y-1/2 flex items-center gap-2 px-3 py-1.5 bg-gray-900 border border-white/10 rounded-full shadow-xl pointer-events-none">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[10px] font-semibold text-white tracking-widest uppercase">Available</span>
            </div>
            
            <button
              id="zmc-ai-toggle"
              onClick={() => setOpen(true)}
              className="relative w-16 h-16 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300"
              style={{
                background: 'var(--ai-btn-bg)',
                boxShadow: 'var(--ai-btn-shadow)',
                border: '1px solid rgba(255,255,255,0.1)'
              }}
              aria-label="Open AI Assistant"
            >
              <Bot size={28} className="text-white" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.94 }}
            transition={{ type: 'spring', damping: 28, stiffness: 320 }}
            className="fixed bottom-6 right-6 z-[9999] flex flex-col overflow-hidden rounded-3xl"
            style={{
              width: '390px',
              maxWidth: 'calc(100vw - 2rem)',
              height: '560px',
              background: 'var(--ai-window-bg)',
              border: '1px solid var(--ai-window-border)',
              boxShadow: '0 32px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.05)',
            }}
          >
            {/* Header */}
            <div
              className="flex items-center justify-between px-5 py-4 flex-shrink-0"
              style={{
                background: 'linear-gradient(135deg, rgba(37,99,235,0.25) 0%, rgba(79,70,229,0.2) 100%)',
                borderBottom: '1px solid rgba(255,255,255,0.08)',
              }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0"
                  style={{
                    background: 'linear-gradient(135deg, hsl(214 88% 52%) 0%, hsl(245 80% 65%) 100%)',
                    boxShadow: '0 4px 16px hsla(214,88%,52%,0.4)',
                  }}
                >
                  <Bot size={19} className="text-white" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white tracking-wide">ZMCO AI Assistant</h4>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <p className="text-[10px] text-emerald-400 font-semibold uppercase tracking-widest">Available</p>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="p-2 rounded-xl text-white/40 hover:text-white hover:bg-white/10 transition-all duration-200"
                aria-label="Close chat"
              >
                <X size={18} />
              </button>
            </div>

            {/* Messages */}
            <div
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-4 space-y-3"
              style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(255,255,255,0.1) transparent' }}
            >
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.25 }}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} items-end gap-2`}
                >
                  {msg.role === 'bot' && (
                    <div
                      className="w-7 h-7 rounded-xl flex items-center justify-center flex-shrink-0 mb-1"
                      style={{ background: 'linear-gradient(135deg, hsl(214 88% 52%), hsl(245 80% 65%))' }}
                    >
                      <Bot size={13} className="text-white" />
                    </div>
                  )}
                  <div
                    className={`max-w-[82%] px-4 py-3 text-sm leading-relaxed whitespace-pre-line ${
                      msg.role === 'user'
                        ? 'rounded-2xl rounded-br-sm text-white'
                        : 'rounded-2xl rounded-bl-sm text-white/85'
                    }`}
                    style={
                      msg.role === 'user'
                        ? {
                            background: 'linear-gradient(135deg, hsl(214 88% 52%) 0%, hsl(230 80% 60%) 100%)',
                            boxShadow: '0 4px 16px hsla(214,88%,52%,0.3)',
                          }
                        : {
                            background: 'rgba(255,255,255,0.06)',
                            border: '1px solid rgba(255,255,255,0.1)',
                            boxShadow: '0 2px 12px rgba(0,0,0,0.3)',
                          }
                    }
                  >
                    {msg.role === 'bot' ? formatMessage(msg.content) : msg.content}
                  </div>
                </motion.div>
              ))}

              {/* Typing indicator */}
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-end gap-2"
                >
                  <div
                    className="w-7 h-7 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: 'var(--ai-msg-bot-bg)' }}
                  >
                    <Bot size={13} className="text-white" />
                  </div>
                  <div
                    className="px-4 py-3 rounded-2xl rounded-bl-sm flex items-center gap-1.5"
                    style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}
                  >
                    {[0, 1, 2].map(i => (
                      <motion.span
                        key={i}
                        className="w-1.5 h-1.5 rounded-full bg-white/40"
                        animate={{ opacity: [0.3, 1, 0.3], y: [0, -3, 0] }}
                        transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                      />
                    ))}
                  </div>
                </motion.div>
              )}
            </div>

            {/* Quick Questions */}
            {messages.length <= 1 && (
              <div className="px-4 pb-3 flex flex-wrap gap-2 flex-shrink-0">
                {quickQuestions.map((q) => (
                  <button
                    key={q}
                    onClick={() => {
                      setInput(q);
                      setTimeout(() => handleSend(), 50);
                    }}
                    className="px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 hover:text-white hover:scale-105"
                    style={{
                      color: 'var(--ai-quick-text)',
                      background: 'var(--ai-quick-bg)',
                      border: '1px solid var(--ai-quick-border)',
                    }}
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}

            {/* Input Bar */}
            <div
              className="p-4 flex-shrink-0"
              style={{ borderTop: '1px solid rgba(255,255,255,0.07)', background: 'rgba(0,0,0,0.3)' }}
            >
              <div
                className="flex items-center gap-2 rounded-2xl px-4 py-2"
                style={{
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.12)',
                }}
              >
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && !isTyping && handleSend()}
                  placeholder="Ask about ZMCO…"
                  className="flex-1 bg-transparent text-sm text-white placeholder:text-white/30 outline-none py-1.5"
                  disabled={isTyping}
                />
                <button
                  id="zmc-ai-send"
                  onClick={handleSend}
                  disabled={!input.trim() || isTyping}
                  className="w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed hover:scale-105 active:scale-95 flex-shrink-0"
                  style={{
                    background: input.trim() && !isTyping
                      ? 'var(--ai-send-btn-bg)'
                      : 'rgba(255,255,255,0.08)',
                  }}
                  aria-label="Send message"
                >
                  <Send size={15} className="text-white" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
