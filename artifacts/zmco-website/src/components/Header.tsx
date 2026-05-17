import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Shield, FileText, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAdmin } from "@/context/AdminContext";

const navLinks = [
  { name: "Home",      path: "/" },
  { name: "About",     path: "/about" },
  { name: "Services",  path: "/services" },
  { name: "Projects",  path: "/projects" },
  { name: "Machinery", path: "/machinery" },
  { name: "Safety",    path: "/safety" },
  { name: "Contact",   path: "/contact" },
];

import logoImage from "@/assets/logo.jpg";

export default function Header() {
  const [location] = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [aiTextOpen, setAiTextOpen] = useState(false);
  const { isAdmin, aiKnowledgeBase, updateAIKnowledge } = useAdmin();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => { setMobileMenuOpen(false); }, [location]);

  const pathname = typeof window !== "undefined" ? window.location.pathname.toLowerCase() : "";
  const isAdminPage = pathname.startsWith("/admin") || pathname.startsWith("/admin-login");
  if (isAdminPage) return null;

  return (
    <>
      {/* ── AI Text Module Bar (admin only) ── */}
      <AnimatePresence>
        {isAdmin && aiTextOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="fixed top-0 left-0 right-0 z-[60] bg-background border-b border-primary/30 overflow-hidden"
          >
            <div className="container mx-auto px-4 py-3 flex items-center gap-4">
              <FileText size={16} className="text-primary shrink-0" />
              <span className="text-xs uppercase tracking-widest text-primary font-bold shrink-0">AI Text Module</span>
              <textarea
                value={aiKnowledgeBase}
                onChange={(e) => updateAIKnowledge(e.target.value)}
                placeholder="Paste company data, FAQs, policies for ZMC AI..."
                className="flex-1 bg-secondary/50 border border-border rounded-lg px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground outline-none focus:border-primary/50 resize-none h-[36px]"
              />
              <button onClick={() => setAiTextOpen(false)} className="text-muted-foreground hover:text-white p-1">
                <X size={16} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Header ── */}
      <header
        className={cn(
          "fixed left-0 right-0 z-50 transition-all duration-500",
          isScrolled
            ? "bg-background/95 backdrop-blur-xl border-b border-border py-3 shadow-aesthetic"
            : "bg-transparent py-5",
          isAdmin && aiTextOpen ? "top-[52px]" : "top-0"
        )}
      >
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex items-center justify-between gap-4">

            {/* ── Logo ── */}
            <Link href="/" className="relative z-50 flex items-center gap-3 group shrink-0">
              <div className={cn(
                "w-9 h-9 rounded-full overflow-hidden bg-white border-2 transition-all duration-300",
                isScrolled
                  ? "border-primary/25 group-hover:border-primary/55"
                  : "border-white/15 group-hover:border-primary/40"
              )}>
                <img src={logoImage} alt="ZMCO Logo" className="w-full h-full object-cover" />
              </div>
              <div className="hidden lg:flex flex-col">
                <span className="font-display font-bold text-[13px] leading-none tracking-tight uppercase whitespace-nowrap">
                  Zain Manzoor &amp; Co
                </span>
                <span className="text-[9px] text-primary/60 uppercase tracking-[0.22em] font-semibold mt-0.5 whitespace-nowrap">
                  Construction &amp; Engineering
                </span>
              </div>
            </Link>

            {/* ── Desktop Nav ── */}
            <nav className="hidden md:flex flex-1 items-center justify-center -ml-10">
              {/* Pill container — subtle glass on scroll */}
              <div className={cn(
                "relative flex items-center gap-0.5 px-1.5 py-1.5 rounded-full transition-all duration-500",
                isScrolled
                  ? "bg-card border border-border shadow-md"
                  : "bg-transparent"
              )}>
                {navLinks.map((link) => {
                  const isActive = location === link.path;
                  return (
                    <Link key={link.path} href={link.path} className="relative group">
                      <span className={cn(
                        "relative flex items-center px-3 py-[7px] rounded-full text-[11px] font-semibold tracking-[0.07em] uppercase transition-all duration-200 whitespace-nowrap select-none",
                        isActive ? "text-white" : "text-foreground/55 hover:text-foreground/90"
                      )}>
                        {/* Animated active pill */}
                        {isActive && (
                          <motion.span
                            layoutId="navPill"
                            className="absolute inset-0 rounded-full bg-primary"
                            style={{ boxShadow: "0 0 18px rgba(59,130,246,0.45), 0 0 6px rgba(59,130,246,0.3)" }}
                            transition={{ type: "spring", stiffness: 400, damping: 34 }}
                          />
                        )}
                        {/* Hover bg (inactive only) */}
                        {!isActive && (
                          <span className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 bg-foreground/5 transition-opacity duration-200" />
                        )}
                        <span className="relative z-10">{link.name}</span>
                      </span>
                    </Link>
                  );
                })}
              </div>
            </nav>

            {/* ── Right Side ── */}
            <div className="flex items-center gap-2 shrink-0">

              {/* Admin tools */}
              {isAdmin && (
                <div className="hidden md:flex items-center gap-1 pl-3 ml-1 border-l border-white/10">
                  <Link
                    href="/admin"
                    className={cn(
                      "flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-[10px] font-bold tracking-widest uppercase transition-all",
                      location === "/admin"
                        ? "bg-primary/15 text-primary border border-primary/25"
                        : "text-muted-foreground/70 hover:text-white hover:bg-white/5"
                    )}
                  >
                    <Shield size={11} /> Admin
                  </Link>
                  <button
                    onClick={() => setAiTextOpen(!aiTextOpen)}
                    className={cn(
                      "flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-[10px] font-bold tracking-widest uppercase transition-all",
                      aiTextOpen ? "bg-primary/15 text-primary border border-primary/25" : "text-muted-foreground/70 hover:text-white hover:bg-white/5"
                    )}
                  >
                    <FileText size={11} /> AI
                  </button>
                </div>
              )}

              {/* CTA */}
              <Link
                href="/contact"
                className={cn(
                  "hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-full",
                  "bg-primary text-white text-[11px] font-bold tracking-widest uppercase whitespace-nowrap",
                  "transition-all duration-300 hover:bg-primary/85",
                  "shadow-[0_0_0_1px_rgba(59,130,246,0.3)] hover:shadow-[0_0_22px_rgba(59,130,246,0.45)]"
                )}
              >
                Get Quote <ChevronRight size={12} className="opacity-75" />
              </Link>

              {/* Mobile hamburger */}
              <button
                className="md:hidden w-9 h-9 flex items-center justify-center rounded-full bg-white/[0.06] border border-white/10 text-foreground hover:bg-white/10 transition-all"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Toggle Menu"
              >
                <AnimatePresence mode="wait" initial={false}>
                  {mobileMenuOpen ? (
                    <motion.span key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}>
                      <X size={17} />
                    </motion.span>
                  ) : (
                    <motion.span key="open" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}>
                      <Menu size={17} />
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ── Mobile Full-screen Drawer ── */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="fixed inset-0 z-40 bg-background/97 backdrop-blur-2xl flex flex-col"
          >
            {/* Nav list */}
            <div className="flex flex-col justify-center items-center flex-1 gap-1.5 px-6">
              <p className="text-[9px] uppercase tracking-[0.4em] text-white/25 mb-5 font-bold">Navigation</p>

              {navLinks.map((link, i) => (
                <motion.div
                  key={link.path}
                  initial={{ opacity: 0, x: -24 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.04 + i * 0.055, duration: 0.28 }}
                  className="w-full max-w-sm"
                >
                  <Link
                    href={link.path}
                    className={cn(
                      "flex items-center justify-between w-full px-5 py-3.5 rounded-2xl font-display uppercase tracking-[0.12em] text-base transition-all group",
                      location === link.path
                        ? "bg-primary/15 text-primary border border-primary/25"
                        : "text-foreground/60 hover:bg-white/[0.04] hover:text-foreground border border-transparent"
                    )}
                  >
                    {link.name}
                    <ChevronRight
                      size={15}
                      className={cn(
                        "transition-all",
                        location === link.path ? "text-primary opacity-100 translate-x-0" : "opacity-0 group-hover:opacity-30"
                      )}
                    />
                  </Link>
                </motion.div>
              ))}

              {/* Admin mobile link */}
              {isAdmin && (
                <motion.div
                  initial={{ opacity: 0, x: -24 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.04 + navLinks.length * 0.055, duration: 0.28 }}
                  className="w-full max-w-sm mt-3 pt-3 border-t border-white/10"
                >
                  <Link
                    href="/admin"
                    className="flex items-center justify-between w-full px-5 py-3.5 rounded-2xl font-display uppercase tracking-[0.12em] text-base text-primary border border-primary/20 hover:bg-primary/10 transition-all"
                  >
                    <span className="flex items-center gap-3"><Shield size={16} /> Admin</span>
                    <ChevronRight size={15} />
                  </Link>
                </motion.div>
              )}
            </div>

            {/* Contact footer */}
            <motion.div
              className="px-6 py-8 border-t border-white/[0.06] text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <p className="text-[9px] uppercase tracking-[0.35em] text-white/25 mb-3 font-bold">Contact</p>
              <a href="tel:03152185221" className="block text-lg font-semibold mb-1 hover:text-primary transition-colors">
                0315 2185221
              </a>
              <a href="mailto:zmco2025@gmail.com" className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                zmco2025@gmail.com
              </a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
