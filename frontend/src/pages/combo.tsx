import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Check, Package, Percent, ShoppingCart } from "lucide-react";
import Navbar from "./navbar";
import { listarProductos } from "../api";
import { useCart, type CartProduct } from "../context/CartContext";
import { getImagesForCombo, getProductImage } from "../utils/productImages";

interface ApiProduct {
  id: string;
  name: string;
  brand: string;
  category: string;
  price: string | number;
  description: string;
  available_stock: number | null;
}

const formatPrice = (price: number) =>
  new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(price);

const normalizeCombo = (product: ApiProduct): CartProduct & { description: string } => ({
  id: product.id,
  name: product.name,
  brand: product.brand,
  category: product.category,
  price: Number(product.price),
  image: getProductImage(product.name, product.category),
  available_stock: product.available_stock ?? 0,
  description: product.description,
});

const discountFromDescription = (description: string) => {
  const match = description.match(/(\d+)%/);
  return match ? `${match[1]}% OFF` : "Combo";
};

const Combos = () => {
  const { addItem, openCart } = useCart();
  const [combos, setCombos] = useState<Array<CartProduct & { description: string }>>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [addedId, setAddedId] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    listarProductos()
      .then((data) => {
        if (Array.isArray(data)) {
          setCombos(data.filter((product) => product.category === "Combos").map(normalizeCombo));
          setLoadError("");
        } else {
          setCombos([]);
          setLoadError("No se pudieron leer los combos de la base de datos.");
        }
      })
      .catch(() => {
        setCombos([]);
        setLoadError("No se pudo conectar con la base de datos. Revisa que el backend este activo.");
      })
      .finally(() => setLoading(false));
  }, []);

  const handleAddCombo = (combo: CartProduct) => {
    addItem(combo);
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
              <span className="text-sm text-primary font-medium">Ahorra más con combos</span>
            </div>
            <h2 className="font-heading text-3xl md:text-5xl font-bold mb-4">
              Combos <span className="gradient-text">tecnológicos</span>
            </h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              Paquetes disponibles.
            </p>
          </motion.div>

          {loading && <p className="text-center text-muted-foreground">Cargando combos...</p>}
          {!loading && loadError && <p className="text-center text-red-600">{loadError}</p>}

          {!loading && !loadError && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {combos.map((combo, i) => {
                const justAdded = addedId === combo.id;
                const inStock = combo.available_stock > 0;

                return (
                  <motion.div
                    key={combo.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08 }}
                    whileHover={{ y: -6 }}
                    className="group glass rounded-lg p-6 relative overflow-hidden"
                  >
                    <div className="absolute top-4 right-4 flex items-center gap-1 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-bold">
                      <Percent size={14} />
                      {discountFromDescription(combo.description)}
                    </div>

                    <div className="flex gap-2 mb-6">
                      {getImagesForCombo(combo.description).map((img) => (
                        <div key={img} className="w-20 h-20 rounded-lg bg-muted overflow-hidden">
                          <img src={img} alt="" className="w-full h-full object-cover" loading="lazy" />
                        </div>
                      ))}
                    </div>

                    <h3 className="font-heading font-bold text-xl text-foreground mb-2">{combo.name}</h3>
                    <p className="text-sm text-muted-foreground mb-4">{combo.description}</p>

                    <div className="mb-4">
                      <span className="block font-heading text-2xl font-bold text-primary">
                        {formatPrice(combo.price)}
                      </span>
                      <span className="text-xs text-muted-foreground">Stock: {combo.available_stock}</span>
                    </div>

                    <button
                      type="button"
                      disabled={!inStock}
                      onClick={() => handleAddCombo(combo)}
                      className="w-full flex items-center justify-center gap-2 py-3 rounded-lg border border-primary/30 text-primary font-semibold hover:bg-primary hover:text-primary-foreground transition-colors disabled:cursor-not-allowed disabled:border-border disabled:text-muted-foreground disabled:hover:bg-transparent"
                    >
                      {justAdded ? "Agregado" : "Agregar combo"}
                      {justAdded ? <Check size={16} /> : <ShoppingCart size={16} />}
                    </button>
                  </motion.div>
                );
              })}
            </div>
          )}

          {!loading && !loadError && combos.length === 0 && (
            <p className="text-center text-muted-foreground">No hay combos disponibles.</p>
          )}
        </div>
      </section>
    </>
  );
};

export default Combos;
