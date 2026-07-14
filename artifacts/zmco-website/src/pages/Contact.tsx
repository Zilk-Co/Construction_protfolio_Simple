import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { MapPin, Phone, Mail, Send } from "lucide-react";
import { toast } from "sonner";
import PageTransition from "@/components/PageTransition";
import LocationMap from "@/components/LocationMap";
import highwayBg from "@/assets/bg-highway.png";
import heroContactBg from "@/assets/hero-contact.png";

export default function Contact() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const captchaRef = useRef<HTMLDivElement>(null);
  const widgetId = useRef<number | null>(null);

  useEffect(() => {
    // Function to render reCAPTCHA
    const renderCaptcha = () => {
      // @ts-ignore
      if (window.grecaptcha && captchaRef.current && widgetId.current === null) {
        // @ts-ignore
        widgetId.current = window.grecaptcha.render(captchaRef.current, {
          sitekey: "6Lf19OksAAAAAEUc6j5bwlefQBOPH5nPxrwwMhYu",
          theme: "dark",
        });
      }
    };

    let interval: any = null;

    // If script is already loaded
    // @ts-ignore
    if (window.grecaptcha && window.grecaptcha.render) {
      renderCaptcha();
    } else {
      // Wait for script to load if it hasn't yet
      interval = setInterval(() => {
        // @ts-ignore
        if (window.grecaptcha && window.grecaptcha.render) {
          renderCaptcha();
          if (interval) clearInterval(interval);
        }
      }, 500);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // @ts-ignore
    const captchaToken = widgetId.current !== null ? window.grecaptcha?.getResponse(widgetId.current) : null;
    
    if (!captchaToken) {
      toast.error("Please complete the reCAPTCHA", {
        description: "We need to verify that you are not a robot.",
      });
      return;
    }

    setIsSubmitting(true);
    
    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name"),
      email: formData.get("email"),
      subject: formData.get("subject"),
      message: formData.get("message"),
      captchaToken
    };

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        toast.success("Message Sent Successfully", {
          description: "Thank you for reaching out. Our team will get back to you shortly.",
        });
        (e.target as HTMLFormElement).reset();
        // @ts-ignore
        if (widgetId.current !== null) window.grecaptcha?.reset(widgetId.current);
      } else {
        const errorData = await response.json();
        toast.error("Failed to send message", {
          description: errorData.message || "Something went wrong. Please try again later.",
        });
      }
    } catch (error) {
      toast.error("Connection Error", {
        description: "Could not connect to the server. Please check your internet connection.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageTransition>
      {/* Hero with background image */}
      <section className="relative py-24 md:py-36 overflow-hidden border-b border-border">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroContactBg})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/70 to-background" />

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

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-muted-foreground font-light leading-relaxed max-w-xl"
            >
              Whether you have a large commercial project or need structural consultation, we are ready to build the future together.
            </motion.p>
          </div>
        </div>
      </section>

      <section className="py-24 relative">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-55" 
          style={{ backgroundImage: `url(${highwayBg})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/95 via-background/80 to-background/95" />
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
                    <a href="tel:+92123456789" className="text-xl text-foreground font-display hover:text-primary transition-colors">+92 123456789</a>
                  </div>
                </div>

                <div className="flex items-start gap-6 group">
                  <div className="w-14 h-14 rounded-full bg-card border border-border flex items-center justify-center shrink-0 group-hover:border-primary/50 group-hover:text-primary transition-colors">
                    <Mail />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold uppercase tracking-widest text-primary mb-2">Email</h4>
                    <a href="mailto:zmc@gmail.com" className="text-xl text-foreground font-display hover:text-primary transition-colors">zmc@gmail.com</a>
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
                      name="name"
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
                      name="email"
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
                    name="subject"
                    required
                    className="w-full bg-background border border-border rounded-lg px-4 py-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-foreground"
                    placeholder="e.g. Commercial Construction Inquiry"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="message" className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Message</label>
                  <textarea 
                    id="message" 
                    name="message"
                    required
                    rows={5}
                    className="w-full bg-background border border-border rounded-lg px-4 py-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-foreground resize-none"
                    placeholder="Tell us about your project requirements..."
                  />
                </div>

                {/* reCAPTCHA Widget Container */}
                <div className="flex justify-center md:justify-start">
                  <div ref={captchaRef}></div>
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
