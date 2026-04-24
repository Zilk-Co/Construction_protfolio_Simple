import { useEffect, useRef } from "react";
import { Link } from "wouter";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { ArrowRight, ChevronRight, HardHat, Building2, Ruler, ClipboardList, Zap, PaintRoller } from "lucide-react";
import * as Icons from "lucide-react";
import PageTransition from "@/components/PageTransition";
import LocationMap from "@/components/LocationMap";
import { projects, services } from "@/lib/data";
import heroImg from "@/assets/hero.png";
import bgPark from "@/assets/bg-park.png";
import bgUnderpass from "@/assets/bg-underpass.png";
import bgAerial from "@/assets/bg-aerial.png";

const FADE_UP = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }
};

const STAGGER = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

function StatCounter({ value, label }: { value: string, label: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <div ref={ref} className="flex flex-col items-center justify-center p-6 border border-white/5 bg-white/5 backdrop-blur-sm rounded-2xl">
      <motion.div 
        initial={{ opacity: 0, scale: 0.5 }}
        animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.5 }}
        transition={{ duration: 0.5, type: "spring" }}
        className="text-4xl md:text-5xl font-display text-primary mb-2"
      >
        {value}
      </motion.div>
      <div className="text-sm text-muted-foreground uppercase tracking-widest text-center">{label}</div>
    </div>
  );
}

