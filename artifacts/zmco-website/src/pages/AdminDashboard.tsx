import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, Link } from 'wouter';
import { motion } from 'framer-motion';
import { useAdmin } from '@/context/AdminContext';
import { Settings, Layout, Briefcase, Type, Palette, Bot, Save, Trash2, Plus, Monitor, LogOut, FileText, ShieldCheck, Edit2, X, Check, Loader2, Moon, Sun, ArrowUpToLine, Wrench, Eraser } from 'lucide-react';
import PageTransition from '@/components/PageTransition';
import * as Icons from 'lucide-react';
import { type MachineryItem, loadMachinery } from '@/pages/Machinery';

type Project = { id: string; title: string; location: string; category: string; status: string; year: string; image: string; description: string; employer?: string; contractValue?: string; executedValue?: string; awarded?: string; completed?: string; scope?: string; gallery?: string[]; serviceIds?: string[]; };
type Service = { id: string; title: string; description: string; longDescription: string; icon: string; capabilities?: string[]; benefits?: string[]; process?: Array<{step: number; title: string; description: string}>; };

const STATUS_COLORS: Record<string, string> = {
  completed: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20',
  'in-progress': 'bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-500/20',
  upcoming: 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/20',
};

export default function AdminDashboard() {
  const { isAdmin, logout, siteTheme, updateTheme, aiKnowledgeBase, updateAIKnowledge, siteContent, updateContent, deleteContent, token, flushContent } = useAdmin();
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState('projects');
  const [projects, setProjects] = useState<Project[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [showNewProject, setShowNewProject] = useState(false);
  const [showNewService, setShowNewService] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState('');

  // Machinery state
  const [machinery, setMachinery] = useState<MachineryItem[]>([]);
  const [editingMachinery, setEditingMachinery] = useState<MachineryItem | null>(null);
  const [showNewMachinery, setShowNewMachinery] = useState(false);

  useEffect(() => { if (!isAdmin) setLocation('/admin-login'); }, [isAdmin]);

  const authHeaders = { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` };

  const showToast = useCallback((msg: string) => { setToast(msg); setTimeout(() => setToast(''), 3000); }, []);

  useEffect(() => {
    Promise.all([
      fetch('/api/projects').then(r => r.json()),
      fetch('/api/services').then(r => r.json()),
    ]).then(([p, s]) => { setProjects(p); setServices(s); setLoading(false); });
  }, []);

  // Load machinery from siteContent
  useEffect(() => {
    setMachinery(loadMachinery(siteContent));
  }, [siteContent]);

  const saveMachineryList = useCallback(async (list: MachineryItem[]) => {
    setSaving(true);
    updateContent('machinery_items', JSON.stringify(list));
    await new Promise(r => setTimeout(r, 300));
    await flushContent();
    setSaving(false);
    showToast('Machinery saved!');
  }, [updateContent, flushContent]);

  const handleSaveMachinery = useCallback((item: MachineryItem, isNew = false) => {
    const updated = isNew
      ? [...machinery, item]
      : machinery.map(m => m.id === item.id ? item : m);
    setMachinery(updated);
    setEditingMachinery(null);
    setShowNewMachinery(false);
    saveMachineryList(updated);
  }, [machinery, saveMachineryList]);

  const handleDeleteMachinery = useCallback((id: string) => {
    if (!confirm('Delete this machinery item?')) return;
    const updated = machinery.filter(m => m.id !== id);
    setMachinery(updated);
    saveMachineryList(updated);
  }, [machinery, saveMachineryList]);
  
  const saveProject = useCallback(async (proj: Project, isNew = false) => {
    setSaving(true);
    try {
      const res = await fetch(`/api/projects${isNew ? '' : `/${proj.id}`}`, {
        method: isNew ? 'POST' : 'PUT', headers: authHeaders, body: JSON.stringify(proj),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to save project');
      }
      const saved = await res.json();
      setProjects(prev => isNew ? [...prev, saved] : prev.map(p => p.id === saved.id ? saved : p));
      setEditingProject(null); setShowNewProject(false); setSaving(false);
      showToast(isNew ? 'Project created!' : 'Project updated!');
    } catch (err: any) {
      showToast('Error: ' + err.message);
      setSaving(false);
    }
  }, [authHeaders, showToast]);

  const deleteProject = useCallback(async (id: string) => {
    if (!confirm('Delete this project?')) return;
    try {
      const res = await fetch(`/api/projects/${id}`, { method: 'DELETE', headers: authHeaders });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || 'Failed to delete project');
      }
      setProjects(prev => prev.filter(p => p.id !== id));
      showToast('Project deleted.');
    } catch (err: any) {
      showToast('Error: ' + err.message);
    }
  }, [authHeaders, showToast]);

  const saveService = useCallback(async (svc: Service, isNew = false) => {
    setSaving(true);
    try {
      const res = await fetch(`/api/services${isNew ? '' : `/${svc.id}`}`, {
        method: isNew ? 'POST' : 'PUT', headers: authHeaders, body: JSON.stringify(svc),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to save service');
      }
      const saved = await res.json();
      setServices(prev => isNew ? [...prev, saved] : prev.map(s => s.id === saved.id ? saved : s));
      setEditingService(null); setShowNewService(false); setSaving(false);
      showToast(isNew ? 'Service created!' : 'Service updated!');
    } catch (err: any) {
      showToast('Error: ' + err.message);
      setSaving(false);
    }
  }, [authHeaders, showToast]);

  const deleteService = useCallback(async (id: string) => {
    if (!confirm('Delete this sector?')) return;
    try {
      const res = await fetch(`/api/services/${id}`, { method: 'DELETE', headers: authHeaders });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || 'Failed to delete sector');
      }
      setServices(prev => prev.filter(s => s.id !== id));
      showToast('Sector deleted.');
    } catch (err: any) {
      showToast('Error: ' + err.message);
    }
  }, [authHeaders, showToast]);

  const handleFlush = useCallback(async () => { setSaving(true); await flushContent(); setSaving(false); showToast('Content saved to database!'); }, [flushContent, showToast]);

  if (!isAdmin) return null;

  return (
    <PageTransition>
      {/* Toast */}
      {toast && (
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="fixed top-6 right-6 z-[999] bg-emerald-500 text-white px-6 py-3 rounded-xl font-bold text-sm shadow-xl">
          {toast}
        </motion.div>
      )}

      <div className="min-h-screen bg-background flex">
        {/* Sidebar */}
        <aside className="w-72 bg-card border-r border-border flex flex-col h-screen fixed top-0 left-0 z-40 shadow-2xl">
          <div className="p-6 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 border border-primary/20 rounded-xl flex items-center justify-center"><ShieldCheck size={20} className="text-primary" /></div>
              <div><p className="font-bold text-sm">ZMCO Admin</p><p className="text-[10px] text-muted-foreground uppercase tracking-widest">CMS Portal</p></div>
            </div>
          </div>
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {[
              { id: 'projects', icon: <Briefcase size={16} />, label: 'Projects' },
              { id: 'services', icon: <Layout size={16} />, label: 'Services' },
              { id: 'machinery', icon: <Wrench size={16} />, label: 'Machinery' },
              { id: 'content', icon: <FileText size={16} />, label: 'Text Content' },
              { id: 'design', icon: <Palette size={16} />, label: 'Design' },
              { id: 'ai', icon: <Bot size={16} />, label: 'ZMC AI' },
            ].map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${activeTab === tab.id ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20' : 'text-muted-foreground hover:bg-accent hover:text-foreground'}`}>
                {tab.icon}{tab.label}
              </button>
            ))}
          </nav>
          <div className="p-4 border-t border-border space-y-1">
            <button onClick={() => setLocation('/')} className="w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold text-muted-foreground hover:text-foreground hover:bg-accent rounded-xl transition-all"><Monitor size={16} />View Site</button>
            <button onClick={logout} className="w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold text-red-500 dark:text-red-400 hover:bg-red-500/10 rounded-xl transition-all"><LogOut size={16} />Logout</button>
          </div>
        </aside>

        {/* Main */}
        <main className="flex-1 ml-72 min-h-screen p-8 bg-background relative z-10">
          {loading ? (
            <div className="flex items-center justify-center h-64"><Loader2 className="animate-spin text-primary" size={32} /></div>
          ) : (
            <>
              {/* ── PROJECTS ── */}
              {activeTab === 'projects' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div><h1 className="text-3xl font-display">Projects</h1><p className="text-muted-foreground text-sm mt-1">{projects.length} projects in database</p></div>
                    <button onClick={() => setShowNewProject(true)} className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-xl text-sm font-bold hover:bg-primary/90 transition-all"><Plus size={16} />New Project</button>
                  </div>
                  {showNewProject && <ProjectForm onSave={p => saveProject(p, true)} onCancel={() => setShowNewProject(false)} saving={saving} allServices={services} />}
                  <div className="space-y-3">
                    {projects.map(p => (
                      <div key={p.id} className="bg-card border border-border rounded-2xl overflow-hidden">
                        {editingProject?.id === p.id ? (
                          <ProjectForm 
                            initial={editingProject} 
                            onSave={p => saveProject(p)} 
                            onCancel={() => setEditingProject(null)} 
                            saving={saving} 
                            allServices={services}
                          />
                        ) : (
                          <div className="flex items-center gap-8 p-8 group">
                            <div className="w-32 h-32 rounded-3xl overflow-hidden border border-border shrink-0 bg-accent/50 shadow-inner">
                              {p.image ? (
                                <img src={p.image} className="w-full h-full object-cover" alt="" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-muted-foreground"><Briefcase size={20} /></div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-4 flex-wrap mb-2">
                                <span className="font-bold text-xl truncate">{p.title}</span>
                                <span className={`px-4 py-1.5 text-[11px] rounded-full font-bold uppercase tracking-[0.1em] ${STATUS_COLORS[p.status] || 'bg-white/10 text-white/50'}`}>{p.status}</span>
                              </div>
                              <p className="text-base text-muted-foreground">{p.category} · {p.location} · {p.year}</p>
                            </div>
                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                              <button onClick={() => setEditingProject(p)} className="p-2 hover:bg-accent rounded-lg text-muted-foreground hover:text-primary transition-colors"><Edit2 size={14} /></button>
                              <button onClick={() => deleteProject(p.id)} className="p-2 hover:bg-red-500/10 rounded-lg text-muted-foreground hover:text-red-400 transition-colors"><Trash2 size={14} /></button>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* ── MACHINERY ── */}
              {activeTab === 'machinery' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h1 className="text-3xl font-display">Plant & Machinery</h1>
                      <p className="text-muted-foreground text-sm mt-1">{machinery.length} items in fleet</p>
                    </div>
                    <button
                      onClick={() => setShowNewMachinery(true)}
                      className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-xl text-sm font-bold hover:bg-primary/90 transition-all"
                    >
                      <Plus size={16} /> Add Machinery
                    </button>
                  </div>

                  {showNewMachinery && (
                    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="bg-card border border-primary/20 rounded-2xl overflow-hidden shadow-2xl">
                      <div className="p-4 bg-primary/10 border-b border-primary/20 flex items-center justify-between">
                        <h3 className="font-bold text-sm uppercase tracking-widest text-primary">Add New Machinery</h3>
                        <button onClick={() => setShowNewMachinery(false)} className="p-1 hover:bg-white/10 rounded-full"><X size={16} /></button>
                      </div>
                      <MachineryForm
                        onSave={item => handleSaveMachinery(item, true)}
                        onCancel={() => setShowNewMachinery(false)}
                        saving={saving}
                      />
                    </motion.div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {machinery.map((m, index) => {
                      const isEditing = editingMachinery?.id === m.id;
                      if (isEditing) {
                        return (
                          <div key={m.id} className="col-span-full bg-card border border-primary/30 rounded-2xl overflow-hidden shadow-2xl">
                            <div className="p-4 bg-primary/10 border-b border-primary/20 flex items-center justify-between">
                              <h3 className="font-bold text-sm uppercase tracking-widest text-primary">Editing: {m.name}</h3>
                              <button onClick={() => setEditingMachinery(null)} className="p-1 hover:bg-white/10 rounded-full"><X size={16} /></button>
                            </div>
                            <MachineryForm
                              initial={editingMachinery}
                              onSave={item => handleSaveMachinery(item)}
                              onCancel={() => setEditingMachinery(null)}
                              saving={saving}
                            />
                          </div>
                        );
                      }
                      return (
                        <motion.div
                          key={m.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.04 }}
                          className="group bg-card border border-border hover:border-primary/40 rounded-2xl overflow-hidden transition-all duration-300 shadow-lg"
                        >
                          <div className="relative h-44 bg-black/30 overflow-hidden">
                            {m.images[0] ? (
                              <img src={m.images[0]} alt={m.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-muted-foreground"><Wrench size={32} /></div>
                            )}
                            <div className="absolute top-3 right-3 bg-black/60 text-white text-[10px] font-bold px-2 py-1 rounded-full">
                              {m.images.length} {m.images.length === 1 ? 'photo' : 'photos'}
                            </div>
                          </div>
                          <div className="p-4">
                            <h3 className="font-display text-base uppercase tracking-wider mb-2 group-hover:text-primary transition-colors">{m.name}</h3>
                            <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">{m.description}</p>
                            <div className="flex items-center gap-2 mt-4 pt-4 border-t border-border/50">
                              <button
                                onClick={() => setEditingMachinery(m)}
                                className="flex-1 flex items-center justify-center gap-2 py-2 bg-white/5 hover:bg-primary/20 rounded-xl text-xs font-bold text-muted-foreground hover:text-primary transition-all"
                              >
                                <Edit2 size={12} /> Edit
                              </button>
                              <button
                                onClick={() => handleDeleteMachinery(m.id)}
                                className="flex-1 flex items-center justify-center gap-2 py-2 bg-white/5 hover:bg-red-500/10 rounded-xl text-xs font-bold text-muted-foreground hover:text-red-400 transition-all"
                              >
                                <Trash2 size={12} /> Delete
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </motion.div>
              )}

              {/* ── SERVICES ── */}
              {activeTab === 'services' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-3xl font-display">Services Management</h2>
                      <p className="text-muted-foreground text-sm mt-1">{services.length} operational services currently defined</p>
                    </div>
                  </div>

                  {showNewService && (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-card border border-primary/20 rounded-2xl overflow-hidden shadow-2xl shadow-primary/5">
                      <div className="p-4 bg-primary/10 border-b border-primary/20 flex items-center justify-between">
                        <h3 className="font-bold text-sm uppercase tracking-widest text-primary">Creating New Service</h3>
                        <button onClick={() => setShowNewService(false)} className="p-1 hover:bg-white/10 rounded-full"><X size={16} /></button>
                      </div>
                      <ServiceForm onSave={s => saveService(s, true)} onCancel={() => setShowNewService(false)} saving={saving} />
                    </motion.div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    {/* Add New Service Card */}
                    {!showNewService && (
                      <motion.button 
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setShowNewService(true)}
                        className="group h-full p-10 rounded-2xl bg-primary/5 border-2 border-dashed border-primary/20 hover:border-primary/60 hover:bg-primary/10 transition-all flex flex-col items-center justify-center text-center min-h-[320px] relative overflow-hidden"
                      >
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="w-20 h-20 rounded-3xl bg-primary/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform relative z-10 shadow-xl shadow-primary/20">
                          <Plus size={40} className="text-primary" />
                        </div>
                        <h3 className="text-2xl font-display text-primary relative z-10">Add Service</h3>
                        <p className="text-sm text-muted-foreground mt-3 max-w-[200px] relative z-10 leading-relaxed">Expand your presence by adding a new operational service</p>
                      </motion.button>
                    )}

                    {services.map((s, index) => {
                      const Icon = Icons[s.icon as keyof typeof Icons] as React.ElementType;
                      const isEditing = editingService?.id === s.id;
                      
                      if (isEditing) {
                        return (
                          <div key={s.id} className="col-span-full bg-card border border-primary/30 rounded-2xl overflow-hidden shadow-2xl">
                            <div className="p-4 bg-primary/10 border-b border-primary/20 flex items-center justify-between">
                              <h3 className="font-bold text-sm uppercase tracking-widest text-primary">Editing: {s.title}</h3>
                              <button onClick={() => setEditingService(null)} className="p-1 hover:bg-white/10 rounded-full"><X size={16} /></button>
                            </div>
                            <ServiceForm initial={editingService} onSave={s => saveService(s)} onCancel={() => setEditingService(null)} saving={saving} />
                          </div>
                        );
                      }

                      return (
                        <motion.div 
                          key={s.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="group h-full p-8 rounded-2xl bg-card border border-border hover:border-primary/40 transition-all duration-300 flex flex-col relative overflow-hidden shadow-lg hover:shadow-primary/5 cursor-pointer"
                          onClick={() => setEditingService(s)}
                        >
                          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full -mr-16 -mt-16 transition-transform duration-500 group-hover:scale-125" />
                          
                          {/* Icon */}
                          <div className="mb-8 p-5 rounded-2xl bg-secondary border border-border group-hover:border-primary/20 group-hover:bg-primary/10 transition-all self-start relative z-10">
                            {Icon && <Icon size={32} className="text-primary" />}
                          </div>

                          {/* Project Count Badge */}
                          <div className="absolute top-6 right-6 px-3 py-1 bg-primary/10 border border-primary/20 rounded-full text-[10px] font-bold text-primary uppercase tracking-widest z-20">
                            {projects.filter(p => p.serviceIds?.includes(s.id)).length} Projects
                          </div>
                          
                          <div className="flex-1 relative z-10">
                            <h3 className="text-2xl font-display mb-3 group-hover:text-primary transition-colors">{s.title}</h3>
                            <p className="text-sm text-muted-foreground line-clamp-3 mb-8 leading-relaxed">{s.description}</p>
                          </div>
                          
                          <div className="pt-6 border-t border-white/5 flex items-center justify-between relative z-10">
                            <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
                              <button 
                                onClick={() => setEditingService(s)} 
                                className="w-10 h-10 flex items-center justify-center bg-white/5 hover:bg-primary/20 rounded-xl text-muted-foreground hover:text-primary transition-all"
                                title="Edit Service"
                              >
                                <Edit2 size={18} />
                              </button>
                              <button 
                                onClick={() => deleteService(s.id)} 
                                className="w-10 h-10 flex items-center justify-center bg-white/5 hover:bg-red-500/10 rounded-xl text-muted-foreground hover:text-red-400 transition-all"
                                title="Delete Service"
                              >
                                <Trash2 size={18} />
                              </button>
                            </div>
                            <Link 
                              href={`/services/${s.id}`} 
                              onClick={e => e.stopPropagation()}
                              className="text-[10px] uppercase tracking-widest font-black text-primary hover:text-white transition-colors bg-primary/10 hover:bg-primary px-3 py-1.5 rounded-lg"
                            >
                              Live Page
                            </Link>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </motion.div>
              )}

              {/* ── TEXT CONTENT ── */}
              {activeTab === 'content' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div><h1 className="text-3xl font-display">Text Content</h1><p className="text-muted-foreground text-sm mt-1">Inline text changes made on the live site</p></div>
                    <button onClick={handleFlush} disabled={saving} className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-xl text-sm font-bold hover:bg-primary/90 disabled:opacity-60 transition-all">
                      {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />} Save to DB
                    </button>
                  </div>
                  <div className="bg-card border border-white/5 rounded-2xl p-6">
                    <p className="text-sm text-muted-foreground mb-6">Enable <strong className="text-white">Edit Mode</strong> from the floating bar at the bottom of any page. Click any highlighted text to rewrite it.</p>
                    {Object.keys(siteContent).length === 0 ? (
                      <p className="text-sm text-muted-foreground">No overrides yet — visit the site and edit text directly.</p>
                    ) : (
                      <div className="space-y-2">
                        {Object.entries(siteContent).map(([key, val]) => (
                          <div key={key} className="p-4 bg-secondary/30 border border-white/5 rounded-2xl flex items-center justify-between gap-4 group hover:border-primary/25 transition-all">
                            <div className="min-w-0 flex-1">
                              <span className="text-[10px] text-primary uppercase tracking-widest font-black block mb-1">{key}</span>
                              <div className="max-h-20 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                                <span className="text-xs text-white/70 font-mono block break-all leading-normal whitespace-pre-wrap">{val}</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-1.5 shrink-0">
                              <button
                                onClick={async () => {
                                  if (confirm(`Clear only the text value of "${key}"? (Font styles and colors will be kept, text will be emptied)`)) {
                                    setSaving(true);
                                    let nextVal = "";
                                    try {
                                      const parsed = JSON.parse(val);
                                      if (parsed && typeof parsed === 'object' && parsed.text !== undefined) {
                                        parsed.text = "";
                                        nextVal = JSON.stringify(parsed);
                                      } else {
                                        nextVal = "";
                                      }
                                    } catch {
                                      nextVal = "";
                                    }
                                    updateContent(key, nextVal);
                                    await new Promise(r => setTimeout(r, 200));
                                    await flushContent();
                                    setSaving(false);
                                    showToast('Text content cleared!');
                                  }
                                }}
                                className="w-8 h-8 rounded-lg flex items-center justify-center bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/20 transition-all cursor-pointer"
                                title="Clear Text Only"
                              >
                                <Eraser size={14} />
                              </button>
                              <button
                                onClick={async () => {
                                  if (confirm(`Completely delete custom override "${key}" and restore default?`)) {
                                    setSaving(true);
                                    await deleteContent(key);
                                    setSaving(false);
                                    showToast('Override deleted successfully.');
                                  }
                                }}
                                className="w-8 h-8 rounded-lg flex items-center justify-center bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 transition-all cursor-pointer"
                                title="Delete Override & Restore Default"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {/* ── DESIGN ── */}
              {activeTab === 'design' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
                  <div className="flex items-center justify-between">
                    <h1 className="text-3xl font-display">Design Settings</h1>
                    <div className="flex bg-secondary border border-border rounded-xl p-1">
                      <button 
                        onClick={() => updateTheme({ themeMode: 'dark' })} 
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${siteTheme.themeMode === 'dark' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-muted-foreground hover:text-white'}`}
                      >
                        <Moon size={14} /> Original (Dark)
                      </button>
                      <button 
                        onClick={() => updateTheme({ themeMode: 'light' })} 
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${siteTheme.themeMode === 'light' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-muted-foreground hover:text-white'}`}
                      >
                        <Sun size={14} /> White Theme
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="bg-card border border-white/5 rounded-2xl p-6 space-y-4">
                      <h3 className="font-bold uppercase tracking-widest text-sm flex items-center gap-2"><Type size={16} className="text-primary" />Font Family</h3>
                      {['Inter, sans-serif','Roboto, sans-serif','Outfit, sans-serif','Georgia, serif'].map(f => (
                        <button key={f} onClick={() => updateTheme({ fontFamily: f })} className={`w-full text-left p-3 rounded-xl border text-sm transition-all ${siteTheme.fontFamily === f ? 'border-primary bg-primary/5 text-primary' : 'border-border hover:border-primary/30 text-muted-foreground'}`}>{f.split(',')[0]}</button>
                      ))}
                    </div>

                    <div className="bg-card border border-white/5 rounded-2xl p-6 space-y-4">
                      <h3 className="font-bold uppercase tracking-widest text-sm flex items-center gap-2"><ArrowUpToLine size={16} className="text-primary" />Base Font Size</h3>
                      <div className="flex items-center gap-4">
                        <input 
                          type="range" 
                          min="12" 
                          max="24" 
                          value={parseInt(siteTheme.fontSizeBase)} 
                          onChange={e => updateTheme({ fontSizeBase: `${e.target.value}px` })} 
                          className="flex-1 accent-primary" 
                        />
                        <span className="text-lg font-bold text-primary w-12 text-right">{siteTheme.fontSizeBase}</span>
                      </div>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-widest">Controls the base text size across the entire application.</p>
                      <div className="p-4 bg-background border border-white/5 rounded-xl" style={{ fontFamily: siteTheme.fontFamily }}>
                        <p style={{ fontSize: siteTheme.fontSizeBase, color: siteTheme.primaryColor }} className="leading-tight font-semibold">Sample Text Preview</p>
                      </div>
                    </div>

                    <div className="bg-card border border-white/5 rounded-2xl p-6 space-y-4">
                      <h3 className="font-bold uppercase tracking-widest text-sm flex items-center gap-2"><Palette size={16} className="text-primary" />Brand Color</h3>
                      <div className="grid grid-cols-5 gap-3">
                        {['#3b82f6','#10b981','#f97316','#8b5cf6','#f43f5e','#06b6d4','#eab308','#ec4899','#14b8a6','#a855f7'].map(c => (
                          <button key={c} onClick={() => updateTheme({ primaryColor: c })} className={`aspect-square rounded-full transition-all ${siteTheme.primaryColor === c ? 'ring-2 ring-white ring-offset-2 ring-offset-black scale-110' : 'hover:scale-105'}`} style={{ backgroundColor: c }} />
                        ))}
                      </div>
                      <input type="color" value={siteTheme.primaryColor} onChange={e => updateTheme({ primaryColor: e.target.value })} className="w-full h-10 rounded-lg cursor-pointer bg-transparent border border-white/10" />
                    </div>
                  </div>
                </motion.div>
              )}

              {/* ── AI ── */}
              {activeTab === 'ai' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                  <h1 className="text-3xl font-display">ZMC AI Knowledge Base</h1>
                  <p className="text-muted-foreground text-sm">Paste your company data, policies, and FAQs. The AI chatbot uses this to answer visitor questions.</p>
                  <div className="bg-card border border-white/5 rounded-2xl p-6 space-y-4">
                    <textarea value={aiKnowledgeBase} onChange={e => updateAIKnowledge(e.target.value)} className="w-full h-80 bg-secondary/50 border border-border rounded-xl p-4 text-sm text-foreground focus:border-primary outline-none font-mono resize-none" placeholder="Enter company data, FAQs, project details..." />
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-muted-foreground">{aiKnowledgeBase.length} characters</span>
                      <button onClick={() => showToast('Knowledge base saved!')} className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-xl text-sm font-bold hover:bg-primary/90"><Save size={14} />Save</button>
                    </div>
                  </div>
                </motion.div>
              )}
            </>
          )}
        </main>
      </div>
    </PageTransition>
  );
}

// ─── Project Form ────────────────────────────────────────────────────────────
function ProjectForm({ initial, onSave, onCancel, saving, allServices }: { initial?: Project; onSave: (p: Project) => void; onCancel: () => void; saving: boolean; allServices: Service[]; }) {
  const blank: Project = { id: '', title: '', location: '', category: '', status: 'upcoming', year: new Date().getFullYear().toString(), image: '', description: '', gallery: [], serviceIds: [], employer: '', contractValue: '', executedValue: '', awarded: '', completed: '', scope: '' };
  const [form, setForm] = useState<Project>(initial || blank);
  const { uploadFile } = useAdmin();
  const [uploading, setUploading] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState('');
  const [galleryUrl, setGalleryUrl] = useState('');

  const set = (k: keyof Project) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => setForm(f => ({ ...f, [k]: e.target.value }));

  const handleImageUrl = async (field: 'image' | 'gallery') => {
    const url = field === 'image' ? imageUrl : galleryUrl;
    if (!url.trim()) return;
    setUploading(field);
    const result = await uploadFile(url);
    if (result) {
      if (field === 'image') setForm(f => ({ ...f, image: result }));
      else setForm(f => ({ ...f, gallery: [...(f.gallery || []), result] }));
    }
    setUploading(null);
    if (field === 'image') setImageUrl('');
    else setGalleryUrl('');
  };

  const removeGalleryImg = (idx: number) => {
    setForm(f => ({ ...f, gallery: f.gallery?.filter((_, i) => i !== idx) }));
  };

  const toggleService = (sid: string) => {
    setForm(f => {
      const current = f.serviceIds || [];
      const next = current.includes(sid) ? current.filter(id => id !== sid) : [...current, sid];
      return { ...f, serviceIds: next };
    });
  };

  return (
    <div className="p-6 border-t border-white/5 bg-black/20 rounded-b-2xl space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <Field label="ID (slug)" value={form.id} onChange={set('id')} placeholder="p12" disabled={!!initial} />
          <Field label="Title" value={form.title} onChange={set('title')} placeholder="Project Name" />
          <Field label="Location" value={form.location} onChange={set('location')} placeholder="Lahore" />
          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Category</label>
            <select 
              value={form.category} 
              onChange={set('category')} 
              className="bg-accent border border-border rounded-xl px-4 py-3 text-sm text-foreground outline-none focus:border-primary"
            >
              <option value="">Select Category</option>
              <option value="Residential">Residential</option>
              <option value="Commercial">Commercial</option>
              <option value="Industrial">Industrial</option>
              <option value="Infrastructure">Infrastructure</option>
              <option value="Institutional">Institutional</option>
            </select>
          </div>
          
          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Status</label>
            <select value={form.status} onChange={set('status')} className="bg-accent border border-border rounded-xl px-4 py-3 text-sm text-foreground outline-none focus:border-primary">
              <option value="completed">Completed</option>
              <option value="in-progress">In Progress</option>
              <option value="upcoming">Upcoming</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Linked Services</label>
            <div className="flex flex-wrap gap-2">
              {allServices.map(s => (
                <button
                  key={s.id}
                  onClick={() => toggleService(s.id)}
                  className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase border transition-all ${
                    form.serviceIds?.includes(s.id) 
                      ? 'bg-primary border-primary text-white' 
                      : 'border-white/10 text-muted-foreground hover:border-white/30'
                  }`}
                >
                  {s.title}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Cover Image URL</label>
            <div className="flex items-center gap-4">
              {form.image && (
                <div className="w-20 h-20 rounded-lg overflow-hidden border border-white/10 shrink-0">
                  <img src={form.image} className="w-full h-full object-cover" />
                </div>
              )}
              <div className="flex-1 flex gap-2">
                <input
                  type="url"
                  value={imageUrl}
                  onChange={e => setImageUrl(e.target.value)}
                  placeholder="Paste image URL (imgbb, imgur...)"
                  className="flex-1 bg-accent border border-border rounded-xl px-4 py-3 text-sm text-foreground outline-none focus:border-primary"
                  onKeyDown={e => e.key === 'Enter' && handleImageUrl('image')}
                />
                <button
                  onClick={() => handleImageUrl('image')}
                  disabled={uploading === 'image' || !imageUrl.trim()}
                  className="px-4 py-3 rounded-xl bg-primary text-white text-sm font-bold hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  {uploading === 'image' ? '...' : 'Add'}
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Gallery Images</label>
            <div className="grid grid-cols-4 gap-2 mb-2">
              {form.gallery?.map((img, i) => (
                <div key={i} className="relative aspect-square rounded-lg overflow-hidden border border-white/10 group">
                  <img src={img} className="w-full h-full object-cover" />
                  <button onClick={() => removeGalleryImg(i)} className="absolute inset-0 bg-red-500/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white"><Trash2 size={16} /></button>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="url"
                value={galleryUrl}
                onChange={e => setGalleryUrl(e.target.value)}
                placeholder="Paste image URL"
                className="flex-1 bg-accent border border-border rounded-xl px-4 py-3 text-sm text-foreground outline-none focus:border-primary"
                onKeyDown={e => e.key === 'Enter' && handleImageUrl('gallery')}
              />
              <button
                onClick={() => handleImageUrl('gallery')}
                disabled={uploading === 'gallery' || !galleryUrl.trim()}
                className="px-4 py-3 rounded-xl bg-primary text-white text-sm font-bold hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {uploading === 'gallery' ? '...' : 'Add'}
              </button>
            </div>
          </div>

          <Field label="Year" value={form.year} onChange={set('year')} placeholder="2025" />
          <Field label="Employer" value={form.employer || ''} onChange={set('employer')} placeholder="Punjab Government" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <Field label="Contract Value" value={form.contractValue || ''} onChange={set('contractValue')} placeholder="PKR 4,000,000" />
          <Field label="Executed Value" value={form.executedValue || ''} onChange={set('executedValue')} placeholder="PKR 4,000,000" />
        </div>
        <div className="space-y-4">
          <Field label="Awarded Date" value={form.awarded || ''} onChange={set('awarded')} placeholder="01-Jan-2023" />
          <Field label="Completed Date" value={form.completed || ''} onChange={set('completed')} placeholder="01-Dec-2024" />
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Description / Scope</label>
        <textarea value={form.description} onChange={set('description')} rows={3} className="bg-background border border-border rounded-xl px-4 py-3 text-sm text-foreground outline-none focus:border-primary resize-none" placeholder="Enter project description and scope..." />
      </div>

      <div className="flex items-center gap-3 pt-4 border-t border-white/5">
        <button onClick={() => onSave(form)} disabled={saving} className="flex items-center gap-2 px-8 py-3 bg-primary text-white rounded-xl text-sm font-bold hover:bg-primary/90 disabled:opacity-60 transition-all shadow-lg shadow-primary/20">
          {saving ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />} Save Project
        </button>
        <button onClick={onCancel} className="flex items-center gap-2 px-6 py-3 border border-white/10 rounded-xl text-sm font-semibold text-muted-foreground hover:text-white transition-all">Cancel</button>
      </div>
    </div>
  );
}

// ─── Service Form ────────────────────────────────────────────────────────────
function ServiceForm({ initial, onSave, onCancel, saving }: { initial?: Service; onSave: (s: Service) => void; onCancel: () => void; saving: boolean; }) {
  const blank: Service = { id: '', title: '', description: '', longDescription: '', icon: 'Building2', capabilities: [], benefits: [], process: [] };
  const [form, setForm] = useState<Service>(initial || blank);
  const set = (k: keyof Service) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setForm(f => ({ ...f, [k]: e.target.value }));

  const addCapability = () => setForm(f => ({ ...f, capabilities: [...(f.capabilities || []), ''] }));
  const removeCapability = (idx: number) => setForm(f => ({ ...f, capabilities: f.capabilities?.filter((_, i) => i !== idx) }));
  const updateCapability = (idx: number, val: string) => setForm(f => {
    const caps = [...(f.capabilities || [])];
    caps[idx] = val;
    return { ...f, capabilities: caps };
  });

  const addBenefit = () => setForm(f => ({ ...f, benefits: [...(f.benefits || []), ''] }));
  const removeBenefit = (idx: number) => setForm(f => ({ ...f, benefits: f.benefits?.filter((_, i) => i !== idx) }));
  const updateBenefit = (idx: number, val: string) => setForm(f => {
    const bens = [...(f.benefits || [])];
    bens[idx] = val;
    return { ...f, benefits: bens };
  });

  const addProcessStep = () => setForm(f => {
    const steps = [...(f.process || [])];
    steps.push({ step: steps.length + 1, title: '', description: '' });
    return { ...f, process: steps };
  });
  const removeProcessStep = (idx: number) => setForm(f => {
    const steps = f.process?.filter((_, i) => i !== idx).map((s, i) => ({ ...s, step: i + 1 }));
    return { ...f, process: steps };
  });
  const updateProcessStep = (idx: number, field: 'title' | 'description', val: string) => setForm(f => {
    const steps = [...(f.process || [])];
    steps[idx] = { ...steps[idx], [field]: val };
    return { ...f, process: steps };
  });

  return (
    <div className="p-6 border-t border-white/5 bg-black/20 rounded-b-2xl space-y-6">
      {/* Basic Info */}
      <div className="space-y-4">
        <h4 className="text-sm font-bold uppercase tracking-widest text-primary">Basic Information</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="ID (slug)" value={form.id} onChange={set('id')} placeholder="s7" disabled={!!initial} />
          <Field label="Icon (Lucide name)" value={form.icon} onChange={set('icon')} placeholder="Building2" />
          <Field label="Title" value={form.title} onChange={set('title')} placeholder="Service Title" />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Short Description</label>
          <textarea value={form.description} onChange={set('description')} rows={2} className="bg-background border border-border rounded-xl px-4 py-3 text-sm text-foreground outline-none focus:border-primary resize-none" />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Long Description</label>
          <textarea value={form.longDescription} onChange={set('longDescription')} rows={4} className="bg-[#0a0a0a] border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-primary resize-none" />
        </div>
      </div>

      {/* Capabilities */}
      <div className="space-y-3 border-t border-white/5 pt-6">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-bold uppercase tracking-widest text-primary">Capabilities</h4>
          <button onClick={addCapability} className="flex items-center gap-1 px-3 py-1 text-xs bg-primary/10 border border-primary/30 rounded-lg hover:bg-primary/20 text-primary transition-colors">
            <Plus size={12} /> Add
          </button>
        </div>
        <div className="space-y-2">
          {form.capabilities?.map((cap, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <input 
                type="text" 
                value={cap} 
                onChange={(e) => updateCapability(idx, e.target.value)} 
                placeholder={`Capability ${idx + 1}`}
                className="flex-1 bg-[#0a0a0a] border border-white/10 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-primary"
              />
              <button onClick={() => removeCapability(idx)} className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors">
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Benefits */}
      <div className="space-y-3 border-t border-white/5 pt-6">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-bold uppercase tracking-widest text-primary">Benefits</h4>
          <button onClick={addBenefit} className="flex items-center gap-1 px-3 py-1 text-xs bg-primary/10 border border-primary/30 rounded-lg hover:bg-primary/20 text-primary transition-colors">
            <Plus size={12} /> Add
          </button>
        </div>
        <div className="space-y-2">
          {form.benefits?.map((ben, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <input 
                type="text" 
                value={ben} 
                onChange={(e) => updateBenefit(idx, e.target.value)} 
                placeholder={`Benefit ${idx + 1}`}
                className="flex-1 bg-[#0a0a0a] border border-white/10 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-primary"
              />
              <button onClick={() => removeBenefit(idx)} className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors">
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Process Steps */}
      <div className="space-y-3 border-t border-white/5 pt-6">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-bold uppercase tracking-widest text-primary">Process Steps</h4>
          <button onClick={addProcessStep} className="flex items-center gap-1 px-3 py-1 text-xs bg-primary/10 border border-primary/30 rounded-lg hover:bg-primary/20 text-primary transition-colors">
            <Plus size={12} /> Add Step
          </button>
        </div>
        <div className="space-y-4">
          {form.process?.map((proc, idx) => (
            <div key={idx} className="p-4 bg-[#0a0a0a] border border-white/10 rounded-lg space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-primary">Step {proc.step}</span>
                <button onClick={() => removeProcessStep(idx)} className="p-1 text-red-400 hover:bg-red-500/10 rounded transition-colors">
                  <Trash2 size={14} />
                </button>
              </div>
              <input 
                type="text" 
                value={proc.title} 
                onChange={(e) => updateProcessStep(idx, 'title', e.target.value)} 
                placeholder="Step Title"
                className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-primary"
              />
              <textarea 
                value={proc.description} 
                onChange={(e) => updateProcessStep(idx, 'description', e.target.value)} 
                placeholder="Step Description"
                rows={3}
                className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-primary resize-none"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-3 pt-4 border-t border-white/5">
        <button onClick={() => onSave(form)} disabled={saving} className="flex items-center gap-2 px-8 py-3 bg-primary text-white rounded-xl text-sm font-bold hover:bg-primary/90 disabled:opacity-60 transition-all">
          {saving ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />} Save Service
        </button>
        <button onClick={onCancel} className="flex items-center gap-2 px-6 py-3 border border-white/10 rounded-xl text-sm font-semibold text-muted-foreground hover:text-white transition-all">
          <X size={14} /> Cancel
        </button>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, placeholder, disabled }: { label: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; placeholder?: string; disabled?: boolean; }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{label}</label>
      <input type="text" value={value} onChange={onChange} placeholder={placeholder} disabled={disabled} className="bg-[#0a0a0a] border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-primary disabled:opacity-50" />
    </div>
  );
}

// ─── Machinery Form ───────────────────────────────────────────────────────────
function MachineryForm({
  initial,
  onSave,
  onCancel,
  saving,
}: {
  initial?: MachineryItem;
  onSave: (item: MachineryItem) => void;
  onCancel: () => void;
  saving: boolean;
}) {
  const blank: MachineryItem = { id: '', name: '', description: '', images: [] };
  const [form, setForm] = React.useState<MachineryItem>(initial || blank);
  const { uploadFile } = useAdmin();
  const [uploading, setUploading] = React.useState(false);
  const [imageUrl, setImageUrl] = React.useState('');

  const handleImageUrl = async () => {
    if (!imageUrl.trim()) return;
    setUploading(true);
    const url = await uploadFile(imageUrl);
    if (url) setForm(f => ({ ...f, images: [...f.images, url] }));
    setUploading(false);
    setImageUrl('');
  };

  const removeImage = (idx: number) => {
    setForm(f => ({ ...f, images: f.images.filter((_, i) => i !== idx) }));
  };

  const moveImage = (idx: number, dir: -1 | 1) => {
    const next = [...form.images];
    const swap = idx + dir;
    if (swap < 0 || swap >= next.length) return;
    [next[idx], next[swap]] = [next[swap], next[idx]];
    setForm(f => ({ ...f, images: next }));
  };

  return (
    <div className="p-6 border-t border-white/5 bg-black/20 rounded-b-2xl space-y-6">
      {/* ID & Name */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field
          label="ID (slug)"
          value={form.id}
          onChange={e => setForm(f => ({ ...f, id: e.target.value }))}
          placeholder="dump-trucks"
          disabled={!!initial}
        />
        <Field
          label="Machine Name"
          value={form.name}
          onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
          placeholder="Dump Trucks"
        />
      </div>

      {/* Description */}
      <div className="flex flex-col gap-1">
        <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Description</label>
        <textarea
          value={form.description}
          onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
          rows={4}
          placeholder="Describe this machine, its uses and specifications..."
          className="bg-[#0a0a0a] border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-primary resize-none"
        />
      </div>

      {/* Images */}
      <div className="space-y-3">
        <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground block">
          Images ({form.images.length})
        </label>

        {/* Existing images */}
        {form.images.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {form.images.map((img, i) => (
              <div key={i} className="relative group aspect-video rounded-xl overflow-hidden border border-white/10">
                <img src={img} alt="" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1">
                  <div className="flex gap-1 mb-1">
                    <button
                      onClick={() => moveImage(i, -1)}
                      disabled={i === 0}
                      className="w-7 h-7 rounded-lg bg-white/20 hover:bg-white/40 flex items-center justify-center text-white disabled:opacity-30 transition-all text-xs font-bold"
                      title="Move left"
                    >
                      ←
                    </button>
                    <button
                      onClick={() => moveImage(i, 1)}
                      disabled={i === form.images.length - 1}
                      className="w-7 h-7 rounded-lg bg-white/20 hover:bg-white/40 flex items-center justify-center text-white disabled:opacity-30 transition-all text-xs font-bold"
                      title="Move right"
                    >
                      →
                    </button>
                  </div>
                  <button
                    onClick={() => removeImage(i)}
                    className="w-7 h-7 rounded-lg bg-red-500/70 hover:bg-red-500 flex items-center justify-center text-white transition-all"
                    title="Remove"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
                {i === 0 && (
                  <div className="absolute top-1.5 left-1.5 bg-primary/80 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wider">
                    Cover
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* URL input */}
        <div className="flex gap-2">
          <input
            type="url"
            value={imageUrl}
            onChange={e => setImageUrl(e.target.value)}
            placeholder="Paste image URL (imgbb, imgur...)"
            className="flex-1 bg-[#0a0a0a] border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-primary"
            onKeyDown={e => e.key === 'Enter' && handleImageUrl()}
          />
          <button
            onClick={handleImageUrl}
            disabled={uploading || !imageUrl.trim()}
            className="px-4 py-3 rounded-xl bg-primary text-white text-sm font-bold hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {uploading ? '...' : 'Add'}
          </button>
        </div>
        <p className="text-[11px] text-muted-foreground">First image is the cover. Use ← → arrows to reorder.</p>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 pt-4 border-t border-white/5">
        <button
          onClick={() => onSave(form)}
          disabled={saving || !form.id || !form.name}
          className="flex items-center gap-2 px-8 py-3 bg-primary text-white rounded-xl text-sm font-bold hover:bg-primary/90 disabled:opacity-50 transition-all shadow-lg shadow-primary/20"
        >
          {saving ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
          Save Machinery
        </button>
        <button
          onClick={onCancel}
          className="flex items-center gap-2 px-6 py-3 border border-white/10 rounded-xl text-sm font-semibold text-muted-foreground hover:text-white transition-all"
        >
          <X size={14} /> Cancel
        </button>
      </div>
    </div>
  );
}

