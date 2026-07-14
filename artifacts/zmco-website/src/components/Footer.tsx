import { Link, useLocation } from "wouter";
import { MapPin, Phone, Mail, Facebook, Instagram, Linkedin, ArrowRight } from "lucide-react";
import logoImage from "@/assets/logo.jpg";

export default function Footer() {
  const [location] = useLocation();
  const isAdminPage = typeof window !== 'undefined' && window.location.pathname.startsWith('/admin');
  if (isAdminPage) return null;

  return (
    <footer className="relative bg-card border-t border-border pt-20 pb-10 overflow-hidden">
      {/* Top subtle gradient line */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
      
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand Col */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 flex items-center justify-center rounded-full overflow-hidden border-2 border-primary/20">
                <img src={logoImage} alt="Zain Manzoor & Co Logo" className="w-full h-full object-cover" />
              </div>
              <div className="flex flex-col">
                <span className="font-display font-bold text-base leading-none tracking-tight uppercase">Zain Manzoor & Co</span>
              </div>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed mb-6">
              Driving Pakistan's growth through uncompromising quality, engineering excellence, and lasting structures. We build the future.
            </p>
            <div className="flex items-center gap-4">
              <Link href="/contact" className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-foreground hover:bg-primary hover:text-primary-foreground transition-all">
                <Facebook size={18} />
              </Link>
              <Link href="/contact" className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-foreground hover:bg-primary hover:text-primary-foreground transition-all">
                <Instagram size={18} />
              </Link>
              <Link href="/contact" className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-foreground hover:bg-primary hover:text-primary-foreground transition-all">
                <Linkedin size={18} />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display uppercase tracking-wider text-sm mb-6 relative inline-block">
              Quick Links
              <span className="absolute -bottom-2 left-0 w-1/2 h-0.5 bg-primary rounded-full"></span>
            </h4>
            <ul className="space-y-3">
              {[
                { name: "Home", path: "/" },
                { name: "About Us", path: "/about" },
                { name: "Our Services", path: "/services" },
                { name: "Featured Projects", path: "/projects" },
                { name: "Machinery", path: "/machinery" },
                { name: "Safety & Care", path: "/safety" },
                { name: "Contact Us", path: "/contact" }
              ].map((link) => (
                <li key={link.name}>
                  <Link href={link.path} className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 text-sm group">
                    <ArrowRight size={14} className="opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-display uppercase tracking-wider text-sm mb-6 relative inline-block">
              Services
              <span className="absolute -bottom-2 left-0 w-1/2 h-0.5 bg-primary rounded-full"></span>
            </h4>
            <ul className="space-y-3">
              {[
                "Construction & Contracting",
                "Civil Engineering",
                "Structural Design",
                "Project Management",
                "MEP Services",
                "Interior & Renovation"
              ].map((service) => (
                <li key={service}>
                  <Link href="/services" className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 text-sm group">
                    <ArrowRight size={14} className="opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300" />
                    {service}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display uppercase tracking-wider text-sm mb-6 relative inline-block">
              Contact Info
              <span className="absolute -bottom-2 left-0 w-1/2 h-0.5 bg-primary rounded-full"></span>
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-sm text-muted-foreground">
                <MapPin size={18} className="text-primary shrink-0 mt-0.5" />
                <span>Headquarters<br/>Pakistan</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-muted-foreground">
                <Phone size={18} className="text-primary shrink-0" />
                <a href="tel:+92123456789" className="hover:text-primary transition-colors">+92 123456789</a>
              </li>
              <li className="flex items-center gap-3 text-sm text-muted-foreground">
                <Mail size={18} className="text-primary shrink-0" />
                <a href="mailto:zmc@gmail.com" className="hover:text-primary transition-colors">zmc@gmail.com</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground uppercase tracking-widest">
            © 2026 Zain Manzoor & Co Construction and Engineering PVT LTD. All rights reserved.
          </p>
          <div className="flex gap-4 text-xs text-muted-foreground uppercase tracking-widest">
            <Link href="/about" className="hover:text-primary transition-colors">Privacy Policy</Link>
            <Link href="/contact" className="hover:text-primary transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
