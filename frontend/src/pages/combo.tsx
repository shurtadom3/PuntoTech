import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Check, Package, Percent, ShoppingCart } from "lucide-react";
import productPhone from "../assets/productPhone.jpg";
import productHeadphones from "../assets/productHeadphones.jpg";
import productAccessories from "../assets/productAccessories.jpg";
import Navbar from "./navbar";
import { listarProductos } from "../api";
import { CartProduct, useCart } from "../context/CartContext";

interface ApiProduct {
  id: string;
  name: string;
  brand: string;
  category: string;
  price: string | number;
  available_stock: number | null;
}

const combos = [
  {
    id: 1,
    name: "Combo Gamer Pro",
    description: "Celular + audifonos + cargador rapido",
    discount: 25,
    originalPrice: 6447000,
    comboPrice: 4835000,
    images: [productPhone, productHeadphones, productAccessories],
  },
  {
    id: 2,
    name: "Combo Productividad",
    description: "Laptop + audifonos + accesorios",
    discount: 20,
    originalPrice: 11148000,
    comboPrice: 8918000,
    images: [productPhone, productHeadphones, productAccessories],
  },
  {
    id: 3,
    name: "Combo Audio Total",
    description: "Bafle + audifonos + cable premium",
    discount: 15,
    originalPrice: 2798000,
    comboPrice: 2378000,
    images: [productHeadphones, productAccessories, productPhone],
  },
  {
    id: 4,
    name: "Combo Estudio Smart",
    description: "Tablet + audifonos + cable USB-C",
    discount: 18,
    originalPrice: 2747000,
    comboPrice: 2252000,
    images: [productPhone, productHeadphones, productAccessories],
  },
  {
    id: 5,
    name: "Combo Oficina Pro",
    description: "Laptop + mouse + hub USB-C",
    discount: 22,
    originalPrice: 3547000,
    comboPrice: 2767000,
    images: [productPhone, productAccessories, productHeadphones],
  },
  {
    id: 6,
    name: "Combo Movil Plus",
    description: "Celular + cargador rapido + cable premium",
    discount: 16,
    originalPrice: 4577000,
    comboPrice: 3845000,
    images: [productPhone, productAccessories, productHeadphones],
  },
];

const formatPrice = (price: number) =>
  new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(price);

const Combos = () => {
  const { addItem, openCart } = useCart();
  const [apiProducts, setApiProducts] = useState<ApiProduct[]>([]);
  const [addedId, setAddedId] = useState<number | null>(null);

  useEffect(() => {
    listarProductos()
      .then((data) => {
        if (Array.isArray(data)) setApiProducts(data);
      })
      .catch(() => setApiProducts([]));
  }, []);

  const handleAddCombo = (combo: (typeof combos)[number]) => {
    const dbProduct = apiProducts.find((product) => product.name === combo.name);
    const cartProduct: CartProduct = {
      id: dbProduct?.id || `combo-${combo.id}`,
      name: combo.name,
      brand: "PuntoTech",
      category: "Combos",
      price: Number(dbProduct?.price || combo.comboPrice),
      image: combo.images[0],
      available_stock: dbProduct?.available_stock ?? 20,
    };

    addItem(cartProduct);
    openCart();
    setAddedId(combo.id);
    window.setTimeout(() => setAddedId(null), 1200);
  };

  return (
    <>
      <Navbar />
      <section id="combos" className="bg-background pt-28 pb-20 md:pt-32 md:pb-28">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/5 mb-4">
              <Package size={14} className="text-primary" />
              <span className="text-sm text-primary font-medium">Ahorra mas con combos</span>
            </div>
            <h2 className="font-heading text-3xl md:text-5xl font-bold mb-4">
              Combos <span className="gradient-text">tecnologicos</span>
            </h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              Paquetes exclusivos disenados para darte la mejor experiencia al mejor precio.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {combos.map((combo, i) => {
              const justAdded = addedId === combo.id;

              return (
                <motion.div
                  key={combo.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15 }}
                  whileHover={{ y: -6 }}
                  className="group glass rounded-lg p-6 relative overflow-hidden"
                >
                  <div className="absolute top-4 right-4 flex items-center gap-1 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-bold">
                    <Percent size={14} />
                    {combo.discount}% OFF
                  </div>

                <div className="flex gap-2 mb-6">
                  {combo.images.map((img, idx) => (
                    <div key={idx} className="w-20 h-20 rounded-lg bg-muted overflow-hidden">
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

                  <button
                    type="button"
                    onClick={() => handleAddCombo(combo)}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-lg border border-primary/30 text-primary font-semibold hover:bg-primary hover:text-primary-foreground transition-colors"
                  >
                    {justAdded ? "Agregado" : "Agregar combo"}
                    {justAdded ? <Check size={16} /> : <ShoppingCart size={16} />}
                  </button>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
};

export default Combos;
