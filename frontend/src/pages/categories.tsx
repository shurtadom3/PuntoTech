import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Cable, Grid2X2, Headphones, Laptop, Smartphone, Speaker, Tablet } from "lucide-react";
import { listarProductos } from "../api";

interface ApiProduct {
  category: string;
}

const categoryIcons = {
  Celulares: Smartphone,
  Computadores: Laptop,
  Audifonos: Headphones,
  Bafles: Speaker,
  Accesorios: Cable,
  Tablets: Tablet,
};

const Categories = () => {
  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    listarProductos()
      .then((data) => {
        if (Array.isArray(data)) {
          setProducts(data);
          setLoadError("");
        } else {
          setLoadError("No se pudo leer el conteo de productos.");
        }
      })
      .catch(() => setLoadError("Activa el backend para ver los conteos reales."));
  }, []);

  const categories = useMemo(() => {
    const counts = products.reduce<Record<string, number>>((acc, product) => {
      acc[product.category] = (acc[product.category] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(counts)
      .filter(([name]) => name !== "Combos")
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([name, count]) => ({
        icon: categoryIcons[name as keyof typeof categoryIcons] || Grid2X2,
        name,
        count,
      }));
  }, [products]);

  return (
    <section id="categorias" className="py-20 md:py-28">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <h2 className="font-heading text-3xl md:text-5xl font-bold mb-4">
            Explora por <span className="gradient-text">categoria</span>
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            Encuentra exactamente lo que buscas en nuestra seleccion curada de tecnologia.
          </p>
          {loadError && <p className="mt-3 text-sm text-muted-foreground">{loadError}</p>}
        </motion.div>

        <div className="mx-auto grid max-w-4xl grid-cols-2 gap-4 md:grid-cols-3 md:gap-6">
          {categories.map((cat, i) => {
            const Icon = cat.icon;

            return (
              <motion.div
                key={cat.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -8 }}
              >
                <Link
                  to={`/products?category=${encodeURIComponent(cat.name)}`}
                  className="group glass block rounded-lg p-6 md:p-8 text-center cursor-pointer hover:border-primary/30 transition-colors"
                >
                  <div className="w-14 h-14 mx-auto rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Icon size={24} className="text-primary" />
                  </div>
                  <h3 className="font-heading font-semibold text-foreground mb-1">{cat.name}</h3>
                  <p className="text-sm text-muted-foreground">{cat.count} productos</p>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Categories;
