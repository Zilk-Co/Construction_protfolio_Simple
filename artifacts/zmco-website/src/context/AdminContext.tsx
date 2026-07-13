import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────
interface AdminContextType {
  isAdmin: boolean;
  isEditMode: boolean;
  token: string | null;
  login: (u: string, p: string) => Promise<boolean>;
  logout: () => void;
  toggleEditMode: () => void;
  siteContent: Record<string, string>;
  updateContent: (id: string, value: string) => void;
  deleteContent: (id: string) => Promise<void>;
  flushContent: () => Promise<void>;
  siteTheme: { fontFamily: string; primaryColor: string; fontSizeBase: string; themeMode: 'dark' | 'light' };
  updateTheme: (theme: Partial<AdminContextType['siteTheme']>) => void;
  aiKnowledgeBase: string;
  updateAIKnowledge: (text: string) => void;
  uploadFile: (url: string) => Promise<string | null>;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

// ─────────────────────────────────────────────────────────────────────────────
// Provider
// ─────────────────────────────────────────────────────────────────────────────
export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // --- Auth ---
  const [token, setToken] = useState<string | null>(() => {
    const stored = localStorage.getItem('zmco_token');
    if (!stored) return null;
    // Basic expiry check (JWT payload is base64url encoded second segment)
    try {
      const payload = JSON.parse(atob(stored.split('.')[1]));
      if (payload.exp && Date.now() / 1000 > payload.exp) {
        localStorage.removeItem('zmco_token');
        return null;
      }
    } catch { return null; }
    return stored;
  });
  const isAdmin = token !== null;

  const [isEditMode, setIsEditMode] = useState(false);

  // --- Site content (backed by DB) ---
  const [siteContent, setSiteContent] = useState<Record<string, string>>({});
  const pendingUpdatesRef = useRef<Record<string, string>>({});

  // Load content from API on mount
  useEffect(() => {
    fetch('/api/content')
      .then(r => r.json())
      .then((data: Record<string, string>) => setSiteContent(data))
      .catch(() => {
        // Fallback to localStorage cache if offline
        const saved = localStorage.getItem('zmco_content');
        if (saved) setSiteContent(JSON.parse(saved));
      });
  }, []);

  const [siteTheme, setSiteTheme] = useState(() => {
    const saved = localStorage.getItem('zmco_theme');
    let theme = saved ? JSON.parse(saved) : null;
    if (!theme || theme.primaryColor === '#eab308') {
      theme = { fontFamily: 'Inter, sans-serif', primaryColor: '#3b82f6', fontSizeBase: '16px', themeMode: 'dark' };
      localStorage.setItem('zmco_theme', JSON.stringify(theme));
    } else if (!theme.themeMode) {
      theme.themeMode = 'dark';
    }
    return theme;
  });

  // --- AI Knowledge ---
  const aiKnowledgeBase = siteContent['aiKnowledgeBase'] || '';

