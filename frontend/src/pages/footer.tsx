import { Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t border-border py-16">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="font-heading font-bold text-primary-foreground text-sm">PT</span>
              </div>
              <span className="font-heading font-bold text-xl">
                Punto<span className="text-primary">tech</span>
              </span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Tu tienda de tecnología con stock inteligente, combos exclusivos y garantías digitales.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-heading font-semibold text-foreground mb-4">Categorías</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {["Celulares", "Computadores", "Audífonos", "Bafles", "Accesorios"].map((l) => (
                <li key={l}><a href="#" className="hover:text-primary transition-colors">{l}</a></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-heading font-semibold text-foreground mb-4">Soporte</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {["Mis Garantías", "Seguir pedido", "Devoluciones", "FAQ", "Contacto"].map((l) => (
                <li key={l}><a href="#" className="hover:text-primary transition-colors">{l}</a></li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-heading font-semibold text-foreground mb-4">Contacto</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-center gap-2"><Mail size={16} className="text-primary" /> info@puntotech.co</li>
              <li className="flex items-center gap-2"><Phone size={16} className="text-primary" /> +57 300 123 4567</li>
              <li className="flex items-center gap-2"><MapPin size={16} className="text-primary" /> Bogotá, Colombia</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">© 2026 Puntotech. Todos los derechos reservados.</p>
          <div className="flex gap-6 text-sm text-muted-foreground">
            <a href="#" className="hover:text-primary transition-colors">Términos</a>
            <a href="#" className="hover:text-primary transition-colors">Privacidad</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;