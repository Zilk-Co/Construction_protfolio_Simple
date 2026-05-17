import { useEffect, useRef, useState } from "react";
import { Link } from "wouter";
import { motion, useScroll, useTransform, useInView, useMotionValue, useSpring } from "framer-motion";
import { ArrowRight, ChevronRight, HardHat, Building2, Ruler, ClipboardList, Zap, PaintRoller } from "lucide-react";
import * as Icons from "lucide-react";
import PageTransition from "@/components/PageTransition";
import LocationMap from "@/components/LocationMap";
import { EditableText } from "@/context/AdminContext";
import heroBg from "@/assets/hero.png";
import parkBg from "@/assets/bg-park.png";
import underpassBg from "@/assets/bg-underpass.png";
import aerialBg from "@/assets/bg-aerial.png";
import servicesBg from "@/assets/hero-services.png";

type Project = { id: string; title: string; location: string; category: string; status: string; year: string; image: string; description: string; employer?: string; contractValue?: string; executedValue?: string; awarded?: string; completed?: string; scope?: string; gallery?: string[]; serviceIds?: string[]; };
type Service = { id: string; title: string; description: string; longDescription: string; icon: string; capabilities?: string[]; benefits?: string[]; process?: any[]; };

const FADE_UP = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const STAGGER = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

function StatCounter({ id, value, label }: { id: string, value: string, label: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <div ref={ref} className="flex flex-col items-center justify-center p-6 border border-border bg-card/50 backdrop-blur-sm rounded-2xl shadow-aesthetic">
      <motion.div 
        initial={{ opacity: 0, scale: 0.5 }}
        animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.5 }}
        transition={{ duration: 0.5, type: "spring" }}
        className="text-4xl md:text-5xl font-display text-primary mb-2"
      >
        <EditableText id={`${id}_val`} defaultText={value} />
      </motion.div>
      <div className="text-sm text-muted-foreground uppercase tracking-widest text-center">
        <EditableText id={`${id}_label`} defaultText={label} />
      </div>
    </div>
  );
}

