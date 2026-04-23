import { useParams, Link } from "wouter";
import { motion } from "framer-motion";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import PageTransition from "@/components/PageTransition";
import { services } from "@/lib/data";

export default function ServiceDetail() {
  const params = useParams();
  const serviceId = params.id;
  const service = services.find((s) => s.id === serviceId);

  if (!service) {
    return (
      <PageTransition>
        <div className="min-h-screen flex flex-col items-center justify-center pt-20">
          <h1 className="text-4xl font-display mb-4">Service Not Found</h1>
          <Link href="/services" className="text-primary hover:underline">
            Return to Services
          </Link>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      {/* Hero Section */}
      <section className="relative py-20 md:py-28 bg-[#050505] overflow-hidden border-b border-white/5">
        <div className="absolute top-0 right-0 w-[50vw] h-[50vw] bg-primary/10 blur-[150px] rounded-full mix-blend-screen translate-x-1/2 -translate-y-1/2" />
        
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <Link href="/services" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors text-sm font-semibold uppercase tracking-widest">
                <ArrowLeft size={16} />
                Back to Services
              </Link>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-5xl md:text-7xl font-display mb-8 leading-tight"
            >
              {service.title}
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-muted-foreground font-light leading-relaxed max-w-3xl"
            >
              {service.longDescription}
            </motion.p>
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            
            {/* Capabilities & Benefits */}
            <div className="space-y-16">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-8 h-[1px] bg-primary" />
                  <h3 className="text-2xl font-display uppercase tracking-wider">What We Do</h3>
                </div>
                <ul className="space-y-4">
                  {service.capabilities.map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-muted-foreground">
                      <CheckCircle2 size={20} className="text-primary shrink-0 mt-0.5" />
                      <span className="leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-8 h-[1px] bg-primary" />
                  <h3 className="text-2xl font-display uppercase tracking-wider">Why Choose Us</h3>
                </div>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {service.benefits.map((benefit, i) => (
                    <li key={i} className="bg-card border border-border p-6 rounded-2xl">
                      <span className="text-primary font-bold text-sm block mb-2">{String(i + 1).padStart(2, '0')}</span>
                      <p className="text-sm leading-relaxed">{benefit}</p>
                    </li>
                  ))}
                </ul>
              </motion.div>
            </div>

            {/* Process */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-[#050505] p-8 md:p-12 rounded-3xl border border-white/5 h-fit"
            >
              <h3 className="text-3xl font-display mb-10">Our Process</h3>
              <div className="space-y-10 relative">
                {/* Vertical connecting line */}
                <div className="absolute left-[23px] top-6 bottom-6 w-[2px] bg-border" />
                
                {service.process.map((step, i) => (
                  <div key={i} className="relative z-10 flex gap-6">
                    <div className="w-12 h-12 rounded-full bg-background border-2 border-primary flex items-center justify-center text-primary font-bold shrink-0">
                      {step.step}
                    </div>
                    <div>
                      <h4 className="text-xl font-display mb-2">{step.title}</h4>
                      <p className="text-muted-foreground text-sm leading-relaxed">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-primary/10 border-t border-primary/20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-5xl font-display mb-6">Need this service?</h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">Contact us today to discuss your project requirements and see how our expertise can add value.</p>
          <Link href="/contact" className="inline-flex px-8 py-4 bg-primary text-primary-foreground font-bold uppercase tracking-wider text-sm rounded-sm hover:bg-primary/90 transition-all">
            Get in Touch
          </Link>
        </div>
      </section>

    </PageTransition>
  );
}