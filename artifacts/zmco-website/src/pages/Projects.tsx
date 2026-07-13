import { useState, useEffect, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PageTransition from "@/components/PageTransition";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogPortal } from "@/components/ui/dialog";
import ImageLightbox from "@/components/ImageLightbox";
import heroProjectsBg from "@/assets/hero-projects.png";
import { useLocation } from "wouter";
import { X, Loader2, Plus } from "lucide-react";
import { EditableText, EditableImage, useAdmin } from "@/context/AdminContext";

const filters = [
  { id: "all", label: "All Projects" },
  { id: "completed", label: "Completed" },
  { id: "in-progress", label: "In Progress" },
  { id: "upcoming", label: "Upcoming" },
  { id: "Residential", label: "Residential" },
  { id: "Commercial", label: "Commercial" },
  { id: "Industrial", label: "Industrial" },
  { id: "Infrastructure", label: "Infrastructure" },
  { id: "Institutional", label: "Institutional" }
];

type Project = { id: string; title: string; location: string; category: string; status: string; year: string; image: string; description: string; employer?: string; contractValue?: string; executedValue?: string; awarded?: string; completed?: string; scope?: string; gallery?: string[]; };

export default function Projects() {
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [location] = useLocation();
  const { isEditMode, token, uploadFile } = useAdmin();
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const dialogContentRef = useRef<HTMLDivElement>(null);
  const [galleryUrl, setGalleryUrl] = useState('');
  const [showGalleryUrlInput, setShowGalleryUrlInput] = useState(false);


  useEffect(() => {
    fetch('/api/projects')
      .then(res => res.json())
      .then(data => {
        setProjects(data);
        setLoading(false);
        // Handle opening project from URL parameter (e.g., /projects?id=p1)
        const params = new URLSearchParams(window.location.search);
        const projectId = params.get('id');
        if (projectId) {
          const project = data.find((p: Project) => p.id === projectId);
          if (project) {
            setSelectedProject(project);
          }
        }
      })
      .catch(console.error);
  }, [location]);

  const filteredProjects = useMemo(() => {
    return projects.filter(p => {
      const statusMatch = statusFilter === "all" || p.status === statusFilter;
      const categoryMatch = categoryFilter === "all" || p.category === categoryFilter;
      return statusMatch && categoryMatch;
    });
  }, [projects, statusFilter, categoryFilter]);

  const handleProjectUpdate = async (projId: string, updates: Partial<Project>) => {
    const proj = projects.find(p => p.id === projId);
    if (!proj) return;
    const next = { ...proj, ...updates };
    
    try {
      const res = await fetch(`/api/projects/${projId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(next),
      });
      if (res.ok) {
        const saved = await res.json();
        setProjects(prev => prev.map(p => p.id === projId ? saved : p));
        if (selectedProject?.id === projId) setSelectedProject(saved);
      }
    } catch (err) { console.error('Update error:', err); }
  };

  return (
    <PageTransition>
      {/* Hero with background image */}
      <section className="relative py-24 md:py-36 overflow-hidden border-b border-white/5">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroProjectsBg})` }}
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
              <span className="uppercase tracking-widest text-sm font-semibold text-primary">Portfolio</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-5xl md:text-7xl font-display mb-8 leading-tight"
            >
              <EditableText id="projects_hero_title_1" defaultText="Featured" /> <br />
              <span className="text-primary"><EditableText id="projects_hero_title_2" defaultText="Developments" /></span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-muted-foreground font-light leading-relaxed max-w-2xl"
            >
              <EditableText id="projects_hero_subtitle" defaultText="Landmark constructions delivered across Pakistan — from commercial towers to civil infrastructure." />
            </motion.p>
          </div>
        </div>
      </section>

      {/* Filter Bar */}
      <section className="py-8 border-b border-border bg-card/80">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col gap-4">
            {/* Status Filters */}
            <div className="flex flex-col items-center gap-3">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/60">Project Status</span>
              <div className="flex flex-wrap justify-center gap-2 md:gap-4">
                {[
                  { id: "all", label: "All Projects" },
                  { id: "completed", label: "Completed" },
                  { id: "in-progress", label: "In Progress" },
                  { id: "upcoming", label: "Upcoming" }
                ].map((filter) => (
                  <button
                    key={filter.id}
                    onClick={() => setStatusFilter(filter.id)}
                    className={`px-6 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all border ${
                      statusFilter === filter.id
                        ? "bg-primary border-primary text-primary-foreground shadow-lg shadow-primary/20"
                        : "border-white/10 text-muted-foreground hover:border-white/30"
                    }`}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Category Filters */}
            <div className="flex flex-col items-center gap-3 mt-4">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/60">Project Services</span>
              <div className="flex flex-wrap justify-center gap-2 md:gap-4">
                {[
                  { id: "all", label: "All Services" },
                  { id: "Residential", label: "Residential" },
                  { id: "Commercial", label: "Commercial" },
                  { id: "Industrial", label: "Industrial" },
                  { id: "Infrastructure", label: "Infrastructure" },
                  { id: "Institutional", label: "Institutional" }
                ].map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => setCategoryFilter(filter.id)}
                  className={`px-6 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all border ${
                    categoryFilter === filter.id
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-transparent text-muted-foreground border-white/10 hover:border-white/30"
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div 
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            <AnimatePresence mode="popLayout">
              {filteredProjects.map((project) => (
                <motion.div
                  key={project.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.25 }}
                  onClick={() => setSelectedProject(project)}
                  className="group relative bg-card border border-border rounded-2xl overflow-hidden hover:border-primary/50 transition-all duration-500 shadow-lg cursor-pointer aspect-[4/5]"
                >
                  <EditableImage 
                    id={`proj_img_${project.id}`}
                    defaultSrc={project.image} 
                    alt={project.title} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    onUpdate={(url) => handleProjectUpdate(project.id, { image: url })}
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
                  <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent flex flex-col justify-end p-6 md:p-8">
                    <div className="translate-y-4 group-hover:translate-y-0 transition-transform duration-500 ease-out">
                      <div className="flex items-center gap-3 mb-3 text-white/70 text-xs font-semibold uppercase tracking-wider">
                        <span>{project.category}</span>
                        <span className="w-1 h-1 rounded-full bg-primary" />
                        <span>{project.location}</span>
                        <span className="w-1 h-1 rounded-full bg-primary" />
                        <span>{project.year}</span>
                      </div>
                      
                      <h3 className="text-xl md:text-2xl font-display text-white mb-2">{project.title}</h3>
                      
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

      {/* Project Detail Dialog - NEW DESIGN MATCHING SCREENSHOT */}
      <Dialog open={!!selectedProject} onOpenChange={(open) => {
        if (!open) {
          setSelectedProject(null);
          setLightboxOpen(false);
        }
      }}>
        <DialogContent 
          ref={dialogContentRef}
          onPointerDownOutside={(e) => { if (lightboxOpen) e.preventDefault(); }}
          onEscapeKeyDown={(e) => { if (lightboxOpen) e.preventDefault(); }}
          className="max-w-5xl bg-card border-border/30 p-0 overflow-hidden max-h-[95vh] overflow-y-auto custom-scrollbar"
        >
          {selectedProject && (
            <>
              <div className="relative">
                {/* Header Image Section */}
                <div className="relative w-full aspect-video md:aspect-[21/9] bg-black/30 overflow-hidden">
                  {!isEditMode ? (
                    <img 
                      src={selectedProject.image} 
                      alt={selectedProject.title} 
                      className="w-full h-full object-cover cursor-zoom-in transition-transform duration-500 hover:scale-[1.02]"
                      onClick={() => {
                        setLightboxIndex(0);
                        setLightboxOpen(true);
                      }}
                    />
                  ) : (
                    <EditableImage 
                      id={`proj_img_modal_${selectedProject.id}`}
                      defaultSrc={selectedProject.image} 
                      alt={selectedProject.title} 
                      className="w-full h-full object-cover"
                      onUpdate={(url) => handleProjectUpdate(selectedProject.id, { image: url })}
                    />
                  )}
                  <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/60 to-transparent pointer-events-none z-10" />
                  
                  {/* Badges Overlay */}
                  <div className="absolute top-6 left-6 flex items-center gap-3 z-20">
                    <span className="px-3 py-1 bg-primary text-primary-foreground text-[10px] font-bold uppercase tracking-widest rounded-sm">
                      {selectedProject.category}
                    </span>
                    <span className="px-3 py-1 bg-green-500 text-white text-[10px] font-bold uppercase tracking-widest rounded-sm">
                      {selectedProject.status}
                    </span>
                  </div>

                  <div className="absolute bottom-8 left-8 right-8 z-20">
                    <h2 className="text-3xl md:text-5xl font-display text-white leading-tight drop-shadow-lg">
                      {selectedProject.title}
                    </h2>
                  </div>
                </div>

                {/* Details Section */}
                <div className="p-8 md:p-12 bg-secondary text-foreground border-t border-border/40">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    {/* Left Column: Project Details */}
                    <div className="space-y-8">
                      <h3 className="text-xl font-display uppercase tracking-widest border-l-4 border-primary pl-4">
                        Project Details
                      </h3>
                      
                      <div className="grid grid-cols-1 gap-6">
                        <DetailItem 
                          label="Employer" 
                          value={selectedProject.employer || "Zain Manzoor & Co Client"} 
                        />
                        <div className="grid grid-cols-2 gap-6">
                          <DetailItem 
                            label="Contract Value" 
                            value={selectedProject.contractValue || "Contact for Details"} 
                          />
                          <DetailItem 
                            label="Executed Value" 
                            value={selectedProject.executedValue || "PKR Variable"} 
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-6">
                          <DetailItem 
                            label="Awarded" 
                            value={selectedProject.awarded || selectedProject.year} 
                          />
                          <DetailItem 
                            label="Completed" 
                            value={selectedProject.completed || "Completed"} 
                          />
                        </div>
                      </div>
                    </div>

                    {/* Right Column: Scope of Work */}
                    <div className="space-y-8">
                      <h3 className="text-xl font-display uppercase tracking-widest border-l-4 border-primary pl-4">
                        Scope of Work
                      </h3>
                      <p className="text-muted-foreground leading-relaxed text-sm">
                        {selectedProject.scope || selectedProject.description}
                      </p>
                    </div>
                  </div>

                  {/* Gallery Section */}
                  <div className="mt-16 space-y-8">
                    <h3 className="text-xl font-display uppercase tracking-widest border-l-4 border-primary pl-4">
                      Gallery
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="contents">
                        {selectedProject.gallery?.map((img, i) => (
                          <div key={i} className="aspect-square rounded-lg overflow-hidden border border-white/5 group relative cursor-pointer">
                            {!isEditMode ? (
                              // Non-edit mode: clickable gallery with hover effect
                              <button
                                onClick={() => {
                                  setLightboxIndex(i);
                                  setLightboxOpen(true);
                                }}
                                className="w-full h-full relative"
                              >
                                <img
                                  src={img}
                                  alt={`${selectedProject.title} ${i}`}
                                  loading="lazy"
                                  decoding="async"
                                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                                  <div className="opacity-0 group-hover:opacity-100 transition-opacity text-white text-xs font-bold uppercase tracking-widest text-center px-2">
                                    Click to view
                                  </div>
                                </div>
                              </button>
                            ) : (
                              // Edit mode: use EditableImage
                              <>
                                <EditableImage 
                                  id={`proj_gal_${selectedProject.id}_${i}`}
                                  defaultSrc={img} 
                                  alt={`${selectedProject.title} ${i}`} 
                                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                  onUpdate={(url) => {
                                    const nextGal = [...(selectedProject.gallery || [])];
                                    nextGal[i] = url;
                                    handleProjectUpdate(selectedProject.id, { gallery: nextGal });
                                  }}
                                />
                                <button 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    const nextGal = selectedProject.gallery?.filter((_, idx) => idx !== i);
                                    handleProjectUpdate(selectedProject.id, { gallery: nextGal });
                                  }}
                                  className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-30"
                                >
                                  <X size={12} />
                                </button>
                              </>
                            )}
                          </div>
                        ))}
                        
                        {isEditMode && (
                          <>
                            {!showGalleryUrlInput ? (
                              <button
                                onClick={() => setShowGalleryUrlInput(true)}
                                className="aspect-square rounded-lg border-2 border-dashed border-white/10 flex flex-col items-center justify-center cursor-pointer hover:border-primary/50 transition-colors bg-white/5"
                              >
                                <Plus size={24} className="text-muted-foreground mb-1" />
                                <span className="text-[10px] uppercase font-bold text-muted-foreground">Add Img</span>
                              </button>
                            ) : (
                              <div className="aspect-square rounded-lg border-2 border-primary/50 flex flex-col items-center justify-center bg-white/5 p-2 gap-1">
                                <input
                                  type="url"
                                  value={galleryUrl}
                                  onChange={e => setGalleryUrl(e.target.value)}
                                  placeholder="Paste URL"
                                  className="w-full bg-black/40 border border-white/10 rounded px-2 py-1 text-[10px] text-white outline-none focus:border-primary text-center"
                                  autoFocus
                                  onKeyDown={async (e) => {
                                    if (e.key === 'Enter' && galleryUrl.trim()) {
                                      const url = await uploadFile(galleryUrl);
                                      if (url) {
                                        const nextGal = [...(selectedProject.gallery || []), url];
                                        handleProjectUpdate(selectedProject.id, { gallery: nextGal });
                                      }
                                      setGalleryUrl('');
                                      setShowGalleryUrlInput(false);
                                    }
                                    if (e.key === 'Escape') { setShowGalleryUrlInput(false); setGalleryUrl(''); }
                                  }}
                                />
                                <div className="flex gap-1">
                                  <button
                                    onClick={async () => {
                                      if (galleryUrl.trim()) {
                                        const url = await uploadFile(galleryUrl);
                                        if (url) {
                                          const nextGal = [...(selectedProject.gallery || []), url];
                                          handleProjectUpdate(selectedProject.id, { gallery: nextGal });
                                        }
                                        setGalleryUrl('');
                                      }
                                      setShowGalleryUrlInput(false);
                                    }}
                                    className="text-[9px] px-2 py-0.5 rounded bg-primary text-white font-bold"
                                  >Add</button>
                                  <button onClick={() => { setShowGalleryUrlInput(false); setGalleryUrl(''); }} className="text-[9px] px-2 py-0.5 rounded border border-white/10 text-muted-foreground">Cancel</button>
                                </div>
                              </div>
                            )}
                          </>
                        )}

                        {(!selectedProject.gallery || selectedProject.gallery.length === 0) && !isEditMode && (
                          [1, 2, 3, 4].map((i) => (
                            <div key={i} className="aspect-square rounded-lg overflow-hidden border border-white/5 bg-black/20" />
                          ))
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </>
          )}
        </DialogContent>

      </Dialog>

      {/* Lightbox Dialog - separate top-level Dialog to ensure focus trap allows click/keyboard interactions */}
      <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
        <DialogContent className="max-w-[100vw] max-h-[100vh] w-screen h-screen p-0 border-none bg-black/95 z-[99999] flex items-center justify-center [&>button]:hidden">
          {selectedProject && (
            <ImageLightbox
              images={selectedProject.gallery && selectedProject.gallery.length > 0 ? selectedProject.gallery : [selectedProject.image]}
              initialIndex={lightboxIndex}
              isOpen={lightboxOpen}
              onClose={() => setLightboxOpen(false)}
              title={selectedProject.title}
            />
          )}
        </DialogContent>
      </Dialog>
    </PageTransition>
  );
}

function DetailItem({ label, value }: { label: string, value: string }) {
  return (
    <div>
      <span className="block text-[10px] uppercase tracking-widest text-primary font-bold mb-1">
        {label}
      </span>
      <span className="text-sm md:text-base font-medium">
        {value}
      </span>
    </div>
  );
}