  // ── Auth ──────────────────────────────────────────────────────────────────
  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      if (!res.ok) return false;
      const { token: newToken } = await res.json();
      localStorage.setItem('zmco_token', newToken);
      setToken(newToken);
      return true;
    } catch {
      return false;
    }
  };

  const logout = () => {
    setToken(null);
    setIsEditMode(false);
    localStorage.removeItem('zmco_token');
  };

  const toggleEditMode = () => setIsEditMode(v => !v);

  // ── Content ───────────────────────────────────────────────────────────────
  // Batches local changes; call flushContent() to persist to DB
  const updateContent = useCallback((id: string, value: string) => {
    setSiteContent(prev => {
      const next = { ...prev, [id]: value };
      localStorage.setItem('zmco_content', JSON.stringify(next));
      return next;
    });
    pendingUpdatesRef.current[id] = value;
  }, []);

  const deleteContent = useCallback(async (id: string) => {
    setSiteContent(prev => {
      const next = { ...prev };
      delete next[id];
      localStorage.setItem('zmco_content', JSON.stringify(next));
      return next;
    });
    if (pendingUpdatesRef.current[id] !== undefined) {
      delete pendingUpdatesRef.current[id];
    }
    if (token) {
      try {
        await fetch(`/api/content/${id}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` }
        });
      } catch (err) {
        console.error('Failed to delete key from DB:', err);
      }
    }
  }, [token]);

  // Auto-flush every 5 s if admin is in edit mode
  const flushContent = useCallback(async () => {
    if (!token || Object.keys(pendingUpdatesRef.current).length === 0) return;
    const payload = { ...pendingUpdatesRef.current };
    pendingUpdatesRef.current = {};
    try {
      await fetch('/api/content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
      });
    } catch {
      // Put back unsaved changes on failure
      Object.assign(pendingUpdatesRef.current, payload);
    }
  }, [token]);

  useEffect(() => {
    if (!isEditMode || !isAdmin) return;
    const interval = setInterval(flushContent, 5000);
    return () => clearInterval(interval);
  }, [isEditMode, isAdmin, flushContent]);

  // Flush on exit edit mode
  useEffect(() => {
    if (!isEditMode) { flushContent(); }
  }, [isEditMode, flushContent]);

  // ── Theme ─────────────────────────────────────────────────────────────────
  const updateTheme = (theme: Partial<AdminContextType['siteTheme']>) => {
    const newTheme = { ...siteTheme, ...theme };
    setSiteTheme(newTheme);
    localStorage.setItem('zmco_theme', JSON.stringify(newTheme));
  };

  const updateAIKnowledge = (text: string) => {
    updateContent('aiKnowledgeBase', text);
  };

  const uploadFile = async (url: string): Promise<string | null> => {
    const trimmed = url.trim();
    if (!trimmed) return null;
    if (!trimmed.match(/^https?:\/\/.+\.(jpg|jpeg|png|webp|gif|svg|avif)(\?.*)?$/i)) {
      alert('Please paste a direct image URL ending in .jpg, .png, .webp, etc.');
      return null;
    }
    return trimmed;
  };

  // Convert hex → HSL for CSS custom properties used by Tailwind
  const hexToHSL = (hex: string) => {
    let r = 0, g = 0, b = 0;
    if (hex.length === 4) {
      r = parseInt(hex[1] + hex[1], 16);
      g = parseInt(hex[2] + hex[2], 16);
      b = parseInt(hex[3] + hex[3], 16);
    } else if (hex.length === 7) {
      r = parseInt(hex.substring(1, 3), 16);
      g = parseInt(hex.substring(3, 5), 16);
      b = parseInt(hex.substring(5, 7), 16);
    }
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h = 0, s = 0;
    const l = (max + min) / 2;
    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }
    return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
  };

  useEffect(() => {
    document.documentElement.style.setProperty('--font-family', siteTheme.fontFamily);
    document.documentElement.style.setProperty('--primary', hexToHSL(siteTheme.primaryColor));
    document.body.style.fontSize = siteTheme.fontSizeBase;
    
    // Toggle light/dark theme classes
    if (siteTheme.themeMode === 'light') {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    }
  }, [siteTheme]);

  return (
    <AdminContext.Provider value={{
      isAdmin, isEditMode, token, login, logout, toggleEditMode,
      siteContent, updateContent, deleteContent, flushContent,
      siteTheme, updateTheme,
      aiKnowledgeBase, updateAIKnowledge,
      uploadFile,
    }}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) throw new Error('useAdmin must be used within an AdminProvider');
  return context;
};

import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Type, ArrowDownUp, Palette } from 'lucide-react';

function rgbToHex(rgbStr: string): string {
  if (!rgbStr) return '#ffffff';
  if (rgbStr.startsWith('#')) return rgbStr;
  const match = rgbStr.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*\d+(?:\.\d+)?)?\)$/);
  if (!match) return '#ffffff';
  const r = parseInt(match[1], 10);
  const g = parseInt(match[2], 10);
  const b = parseInt(match[3], 10);
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