function ServiceCard({ service, index }: { service: Service; index: number }) {
  const Icon = Icons[service.icon as keyof typeof Icons] as React.ElementType;
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function onMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  const background = useTransform(
    [mouseX, mouseY],
    ([x, y]) => `radial-gradient(650px circle at ${x}px ${y}px, hsla(var(--primary) / 0.1), transparent 80%)`
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      onMouseMove={onMouseMove}
      className="group relative rounded-2xl overflow-hidden cursor-pointer h-full"
    >
      <Link href={`/services/${service.id}`}>
        <div
          className="relative flex flex-col h-full p-8 rounded-2xl transition-all duration-500 group-hover:-translate-y-2 group-hover:shadow-premium-hover"
          style={{
            background: 'linear-gradient(145deg, rgba(30,60,140,0.28) 0%, rgba(20,40,110,0.18) 100%)',
            border: '1px solid rgba(80,130,255,0.22)',
            boxShadow: '0 4px 28px rgba(0,10,40,0.45)',
          }}
        >
          {/* Top accent line — always visible */}
          <div className="absolute top-0 left-8 right-8 h-[2px] rounded-full bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

          {/* Spotlight Effect */}
          <motion.div
            className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition duration-300 group-hover:opacity-100"
            style={{ background }}
          />

          {/* Icon */}
          <div
            className="relative mb-6 inline-block self-start p-4 rounded-xl transition-all duration-500 group-hover:scale-110 group-hover:rotate-3"
            style={{
              background: 'linear-gradient(135deg, hsla(214,88%,52%,0.25) 0%, hsla(245,80%,65%,0.15) 100%)',
              border: '1px solid hsla(214,88%,52%,0.40)',
              boxShadow: '0 4px 16px hsla(214,88%,52%,0.20)',
            }}
          >
            {Icon && <Icon size={30} className="text-primary" />}
          </div>

          {/* Content — always visible, no hover fade */}
          <div className="relative z-10">
            <h3 className="text-xl font-display mb-3 text-white">
              {service.title}
            </h3>
            <p className="text-white/65 text-sm line-clamp-3 mb-6 leading-relaxed">
              {service.description}
            </p>
          </div>

          {/* CTA — always visible */}
          <div className="relative mt-auto flex items-center gap-3 text-primary text-sm font-bold tracking-wider uppercase">
            <span className="relative">
              Explore Details
              <span className="absolute -bottom-1 left-0 w-full h-[2px] bg-primary/60" />
            </span>
            <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export default function Home() {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  const [projects, setProjects] = useState<Project[]>([]);
  const [services, setServices] = useState<Service[]>([]);

  useEffect(() => {
    Promise.all([
      fetch('/api/projects').then(res => res.json()),
      fetch('/api/services').then(res => res.json())
    ])
      .then(([p, s]) => {
        setProjects(p);
        setServices(s);
      })
      .catch(console.error);
  }, []);

  return (
    <PageTransition>
      {/* HERO SECTION */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden pt-20">
        <motion.div style={{ y, opacity }} className="absolute inset-0 z-0">
          <img 
            src={heroBg} 
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
              <EditableText id="hero_badge" defaultText="Building the Future of Pakistan" />
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="text-5xl md:text-7xl lg:text-8xl font-display tracking-tighter leading-[0.9] mb-8"
            >
              <EditableText id="hero_title_1" defaultText="ZAIN MANZOOR" /> <br />
              <span className="text-primary"><EditableText id="hero_title_2" defaultText="& CO" /></span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-lg md:text-xl text-muted-foreground font-light mb-10 max-w-2xl mx-auto"
            >
              <EditableText id="hero_subtitle" defaultText="Construction and Engineering PVT LTD. Delivering excellence in construction, civil engineering, and structural projects across Pakistan." />
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
      </section>

      {/* MARQUEE */}
      <div className="w-full py-8 border-y border-border bg-card overflow-hidden flex items-center">
        <div 
          className="animate-marquee flex whitespace-nowrap w-max items-center gap-12 text-2xl md:text-4xl font-display text-muted-foreground/30 uppercase tracking-widest will-change-transform"
        >
          <span>Civil Engineering</span> <span className="text-primary/50">•</span>
          <span>Commercial Construction</span> <span className="text-primary/50">•</span>
          <span>Structural Design</span> <span className="text-primary/50">•</span>
          <span>MEP Services</span> <span className="text-primary/50">•</span>
          <span>Project Management</span> <span className="text-primary/50">•</span>
          {/* duplicate exactly the same for seamless loop */}
          <span>Civil Engineering</span> <span className="text-primary/50">•</span>
          <span>Commercial Construction</span> <span className="text-primary/50">•</span>
          <span>Structural Design</span> <span className="text-primary/50">•</span>
          <span>MEP Services</span> <span className="text-primary/50">•</span>
          <span>Project Management</span> <span className="text-primary/50">•</span>
        </div>
      </div>

      {/* COMPANY MESSAGE & STATS */}
      <section className="py-20 relative overflow-hidden border-y border-border">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-60" 
          style={{ backgroundImage: `url(${parkBg})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/95 via-background/80 to-background/95" />
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-2xl md:text-3xl font-light leading-relaxed"
            >
              <EditableText tagName="span" id="company_msg_1" defaultText="Contributing to Pakistan's growth by delivering " />
              <span className="text-primary font-medium"><EditableText tagName="span" id="company_msg_2" defaultText="world-class construction " /></span>
              <EditableText tagName="span" id="company_msg_3" defaultText="and engineering solutions that stand the test of time." />
            </motion.p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
            <StatCounter id="stat_years" value="25+" label="Years Experience" />
            <StatCounter id="stat_projects" value="150+" label="Projects Completed" />
            <StatCounter id="stat_team" value="500+" label="Team Members" />
            <StatCounter id="stat_satisfaction" value="100%" label="Client Satisfaction" />
          </div>
        </div>
      </section>

      {/* GOAL, MISSION, VISION */}
      <section className="py-24 md:py-32 relative border-y border-border">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-60" 
          style={{ backgroundImage: `url(${underpassBg})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/95 via-background/80 to-background/95" />
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
                viewport={{ once: true, margin: "0px" }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="group p-8 rounded-2xl bg-card border border-border hover:border-primary/50 transition-colors shadow-aesthetic relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full -mr-16 -mt-16 transition-transform group-hover:scale-150" />
                <div className="mb-6 p-4 rounded-xl bg-background inline-block border border-border">
                  {item.icon}
                </div>
                <h3 className="text-2xl font-display mb-4"><EditableText tagName="span" id={`box_title_${index}`} defaultText={item.title} /></h3>
                <p className="text-muted-foreground leading-relaxed">
                  <EditableText tagName="span" id={`box_content_${index}`} defaultText={item.content} />
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SERVICES PREVIEW */}
      <section className="py-24 md:py-32 relative border-y border-border">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-60" 
          style={{ backgroundImage: `url(${aerialBg})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/95 via-background/80 to-background/95" />
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
            {services.slice(0, 6).map((service, index) => (
              <ServiceCard key={service.id} service={service} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* PROJECTS PREVIEW */}
      <section className="py-24 md:py-32 bg-background relative overflow-hidden">
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
            {projects.slice(0, 2).map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="group relative aspect-[4/3] rounded-2xl overflow-hidden block"
              >
                <Link href={`/projects?id=${project.id}`} className="block w-full h-full">
                  <img 
                    src={project.image} 
                    alt={project.title} 
                    loading="lazy"
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
            <h2 className="text-4xl md:text-6xl font-display mb-6"><EditableText id="cta_title_1" defaultText="Ready to Build Something " /><span className="text-primary"><EditableText id="cta_title_2" defaultText="Extraordinary?" /></span></h2>
            <p className="text-muted-foreground text-lg mb-10"><EditableText id="cta_subtitle" defaultText="Let's discuss your next monumental project. Our team of engineering experts is ready to bring your vision to life." /></p>
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
