import { motion } from "framer-motion";
import { Star, ShoppingCart, Heart } from "lucide-react";
import productPhone from "../assets/productPhone.jpg";
import productLaptop from "../assets/productLaptop.jpg";
import productHeadphones from "../assets/productHeadphones.jpg";
import productSpeaker from "../assets/productSpeaker.jpg";

const products = [
  {
    id: 1,
    name: "Galaxy S24 Ultra",
    brand: "Samsung",
    price: 4299000,
    oldPrice: 4899000,
    rating: 4.8,
    image: productPhone,
    tag: "Más vendido",
    inStock: true,
  },
  {
    id: 2,
    name: "MacBook Pro M3",
    brand: "Apple",
    price: 8999000,
    oldPrice: null,
    rating: 4.9,
    image: productLaptop,
    tag: "Nuevo",
    inStock: true,
  },
  {
    id: 3,
    name: "WH-1000XM5",
    brand: "Sony",
    price: 1499000,
    oldPrice: 1799000,
    rating: 4.7,
    image: productHeadphones,
    tag: "-17%",
    inStock: true,
  },
  {
    id: 4,
    name: "JBL Charge 5",
    brand: "JBL",
    price: 649000,
    oldPrice: null,
    rating: 4.6,
    image: productSpeaker,
    tag: null,
    inStock: false,
  },
];

const formatPrice = (price: number) =>
  new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(price);

const Products = () => {
  return (
    <section className="py-20 md:py-28 bg-secondary/30">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-end justify-between mb-14"
        >
          <div>
            <h2 className="font-heading text-3xl md:text-5xl font-bold mb-4">
              Productos <span className="gradient-text">destacados</span>
            </h2>
            <p className="text-muted-foreground">Recomendados según las tendencias más populares</p>
          </div>
          <a href="#" className="hidden md:block text-primary hover:underline text-sm font-medium">
            Ver todos →
          </a>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product, i) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -6 }}
              className="group glass rounded-2xl overflow-hidden"
            >
              {/* Image */}
              <div className="relative aspect-square bg-muted/30 overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                {product.tag && (
                  <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-semibold">
                    {product.tag}
                  </span>
                )}
                <button className="absolute top-3 right-3 w-8 h-8 rounded-full bg-card/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-card">
                  <Heart size={16} className="text-muted-foreground hover:text-destructive transition-colors" />
                </button>
                {!product.inStock && (
                  <div className="absolute inset-0 bg-background/60 flex items-center justify-center">
                    <span className="px-4 py-2 rounded-lg bg-muted text-muted-foreground text-sm font-medium">
                      Agotado
                    </span>
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="p-4">
                <p className="text-xs text-muted-foreground mb-1">{product.brand}</p>
                <h3 className="font-heading font-semibold text-foreground mb-2">{product.name}</h3>
                <div className="flex items-center gap-1 mb-3">
                  <Star size={14} className="fill-primary text-primary" />
                  <span className="text-sm text-foreground">{product.rating}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-heading font-bold text-lg text-foreground">
                      {formatPrice(product.price)}
                    </span>
                    {product.oldPrice && (
                      <span className="block text-xs text-muted-foreground line-through">
                        {formatPrice(product.oldPrice)}
                      </span>
                    )}
                  </div>
                  {product.inStock && (
                    <button className="w-10 h-10 rounded-xl bg-primary text-primary-foreground flex items-center justify-center hover:opacity-90 transition-opacity">
                      <ShoppingCart size={18} />
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Products;