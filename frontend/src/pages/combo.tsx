import { motion } from "framer-motion";
import { Package, ArrowRight, Percent } from "lucide-react";
import productPhone from "../assets/productPhone.jpg";
import productHeadphones from "../assets/productHeadphones.jpg";
import productAccessories from "../assets/productAccessories.jpg";
import Navbar from "./navbar";
const combos = [
  {
    id: 1,
    name: "Combo Gamer Pro",
    description: "Celular + Audífonos + Cargador rápido",
    discount: 25,
    originalPrice: 6447000,
    comboPrice: 4835000,
    images: [productPhone, productHeadphones, productAccessories],
  },
  {
    id: 2,
    name: "Combo Productividad",
    description: "Laptop + Audífonos + Accesorios",
    discount: 20,
    originalPrice: 11148000,
    comboPrice: 8918000,
    images: [productPhone, productHeadphones, productAccessories],
  },
  {
    id: 3,
    name: "Combo Audio Total",
    description: "Bafle + Audífonos + Cable premium",
    discount: 15,
    originalPrice: 2798000,
    comboPrice: 2378000,
    images: [productHeadphones, productAccessories, productPhone],
  },
];

const formatPrice = (price: number) =>
  new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(price);

const Combos = () => {
  return (
    <>
    <Navbar />
    <section id="combos" className="py-20 md:py-28">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-accent/30 bg-accent/5 mb-4">
            <Package size={14} className="text-accent" />
            <span className="text-sm text-accent font-medium">Ahorra más con combos</span>
          </div>
          <h2 className="font-heading text-3xl md:text-5xl font-bold mb-4">
            Combos <span className="gradient-accent-text">tecnológicos</span>
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            Paquetes exclusivos diseñados para darte la mejor experiencia al mejor precio
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {combos.map((combo, i) => (
            <motion.div
              key={combo.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              whileHover={{ y: -6 }}
              className="group glass rounded-2xl p-6 relative overflow-hidden"
            >
              {/* Discount badge */}
              <div className="absolute top-4 right-4 flex items-center gap-1 px-3 py-1 rounded-full bg-accent/20 text-accent text-sm font-bold">
                <Percent size={14} />
                {combo.discount}% OFF
              </div>

              {/* Product thumbnails */}
              <div className="flex gap-2 mb-6">
                {combo.images.map((img, idx) => (
                  <div key={idx} className="w-20 h-20 rounded-xl bg-muted/30 overflow-hidden">
                    <img src={img} alt="" className="w-full h-full object-cover" loading="lazy" />
                  </div>
                ))}
              </div>

              <h3 className="font-heading font-bold text-xl text-foreground mb-2">{combo.name}</h3>
              <p className="text-sm text-muted-foreground mb-4">{combo.description}</p>

              <div className="mb-4">
                <span className="text-sm text-muted-foreground line-through">{formatPrice(combo.originalPrice)}</span>
                <span className="block font-heading text-2xl font-bold text-primary">
                  {formatPrice(combo.comboPrice)}
                </span>
              </div>

              <button className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-primary/30 text-primary font-semibold hover:bg-primary hover:text-primary-foreground transition-colors">
                Agregar combo
                <ArrowRight size={16} />
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
    </>
  );
};

export default Combos;