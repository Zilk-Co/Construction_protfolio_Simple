import { motion } from "framer-motion";
import PageTransition from "@/components/PageTransition";
import { services } from "@/lib/data";
import * as Icons from "lucide-react";
import { Link } from "wouter";

export default function Services() {
  return (
    <PageTransition>
      {/* Hero */}
      <section className="relative py-20 md:py-28 bg-[#050505] overflow-hidden border-b border-white/5">
        <div className="absolute top-0 right-0 w-[50vw] h-[50vw] bg-primary/10 blur-[150px] rounded-full mix-blend-screen translate-x-1/2 -translate-y-1/2" />
        
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-block mb-6"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-[1px] bg-primary" />
                <span className="uppercase tracking-widest text-sm font-semibold text-primary">Expertise</span>
              </div>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-5xl md:text-7xl font-display mb-8 leading-tight"
            >
              Comprehensive <br />
              <span className="text-primary">Engineering</span> Services
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-muted-foreground font-light leading-relaxed"
            >
              From concept to completion, we provide end-to-end solutions for complex construction challenges, ensuring precision, safety, and efficiency at every stage.
            </motion.p>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-24 md:py-32 relative z-10">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => {
              const Icon = Icons[service.icon as keyof typeof Icons] as React.ElementType;
              return (
                <Link key={service.id} href={`/services/${service.id}`}>
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="group h-full p-8 rounded-2xl bg-card border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/5 relative overflow-hidden flex flex-col"
                  >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full -mr-16 -mt-16 transition-transform duration-500 group-hover:scale-150" />
                    
                    <div className="mb-8 p-4 rounded-xl bg-background inline-block border border-border group-hover:border-primary/30 group-hover:bg-primary/10 transition-colors self-start">
                      {Icon && <Icon size={32} className="text-primary" />}
                    </div>
                    
                    <h3 className="text-2xl font-display mb-4">{service.title}</h3>
                    <p className="text-muted-foreground leading-relaxed flex-grow">
                      {service.description}
                    </p>

                    <div className="mt-8 pt-6 border-t border-border flex items-center justify-between text-sm font-semibold uppercase tracking-widest text-muted-foreground group-hover:text-primary transition-colors cursor-pointer">
                      <span>Learn More</span>
                      <Icons.ArrowRight size={16} className="-translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300" />
                    </div>
                  </motion.div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-24 md:py-32 bg-[#050505] border-t border-white/5">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-4xl md:text-5xl font-display mb-6">Our Methodology</h2>
            <p className="text-muted-foreground">A proven systematic approach to delivering monumental projects flawlessly.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
            {/* Connecting line for desktop */}
            <div className="hidden md:block absolute top-12 left-[10%] right-[10%] h-[1px] bg-border" />

            {[
              { step: "01", title: "Consultation", desc: "Deep dive into requirements, site analysis, and feasibility studies." },
              { step: "02", title: "Planning & Design", desc: "Rigorous architectural drafting and structural engineering blueprints." },
              { step: "03", title: "Execution", desc: "Flawless on-site construction driven by skilled project managers." },
              { step: "04", title: "Handover", desc: "Rigorous QA testing, final inspections, and seamless delivery." }
            ].map((phase, i) => (
              <motion.div 
                key={phase.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="relative z-10 flex flex-col items-center text-center"
              >
                <div className="w-24 h-24 rounded-full bg-[#050505] border-2 border-primary flex items-center justify-center text-2xl font-display text-primary mb-6 shadow-[0_0_30px_rgba(37,99,235,0.15)]">
                  {phase.step}
                </div>
                <h4 className="text-xl font-display mb-3">{phase.title}</h4>
                <p className="text-sm text-muted-foreground">{phase.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </PageTransition>
  );
}
