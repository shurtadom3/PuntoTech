import { motion } from "framer-motion";
import { Smartphone, Laptop, Headphones, Speaker, Cable } from "lucide-react";
import { Link } from "react-router-dom";

const categories = [
  { icon: Smartphone, name: "Celulares", count: 120, color: "from-primary/20 to-primary/5" },
  { icon: Laptop, name: "Computadores", count: 85, color: "from-accent/20 to-accent/5" },
  { icon: Headphones, name: "Audífonos", count: 64, color: "from-primary/20 to-primary/5" },
  { icon: Speaker, name: "Bafles", count: 42, color: "from-accent/20 to-accent/5" },
  { icon: Cable, name: "Accesorios", count: 200, color: "from-primary/20 to-primary/5" },
];

const container = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.12
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0 }
};

const Categories = () => {
  return (
    <section id="categorias" className="py-20 md:py-28 relative overflow-hidden">
      <div className="container mx-auto px-4 md:px-6">

        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="font-heading text-3xl md:text-5xl font-bold mb-4">
            Explora por <span className="gradient-text">categoría</span>
          </h2>

          <p className="text-muted-foreground max-w-md mx-auto">
            Encuentra exactamente lo que buscas en nuestra selección curada de tecnología
          </p>
        </motion.div>

        {/* GRID */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6"
        >
          {categories.map((cat) => (
            <motion.div
              key={cat.name}
              variants={item}
              whileHover={{ y: -10, scale: 1.03 }}
              transition={{ type: "spring", stiffness: 200 }}
            >
              <Link
                to={`/products?category=${cat.name}`}
                className="group glass rounded-2xl p-6 md:p-8 text-center cursor-pointer 
                border border-border/50 hover:border-primary/40
                hover:shadow-xl hover:shadow-primary/10
                transition-all duration-300 block"
              >

                {/* ICON */}
                <div
                  className={`w-14 h-14 mx-auto rounded-xl bg-gradient-to-br ${cat.color}
                  flex items-center justify-center mb-4
                  group-hover:scale-110 group-hover:rotate-3
                  transition-all duration-300`}
                >
                  <cat.icon
                    size={26}
                    className="text-primary group-hover:drop-shadow-[0_0_8px_rgba(99,102,241,0.8)]"
                  />
                </div>

                {/* TITLE */}
                <h3 className="font-heading font-semibold text-foreground mb-1">
                  {cat.name}
                </h3>

                {/* COUNT */}
                <p className="text-sm text-muted-foreground">
                  {cat.count} productos
                </p>

              </Link>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
};

export default Categories;