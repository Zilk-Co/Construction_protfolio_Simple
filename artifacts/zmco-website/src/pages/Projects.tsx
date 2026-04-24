import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PageTransition from "@/components/PageTransition";
import { projects } from "@/lib/data";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

const filters = [
  { id: "all", label: "All Projects" },
  { id: "in-progress", label: "In Progress" },
  { id: "completed", label: "Completed" },
  { id: "upcoming", label: "Upcoming" },
];

export default function Projects() {
  const [activeFilter, setActiveFilter] = useState("all");
  const [selectedProject, setSelectedProject] = useState<typeof projects[0] | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const openId = params.get("open");
    if (openId) {
      const found = projects.find((p) => p.id === openId);
      if (found) setSelectedProject(found);
    }
  }, []);

  const filteredProjects = projects.filter(
    (p) => activeFilter === "all" || p.status === activeFilter
  );

  return (
    <PageTransition>
      {/* Hero */}
      <section className="relative py-20 md:py-28 bg-[#050505] border-b border-white/5">
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-4 mb-6"
            >
              <div className="w-12 h-[1px] bg-primary" />
              <span className="uppercase tracking-widest text-sm font-semibold text-primary">Portfolio</span>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-5xl md:text-7xl font-display mb-8 leading-tight"
            >
              Featured <br />
              <span className="text-primary">Developments</span>
            </motion.h1>
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-12 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
          
          {/* Filters */}
          <div className="flex overflow-x-auto pb-4 mb-12 gap-2 hide-scrollbar scroll-smooth">
            {filters.map((filter) => (
              <button
                key={filter.id}
                onClick={() => setActiveFilter(filter.id)}
                className={`px-6 py-3 rounded-full text-sm font-semibold uppercase tracking-widest whitespace-nowrap transition-all ${
                  activeFilter === filter.id 
                    ? "bg-primary text-primary-foreground" 
                    : "bg-card border border-border text-muted-foreground hover:border-primary/50 hover:text-foreground"
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>

          {/* Grid */}
          <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence mode="popLayout">
              {filteredProjects.map((project) => (
                <motion.div
                  key={project.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4 }}
                  className="group relative aspect-[4/5] rounded-2xl overflow-hidden bg-card cursor-pointer"
                  onClick={() => setSelectedProject(project)}
                >
                  <img 
                    src={project.image} 
                    alt={project.title} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  
                  {/* Status Badge */}
                  <div className="absolute top-4 right-4 z-20">
                    <span className={`px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full backdrop-blur-md border ${
                      project.status === 'completed' ? 'bg-green-500/20 text-green-400 border-green-500/30' :
                      project.status === 'in-progress' ? 'bg-primary/20 text-primary border-primary/30' :
                      'bg-white/10 text-white border-white/20'
                    }`}>
                      {project.status.replace('-', ' ')}
                    </span>
                  </div>

                  {/* Content Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-end p-6 md:p-8">
                    <div className="translate-y-8 group-hover:translate-y-0 transition-transform duration-300">
                      <div className="flex items-center gap-3 mb-3 text-white/70 text-xs font-semibold uppercase tracking-wider">
                        <span>{project.category}</span>
                        <span className="w-1 h-1 rounded-full bg-primary" />
                        <span>{project.location}</span>
                        <span className="w-1 h-1 rounded-full bg-primary" />
                        <span>{project.year}</span>
                      </div>
                      
                      <h3 className="text-2xl md:text-3xl font-display text-white mb-3">{project.title}</h3>
                      
                      <div className="overflow-hidden">
                        <p className="text-white/60 text-sm leading-relaxed translate-y-full group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300 delay-100">
                          {project.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
          
          {filteredProjects.length === 0 && (
            <div className="text-center py-20">
              <p className="text-muted-foreground">No projects found for this category.</p>
            </div>
          )}

        </div>
      </section>

      {/* Project Detail Dialog */}
      <Dialog open={!!selectedProject} onOpenChange={(open) => !open && setSelectedProject(null)}>
        <DialogContent className="max-w-4xl bg-card border-border/50 max-h-[90vh] overflow-y-auto">
          {selectedProject && (
            <>
              <DialogHeader className="mb-6">
                <div className="flex items-center gap-3 mb-2 text-primary text-xs font-semibold uppercase tracking-wider">
                  <span>{selectedProject.category}</span>
                  <span className="w-1 h-1 rounded-full bg-primary" />
                  <span>{selectedProject.location}</span>
                  <span className="w-1 h-1 rounded-full bg-primary" />
                  <span>{selectedProject.year}</span>
                </div>
                <DialogTitle className="text-3xl font-display">{selectedProject.title}</DialogTitle>
                <DialogDescription className="text-base text-muted-foreground mt-4 leading-relaxed">
                  {selectedProject.description}
                </DialogDescription>
              </DialogHeader>

              {/* Gallery */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {selectedProject.gallery ? (
                  selectedProject.gallery.map((img, i) => (
                    <div key={i} className={`rounded-xl overflow-hidden ${i === 0 ? "md:col-span-2 aspect-video" : "aspect-[4/3]"}`}>
                      <img src={img} alt={`${selectedProject.title} view ${i + 1}`} className="w-full h-full object-cover" />
                    </div>
                  ))
                ) : (
                  <div className="md:col-span-2 rounded-xl overflow-hidden aspect-video">
                    <img src={selectedProject.image} alt={selectedProject.title} className="w-full h-full object-cover" />
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </PageTransition>
  );
}
