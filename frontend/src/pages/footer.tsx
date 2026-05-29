import { Mail, Phone, MapPin } from "lucide-react";
import { useGettext } from "../i18n/gettext";

const Footer = () => {
  const { gettext: t } = useGettext();

  return (
    <footer className="border-t border-border py-16">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
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
              {t("Tu tienda de tecnologia con stock inteligente, combos exclusivos y garantias digitales.")}
            </p>
          </div>

          <div>
            <h4 className="font-heading font-semibold text-foreground mb-4">{t("Categorias")}</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {["Celulares", "Computadores", "Audifonos", "Bafles", "Accesorios"].map((label) => (
                <li key={label}>
                  <a href="#" className="hover:text-primary transition-colors">{t(label)}</a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-heading font-semibold text-foreground mb-4">{t("Soporte")}</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {["Mis Garantias", "Seguir pedido", "Devoluciones", "FAQ", "Contacto"].map((label) => (
                <li key={label}>
                  <a href="#" className="hover:text-primary transition-colors">{t(label)}</a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-heading font-semibold text-foreground mb-4">{t("Contacto")}</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-center gap-2"><Mail size={16} className="text-primary" /> info@puntotech.co</li>
              <li className="flex items-center gap-2"><Phone size={16} className="text-primary" /> +57 300 123 4567</li>
              <li className="flex items-center gap-2"><MapPin size={16} className="text-primary" /> Bogota, Colombia</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">(c) 2026 Puntotech. {t("Todos los derechos reservados.")}</p>
          <div className="flex gap-6 text-sm text-muted-foreground">
            <a href="#" className="hover:text-primary transition-colors">{t("Terminos")}</a>
            <a href="#" className="hover:text-primary transition-colors">{t("Privacidad")}</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