export default function Home() {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <PageTransition>
      {/* HERO SECTION */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden pt-20">
        <motion.div style={{ y, opacity }} className="absolute inset-0 z-0">
          <img 
            src={heroImg} 
            alt="Construction Hero" 
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
        </motion.div>

        <div className="container relative z-10 mx-auto px-4 md:px-6">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
              className="inline-flex items-center justify-center p-3 mb-8 border border-primary/30 bg-primary/10 rounded-full text-primary text-sm font-semibold tracking-widest uppercase"
            >
              Building the Future of Pakistan
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="text-5xl md:text-7xl lg:text-8xl font-display tracking-tighter leading-[0.9] mb-8"
            >
              ZAIN MANZOOR <br />
              <span className="text-primary">& CO</span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-lg md:text-xl text-muted-foreground font-light mb-10 max-w-2xl mx-auto"
            >
              Construction and Engineering PVT LTD. Delivering excellence in construction, civil engineering, and structural projects across Pakistan.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Link href="/projects" className="px-8 py-4 bg-primary text-primary-foreground font-bold uppercase tracking-wider text-sm rounded-sm hover:bg-primary/90 transition-all flex items-center gap-2 group w-full sm:w-auto justify-center">
                View Projects
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="/contact" className="px-8 py-4 border border-border bg-background/50 backdrop-blur-sm text-foreground font-bold uppercase tracking-wider text-sm rounded-sm hover:bg-white/5 transition-all w-full sm:w-auto justify-center text-center">
                Contact Us
              </Link>
            </motion.div>
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-muted-foreground"
        >
          <span className="text-xs uppercase tracking-widest">Scroll</span>
          <motion.div 
            animate={{ y: [0, 10, 0] }} 
            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
            className="w-[1px] h-12 bg-gradient-to-b from-primary to-transparent"
          />
        </motion.div>
      </section>

      {/* MARQUEE */}
      <div className="w-full py-8 border-y border-white/5 bg-[#050505] overflow-hidden flex items-center">
        <div className="zmc-marquee-track flex whitespace-nowrap items-center gap-12 text-2xl md:text-4xl font-display text-muted-foreground/40 uppercase tracking-widest pr-12">
          {Array.from({ length: 2 }).map((_, dup) => (
            <div key={dup} className="flex items-center gap-12 pr-12 shrink-0">
              <span>Civil Engineering</span> <span className="text-primary/60">•</span>
              <span>Commercial Construction</span> <span className="text-primary/60">•</span>
              <span>Structural Design</span> <span className="text-primary/60">•</span>
              <span>MEP Services</span> <span className="text-primary/60">•</span>
              <span>Project Management</span> <span className="text-primary/60">•</span>
              <span>Interior & Renovation</span> <span className="text-primary/60">•</span>
            </div>
          ))}
        </div>
      </div>

      {/* COMPANY MESSAGE & STATS */}
      <section className="py-20 relative overflow-hidden border-y border-white/5">
        <div className="absolute inset-0 bg-cover bg-center opacity-60" style={{ backgroundImage: `url(${bgPark})` }} />
        <div className="absolute inset-0 bg-gradient-to-b from-[#050505]/95 via-[#050505]/80 to-[#050505]/95" />
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-2xl md:text-3xl font-light leading-relaxed"
            >
              Contributing to Pakistan's growth by delivering <span className="text-primary font-medium">world-class construction</span> and engineering solutions that stand the test of time.
            </motion.p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
            <StatCounter value="25+" label="Years Experience" />
            <StatCounter value="150+" label="Projects Completed" />
            <StatCounter value="500+" label="Team Members" />
            <StatCounter value="100%" label="Client Satisfaction" />
          </div>
        </div>
      </section>

      {/* GOAL, MISSION, VISION */}
      <section className="py-24 md:py-32 relative border-y border-white/5">
        <div className="absolute inset-0 bg-cover bg-center opacity-60" style={{ backgroundImage: `url(${bgUnderpass})` }} />
        <div className="absolute inset-0 bg-gradient-to-b from-[#050505]/95 via-[#050505]/80 to-[#050505]/95" />
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Our Vision",
                content: "To be the premier construction and engineering firm in Pakistan, recognized for delivering complex projects with unparalleled innovation, quality, and safety.",
                icon: <Building2 size={32} className="text-primary" />
              },
              {
                title: "Our Mission",
                content: "To provide exceptional construction services by fostering a culture of safety, continuous improvement, and deep collaboration with our clients and partners.",
                icon: <HardHat size={32} className="text-primary" />
              },
              {
                title: "Our Goal",
                content: "To execute every project on time and within budget while maintaining the highest standards of architectural integrity and structural excellence.",
                icon: <Ruler size={32} className="text-primary" />
              }
            ].map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="group p-8 rounded-2xl bg-card border border-border hover:border-primary/50 transition-colors relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full -mr-16 -mt-16 transition-transform group-hover:scale-150" />
                <div className="mb-6 p-4 rounded-xl bg-background inline-block border border-border">
                  {item.icon}
                </div>
                <h3 className="text-2xl font-display mb-4">{item.title}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {item.content}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SERVICES PREVIEW */}
      <section className="py-24 md:py-32 relative border-y border-white/5">
        <div className="absolute inset-0 bg-cover bg-center opacity-60" style={{ backgroundImage: `url(${bgAerial})` }} />
        <div className="absolute inset-0 bg-gradient-to-b from-[#050505]/95 via-[#050505]/80 to-[#050505]/95" />
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={STAGGER}
              className="max-w-2xl"
            >
              <motion.div variants={FADE_UP} className="flex items-center gap-4 mb-4">
                <div className="w-12 h-[1px] bg-primary" />
                <span className="uppercase tracking-widest text-sm font-semibold text-primary">What We Do</span>
              </motion.div>
              <motion.h2 variants={FADE_UP} className="text-4xl md:text-5xl lg:text-6xl font-display">
                Comprehensive <br/>Engineering Solutions
              </motion.h2>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <Link href="/services" className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors uppercase tracking-widest text-sm font-bold group">
                View All Services
                <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.slice(0, 6).map((service, index) => {
              const Icon = Icons[service.icon as keyof typeof Icons] as React.ElementType;
              return (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="group relative h-[300px] rounded-2xl overflow-hidden cursor-pointer"
                >
                  <Link href={`/services/${service.id}`}>
                    <div className="absolute inset-0 bg-[#111]/80 backdrop-blur-sm p-8 flex flex-col border border-white/5 group-hover:border-primary/30 transition-colors z-10">
                      <div className="mb-auto p-3 rounded-xl bg-primary/10 inline-block self-start">
                        {Icon && <Icon size={28} className="text-primary" />}
                      </div>
                      <h3 className="text-2xl font-display mb-2 group-hover:text-primary transition-colors mt-4">{service.title}</h3>
                      <p className="text-muted-foreground text-sm line-clamp-2 transition-all duration-300 group-hover:text-foreground/80">{service.description}</p>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* PROJECTS PREVIEW */}
      <section className="py-24 md:py-32 relative">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={STAGGER}
              className="max-w-2xl"
            >
              <motion.div variants={FADE_UP} className="flex items-center gap-4 mb-4">
                <div className="w-12 h-[1px] bg-primary" />
                <span className="uppercase tracking-widest text-sm font-semibold text-primary">Featured Work</span>
              </motion.div>
              <motion.h2 variants={FADE_UP} className="text-4xl md:text-5xl lg:text-6xl font-display">
                Landmark <br/>Developments
              </motion.h2>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <Link href="/projects" className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors uppercase tracking-widest text-sm font-bold group">
                View All Projects
                <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {projects.filter(p => p.status === "completed").slice(0, 2).map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
              >
                <Link
                  href={`/projects?open=${project.id}`}
                  className="group relative aspect-[4/3] rounded-2xl overflow-hidden block cursor-pointer"
                >
                  <img 
                    src={project.image} 
                    alt={project.title} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-end p-8">
                    <div className="translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="px-3 py-1 bg-primary text-primary-foreground text-xs font-bold uppercase tracking-wider rounded-sm">
                          {project.category}
                        </span>
                        <span className="text-white/70 text-sm">{project.location}</span>
                      </div>
                      <h3 className="text-3xl font-display text-white mb-2">{project.title}</h3>
                      <p className="text-white/60 line-clamp-2 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
                        {project.description}
                      </p>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="py-32 relative overflow-hidden bg-primary/10">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1541888086925-eb3e536f97ef?q=80&w=2000')] bg-cover bg-center opacity-5 mix-blend-luminosity grayscale" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background" />
        
        <div className="container mx-auto px-4 md:px-6 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-4xl md:text-6xl font-display mb-6">Ready to Build Something <span className="text-primary">Extraordinary?</span></h2>
            <p className="text-muted-foreground text-lg mb-10">Let's discuss your next monumental project. Our team of engineering experts is ready to bring your vision to life.</p>
            <Link href="/contact" className="inline-flex items-center justify-center px-10 py-5 bg-primary text-primary-foreground font-bold uppercase tracking-wider text-sm rounded-sm hover:bg-primary/90 transition-all hover:scale-105 active:scale-95 shadow-xl shadow-primary/20">
              Start a Conversation
            </Link>
          </motion.div>
        </div>
      </section>

      <LocationMap />
    </PageTransition>
  );
}
