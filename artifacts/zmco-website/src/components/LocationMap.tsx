import { MapPin } from "lucide-react";
import { motion } from "framer-motion";

export default function LocationMap() {
  const address = "House 53, Street 12, Sector 2, Naval Colony, Baldia Hub River Road, Karachi, Sindh, Pakistan";
  const mapUrl = `https://www.google.com/maps?q=${encodeURIComponent(address)}&output=embed`;

  return (
    <section className="py-24 relative bg-[#050505] border-t border-white/5">
      <div className="absolute inset-0 bg-[url('/src/assets/bg-underpass.png')] bg-cover bg-center opacity-30 mix-blend-luminosity" />
      <div className="absolute inset-0 bg-gradient-to-b from-[#050505]/95 via-[#050505]/80 to-[#050505]/95" />
      
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center gap-4 justify-center mb-6"
          >
            <div className="w-8 h-[1px] bg-primary" />
            <span className="uppercase tracking-widest text-sm font-semibold text-primary flex items-center gap-2">
              <MapPin size={16} /> Find Us
            </span>
            <div className="w-8 h-[1px] bg-primary" />
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-display mb-6"
          >
            Location
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-muted-foreground text-lg max-w-2xl mx-auto"
          >
            {address}
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="rounded-3xl overflow-hidden border border-primary/20 shadow-[0_0_40px_rgba(37,99,235,0.1)] relative"
        >
          <iframe
            src={mapUrl}
            width="100%"
            height="450"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            style={{ border: 0 }}
            title="ZMC Location"
            className="w-full h-[400px] md:h-[500px]"
          />
        </motion.div>
      </div>
    </section>
  );
}
