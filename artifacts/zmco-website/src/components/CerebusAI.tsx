import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, X, Send, Sparkles } from 'lucide-react';
import { useAdmin } from '@/context/AdminContext';

interface Message {
  role: 'user' | 'bot';
  content: string;
}

const DEFAULT_KNOWLEDGE = `
Zain Manzoor & Co. (ZMCO) is a premier engineering, construction, and project management firm in Pakistan.
The CEO and founder of Zain Manzoor & Co. is Mr. Muneer Ahmed Khoso, a visionary leader driving civil engineering and construction excellence.
With over 12 years of industry experience and excellence, ZMCO has successfully completed a total of 11 major landmark projects across Pakistan.
Key landmark projects include the Rohri Canal Lining (Sindh), Indus River Bridge (Sindh), Al-Shifa General Hospital (Lahore), Capital Residency Hub (Islamabad), and Gwadar Logistics Park.
ZMCO offers a wide range of premium services: Construction & Contracting, Civil Engineering, Structural Design, Project Management, MEP Services, and Interior & Renovation.
Contact ZMCO at 0315 2185221 or email zmco2025@gmail.com. The head office is located in Pakistan.
Our heavy equipment fleet includes HOWO dump trucks, CAT 330D excavators, and we self-perform all earthworks and site logistics.
`;

function findAnswer(question: string, knowledgeBase: string): string {
  const kb = (knowledgeBase || '').trim() ? knowledgeBase : DEFAULT_KNOWLEDGE;
  const q = question.toLowerCase();

  // 1. Specific CEO / Leadership Matches
  if (q.includes('ceo') || q.includes('boss') || q.includes('owner') || q.includes('founder') || q.includes('president') || q.includes('muneer') || q.includes('munner') || q.includes('khoso') || q.includes('khooso') || q.includes('who runs') || q.includes('who leads')) {
    return "The CEO and founder of Zain Manzoor & Co. (ZMCO) is Mr. Muneer Ahmed Khoso. Under his visionary leadership, the company has delivered top-tier civil engineering, infrastructure, and construction projects across Pakistan with a commitment to quality and safety.";
  }

  // 2. Specific Project Count / Year Stats Matches
  if ((q.includes('how many') && q.includes('project')) || q.includes('total project') || (q.includes('year') && q.includes('experience')) || q.includes('how long') || q.includes('history') || q.includes('excellence')) {
    return "Zain Manzoor & Co. proudly boasts over 12 years of engineering excellence, during which we have successfully executed a total of 11 landmark projects across Pakistan. Our portfolio spans massive infrastructure developments, hospitals, residential high-rises, and industrial parks.";
  }

  const lines = kb.split('\n').filter(l => l.trim());
  
  // Try to find the most relevant line(s)
  const scored = lines.map(line => {
    const words = q.split(/\s+/).filter(w => w.length > 2);
    const hits = words.filter(w => line.toLowerCase().includes(w)).length;
    return { line, score: hits };
  }).filter(s => s.score > 0).sort((a, b) => b.score - a.score);

  if (scored.length > 0) {
    const topResults = scored.slice(0, 3).map(s => s.line).join(' ');
    return topResults;
  }

  // Fallback responses
  if (q.includes('hello') || q.includes('hi') || q.includes('hey')) {
    return "Hello! I'm Cerebus AI, Zain Manzoor & Co's virtual assistant. How can I help you today?";
  }
  if (q.includes('contact') || q.includes('phone') || q.includes('email')) {
    return "You can reach Zain Manzoor & Co at 0315 2185221 or email zmco2025@gmail.com. Visit our Contact page for more details.";
  }
  if (q.includes('service')) {
    return "Zain Manzoor & Co offers Construction & Contracting, Civil Engineering, Structural Design, Project Management, MEP Services, and Interior & Renovation. Visit our Services page for details.";
  }
  if (q.includes('project')) {
    return "We have completed a total of 11 major projects including the Rohri Canal Lining, Indus River Bridge, and Al-Shifa General Hospital. Visit our Projects page for the full portfolio.";
  }

  return "I couldn't find a specific answer in my knowledge base. For detailed inquiries, please contact Zain Manzoor & Co directly at 0315 2185221 or visit our Contact page.";
}

export default function CerebusAI() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { role: 'bot', content: "Hello! I'm Cerebus AI, your virtual assistant for Zain Manzoor & Co. Ask me anything about our services, projects, or company." }
  ]);
  const { aiKnowledgeBase } = useAdmin();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg = input.trim();
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setInput('');

    // Simulate typing delay
    setTimeout(() => {
      const answer = findAnswer(userMsg, aiKnowledgeBase);
      setMessages(prev => [...prev, { role: 'bot', content: answer }]);
    }, 600);
  };

  return (
    <>
      {/* Floating Button */}
      <AnimatePresence>
        {!open && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="fixed bottom-6 right-6 z-[998] group"
          >
            <button
              onClick={() => setOpen(true)}
              className="relative w-14 h-14 bg-primary text-primary-foreground rounded-full flex items-center justify-center shadow-2xl shadow-primary/30 hover:scale-110 transition-transform"
            >
              <Bot size={24} />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-[#050505] animate-pulse" />
            </button>
            <div className="absolute bottom-full right-0 mb-3 px-4 py-2 bg-card border border-white/10 rounded-xl text-xs font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity shadow-xl pointer-events-none">
              <Sparkles size={12} className="inline mr-1.5 text-primary" />
              Get help with AI
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-6 right-6 z-[998] w-[380px] max-w-[calc(100vw-3rem)] bg-[#111] border border-white/10 rounded-3xl shadow-2xl shadow-black/50 flex flex-col overflow-hidden"
            style={{ height: '520px' }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-[#0a0a0a]">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-primary/10 rounded-xl flex items-center justify-center border border-primary/20">
                  <Bot size={18} className="text-primary" />
                </div>
                <div>
                  <h4 className="text-sm font-display font-bold">Cerebus AI</h4>
                  <p className="text-[10px] text-green-500 uppercase tracking-widest font-bold">Online</p>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="p-2 hover:bg-white/5 rounded-xl transition-colors text-muted-foreground hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin">
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-primary text-primary-foreground rounded-br-sm'
                        : 'bg-white/5 text-white/80 rounded-bl-sm border border-white/5'
                    }`}
                  >
                    {msg.content}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Input */}
            <div className="p-4 border-t border-white/5 bg-[#0a0a0a]">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask about our services..."
                  className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/30 outline-none focus:border-primary/50 transition-colors"
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim()}
                  className="p-3 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <Send size={16} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
