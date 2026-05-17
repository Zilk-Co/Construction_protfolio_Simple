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
    phone: "0315 2185221",
    email: "zmco2025@gmail.com",
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
      a: "Contact us at 0315 2185221 or email zmco2025@gmail.com with your project details. Our estimating team will provide a detailed proposal within 48 hours.",
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
function generateResponse(question: string, extraKnowledge: string): string {
  const q = question.toLowerCase().trim();
  const { company, stats, services, projects, equipment, faqs } = SITE_KNOWLEDGE;

  // Greeting
  if (/^(hi|hello|hey|salam|assalam|good\s*(morning|afternoon|evening)|howdy|greetings)/i.test(q)) {
    return `Hello! 👋 Welcome to **${company.name}**. I'm your AI assistant, here to help you with anything about our services, projects, team, or how to get started. What can I help you with today?`;
  }

  // CEO / Leadership
  if (/ceo|boss|owner|founder|president|director|head|leader|who runs|who leads|muneer|khoso|munner|khooso/i.test(q)) {
    return `The **CEO and Founder** of ${company.name} is **${company.ceo}**. Under his visionary leadership for over ${company.experience}, ZMCO has successfully delivered ${stats.projects} landmark projects across Pakistan, setting new standards in civil engineering and construction excellence.`;
  }

  // Company overview / About
  if (/about|company|zmco|zain manzoor|who are you|tell me about|overview|background/i.test(q)) {
    return `**${company.fullName}** is Pakistan's premier construction and engineering firm. Founded in ${company.founded} by ${company.ceo}, we have over **${company.experience}** of industry excellence with **${stats.projects} major landmark projects** successfully completed across the country. We specialize in civil engineering, structural design, project management, and MEP services. Our commitment: delivering on time, within budget, without compromise.`;
  }

  // Experience / History / How long
  if (/experience|how long|years|since|history|established|founded/i.test(q)) {
    return `${company.name} has **${company.experience} of engineering excellence**, having been founded in ${company.founded}. Over this period, we have executed **${stats.projects} major landmark projects** across Pakistan, including infrastructure, healthcare, residential, and industrial developments.`;
  }

  // Projects count / portfolio stats
  if (/(how many|total|number of|count).*(project)|projects.*(completed|done|finished|built)/i.test(q)) {
    return `ZMCO has successfully completed a total of **${stats.projects} major landmark projects** across Pakistan over our **${company.experience}** of operation. Our portfolio spans infrastructure (bridges, canals), hospitals, residential towers, and industrial estates. Visit our **Projects** page to explore the full portfolio.`;
  }

  // Specific project inquiries
  if (/rohri|canal|indus|bridge|hospital|shifa|capital residency|gwadar|faisalabad|industrial estate/i.test(q)) {
    const matched = projects.filter(p =>
      q.includes(p.name.toLowerCase().split(' ')[0]) ||
      q.includes(p.location.toLowerCase()) ||
      p.name.toLowerCase().split(' ').some(w => q.includes(w))
    );
    if (matched.length > 0) {
      return matched.map(p =>
        `**${p.name}** (${p.location})\n${p.description}`
      ).join('\n\n');
    }
  }

  // All projects listing
  if (/project|portfolio|work|what.*(built|done|completed|made)/i.test(q)) {
    const list = projects.map((p, i) => `${i + 1}. **${p.name}** — ${p.location} (${p.category})`).join('\n');
    return `Here are our **${stats.projects} landmark projects**:\n\n${list}\n\nVisit our **Projects page** for images, details, and contract values.`;
  }

  // Services
  if (/service|what do you (do|offer|provide)|capabilities|speciali[sz]e|expertise/i.test(q)) {
    const list = services.map(s => `• **${s.name}**`).join('\n');
    return `We offer **6 core engineering and construction services**:\n\n${list}\n\nEach service is delivered by experienced engineers and site managers. Would you like details on any specific service?`;
  }

  // Specific service matches
  if (/civil|road|bridge|canal|drainage|earthwork/i.test(q)) {
    const s = services.find(sv => sv.name === 'Civil Engineering')!;
    return `**${s.name}**: ${s.description}`;
  }
  if (/structural|design|analysis|building design/i.test(q)) {
    const s = services.find(sv => sv.name === 'Structural Design')!;
    return `**${s.name}**: ${s.description}`;
  }
  if (/mep|mechanical|electrical|plumbing|hvac|fire/i.test(q)) {
    const s = services.find(sv => sv.name === 'MEP Services')!;
    return `**${s.name}**: ${s.description}`;
  }
  if (/interior|renovation|design|finishing|fitout|fit.?out/i.test(q)) {
    const s = services.find(sv => sv.name === 'Interior & Renovation')!;
    return `**${s.name}**: ${s.description}`;
  }
  if (/project manag|pm |timeline|schedule|planning/i.test(q)) {
    const s = services.find(sv => sv.name === 'Project Management')!;
    return `**${s.name}**: ${s.description}`;
  }
  if (/construction|contracting|build|contractor/i.test(q)) {
    const s = services.find(sv => sv.name === 'Construction & Contracting')!;
    return `**${s.name}**: ${s.description}`;
  }

  // Equipment / machinery
  if (/equipment|machinery|truck|excavator|crane|machine|fleet/i.test(q)) {
    const list = equipment.map(e => `• ${e}`).join('\n');
    return `Our heavy equipment fleet includes:\n\n${list}\n\nWe self-perform all earthworks, excavation, and site logistics using our own fleet, ensuring quality control and faster delivery.`;
  }

  // Contact info
  if (/contact|phone|call|email|reach|number|address|office|location/i.test(q)) {
    return `You can reach **${company.name}** through:\n\n📞 **Phone:** ${company.phone}\n📧 **Email:** ${company.email}\n📍 **Location:** ${company.location}\n\nOr fill out the contact form on our **Contact page** for a detailed project inquiry.`;
  }

  // Quote / pricing
  if (/quote|price|cost|pricing|estimate|how much|budget/i.test(q)) {
    return `For a **project quote or cost estimate**, please contact us directly:\n\n📞 **${company.phone}**\n📧 **${company.email}**\n\nShare your project details (type, size, location, and timeline) and our estimating team will provide a comprehensive proposal within **48 hours**.`;
  }

  // Certification / license
  if (/licens|certif|register|pec|nespak|auth|approved/i.test(q)) {
    return `Yes, **${company.name}** is a fully licensed and registered engineering and construction firm, operating in compliance with **Pakistan Engineering Council (PEC)** regulations. All our engineers and project managers hold valid professional certifications.`;
  }

  // FAQ matching
  for (const faq of faqs) {
    if (faq.q.toLowerCase().split(' ').filter(w => w.length > 3).some(w => q.includes(w))) {
      return faq.a;
    }
  }

  // Extra knowledge base from admin (supplemental only)
  if (extraKnowledge.trim()) {
    const lines = extraKnowledge.split('\n').filter(l => l.trim());
    const scored = lines.map(line => {
      const words = q.split(/\s+/).filter(w => w.length > 2);
      const hits = words.filter(w => line.toLowerCase().includes(w)).length;
      return { line, score: hits };
    }).filter(s => s.score > 0).sort((a, b) => b.score - a.score);

    if (scored.length > 0) {
      return scored.slice(0, 2).map(s => s.line).join(' ');
    }
  }

  // Default fallback
  return `I'm not sure I have a specific answer for that, but I can help you with:\n\n• 🏗️ Our **services** (civil engineering, construction, MEP, etc.)\n• 📂 Our **project portfolio** (11 landmark projects)\n• 👤 **Company & leadership** information\n• 📞 **Contact & quote** details\n\nFeel free to ask, or call us directly at **${company.phone}**.`;
}

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
export default function CerebusAI() {
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

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg = input.trim();
    setMessages(prev => [...prev, { role: 'user', content: userMsg, timestamp: new Date() }]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const answer = generateResponse(userMsg, aiKnowledgeBase);
      setIsTyping(false);
      setMessages(prev => [...prev, { role: 'bot', content: answer, timestamp: new Date() }]);
    }, 800 + Math.random() * 400);
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
            <button
              id="cerebus-ai-toggle"
              onClick={() => setOpen(true)}
              className="relative w-16 h-16 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 hover:scale-110 active:scale-95"
              style={{
                background: 'linear-gradient(135deg, hsl(214 88% 52%) 0%, hsl(230 80% 60%) 100%)',
                boxShadow: '0 8px 32px hsla(214, 88%, 52%, 0.45)',
              }}
              aria-label="Open AI Assistant"
            >
              <Bot size={26} className="text-white" />
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-400 rounded-full border-2 border-white animate-pulse shadow-md" />
            </button>
            <div className="absolute bottom-full right-0 mb-3 px-4 py-2 bg-gray-900 border border-white/15 rounded-xl text-xs font-semibold text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-2xl pointer-events-none">
              <Sparkles size={11} className="inline mr-1.5 text-blue-400" />
              Ask ZMCO AI
            </div>
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
              background: 'linear-gradient(145deg, #0d0f1a 0%, #111827 100%)',
              border: '1px solid rgba(255,255,255,0.1)',
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
                    <p className="text-[10px] text-emerald-400 font-semibold uppercase tracking-widest">Online</p>
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
                    style={{ background: 'linear-gradient(135deg, hsl(214 88% 52%), hsl(245 80% 65%))' }}
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
                    className="px-3 py-1.5 rounded-full text-xs font-medium text-blue-300 transition-all duration-200 hover:text-white hover:scale-105"
                    style={{
                      background: 'rgba(59,130,246,0.12)',
                      border: '1px solid rgba(59,130,246,0.25)',
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
                  id="cerebus-ai-send"
                  onClick={handleSend}
                  disabled={!input.trim() || isTyping}
                  className="w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed hover:scale-105 active:scale-95 flex-shrink-0"
                  style={{
                    background: input.trim() && !isTyping
                      ? 'linear-gradient(135deg, hsl(214 88% 52%) 0%, hsl(230 80% 60%) 100%)'
                      : 'rgba(255,255,255,0.08)',
                  }}
                  aria-label="Send message"
                >
                  <Send size={15} className="text-white" />
                </button>
              </div>
              <p className="text-center text-[10px] text-white/20 mt-2">ZMCO AI · Powered by site knowledge</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
