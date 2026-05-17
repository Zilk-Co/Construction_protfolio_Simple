import { useState, useEffect } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import PageTransition from "@/components/PageTransition";
import * as Icons from "lucide-react";
import { Link } from "wouter";
import heroServicesBg from "@/assets/hero-services.png";
import bgSafetyPattern from "@/assets/bg_safety_pattern.png";
import { EditableText } from "@/context/AdminContext";

type Service = { id: string; title: string; description: string; longDescription: string; icon: string; capabilities?: string[]; benefits?: string[]; process?: any[]; };
type Project = { id: string; title: string; serviceIds?: string[] };

export default function Services() {
  const [services, setServices] = useState<Service[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/services').then(res => res.json()),
      fetch('/api/projects').then(res => res.json())
    ])
      .then(([servicesData, projectsData]) => {
        setServices(servicesData);
        setProjects(projectsData);
        setLoading(false);
      })
      .catch(console.error);
  }, []);

  return (
    <PageTransition>
      {/* Hero with background image */}
      <section className="relative py-24 md:py-48 overflow-hidden border-b border-border">
        {/* Full hero image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroServicesBg})`, opacity: 0.5 }}
        />
        {/* Dark gradient overlays for readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/70 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/60" />

        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-block mb-8"
            >
              <div className="flex items-center gap-4 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                <span className="uppercase tracking-[0.3em] text-[10px] font-black text-primary">Core Expertise</span>
              </div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-6xl md:text-9xl font-display mb-10 leading-[0.9] text-foreground"
            >
              <EditableText id="services_hero_title_1" defaultText="Operational" /> <br />
              <span className="text-primary"><EditableText id="services_hero_title_2" defaultText="Services" /></span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-xl md:text-2xl text-muted-foreground font-light leading-relaxed max-w-2xl"
            >
              <EditableText id="services_hero_subtitle" defaultText="Delivering end-to-end infrastructure solutions with uncompromising quality and safety standards." />
            </motion.p>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-24 relative z-10 overflow-hidden animate-fade-in" style={{ backgroundColor: 'var(--service-bg)', transition: 'background-color 0.5s ease' }}>
        {/* Subtle grid texture */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '32px 32px' }}
        />
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <ServiceCard 
                key={service.id} 
                service={service} 
                index={index} 
                projects={projects} 
              />
            ))}
          </div>
        </div>
      </section>

      {/* Methodology Section */}
      <section className="py-32 bg-background border-t border-border relative overflow-hidden">
        <div className="absolute inset-0 bg-primary/5 opacity-50" />
        
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="flex flex-col md:flex-row items-end justify-between mb-24 gap-8">
            <div className="max-w-2xl">
              <h2 className="text-5xl md:text-7xl font-display mb-8 text-foreground leading-tight">
                <EditableText id="services_method_title" defaultText="Systematic Engineering Excellence" />
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed">
                <EditableText id="services_method_subtitle" defaultText="Our methodology is built on decades of field experience and rigorous engineering standards." />
              </p>
            </div>
            <div className="hidden lg:block w-32 h-[1px] bg-white/20 mb-6" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { step: "01", title: "Strategy", desc: "Phase analysis and risk mitigation planning." },
              { step: "02", title: "Design", desc: "Advanced structural drafting and simulation." },
              { step: "03", title: "Execution", desc: "Real-time project monitoring and delivery." },
              { step: "04", title: "Quality", desc: "Rigorous ISO-standard inspections." }
            ].map((phase, i) => (
              <motion.div
                key={phase.step}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, type: "spring", stiffness: 100 }}
                className="group p-10 rounded-[32px] bg-card border border-border hover:border-primary/40 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/5 shadow-sm"
              >
                <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-2xl font-black text-primary mb-8 group-hover:bg-primary group-hover:text-white transition-all duration-500">
                  {phase.step}
                </div>
                <h4 className="text-2xl font-display mb-4 text-foreground">
                  <EditableText tagName="span" id={`services_phase_title_${i}`} defaultText={phase.title} />
                </h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  <EditableText tagName="span" id={`services_phase_desc_${i}`} defaultText={phase.desc} />
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </PageTransition>
  );
}

function ServiceCard({ service, index, projects }: { service: Service; index: number; projects: Project[] }) {
  const Icon = Icons[service.icon as keyof typeof Icons] as React.ElementType;
  const projectCount = projects.filter(p => p.serviceIds?.includes(service.id)).length;
  
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function onMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  const background = useTransform(
    [mouseX, mouseY],
    ([x, y]) => `radial-gradient(650px circle at ${x}px ${y}px, hsla(var(--primary) / 0.15), transparent 80%)`
  );

  return (
    <Link href={`/services/${service.id}`}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "0px" }}
        transition={{ duration: 0.4, delay: Math.min(index * 0.05, 0.2) }}
        onMouseMove={onMouseMove}
        className="group relative rounded-2xl overflow-hidden cursor-pointer h-full will-change-transform"
      >
        <div
          className="relative flex flex-col h-full p-8 rounded-2xl transition-all duration-500 group-hover:-translate-y-2 group-hover:shadow-premium-hover"
          style={{
            background: 'var(--service-card-bg)',
            border: '1px solid var(--service-card-border)',
            boxShadow: 'var(--service-card-shadow)',
          }}
        >
          {/* Top accent glow on hover */}
          <div className="absolute top-0 left-10 right-10 h-[1px] bg-gradient-to-r from-transparent via-primary/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          {/* Spotlight Effect */}
          <motion.div
            className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition duration-300 group-hover:opacity-100"
            style={{ background }}
          />

          {/* Decorative corner accent */}
          <div className="absolute top-0 right-0 w-32 h-32 rounded-bl-full -mr-16 -mt-16 blur-lg opacity-40 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500 pointer-events-none"
            style={{ background: 'var(--service-glow)', transform: 'translate3d(0,0,0)', backfaceVisibility: 'hidden' }} />

          {/* Project Badge */}
          <div className="mb-5 self-start px-3 py-1 bg-primary text-white rounded-full text-[9px] font-black uppercase tracking-widest shadow-lg shadow-primary/20 relative z-10">
            {projectCount} {projectCount === 1 ? 'Project' : 'Projects'}
          </div>

          {/* Icon */}
          <div
            className="mb-6 w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 relative z-10"
            style={{
              background: 'var(--icon-bg)',
              border: '1px solid var(--icon-border)',
              boxShadow: 'var(--icon-shadow)',
            }}
          >
            {Icon && <Icon size={28} className="text-primary transition-transform duration-300" />}
          </div>

          <h3 className="text-3xl font-display mb-4 text-card-foreground/90 group-hover:text-card-foreground transition-colors duration-300 relative z-10">
            {service.title}
          </h3>
          <p className="text-card-foreground/60 leading-relaxed flex-grow text-sm group-hover:text-card-foreground/80 transition-colors relative z-10">
            {service.description}
          </p>

          {/* CTA */}
          <div className="mt-6 pt-5 border-t border-card-border/40 flex items-center justify-between relative z-10">
            <span className="text-primary text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2 transition-all">
              Explore Capability
              <Icons.ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" />
            </span>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
