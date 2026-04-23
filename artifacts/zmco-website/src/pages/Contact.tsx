import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Phone, Mail, Send } from "lucide-react";
import { toast } from "sonner";
import PageTransition from "@/components/PageTransition";
import LocationMap from "@/components/LocationMap";

export default function Contact() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success("Message Sent Successfully", {
        description: "Thank you for reaching out. Our team will get back to you shortly.",
      });
      (e.target as HTMLFormElement).reset();
    }, 1500);
  };

  return (
    <PageTransition>
      {/* Hero */}
      <section className="relative py-20 md:py-28 bg-[#050505] overflow-hidden border-b border-white/5">
        <div className="absolute top-1/2 left-0 w-96 h-96 bg-primary/10 blur-[150px] rounded-full mix-blend-screen -translate-y-1/2 -translate-x-1/2" />
        
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-4 mb-6"
            >
              <div className="w-12 h-[1px] bg-primary" />
              <span className="uppercase tracking-widest text-sm font-semibold text-primary">Get in Touch</span>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-5xl md:text-7xl font-display mb-8 leading-tight"
            >
              Start Your <br />
              <span className="text-primary">Project</span> With Us
            </motion.h1>
          </div>
        </div>
      </section>

      <section className="py-24 relative">
        <div className="absolute inset-0 bg-[url('/src/assets/bg-highway.png')] bg-cover bg-center opacity-30 mix-blend-luminosity" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#050505]/95 via-[#050505]/80 to-[#050505]/95" />
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            
            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-display mb-8">Contact Information</h2>
              <p className="text-muted-foreground mb-12 max-w-md">
                Whether you have a multi-million rupee commercial project or need structural consultation, we are ready to build the future together.
              </p>

              <div className="space-y-8">
                <div className="flex items-start gap-6 group">
                  <div className="w-14 h-14 rounded-full bg-card border border-border flex items-center justify-center shrink-0 group-hover:border-primary/50 group-hover:text-primary transition-colors">
                    <MapPin />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold uppercase tracking-widest text-primary mb-2">Head Office</h4>
                    <p className="text-xl text-foreground font-display">Pakistan</p>
                  </div>
                </div>

                <div className="flex items-start gap-6 group">
                  <div className="w-14 h-14 rounded-full bg-card border border-border flex items-center justify-center shrink-0 group-hover:border-primary/50 group-hover:text-primary transition-colors">
                    <Phone />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold uppercase tracking-widest text-primary mb-2">Phone</h4>
                    <a href="tel:03152185221" className="text-xl text-foreground font-display hover:text-primary transition-colors">0315 2185221</a>
                  </div>
                </div>

                <div className="flex items-start gap-6 group">
                  <div className="w-14 h-14 rounded-full bg-card border border-border flex items-center justify-center shrink-0 group-hover:border-primary/50 group-hover:text-primary transition-colors">
                    <Mail />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold uppercase tracking-widest text-primary mb-2">Email</h4>
                    <a href="mailto:zmco2025@gmail.com" className="text-xl text-foreground font-display hover:text-primary transition-colors">zmco2025@gmail.com</a>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-card border border-border rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-bl-full -mr-32 -mt-32" />
              
              <h2 className="text-3xl font-display mb-8 relative z-10">Send a Message</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Full Name</label>
                    <input 
                      type="text" 
                      id="name" 
                      required
                      className="w-full bg-background border border-border rounded-lg px-4 py-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-foreground"
                      placeholder="John Doe"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Email Address</label>
                    <input 
                      type="email" 
                      id="email" 
                      required
                      className="w-full bg-background border border-border rounded-lg px-4 py-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-foreground"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="subject" className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Subject / Project Type</label>
                  <input 
                    type="text" 
                    id="subject" 
                    required
                    className="w-full bg-background border border-border rounded-lg px-4 py-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-foreground"
                    placeholder="e.g. Commercial Construction Inquiry"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="message" className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Message</label>
                  <textarea 
                    id="message" 
                    required
                    rows={5}
                    className="w-full bg-background border border-border rounded-lg px-4 py-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-foreground resize-none"
                    placeholder="Tell us about your project requirements..."
                  />
                </div>

                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full bg-primary text-primary-foreground font-bold uppercase tracking-wider text-sm rounded-lg px-6 py-4 flex items-center justify-center gap-2 hover:bg-primary/90 transition-all disabled:opacity-70"
                >
                  {isSubmitting ? (
                    "Sending..."
                  ) : (
                    <>
                      Send Message
                      <Send size={16} />
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          </div>
        </div>
      </section>

      <LocationMap />
    </PageTransition>
  );
}
