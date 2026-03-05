import { motion } from "framer-motion";
import { Smartphone, Laptop, Headphones, Speaker, Cable } from "lucide-react";

const categories = [
  { icon: Smartphone, name: "Celulares", count: 120, color: "from-primary/20 to-primary/5" },
  { icon: Laptop, name: "Computadores", count: 85, color: "from-accent/20 to-accent/5" },
  { icon: Headphones, name: "Audífonos", count: 64, color: "from-primary/20 to-primary/5" },
  { icon: Speaker, name: "Bafles", count: 42, color: "from-accent/20 to-accent/5" },
  { icon: Cable, name: "Accesorios", count: 200, color: "from-primary/20 to-primary/5" },
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
            Explora por <span className="gradient-text">categoría</span>
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            Encuentra exactamente lo que buscas en nuestra selección curada de tecnología
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
          {categories.map((cat, i) => (
            <motion.a
              key={cat.name}
              href="#"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -8 }}
              className="group glass rounded-2xl p-6 md:p-8 text-center cursor-pointer hover:border-primary/30 transition-colors"
            >
              <div className={`w-14 h-14 mx-auto rounded-xl bg-gradient-to-br ${cat.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <cat.icon size={24} className="text-primary" />
              </div>
              <h3 className="font-heading font-semibold text-foreground mb-1">{cat.name}</h3>
              <p className="text-sm text-muted-foreground">{cat.count} productos</p>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Categories;