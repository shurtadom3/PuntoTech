import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Cable, Headphones, Laptop, Smartphone, Speaker } from "lucide-react";

const categories = [
  { icon: Smartphone, name: "Celulares", count: 120 },
  { icon: Laptop, name: "Computadores", count: 85 },
  { icon: Headphones, name: "Audifonos", count: 64 },
  { icon: Speaker, name: "Bafles", count: 42 },
  { icon: Cable, name: "Accesorios", count: 200 },
];

const Categories = () => {
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
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
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