export const EditableText: React.FC<{
  id: string;
  defaultText: string;
  className?: string;
  tagName?: string;
}> = ({ id, defaultText, className, tagName = 'span' }) => {
  const { isEditMode, siteContent, updateContent } = useAdmin();
  const elementRef = useRef<HTMLElement>(null);
  const [computedSize, setComputedSize] = useState<string>('');
  const [computedColor, setComputedColor] = useState<string>('');
  
  // Parse existing content (handle legacy plain strings vs new JSON objects)
  const rawContent = siteContent[id];
  let text = defaultText;
  let fontSize = '';
  let fontFamily = '';
  let color = '';

  if (rawContent) {
    try {
      const parsed = JSON.parse(rawContent);
      if (parsed && typeof parsed === 'object' && parsed.text !== undefined) {
        text = parsed.text;
        fontSize = parsed.fontSize || '';
        fontFamily = parsed.fontFamily || '';
        color = parsed.color || '';
      } else {
        text = rawContent;
      }
    } catch {
      text = rawContent;
    }
  }

  const Tag = tagName as any;

  // Compile styles
  const customStyles: React.CSSProperties = {};
  if (fontSize) customStyles.fontSize = fontSize;
  if (fontFamily) customStyles.fontFamily = fontFamily;
  if (color) customStyles.color = color;

  // Get computed size and color on mount or when edit mode turns on
  useEffect(() => {
    if (isEditMode && elementRef.current) {
      const style = window.getComputedStyle(elementRef.current);
      setComputedSize(style.fontSize);
      // Convert rgb to hex for the color picker placeholder if possible, or just string
      // But standard color picker input needs #hex. We'll just set it to state for reference.
      setComputedColor(style.color);
    }
  }, [isEditMode, fontSize, color]);

  if (!isEditMode) {
    return (
      <Tag className={className} style={customStyles}>
        {text}
      </Tag>
    );
  }

  const handleUpdate = (updates: { text?: string; fontSize?: string; fontFamily?: string; color?: string }) => {
    const nextObj = {
      text: updates.text ?? text,
      fontSize: updates.fontSize ?? fontSize,
      fontFamily: updates.fontFamily ?? fontFamily,
      color: updates.color ?? color,
    };
    updateContent(id, JSON.stringify(nextObj));
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Tag
          ref={elementRef}
          className={[
            className,
            'outline outline-2 outline-dashed outline-blue-400/70',
            'bg-blue-500/10 rounded-sm min-w-[20px] inline-block cursor-pointer relative',
            'transition-all hover:outline-blue-500 hover:bg-blue-500/20',
          ].join(' ')}
          style={customStyles}
        >
          {text}
        </Tag>
      </PopoverTrigger>
      <PopoverContent 
        className="w-72 p-4 bg-card border-border shadow-xl z-[9999]" 
        sideOffset={8}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-2">
            <h4 className="font-semibold text-sm">Edit Element</h4>
          </div>
          
          <div className="space-y-2">
            <label className="text-xs font-semibold text-muted-foreground flex items-center gap-2">
              <Type size={12} /> Text Content
            </label>
            <textarea
              className="w-full bg-background border border-input rounded-md p-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary min-h-[60px]"
              value={text}
              onChange={(e) => handleUpdate({ text: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-muted-foreground flex items-center gap-2">
                <ArrowDownUp size={12} /> Size
              </label>
              <input
                type="text"
                placeholder={computedSize ? `Default: ${computedSize}` : "e.g. 24px, 2rem"}
                className="w-full bg-background border border-input rounded-md p-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary placeholder:text-muted-foreground/50"
                value={fontSize}
                onChange={(e) => handleUpdate({ fontSize: e.target.value })}
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-xs font-semibold text-muted-foreground flex items-center gap-2">
                <Palette size={12} /> Color
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  className="w-8 h-8 rounded-md cursor-pointer border-0 p-0"
                  value={color || rgbToHex(computedColor)}
                  onChange={(e) => handleUpdate({ color: e.target.value })}
                />
                <input
                  type="text"
                  placeholder={computedColor ? `Default: ${computedColor}` : "Hex/RGB"}
                  className="w-full bg-background border border-input rounded-md p-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary placeholder:text-muted-foreground/50"
                  value={color}
                  onChange={(e) => handleUpdate({ color: e.target.value })}
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-muted-foreground flex items-center gap-2">
              <Type size={12} /> Font
            </label>
            <select
              className="w-full bg-background border border-input rounded-md p-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
              value={fontFamily}
              onChange={(e) => handleUpdate({ fontFamily: e.target.value })}
            >
              <option value="">Default</option>
              <option value="Inter, sans-serif">Inter</option>
              <option value="'Archivo Black', sans-serif">Archivo Black</option>
              <option value="Georgia, serif">Georgia</option>
              <option value="Menlo, monospace">Monospace</option>
              <option value="'Times New Roman', Times, serif">Times New Roman</option>
            </select>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// EditableImage – inline image editing/uploading
// ─────────────────────────────────────────────────────────────────────────────
import { Image as ImageIcon, Upload, Loader2 } from 'lucide-react';

export const EditableImage: React.FC<{
  id: string;
  defaultSrc: string;
  alt?: string;
  className?: string;
  aspectRatio?: string;
  onUpdate?: (url: string) => void;
}> = ({ id, defaultSrc, alt, className, aspectRatio, onUpdate }) => {
  const { isEditMode, siteContent, updateContent, uploadFile } = useAdmin();
  const [isUploading, setIsUploading] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [urlValue, setUrlValue] = useState('');

  const currentSrc = onUpdate ? defaultSrc : (siteContent[id] || defaultSrc);

  const handleUrlSubmit = async () => {
    if (!urlValue.trim()) return;
    setIsUploading(true);
    const url = await uploadFile(urlValue);
    if (url) {
      if (onUpdate) {
        onUpdate(url);
      } else {
        updateContent(id, url);
      }
    }
    setIsUploading(false);
    setShowUrlInput(false);
    setUrlValue('');
  };

  if (!isEditMode) {
    return <img src={currentSrc} alt={alt} className={className} style={aspectRatio ? { aspectRatio } : {}} />;
  }

  return (
    <>
      <div 
        className={`relative group cursor-pointer overflow-hidden rounded-lg outline outline-2 outline-dashed outline-blue-400/70 hover:outline-blue-500 transition-all ${className}`}
        onClick={() => setShowUrlInput(true)}
        style={aspectRatio ? { aspectRatio } : {}}
      >
        <img src={currentSrc} alt={alt} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-blue-500/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white">
          {isUploading ? (
            <Loader2 className="animate-spin mb-2" size={32} />
          ) : (
            <>
              <Upload size={32} className="mb-2" />
              <span className="text-xs font-bold uppercase tracking-widest">Replace Image</span>
            </>
          )}
        </div>
      </div>
      {showUrlInput && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4" onClick={() => setShowUrlInput(false)}>
          <div className="bg-[#111] border border-white/10 rounded-2xl p-6 w-full max-w-md space-y-4" onClick={e => e.stopPropagation()}>
            <h3 className="text-white font-bold text-lg">Paste Image URL</h3>
            <p className="text-muted-foreground text-sm">Paste a direct link to an image (from imgbb, Imgur, etc.)</p>
            <input
              type="url"
              value={urlValue}
              onChange={e => setUrlValue(e.target.value)}
              placeholder="https://i.ibb.co/..."
              className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-primary"
              autoFocus
              onKeyDown={e => e.key === 'Enter' && handleUrlSubmit()}
            />
            <div className="flex gap-3">
              <button onClick={() => { setShowUrlInput(false); setUrlValue(''); }} className="flex-1 py-2 rounded-xl border border-white/10 text-muted-foreground hover:text-white transition-colors text-sm">Cancel</button>
              <button onClick={handleUrlSubmit} className="flex-1 py-2 rounded-xl bg-primary text-white font-bold text-sm hover:opacity-90 transition-opacity">Apply</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
