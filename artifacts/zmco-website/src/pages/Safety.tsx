import { motion } from "framer-motion";
import PageTransition from "@/components/PageTransition";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Link } from "wouter";

const safetyTopics = [
  {
    title: "Health, Safety & Environment (HSE) Policy",
    content: "At Zain Manzoor & Co, our HSE policy is the cornerstone of our operations. We believe that every accident is preventable and that a safe working environment is a fundamental right. Our comprehensive HSE framework ensures that environmental protection, occupational health, and safety are integrated into all phases of our construction and engineering projects.\n\nWe mandate strict compliance with both national regulations and international best practices. Regular audits, continuous monitoring, and proactive risk mitigation strategies form the basis of our commitment to zero-harm operations across all project sites."
  },
  {
    title: "Worker Welfare & Training",
    content: "Our workforce is our most valuable asset. We are deeply committed to the physical and mental well-being of every individual on our sites. We provide extensive, mandatory safety inductions and continuous skill development programs tailored to specific roles and hazards.\n\nBeyond training, we ensure that our workers have access to clean drinking water, shaded rest areas, and proper sanitation facilities. We foster a culture where workers are empowered to report unsafe conditions without hesitation, knowing their welfare is our top priority."
  },
  {
    title: "Site Safety Protocols",
    content: "Every project site operates under a rigorous set of safety protocols designed to manage high-risk activities such as working at heights, heavy lifting, and excavation. Access to our sites is strictly controlled, and daily toolbox talks are conducted to align the team on the day's specific hazards.\n\nSite safety officers are permanently deployed to enforce these protocols. We utilize clear signage, secure barricading, and established exclusion zones to protect both our workers and the public from construction-related dangers."
  },
  {
    title: "Personal Protective Equipment (PPE)",
    content: "The use of high-quality Personal Protective Equipment is non-negotiable at Zain Manzoor & Co. We provide all personnel with the necessary gear, including impact-resistant hard hats, high-visibility vests, steel-toed boots, safety harnesses, and specialized eye and ear protection based on their tasks.\n\nWe continuously inspect PPE for wear and tear, ensuring immediate replacement when necessary. Strict enforcement policies guarantee that no individual enters an active work zone without the appropriate protective gear."
  },
  {
    title: "Risk Assessment & Hazard Management",
    content: "Before ground is broken on any project, our engineering and safety teams conduct exhaustive risk assessments. We identify potential hazards associated with specific site conditions, materials, and construction methods, subsequently designing targeted control measures to mitigate these risks.\n\nThis is not a one-time process; hazard management is dynamic. As projects evolve and new phases begin, we re-evaluate our risk assessments, adapting our strategies to maintain a secure environment amidst changing project variables."
  },
  {
    title: "Equipment & Machinery Safety",
    content: "Our extensive fleet of heavy machinery, including HOWO dump trucks and CAT excavators, is maintained to the highest operational standards. We enforce a rigorous preventative maintenance schedule, conducted by certified mechanics, to prevent catastrophic equipment failures on site.\n\nOnly trained, certified, and authorized operators are permitted to handle our heavy equipment. Strict operational guidelines, including speed limits, spotter requirements for reversing, and pre-start daily inspections, are rigorously enforced to prevent machinery-related incidents."
  },
  {
    title: "Quality Assurance & Quality Control",
    content: "We believe that quality and safety are inextricably linked; a poorly constructed structure is inherently unsafe. Our Quality Assurance and Quality Control (QA/QC) protocols dictate rigorous testing of all materials—from concrete compressive strength to steel tensile resilience.\n\nOur QA/QC engineers conduct systematic inspections at every critical milestone. This meticulous oversight guarantees that the final delivered project not only meets architectural specifications but also possesses the structural integrity required to ensure long-term public safety."
  },
  {
    title: "Environmental Care & Sustainability",
    content: "Zain Manzoor & Co is dedicated to minimizing the environmental footprint of our construction activities. We implement robust waste management plans, prioritizing the recycling of construction debris and responsible disposal of hazardous materials to prevent soil and water contamination.\n\nWe actively seek to incorporate sustainable practices into our projects, from dust suppression techniques and noise reduction measures to optimizing material usage and energy efficiency. We strive to leave the communities in which we operate better than we found them."
  },
  {
    title: "Emergency Response & Preparedness",
    content: "While we work tirelessly to prevent incidents, we are fully prepared to respond effectively should an emergency arise. Every site features a customized Emergency Response Plan (ERP) detailing clear evacuation routes, assembly points, and communication protocols.\n\nWe maintain well-equipped first aid stations and ensure trained first responders are always present on site. Regular emergency drills are conducted to guarantee that our teams can react swiftly and calmly to incidents ranging from medical emergencies to natural disasters."
  },
  {
    title: "Community Engagement & Care",
    content: "Our construction projects do not exist in isolation; they are part of living communities. We take our responsibility as a corporate neighbor seriously. We engage with local stakeholders prior to project commencement to address concerns regarding traffic, noise, and site security.\n\nWe implement strict traffic management plans to minimize disruption to local roads and enforce specific working hours to reduce noise pollution. Our goal is to ensure that our operations respect the daily lives of the people residing in the vicinity of our projects."
  }
];

export default function Safety() {
  return (
    <PageTransition>
      {/* Hero Section */}
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
                <span className="uppercase tracking-widest text-sm font-semibold text-primary">Commitment</span>
                <div className="w-12 h-[1px] bg-primary" />
              </div>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-5xl md:text-7xl font-display mb-8 leading-tight"
            >
              Safety & <span className="text-primary">Care</span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-muted-foreground font-light max-w-2xl mx-auto leading-relaxed"
            >
              Zero compromises. We build with a profound responsibility toward our workforce, the environment, and the communities we serve.
            </motion.p>
          </div>
        </div>
      </section>

      {/* Accordion Section */}
      <section className="py-24 md:py-32">
        <div className="container mx-auto px-4 md:px-6 max-w-4xl">
          <Accordion type="single" collapsible className="w-full space-y-4">
            {safetyTopics.map((topic, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
              >
                <AccordionItem value={`item-${index}`} className="bg-card border border-border px-6 py-2 rounded-xl">
                  <AccordionTrigger className="text-left text-xl font-display hover:no-underline hover:text-primary transition-colors">
                    {topic.title}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed whitespace-pre-wrap pt-4 border-t border-border mt-2">
                    {topic.content}
                  </AccordionContent>
                </AccordionItem>
              </motion.div>
            ))}
          </Accordion>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-primary/10 border-t border-primary/20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-5xl font-display mb-6">Have questions about our practices?</h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">We are transparent about our safety records and protocols. Reach out to our HSE department for more detailed information.</p>
          <Link href="/contact" className="inline-flex px-8 py-4 bg-primary text-primary-foreground font-bold uppercase tracking-wider text-sm rounded-sm hover:bg-primary/90 transition-all">
            Contact Us
          </Link>
        </div>
      </section>
    </PageTransition>
  );
}