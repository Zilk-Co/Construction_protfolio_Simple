import { motion } from "framer-motion";
import PageTransition from "@/components/PageTransition";
import ceoImage from "@/assets/ceo.jpeg";
import heroImg from "@/assets/hero.png";
import bgCanal from "@/assets/bg-canal.png";

export default function About() {
  return (
    <PageTransition>
      {/* Hero */}
      <section className="relative py-20 md:py-28 bg-[#050505] overflow-hidden border-b border-white/5">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-4xl">
          <div className="absolute inset-0 bg-primary/10 blur-[150px] rounded-full mix-blend-screen" />
        </div>
        
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-block mb-6"
            >
              <div className="flex items-center gap-4 justify-center">
                <div className="w-12 h-[1px] bg-primary" />
                <span className="uppercase tracking-widest text-sm font-semibold text-primary">About Us</span>
                <div className="w-12 h-[1px] bg-primary" />
              </div>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-5xl md:text-7xl font-display mb-8 leading-tight"
            >
              Building Pakistan's <br />
              <span className="text-primary">Infrastructure</span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-muted-foreground font-light max-w-2xl mx-auto leading-relaxed"
            >
              Zain Manzoor & Co is a leading construction and engineering firm dedicated to transforming the urban landscape with uncompromising quality and integrity.
            </motion.p>
          </div>
        </div>
      </section>

      {/* History & Journey */}
      <section className="py-24 md:py-32">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative aspect-square rounded-2xl overflow-hidden"
            >
              <img 
                src={heroImg} 
                alt="Construction Journey" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-display mb-8">Our Journey of Excellence</h2>
              <div className="prose prose-invert prose-lg text-muted-foreground font-light">
                <p>
                  Established with a vision to revolutionize the construction industry in Pakistan, Zain Manzoor & Co has grown into a powerhouse of engineering capability and architectural execution.
                </p>
                <p>
                  Our foundation is built on deep technical expertise and a relentless pursuit of perfection. From complex commercial high-rises to intricate civil infrastructure, we approach every project with the same level of dedication and meticulous planning.
                </p>
                <p>
                  We don't just build structures; we build relationships. Our long-standing partnerships with clients, architects, and subcontractors are a testament to our transparent processes and reliable delivery.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-24 md:py-32 relative border-y border-white/5">
        <div className="absolute inset-0 bg-cover bg-center opacity-60" style={{ backgroundImage: `url(${bgCanal})` }} />
        <div className="absolute inset-0 bg-gradient-to-b from-[#050505]/95 via-[#050505]/80 to-[#050505]/95" />
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl md:text-5xl font-display mb-6">Our Core Values</h2>
            <p className="text-muted-foreground">The principles that guide every brick we lay and every design we draft.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { title: "Integrity", desc: "Uncompromising honesty and transparency in all our dealings." },
              { title: "Excellence", desc: "A relentless pursuit of quality in every structural detail." },
              { title: "Safety", desc: "Zero-compromise approach to the well-being of our workforce." },
              { title: "Innovation", desc: "Embracing modern engineering solutions to solve complex challenges." }
            ].map((value, i) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-8 rounded-2xl bg-card border border-border"
              >
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-display text-xl mb-6">
                  {i + 1}
                </div>
                <h3 className="text-2xl font-display mb-4">{value.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{value.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Leadership */}
      <section className="py-24 md:py-32">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center gap-4 mb-16 justify-center">
              <div className="w-12 h-[1px] bg-primary" />
              <span className="uppercase tracking-widest text-sm font-semibold text-primary">Leadership</span>
              <div className="w-12 h-[1px] bg-primary" />
            </div>

            <div className="flex flex-col md:flex-row gap-12 items-center bg-card border border-border rounded-3xl p-8 md:p-12">
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="w-64 h-64 shrink-0 rounded-full overflow-hidden border-4 border-primary/20"
              >
                <img src={ceoImage} alt="Muneer Ahmed" className="w-full h-full object-cover scale-[1.7] -translate-y-6 transition-transform duration-500" style={{ objectPosition: "50% 30%" }} />
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <h3 className="text-3xl font-display mb-2">Muneer Ahmed</h3>
                <p className="text-primary uppercase tracking-widest text-sm font-semibold mb-6">Chief Executive Officer</p>
                <p className="text-muted-foreground leading-relaxed italic mb-6">
                  "Construction is more than assembling materials; it is the physical manifestation of vision, ambition, and progress. At Zain Manzoor & Co, we take immense pride in our role as nation-builders, delivering projects that serve as catalysts for economic and social development."
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </PageTransition>
  );
}
